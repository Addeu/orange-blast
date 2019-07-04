const GameInfo = (function() {
  class GameInfo{
    constructor() {
      this.turns = 50;
      this.score = 0;
      this.goal = 10000;
    }

    init() {
      const s = cc.winSize;

    }

    updateScore(number) {
      if(number <= 3) {
        this.score += number * 20;
      }
      else if ( 3 < number <= 5) {
        this.score += number * 50;
      }
      else if (5 < number) {
        this.score += number * 100;
      }
    }

    updateTurns() {
      this.turns-- ;
    }
  }
return GameInfo;
}());
