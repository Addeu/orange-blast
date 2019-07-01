const MainLayer = (function() {

  const MainLayer = cc.Layer.extend({

    ctor() {
      this._super();
      this.init();
    },

    init() {
      const s = cc.winSize;

      const gamefield = cc.Sprite.create(res.gamefield);
      gamefield.setPosition(s.width * 0.5, s.height * 0.5);
      this.addChild(gamefield);      
    }

  })
  return MainLayer;
}());
