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
      this.progressBg = new cc.Sprite(res.progressHoster);
      this.progressCourse = new cc.Sprite(res.progressBarCourse);
      this.scoreLabel = new cc.LabelTTF(`${this.score} out of ${this.goal}`, "Marvin", 16);
      this.turnsLabel = new cc.LabelTTF(`Turns left: ${this.turns}`, "Marvin", 20);
    }

    /**
    Updates game score according to the size of deleted tiles chunk
    the bigger the chunk the more points the player recieves
    @param {number} Array.length of tiles to delete from MainLayer
    */
    updateScore(number) {
      if(number <= 3) {
        this.score += number * 20;
        this.scoreLabel.setString(`${this.score} out of ${this.goal}`);
      }
      if ( 3 < number <= 5) {
        this.score += number * 30;
        this.scoreLabel.setString(`${this.score} out of ${this.goal}`);
      }
      if (5 < number) {
        this.score += number * 40;
        this.scoreLabel.setString(`${this.score} out of ${this.goal}`);
      }
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
