/**
 * @class First scene of the game.
 * Used as Outro as well
 * @extends cc.Scene
 */
const IntroScene = cc.Scene.extend({
    ctor(result = "Orange BLAST!!!") {
      this._super();
      this.addChild(new Background(), 0); //zIndex = 0
      this.addChild(new UILayer(), 1); //zIndex = 1
      this.storage = new Storage; //to get access to localStorage for results
      this.init(result);
    },

    init(result) {
      const s = cc.winSize;

      const title = new cc.LabelTTF(result, "Marvin", 32);
      const best = new cc.LabelTTF(`Best score is: ${this.storage.bestScore}`, "Marvin", 26);
      const last = new cc.LabelTTF(`Last score is: ${this.storage.lastScore}`, "Marvin", 26);

      title.setPosition(s.width * 0.5, s.height * 0.8);
      best.setPosition(s.width * 0.5, s.height * 0.6);
      last.setPosition(s.width * 0.5, s.height * 0.5);

      this.addChild(title);
      this.addChild(last);
      this.addChild(best);
    }
});
