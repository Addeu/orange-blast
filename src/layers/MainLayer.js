const MainLayer = (function() {
  const MainLayer = cc.Layer.extend({


      maxRows : 9, //Field size in number of rows
      maxCols : 9, //and columns

      tilesPos : null, // 2d array keeps tiles position
      tilesSpr : null, // 2d array keeps tiles sprites

    ctor() {
      this._super();
      this.init();
    },

    init() {
      const s = cc.winSize;

      const gamefield = cc.Sprite.create(res.gamefield);
      gamefield.setPosition(s.width * 0.5, s.height * 0.5);
      this.addChild(gamefield);

      this.tilesPos = this.create2dArray(this.maxRows, this.maxCols, null);
      this.tilesSpr = this.create2dArray(this.maxRows, this.maxCols, null);

      //Initializing the game matrix and populating it with tiles
      this.runAction(cc.CallFunc.create(this.initMatrix.bind(this)));
    },

    create2dArray(arow, acol, defValue) {
      let arr = [];
      for(let row = 0; row < arow; row++) {
        arr[row] = [];
        for(let col = 0; col < acol; col++) {
          arr[row][col] = defValue;
        }
      }
      return arr;
    },

    initMatrix() {

      const half = 25;         //half size of a tile
      const full = half * 2; //and full size of it

      const baseX = 40;  //coords from which
      const baseY = 160; //the matrix starts

      //Assignment of position on matrix and sprite
      for(let row = 0; row < this.maxRows; row++) {
        for(let col = 0; col < this.maxRows; col++) {
          this.tilesPos[row][col] = cc.p(baseX + col*full, baseY + row * full);
          this.addOneTile(row, col);
        }
      }
    },

    addOneTile(row, col) {
      const type = Math.floor(Math.random() * 5) + 1;

      this.tilesSpr[row][col] = new cc.Sprite(`res/${type}.png`);
      this.tilesSpr[row][col].setAnchorPoint(0.5, 0.5);
      this.tilesSpr[row][col].rowIndex = row;
      this.tilesSpr[row][col].colIndex = col;
      this.tilesSpr[row][col].setPosition(this.tilesPos[row][col].x, this.tilesPos[row][col].y);

      this.addChild(this.tilesSpr[row][col]);
    },

  })
  return MainLayer;
}());
