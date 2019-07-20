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
    tile.isSuperTile = false;
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
   * @public
   * @param {Array}
   * @return {Array}
   */
  whichTilesNeedMove(arr) {
    const nulls = this.removeDuplicateCols(arr, "colIndex");
    const movingTiles = this.tilesToMove(nulls);
    return movingTiles;
  }


  /**
   * @private
   * @param {Array}
   * @param {String} Object property to be filtered
   * @return {Array}
   */
  removeDuplicateCols(testArr, prop) {
    return testArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }


  /**
   * @private
   * @param {Array}
   * @return {Array}
   */
  tilesToMove(arr) {
    const returnArr = [];
    arr.forEach(tile => {
      let col = tile.colIndex;
      for (let i = 1; i < CONFIG.maxRows; i++) {
        if (this.tilesSpr[i][col] !== null) {
          let emptySpace = 0;
          for (let m = i - 1; m >= 0; m--) {
            if (this.tilesSpr[m][col] === null) {
              emptySpace++ ;
            }
          }
          if (emptySpace > 0) {
            returnArr.push({ tile: this.tilesSpr[i][col], emptySpace });

            this.tilesSpr[i - emptySpace][col] = this.tilesSpr[i][col];
            this.tilesSpr[i - emptySpace][col].rowIndex = i - emptySpace;
            this.tilesSpr[i][col] = null;
          }
        }
      }
    });
    return returnArr;
  }

  /**
   * Collects tiles to delete after bomb activation
   * @param {Object} Bomb tile
   * @return {Array} tiles to be deleted
   */
  bombBlast(tile) {
    tile.isSuperTile = false;
    const radius = [tile];
    for(let i = tile.rowIndex - CONFIG.blastRadius; i <= tile.rowIndex + CONFIG.blastRadius; i++) {
      for(let j = tile.colIndex - CONFIG.blastRadius; j <= tile.colIndex + CONFIG.blastRadius; j++) {
          radius.push({rowIndex: i, colIndex: j});
      }
    }
    return this.validNeighbours(radius);
  }

  /**
   * Collects tiles to delete after bomb activation
   * @param {Object} Bomb tile
   * @return {Array} tiles to be deleted
   */
  crossieBlast(tile) {
    tile.isSuperTile = false;
    const radius = [];
      for(let i = 0; i < CONFIG.maxRows; i++) {
        radius.push({rowIndex: i, colIndex: tile.colIndex});
        radius.push({rowIndex: tile.rowIndex, colIndex: i});
      }
    return this.validNeighbours(radius);
  }

  /**
   * Collects tiles to delete after bomb activation
   * @param {Object} Bomb tile
   * @return {Array} tiles to be deleted
   */
  colorDestroyBlast(tile) {
    tile.isSuperTile = false;
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
