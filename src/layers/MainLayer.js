/**
 * Main game layer
 * @extends cc.Layer
 */
const MainLayer = cc.Layer.extend({
    ctor() {
      this._super();
      this.init();
    },

    init() {
      const s = cc.winSize;

      //Add gamefield and tiles logics
      this.field = new MainField;
      this.field.setPosition(s.width * 0.5, s.height * 0.5);
      this.field.setAnchorPoint(0.5, 0.5);
      this.addChild(this.field);

      //Add progress bar background
      this.gameInfo = new GameInfo;

      //Progress bar assembling
      const progressBarParts = [
        this.gameInfo.progressBg,
        this.gameInfo.progressCourse,
        this.gameInfo.progress,
        this.gameInfo.scoreLabel
      ];
      progressBarParts.forEach(element => {
        element.setPosition(s.width * 0.5, s.height * 0.95);
        this.addChild(element);
      });

      //Add turns label
      this.gameInfo.turnsLabel.setPosition(s.width * 0.5, s.height * 0.85);
      this.addChild(this.gameInfo.turnsLabel);

      //Add listeners for picking tiles
      this.listener = cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.clickCheck}, this);

      //Time for double click
      this.timeEnd = 0;
      this.timeActivate = 300; //time interval between two clicks

      //Delay for animation separation
      this.delay = cc.delayTime(CONFIG.stdAnimationTime);
    },

    /**
     * Checks if the pick is valid and
     * whether it was single or double click
     */
    clickCheck(touch, event) {
      const target = event.getCurrentTarget();
      const fieldRect = cc.rect(CONFIG.fieldX, CONFIG.fieldY, CONFIG.fieldWidth, CONFIG.fieldHeight);
      const location = touch.getLocation();
      console.log(location);

      //Pick up necessary tile
      if(cc.rectContainsPoint(fieldRect, location)) {
        let tile = target.field.tilePick(location);

        if(target.checkDouble()) {
          target.onDouble(tile);
        } else {
          target.onClick(tile);
        }
      };
    },

    /**
     * @return {boolean}
     */
    checkDouble() {
      this.timeStart = this.timeEnd;
      this.timeEnd = Date.now();
      let deltaTime = this.timeEnd - this.timeStart;
      return deltaTime <= this.timeActivate;
    },

    /**
     * activates bomb
     * @param {Object} target tile
     */
    onDouble(tile) {
        if(tile.isSuperTile) {
          const blastRadius = this.field.fieldLogic.superBlast(tile);
          const destroy = new cc.CallFunc(() => this.field.destroyTiles(blastRadius));
          const turn = new cc.CallFunc(() => this.makeTurn(blastRadius));
          const chain = new cc.Sequence(destroy, this.delay, turn);
          this.runAction(chain);
       }
    },

    /**
     * selects a tile and perform actions
     * @param {Object} target tile
     */
    onClick(tile) {
        if(tile.isSuperTile) {
          this.field.superTileAnimation(tile);
        } else {
        //return array of tiles similar in colour
        const arrOfTiles = this.field.fieldLogic.findTiles(tile);
        if(arrOfTiles != undefined) {
          if(arrOfTiles.length >= CONFIG.tilesForSuperTile) { //check length for making bomb
            tile.isSuperTile = true;
            const assemble = new cc.CallFunc(() => this.field.assembleSuperTile(arrOfTiles, tile));
            const turn = new cc.CallFunc(() => this.makeTurn(arrOfTiles));
            const chain = new cc.Sequence(assemble, this.delay, turn);
            this.runAction(chain)

          } else {
             const destroy = new cc.CallFunc(() => this.field.destroyTiles(arrOfTiles));
             const turn = new cc.CallFunc(() => this.makeTurn(arrOfTiles));
             const chain = new cc.Sequence(destroy, this.delay, turn);
             this.runAction(chain);
          }
       }
     }
    },

    /**
     * Performs main mechanics
     * @param {Array} of similar tiles
     */
    makeTurn(arr) {
      this.field.tilesSlideDown(arr);
      this.field.refillTiles();
      this.gameInfo.updateScore(arr.length);
      this.gameInfo.updateTurns();
      this.gameInfo.isOver();
  }
});
