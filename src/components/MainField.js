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

      //Assignment of position on the matrix
      for(let row = 0; row < this.maxRows; row++) {
        for(let col = 0; col < this.maxRows; col++) {
          this.tilesPos[row][col] = cc.p(baseX + col*full, baseY + row * full);
          this.addOneTile(row, col);
        }
      }
    },

    /**
    Add a tile sprite to the field
    is used in:
    this.initMatrix
    this.refillTiles
    @param {Number} a row to place the tile
    @param {Number} a column to place the tile
    */
    addOneTile(row, col) {
      const type = Math.floor(Math.random() * 5) + 1;

      this.tilesSpr[row][col] = new cc.Sprite(`res/${type}.png`);
      this.tilesSpr[row][col].setAnchorPoint(0.5, 0.5);
      this.tilesSpr[row][col].extraAttr = type;
      this.tilesSpr[row][col].rowIndex = row;
      this.tilesSpr[row][col].colIndex = col;
      this.tilesSpr[row][col].setPosition(this.tilesPos[row][col].x, 450);

      const slide = new cc.MoveTo(0.3, this.tilesPos[row][col].x, this.tilesPos[row][col].y);
      this.tilesSpr[row][col].runAction(slide);
      this.addChild(this.tilesSpr[row][col]);

    },

    /**
    Checks if the tile is on the field and not null
    is used in:
    this.checkForColor
    @param {Object} tile to check
    @return {Boolean} true if exists
    */
    tileExists(tile) {
      return tile.rowIndex >= 0 && tile.rowIndex < 9 && tile.colIndex >= 0 && tile.colIndex < 9 && tile != null;
    },

    /**
    Collect all tiles of similar colour to one array
    @param {Object} Picked tile from MainLayer
    @return {Array} of similar tiles
    */
    findTiles(tile) {
      const neighbours = this.checkForColor(tile);
      if(neighbours.length > 0) {
        const returnArr = [tile];
        while(neighbours.length > 0) {
          for(let i = 0; i < neighbours.length; i++) {
            const tilesToCheck = this.checkForColor(neighbours[i]);
            const neighboursFiltered = tilesToCheck.filter(element => !neighbours.includes(element));
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

      const startRow = tile.rowIndex;
      const startCol = tile.colIndex;

      const neighbours = [
        {rowIndex: startRow + 1, colIndex: startCol }, //upper tile
        {rowIndex: startRow - 1, colIndex: startCol }, //lower tile
        {rowIndex: startRow, colIndex: startCol + 1}, //tile to the right
        {rowIndex: startRow, colIndex: startCol - 1} //tile to the left
      ];

      const similarNeighbours = neighbours
          .filter(element => this.tileExists(element))
          .map(element => this.tilesSpr[element.rowIndex][element.colIndex])
          .filter(element => element.extraAttr === tile.extraAttr && !element.isPicked);

      return similarNeighbours;
    },

    /**
    Provides animation and removes tiles
    marked for deletion
    is called from MainLayer.makeTurn
    @param {Array} of marked tiles for deletion
    */
    destroyTiles(chunk) {
      chunk.forEach(tile => {
        tile.zIndex = 99; //To make sure removing tiles are shown ABOVE other tiles
        const shrinking = new cc.ScaleTo(0.5, 0.5);
        const fly = new cc.MoveTo(0.4, 240, 700);
        const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
        const chain = new cc.Sequence(shrinking, fly, deletion);
        tile.runAction(chain);
        this.tilesSpr[tile.rowIndex][tile.colIndex] = null;
      });
    },

    /*Checks tiles for empty space below
    Is used in this.tilesSlideDown
    */
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
      const tilesToMove = this.whichTilesNeedMove();

      tilesToMove.forEach(movingTile => {
        const tile = movingTile.tile;
        const hole = movingTile.emptySpace;
        const xCoord = tile.x;
        const yCoord = tile.y - hole*50;
        const slideDown = new cc.MoveTo(0.4, xCoord, yCoord);
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
