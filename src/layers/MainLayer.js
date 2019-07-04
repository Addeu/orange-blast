const MainLayer = (function() {
  const MainLayer = cc.Layer.extend({

      maxRows : 9, //Field size in number of rows
      maxCols : 9, //and columns

      tilesPos : null, // 2d array keeps tiles position
      tilesSpr : null, // 2d array keeps tiles sprites

    ctor() {
      this._super();
      this.init();
    },

    init() {
      const s = cc.winSize;

      this.field = new MainField;
      this.field.setPosition(s.width * 0.5, s.height * 0.5);
      this.field.setAnchorPoint(0.5, 0.5);
      this.addChild(this.field);

      this.listener = cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onClick}, this);
    },

    onClick(touch, event) {
      const location = touch.getLocation();
      const target = event.getCurrentTarget();
      const ly = Math.floor(location.y - 80);
      const lx = Math.floor(location.x - 15);
      const row =  Math.floor((ly - 80 + 25)/50);
      const col =  Math.floor((lx - 15 + 25)/50);
      const tile = target.field.tilesSpr[row][col];

      const arrOfTiles = target.field.findTiles(tile);
      target.makeTurn(arrOfTiles);
    },

    makeTurn(arr) {
      this.field.destroyTiles(arr);
      this.field.tilesSlideDown();
      this.field.refillTiles();
    }

  });
  return MainLayer;
}());
