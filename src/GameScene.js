/**
 * @class Main scene of the game.
 * @extends cc.Scene
 */
const GameScene = cc.Scene.extend({
    ctor() {
      this._super();
      this.addChild(new Background(), 0); //zIndex = 0
      this.addChild(new MainLayer(), 1); //zIndex = 1
      this.addChild(new UILayer(), 2); //zIndex = 2
    }
});
