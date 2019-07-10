/*
Main scene of the game.
will show:
1. Current score
2. Turns left
3. Gamefield with tiles
4. Button to restart the game
*/
const GameScene = cc.Scene.extend({
    ctor() {
      this._super();
      this.addChild(new Background(), 0); //zIndex = 0
      this.addChild(new MainLayer(), 1); //zIndex = 1
      this.addChild(new UILayer(), 2); //zIndex = 2
    }
});
