class FieldModel{

  constructor() {
    this.tilesPos = this.create2dArray(CONFIG.maxRows, CONFIG.maxCols, null);
    this.tilesSpr = this.create2dArray(CONFIG.maxRows, CONFIG.maxCols, null);
  }

  /**
  * @description Creates 2d array
  * @param {number} desired number of rows
  * @param {number} desired number of columns
  * @param {number || string || Object || null} set default value for the array
  * @return {Array} two dimensional array
  */
  create2dArray(arow, acol, defValue) {
    let arr = [];
    for(let row = 0; row < arow; row++) {
      arr[row] = [];
      for(let col = 0; col < acol; col++) {
        arr[row][col] = defValue;
      }
    }
    return arr;
  }

  /**
  * @description Checks if the tile is on the field and not null
  * @param {Object} tile to check
  * @return {boolean} true if exists
  */
  tileExists(tile) {
    return tile.rowIndex >= 0 && tile.rowIndex < CONFIG.maxRows && tile.colIndex >= 0 && tile.colIndex < CONFIG.maxCols && tile != null;
  }

  /**
  * @description Collect all tiles of similar colour to one array
  * @param {Object} Picked tile from MainLayer
  * @return {Array} of similar tiles
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
      if(returnArr.length > 1) {
        return returnArr;
      } else {
        tile.isPicked = false;
      }
    }
  }

  /**
  * @description Check neighbouring tiles for similar colour
  * @param {Object} Picked tile
  * @return {Array} of similar neighbouring tiles
  */
  checkForColor(tile) {
    tile.isPicked = true;

    const neighbours = [
      {rowIndex: tile.rowIndex + 1, colIndex: tile.colIndex }, //upper tile
      {rowIndex: tile.rowIndex - 1, colIndex: tile.colIndex }, //lower tile
      {rowIndex: tile.rowIndex, colIndex: tile.colIndex + 1}, //tile to the right
      {rowIndex: tile.rowIndex, colIndex: tile.colIndex - 1} //tile to the left
    ];

    const similarNeighbours = neighbours
        .filter(element => this.tileExists(element))
        .map(element => this.tilesSpr[element.rowIndex][element.colIndex])
        .filter(element => element.extraAttr === tile.extraAttr && !element.isPicked);

    return similarNeighbours;
  }

  bombBlast(tile) {
    tile.isBomb = false;
    const radius = [tile];
      for(let i = tile.rowIndex - CONFIG.blastRadius; i <= tile.rowIndex + CONFIG.blastRadius; i++) {
        for(let j = tile.colIndex - CONFIG.blastRadius; j <= tile.colIndex + CONFIG.blastRadius; j++) {
            radius.push(this.tilesSpr[i][j]);
        }
      }
    return radius.filter(element => this.tileExists(element));
  }

  whichTilesNeedMove() {
    const tilesToMove = [];
    for (let i = 1; i < CONFIG.maxRows; i++) {
      for (let j = 0; j < CONFIG.maxCols; j++) {
        if (this.tilesSpr[i][j] !== null) {
          let emptySpace = 0;
          for (let m = i - 1; m >= 0; m--) {
            if (this.tilesSpr[m][j] === null) {
              emptySpace++ ;
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
  }
}
