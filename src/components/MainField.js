/*
Is used on MainScene

responsible for:
1. creating the Gamefield
2. creating and positioning tiles
3. Cheking picked tiles
4. Revoming deleted tiles
5. Updating and refilling the gamefield
*/
const MainField = cc.Sprite.extend({

    ctor() {
      this._super(res.gamefield);
      this.init();
    },

    init() {
      this.fieldLogic = new FieldModel;
      //Initializing the game matrix and populating it with tiles
      this.runAction(cc.CallFunc.create(this.initMatrix.bind(this)));
    },

    initMatrix() {
      const baseX = 38;  //coords from which
      const baseY = 38; //the matrix starts

      //Assignment of position on the matrix
      for(let row = 0; row < CONFIG.maxRows; row++) {
        for(let col = 0; col < CONFIG.maxRows; col++) {
          this.fieldLogic.tilesPos[row][col] = cc.p(baseX + col*CONFIG.tileSize, baseY + row * CONFIG.tileSize);
          this.addOneTile(row, col);
        }
      }
    },

    /**
     * @description Matches location with tile
     * @params {Object} location {x, y}
     * @return {Object} tile sprite
     */
    tilePick(location) {

      const ly = Math.floor(location.y - 80);
      const lx = Math.floor(location.x - CONFIG.fieldBorder);
      const row =  Math.floor((ly - 80 + CONFIG.tileHalf)/CONFIG.tileSize);
      const col =  Math.floor((lx - CONFIG.fieldBorder + CONFIG.tileHalf)/CONFIG.tileSize);
      const tile = this.fieldLogic.tilesSpr[row][col];

      return tile;
    },

    /**
     * @description Add a tile sprite to the field
     * @param {number} a row to place the tile
     * @param {number} a column to place the tile
     */
    addOneTile(row, col) {
      const type = Math.floor(Math.random() * 5) + 1;

      this.fieldLogic.tilesSpr[row][col] = new Tile(type, row, col);
      this.fieldLogic.tilesSpr[row][col].setPosition(this.fieldLogic.tilesPos[row][col].x, CONFIG.fieldHeight);

      const slide = new cc.MoveTo(0.3, this.fieldLogic.tilesPos[row][col].x, this.fieldLogic.tilesPos[row][col].y);
      this.fieldLogic.tilesSpr[row][col].runAction(slide);
      this.addChild(this.fieldLogic.tilesSpr[row][col]);

    },


    /**
     * @description Animates and deletes tiles that make a bomb
     * @param {Array} of tiles to make a bomb
     * @param {Object} a root tile for the bomb
     */
    assembleBomb(arr, bomb) {
      bomb.zIndex = CONFIG.topMostIndex;
      bomb.extraAttr = CONFIG.bombType;
      bomb.setTexture(res.bombie);
      arr.forEach(tile => {
        if(!tile.isBomb) {
          const unify = new cc.MoveTo(CONFIG.stdAnimationTime, bomb.x, bomb.y);
          const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
          const chain = new cc.Sequence(unify, deletion);
          tile.runAction(chain);
          this.fieldLogic.tilesSpr[tile.rowIndex][tile.colIndex] = null;
        }
      });
    },

    /**
     * @description Provides animation and removes tiles
     * marked for deletion
     * @param {Array} of marked tiles for deletion
     */
    destroyTiles(chunk) {
      chunk.forEach(tile => {
        tile.zIndex = CONFIG.topMostIndex;
        const shrinking = new cc.ScaleTo(CONFIG.stdAnimationTime, 0.5);
        const fly = new cc.MoveTo(CONFIG.stdAnimationTime, CONFIG.middleX, CONFIG.progressBarY);
        const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
        const chain = new cc.Sequence(shrinking, fly, deletion);
        tile.runAction(chain);
        this.fieldLogic.tilesSpr[tile.rowIndex][tile.colIndex] = null;
      });
    },

    /**
     * @description Moves remaining tiles down to fill in empty spaces
     */
    tilesSlideDown() {
      const tilesToMove = this.fieldLogic.whichTilesNeedMove();

      tilesToMove.forEach(movingTile => {
        const tile = movingTile.tile;
        const hole = movingTile.emptySpace;
        const xCoord = tile.x;
        const yCoord = tile.y - hole * CONFIG.tileSize;
        const slideDown = new cc.MoveTo(CONFIG.stdAnimationTime, xCoord, yCoord);
        tile.runAction(slideDown);
      });
    },


    /**
     * @description adds tiles to empty spaces
     * after sliding down and deletion
     */
    refillTiles() {
      for(let i = 0; i < CONFIG.maxRows; i++) {
        for(let j = 0; j < CONFIG.maxCols; j++) {
          if(this.fieldLogic.tilesSpr[i][j] == null) {
            this.addOneTile(i, j);
          }
        }
      }
    },

    /**
     * @description Animation to react on non-double click
     * @param {Object} tile to animate
     */
    bombAnimation(bomb) {
      const shrinking = new cc.ScaleTo(CONFIG.stdAnimationTime, 0.8);
      const expanding = new cc.ScaleTo(CONFIG.stdAnimationTime, 1);
      const chain = new cc.Sequence(shrinking, expanding);
      const repeat = new cc.RepeatForever(chain);
      bomb.runAction(repeat);
    }
});
