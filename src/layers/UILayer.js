/*
Returns UI layer that is used to:
  in IntroScene: starts new game
  in GameScene: restarts current game with different tiles
  in OutroScene: launches game again
*/
const UILayer = (function() {

  const UILayer = cc.Layer.extend({

    ctor() {

      this._super();
      this.createScreen();
    },

    // TODO: add best score/lastscore layouts

    createScreen() {
      const s = cc.winSize;

      const startButton = new ccui.Button();
      startButton.loadTextures(res.button, res.button);
      startButton.setTitleText("Start new game");
      startButton.setTitleFontName("Marvin");
      startButton.setTitleFontSize(36);
      startButton.setScale(0.4);
      startButton.setPosition(s.width * 0.5, s.height * 0.1);
      startButton.addTouchEventListener(this.buttonEvent, this);
      this.addChild(startButton);
    },

    buttonEvent(sender, type) {
      if(type == ccui.Widget.TOUCH_ENDED) {
        const scale = new cc.ScaleBy(0.2, 0.8);
        const easeScale = new cc.EaseBackOut(scale);
        const reaction = new cc.CallFunc(cc.director.runScene(new cc.TransitionSlideInR(0.25, new GameScene())));
        const chain = new cc.Sequence(easeScale, reaction);

        this.runAction(chain);
      }
    }
  })
  return UILayer;
}());
