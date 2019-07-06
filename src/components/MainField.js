/*
Is used on MainScene

responsible for:
1. creating the Gamefield
2. creating and positioning tiles
3. Cheking picked tiles
4. Revoming deleted tiles
5. Updating and refilling the gamefield
*/
const MainField = (function() {
  const MainField = cc.Sprite.extend({

    maxRows : 9, //Field size in number of rows
    maxCols : 9, //and columns

    tilesPos : null, // 2d array keeps tiles position
    tilesSpr : null, // 2d array keeps tiles sprites

    ctor() {
      this._super(res.gamefield);
      this.init();
    },

    init() {
      const s = cc.winSize;

      //Creating 2d arrays for Sprites and their position
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

      const full = 50; //full size of a tile

      const baseX = 38;  //coords from which
      const baseY = 38; //the matrix starts

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
      this.tilesSpr[row][col].extraAttr = type;
      this.tilesSpr[row][col].rowIndex = row;
      this.tilesSpr[row][col].colIndex = col;
      this.tilesSpr[row][col].setPosition(40, 600);

      const slide = new cc.MoveTo(0.3, this.tilesPos[row][col].x, this.tilesPos[row][col].y);
      this.tilesSpr[row][col].runAction(slide);
      this.addChild(this.tilesSpr[row][col]);

    },

    tileExists(tile) {
      return tile.rowIndex >= 0 && tile.rowIndex < 9 && tile.colIndex >= 0 && tile.colIndex < 9 && tile != null;
    },

    /**
    Collect all tiles of similar colour to one array
    @param {Object} Picked tile from MainLayer
    @return {Array} of similar tiles
    */
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

    /**
    Check neighbouring tiles for similar colour
    @param {Object} Picked tile from this.findTiles
    @return {Array} of similar neighbouring tiles
    */
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

      const neighbours = tilesToCheck
          .map(element => this.tilesSpr[element.rowIndex][element.colIndex])
          .filter(element =>element.extraAttr === tile.extraAttr)
          .filter(tile => !tile.isPicked);

      return neighbours;
    },

    destroyTiles(chunk) {
      chunk.forEach(tile => {
        tile.zIndex = 99; //To make sure removing tiles are ABOVE other tiles
        const shrinking = new cc.ScaleTo(0.5, 0.5);
        const fly = new cc.MoveTo(0.4, 240, 700);
        const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
        const chain = new cc.Sequence(shrinking, fly, deletion);
        tile.runAction(chain);
        this.tilesSpr[tile.rowIndex][tile.colIndex] = null;
      });
    },

    whichTilesNeedMove() {
      const tilesToMove = [];
      for (let i = 1; i < this.maxRows; i++) {
        for (let j = 0; j < this.maxCols; j++) {
          if (this.tilesSpr[i][j] !== null) {
            let emptySpace = 0;
            for (let m = i - 1; m >= 0; m--) {
              if (this.tilesSpr[m][j] === null) {
                emptySpace++
              }
            }
            if (emptySpace > 0) {
              tilesToMove.push({ tile: this.tilesSpr[i][j], emptySpace });

              this.tilesSpr[i - emptySpace][j] = this.tilesSpr[i][j];
              this.tilesSpr[i - emptySpace][j].rowIndex = i - emptySpace;
              this.tilesSpr[i][j] = null;
            }
          }
        }
      }
      return tilesToMove;
    },

    tilesSlideDown() {
      let tilesToMove = this.whichTilesNeedMove();

      tilesToMove.forEach(movingTile => {
        let tile = movingTile.tile;
        let hole = movingTile.emptySpace;
        let xCoord = tile.x;
        let yCoord = tile.y - hole*50;
        let slideDown = new cc.MoveTo(0.4, xCoord, yCoord);
        tile.runAction(slideDown);
      });
    },

    refillTiles() {
      for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          if(this.tilesSpr[i][j] == null) {
            this.addOneTile(i, j)
          }
        }
      }
    },


  })
  return MainField;
}());
