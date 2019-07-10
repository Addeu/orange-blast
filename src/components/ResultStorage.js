/*
Keeps and gives the score
Uses Local Storage as DB
*/
class Storage {

    constructor() {
      this.lastscore = 0;
      this.bestScore = 0;
      this.init();
    }

    init() {
      //check for existing score records
      if(cc.sys.localStorage.getItem('scoreData') == null) {
        cc.sys.localStorage.setItem('bestScore', '0');
        cc.sys.localStorage.setItem('lastScore', '0');

        cc.sys.localStorage.setItem('scoreData', 33);
      }
      //setting score data
      this.bestScore = parseInt(cc.sys.localStorage.getItem('bestScore'));
      this.lastScore = parseInt(cc.sys.localStorage.getItem('lastScore'));
    }

    /**
    @param {Number} Recieves number from GameInfo module
    */
    setLastScore(score) {
      this.lastScore = score;

      if(score > this.bestScore) {
        this.bestScore = score;
        cc.sys.localStorage.setItem('bestScore', this.bestScore);
      }

     cc.sys.localStorage.setItem('lastScore', this.lastScore);
    }
}
