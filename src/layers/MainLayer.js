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

      this.timeEnd = 0;
      this.timeActivate = 300;
    },

    /**
    * @description Checks if the pick is valid and
    * whether it was single or double click
    */
    clickCheck(touch, event) {
      const target = event.getCurrentTarget();
      const fieldRect = cc.rect(CONFIG.fieldX, CONFIG.fieldY, CONFIG.fieldWidth, CONFIG.fieldHeight);
      const location = touch.getLocation();
      let tile = null;

      //Pick up necessary tile
      if(cc.rectContainsPoint(fieldRect, location)) {
        tile = target.field.tilePick(location);
      };

      if(target.checkDouble()) {
        target.onDouble(tile);
      } else {
        target.onClick(tile);
      }

    },

    checkDouble() {
      this.timeStart = this.timeEnd;
      this.timeEnd = Date.now();
      let deltaTime = this.timeEnd - this.timeStart;
      return deltaTime <= this.timeActivate;
    },

    onDouble(tile) {
        if(tile.isBomb) {
          const blastRadius = this.field.fieldLogic.bombBlast(tile);
          this.field.destroyTiles(blastRadius);
          this.makeTurn(blastRadius.length);
       }
    },

    onClick(tile) {
        if(tile.isBomb) {
          this.field.bombAnimation(tile);
        } else {
        //return array of tiles similar in colour
        const arrOfTiles = this.field.fieldLogic.findTiles(tile);
        if(arrOfTiles != undefined) {
          if(arrOfTiles.length >= CONFIG.tilesForBomb) { //check length for making bomb
            tile.isBomb = true;
            this.field.assembleBomb(arrOfTiles, tile);
            this.makeTurn(arrOfTiles);
          } else {
          this.field.destroyTiles(arrOfTiles);
          this.makeTurn(arrOfTiles.length);
          }
       }
     }
    },

    /**
    * @description Performs main mechanics:
    * 1. calls function to destroy tiles
    * 2. calls gamefield update
    * 3. calls score and turns update
    * @param {Array} of similar tiles from this.onClick
    */
    makeTurn(number) {
      this.field.tilesSlideDown();
      this.field.refillTiles();
      this.gameInfo.updateScore(number);
      this.gameInfo.updateTurns();
      this.gameInfo.isOver();
  }
});
