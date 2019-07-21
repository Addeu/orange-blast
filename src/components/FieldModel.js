/**
 * @class represents field logic
 */
class FieldModel{

  constructor() {
    this.tilesPos = this.create2dArray(CONFIG.maxRows, CONFIG.maxCols, null);
    this.tilesSpr = this.create2dArray(CONFIG.maxRows, CONFIG.maxCols, null);
  }

  /**
   * Creates 2d array
   * @private
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
   * @private
   * Checks if the tile is on the field and not null
   * @param {Object} tile to check
   * @return {boolean} true if exists
   */
  tileExists(tile) {
    return tile.rowIndex >= 0 && tile.rowIndex < CONFIG.maxRows && tile.colIndex >= 0 && tile.colIndex < CONFIG.maxCols && tile != null;
  }

  /**
   * @private
   * Collect all tiles of similar colour to one array
   * @param {Object} Picked tile from MainLayer
   * @return {Array} of similar tiles
   */
  findTiles(tile) {
    const stack = new Stack;
    stack.push(tile);
    const returnArr = [];
    while(!stack.isEmpty()) {
      const subject = stack.pop();
      this.checkForColor(subject).forEach(el => stack.push(el));
      returnArr.push(subject);
    }
    if(returnArr.length > 1) {
      return returnArr;
    } else {
      tile.isPicked = false;
    }
  }

  /**
   * @private
   * Checks neighbouring tiles for similar colour
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

    const similarNeighbours = this.validNeighbours(neighbours)
          .filter(element => element.extraAttr === tile.extraAttr && !element.isPicked);

    return similarNeighbours;
  }

  /**
   * Collects tiles to delete after bomb activation
   * @param {Object} Bomb tile
   * @return {Array} tiles to be deleted
   */
  superBlast(tile) {
    //tile.isSuperTile = false;
    let radius = [];
    switch(tile.extraAttr) {
      case CONFIG.bombType:
        radius = this.bombBlast(tile);
        break;

      case CONFIG.crossie:
        radius = this.crossieBlast(tile);
        break;

      case CONFIG.colorDestroy:
        radius = this.colorDestroyBlast(tile);
        break;

      default:
        radius = this.bombBlast(tile);
    }

    return this.validNeighbours(radius);
  }

  /**
   * @private
   * checks if tile is within the filed and binds it to tile sprite
   * @param {Array} tile positions to check
   * @return {Array} of valid tiles
   */
  validNeighbours(arr) {
    const validArr = arr.filter(element => this.tileExists(element))
                        .map(element => this.tilesSpr[element.rowIndex][element.colIndex]);
    return validArr;
  }

  /**
   * Find tiles that have holes below
   * @return {Array} of tiles and empty space
   */
  whichTilesNeedMove() {
    const returnArr = [];
    for(let i = 1; i < CONFIG.maxRows; i++) {
      for(let j = 0; j < CONFIG.maxCols; j++) {
        if(this.tilesSpr[i][j] !== null) {
          const emptySpace = this.findEmptySpace(i, j);
          if(emptySpace > 0) {
            returnArr.push({tile: this.tilesSpr[i][j], emptySpace});
            this.swapTiles(i, j, i - emptySpace);
          }
        }
      }
    }
   return returnArr;
  }

  /**
   * find empty space ander a tile
   * @private
   * @param {number} row index
   * @param {numver} column index
   */
  findEmptySpace(row, col) {
    let emptySpace = 0;
      for(let i = row - 1; i >= 0; i--) {
        if(this.tilesSpr[i][col] === null) {
          emptySpace++ ;
        }
      }
    return emptySpace;
  }

  /**
   * Moves upper tile to lower position
   * @private
   * @param {number} upper row index
   * @param {number} column index
   * @param {number} lower row index
   */
  swapTiles(row, col, row2) {
    this.tilesSpr[row2][col] = this.tilesSpr[row][col];
    this.tilesSpr[row2][col].rowIndex = row2;
    this.tilesSpr[row][col] = null;
  }

  /**
   * Collects tiles to delete after bomb super tile activation
   * @param {Object} Bomb tile
   * @return {Array} tiles to be deleted
   */
  bombBlast(tile) {
    const radius = [tile];
    for(let i = tile.rowIndex - CONFIG.blastRadius; i <= tile.rowIndex + CONFIG.blastRadius; i++) {
      for(let j = tile.colIndex - CONFIG.blastRadius; j <= tile.colIndex + CONFIG.blastRadius; j++) {
          radius.push({rowIndex: i, colIndex: j});
      }
    }
    return this.validNeighbours(radius);
  }

  /**
   * Collects tiles to delete after cross super tile activation
   * @param {Object} Cross tile
   * @return {Array} tiles to be deleted
   */
  crossieBlast(tile) {
    const radius = [];
      for(let i = 0; i < CONFIG.maxRows; i++) {
        radius.push({rowIndex: i, colIndex: tile.colIndex});
        radius.push({rowIndex: tile.rowIndex, colIndex: i});
      }
    return this.validNeighbours(radius);
  }

  /**
   * Collects tiles to delete after Color Destroy super tile activation
   * @param {Object} super tile
   * @return {Array} tiles to be deleted
   */
  colorDestroyBlast(tile) {
    const radius = [tile];
    for(let i = 0; i < CONFIG.maxRows; i++) {
      for(let j = 0; j < CONFIG.maxCols; j++) {
        if(this.tilesSpr[i][j].extraAttr === tile.resemblance) {
          radius.push({rowIndex: i, colIndex: j});
        }
      }
    }
    return this.validNeighbours(radius);
  }
}
