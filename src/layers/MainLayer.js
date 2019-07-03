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

      const notification = NotificationCenter();
      notification.addObserver(this, this.onClick, "click");



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

      this.tilesSpr[row][col] = new TileSprite(type);
      this.tilesSpr[row][col].setAnchorPoint(0.5, 0.5);
      this.tilesSpr[row][col].extraAttr = type;
      this.tilesSpr[row][col].rowIndex = row;
      this.tilesSpr[row][col].colIndex = col;
      this.tilesSpr[row][col].setPosition(this.tilesPos[row][col].x, this.tilesPos[row][col].y);

      this.addChild(this.tilesSpr[row][col]);
    },

    onClick(target){
      let arrOfTiles = this.findTiles(target);
      this.destroyTiles(arrOfTiles);

    },

    tileExists(tile) {
      return tile.rowIndex >= 0 && tile.rowIndex < 9 && tile.colIndex >= 0 && tile.colIndex < 9;
    },

    findTiles(tile) {
      let neighbours = this.checkForColor(tile);

      if(neighbours.length > 0) {
        let returnArr = [tile];
        while(neighbours.length > 0) {
          for(let i = 0; i < neighbours.length; i++) {
            let tilesToCheck = this.checkForColor(neighbours[i]);
            let neighboursFiltered = tilesToCheck.filter(element => !neighbours.includes(element));
            neighbours.push(...neighboursFiltered);
            returnArr.push(...neighbours.splice(i, 1));
          }
        }
        return returnArr;
      }
    },

    checkForColor(tile) {
      tile.isPicked = true;
      const tilesToCheck = [];

      const startRow = tile.rowIndex;
      const startCol = tile.colIndex;

      const upperTile = {rowIndex: startRow + 1, colIndex: startCol };
      const lowerTile = {rowIndex: startRow - 1, colIndex: startCol };
      const righterTile = {rowIndex: startRow, colIndex: startCol + 1};
      const lefterTile = {rowIndex: startRow, colIndex: startCol - 1};

      if(this.tileExists(upperTile)) {
        tilesToCheck.push(upperTile);
      }
      if(this.tileExists(lowerTile)) {
        tilesToCheck.push(lowerTile);
      }
      if(this.tileExists(righterTile)) {
        tilesToCheck.push(righterTile);
      }
      if(this.tileExists(lefterTile)) {
        tilesToCheck.push(lefterTile);
      }

      let neighbours = tilesToCheck
          .map(element => this.tilesSpr[element.rowIndex][element.colIndex])
          .filter(element =>element.extraAttr === tile.extraAttr)
          .filter(tile => !tile.isPicked);

      return neighbours;
    },

    destroyTiles(chunk) {
      console.log(chunk);
      chunk.forEach(tile => {
        let fly = new cc.MoveTo(0.3, 240, 720);
        const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
        const chain = new cc.Sequence(fly, deletion);
        tile.runAction(chain);
        this.tilesSpr[tile.rowIndex][tile.colIndex] = null;
      });
    },


  })
  return MainLayer;
}());
