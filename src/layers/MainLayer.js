const MainLayer = (function() {
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
      this.gameInfo.progressBg.setPosition(s.width * 0.5, s.height * 0.95);
      this.addChild(this.gameInfo.progressBg);

      //Add progress bar course
      this.gameInfo.progressCourse.setPosition(s.width * 0.5, s.height * 0.95);
      this.addChild(this.gameInfo.progressCourse);

      //Add progress bar filament
      this.gameInfo.progress.setPosition(s.width * 0.5, s.height * 0.95);
      this.addChild(this.gameInfo.progress);

      /*
      Add score label (the order is important;
      may be done with zIndex with the same result)
      */
      this.gameInfo.scoreLabel.setPosition(s.width * 0.5, s.height * 0.95);
      this.addChild(this.gameInfo.scoreLabel);

      //Add turns label
      this.gameInfo.turnsLabel.setPosition(s.width * 0.5, s.height * 0.85);
      this.addChild(this.gameInfo.turnsLabel);

      //Add listeners for picking tiles
      this.listener = cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onClick}, this);
    },

    onClick(touch, event) {
      //restrict listener activity within gamefield
      const fieldRect = cc.rect(12, 135, 450, 450);
      const location = touch.getLocation();
      const target = event.getCurrentTarget();

      //Pick up necessary tile
      if(cc.rectContainsPoint(fieldRect, location)) {
        const ly = Math.floor(location.y - 80);
        const lx = Math.floor(location.x - 15);
        const row =  Math.floor((ly - 80 + 25)/50);// 50 is tile size
        const col =  Math.floor((lx - 15 + 25)/50);// 25 is a half of a tile
        const tile = target.field.tilesSpr[row][col];

        //return array of tiles similar in colour
        const arrOfTiles = target.field.findTiles(tile);
        if(arrOfTiles != undefined) {
          target.makeTurn(arrOfTiles);
       }
      }
    },

    /**
    Performs main mechanics:
    1. calls function to destroy tiles
    2. calls gamefield update
    3. calls score and turns update
    @param {Array} of similar tiles from this.onClick
    */
    makeTurn(arr) {
      this.field.destroyTiles(arr);
      this.field.tilesSlideDown();
      this.field.refillTiles();
      this.gameInfo.updateScore(arr.length);
      this.gameInfo.updateTurns();
      this.gameInfo.isOver();
    }

  });
  return MainLayer;
}());
