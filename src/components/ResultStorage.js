const Storage = (function() {
  class Storage{

    constructor() {
      this.lastscore = 0;
      this.bestScore = 0;
      this.init();
    }

    init() {
      if(cc.sys.localStorage.getItem('scoreData') == null) {
        cc.sys.localStorage.setItem('bestScore', '0');
        cc.sys.localStorage.setItem('lastScore', '0');

        cc.sys.localStorage.setItem('scoreData', 33);
      }
      this.bestScore = parseInt(cc.sys.localStorage.getItem('bestScore'));
      this.lastScore = parseInt(cc.sys.localStorage.getItem('lastScore'));
    }

    setLastScore(score) {
      this.lastScore = score;

      if(score > this.bestScore) {
        this.bestScore = score;
        cc.sys.localStorage.setItem('bestScore', this.bestScore);
      }

     cc.sys.localStorage.setItem('lastScore', this.lastScore);
    }
  }
  return Storage;
}());
