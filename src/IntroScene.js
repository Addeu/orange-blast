/*
First scene of the game.
will show:
1. Last score (if any)
2. Best score (if any)
3. Button to start the game
*/
const IntroScene = (function() {
  //TODO: get scores

  const IntroScene = cc.Scene.extend({
    ctor() {
      this._super();
      this.addChild(new Background(), 0); //zIndex = 0
      this.addChild(new UILayer(), 1); //zIndex = 1

      const title = new cc.LabelTTF("Orange BLAST!!!", "Marvin", 32);
      const s = cc.winSize;
      title.setPosition(s.width * 0.5, s.height * 0.8);

      this.addChild(title);
    }
  });
  return IntroScene;
}());
