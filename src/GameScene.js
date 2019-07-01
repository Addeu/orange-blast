/*
First scene of the game.
will show:
1. Last score (if any)
2. Best score (if any)
3. Button to start the game
*/
const GameScene = (function() {
  //TODO: get scores

  const GameScene = cc.Scene.extend({
    ctor() {
      this._super();
      this.addChild(new Background(), 0); //zIndex = 0
      this.addChild(new UILayer(), 1); //zIndex = 1
      this.addChild(new MainLayer(), 2); //zIndex = 2
    }
  });
  return GameScene;
}());
