/*
Returns Background that is used
to add background throughout the game
*/
const Background = cc.Layer.extend({

    ctor() {

      this._super();
      this.init()
    },

    init() {
      const s = cc.winSize; //get size
      const bg = cc.LayerColor.create(new cc.Color(255, 99, 71, 255), s.width, s.height);

      this.addChild(bg, 0); //zIndex = 0
    }
});
