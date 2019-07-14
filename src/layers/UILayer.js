/*
Returns UI layer that is used in:
  in IntroScene: starts new game
  in GameScene: restarts current game with different tiles
  in OutroScene: launches game again
*/
const UILayer = cc.Layer.extend({

    ctor() {

      this._super();
      this.createScreen();
    },

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
        const scale = new cc.ScaleBy(CONFIG.stdAnimationTime, 0.8);//Decrease to 0.8 from original size
        const easeScale = new cc.EaseBackOut(scale);
        const reaction = new cc.CallFunc(cc.director.runScene(new cc.TransitionSlideInR(CONFIG.stdAnimationTime, new GameScene())));
        const chain = new cc.Sequence(easeScale, reaction);

        this.runAction(chain);
      }
    }
});
