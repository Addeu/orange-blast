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

    clickCheck(touch, event) {
      const target = event.getCurrentTarget();

      this.timeStart = target.timeEnd;
      target.timeEnd = Date.now();

      let deltaTime = target.timeEnd - this.timeStart;

      if(deltaTime <= target.timeActivate) {
        target.onDouble(touch, event);
      } else {
        target.onClick(touch, event);
      }

    },

    onDouble(touch, event) {

      //restrict listener activity within gamefield
      const fieldRect = cc.rect(CONFIG.fieldX, CONFIG.fieldY, CONFIG.fieldWidth, CONFIG.fieldHeight);
      const location = touch.getLocation();
      const target = event.getCurrentTarget();

      //Pick up necessary tile
      if(cc.rectContainsPoint(fieldRect, location)) {
        const tile = target.field.tilePick(location);

        if(tile.isBomb) {
          const blastRadius = target.field.fieldLogic.bombBlast(tile);
          target.makeTurn(blastRadius, tile);
       }
      }
    },

    onSingle(touch, event) {
      console.log("One!");
    },

    onClick(touch, event) {
      //restrict listener activity within gamefield
      const fieldRect = cc.rect(CONFIG.fieldX, CONFIG.fieldY, CONFIG.fieldWidth, CONFIG.fieldHeight);
      const location = touch.getLocation();
      const target = event.getCurrentTarget();

      //Pick up necessary tile
      if(cc.rectContainsPoint(fieldRect, location)) {
        const tile = target.field.tilePick(location);

        if(tile.isBomb) {
          target.field.bombAnimation(tile);
        } else {
        //return array of tiles similar in colour
        const arrOfTiles = target.field.fieldLogic.findTiles(tile);
        if(arrOfTiles.length >= CONFIG.tilesForBomb) { //check length for making bomb
          tile.isBomb = true;
        }
        if(arrOfTiles != undefined) {
          target.makeTurn(arrOfTiles, tile);
       } else {
          tile.isPicked = false; //to prevent innervation of the tile
                                //because it has been clicked
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
    makeTurn(arr, tile) {
      if(tile.isBomb) {
        this.field.assembleBomb(arr, tile);
      } else {
        this.field.destroyTiles(arr);
      }
      this.field.tilesSlideDown();
      this.field.refillTiles();
      this.gameInfo.updateScore(arr.length);
      this.gameInfo.updateTurns();
      this.gameInfo.isOver();
    }
});
