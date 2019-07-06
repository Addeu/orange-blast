const GameInfo = (function() {

  class GameInfo{

    constructor() {
      this.turns = 50;
      this.score = 0;
      this.goal = 10000;
      this.storage = new Storage;
      this.init();
    }

    init() {
      //Set progressBar background and information labels
      this.progressBg = new cc.Sprite(res.progressHoster);
      this.progressCourse = new cc.Sprite(res.progressBarCourse);
      this.scoreLabel = new cc.LabelTTF(`${this.score} out of ${this.goal}`, "Marvin", 16);
      this.turnsLabel = new cc.LabelTTF(`Turns left: ${this.turns}`, "Marvin", 20);


      //Set Progress bar with Cocos2d ProgressTimer
      this.progress = cc.ProgressTimer.create(cc.Sprite.create(res.progressBar));
      this.progress.setType(cc.ProgressTimer.TYPE_BAR);
      this.progress.setBarChangeRate(cc.p(1, 0));
      this.progress.setMidpoint(cc.p(0, 0));
    }

    /**
    Updates game score according to the size of deleted tiles chunk
    the bigger the chunk the more points the player recieves
    @param {number} Array.length of tiles to delete from MainLayer
    */
    updateScore(number) {
      if(number <= 3) {
        this.score += number * 20;
      }
      if ( 3 < number <= 5) {
        this.score += number * 30;
      }
      if (5 < number) {
        this.score += number * 40;
      }
      //change Score label content
      this.scoreLabel.setString(`${this.score} out of ${this.goal}`);

      //change ProgressBar filling
      const fillScale = cc.progressTo(0.4, this.score/this.goal * 100);
      this.progress.runAction(fillScale);
    }

    updateTurns() {
      this.turns-- ;
      this.turnsLabel.setString(`Turns left: ${this.turns}`);
    }

    /*
    Conditions to finish the game.
    If the player gets more than 10000 points before
    runs out of turns, it will be rewarded with bonus points
    that equal number of turns left multiplie by 500
    */
    isOver() {
      if(this.turns <= 0) {
        this.storage.setLastScore(this.score);
        cc.director.runScene(new cc.TransitionSlideInR(0.4, new IntroScene("Ooops! Try again!")));
      }
      else if (this.score >= 10000) {
        this.score += this.turns * 500;
        this.storage.setLastScore(this.score);
        cc.director.runScene(new cc.TransitionSlideInR(0.4, new IntroScene("You won!!")));
      }
    }
  }
return GameInfo;
}());
