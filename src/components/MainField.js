/**
 * @class represents gamefield
 * @extends cc.Sprite
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

    /**
     * @private Assogns tile position on the matrix
     */
    initMatrix() {
      for(let row = 0; row < CONFIG.maxRows; row++) {
        for(let col = 0; col < CONFIG.maxRows; col++) {
          this.fieldLogic.tilesPos[row][col] = cc.p(CONFIG.base + col*CONFIG.tileSize, CONFIG.base + row * CONFIG.tileSize);
          this.addOneTile(row, col);
        }
      }
    },

    /**
     * Matches touch location with tile
     * @params {Object} location {x, y}
     * @return {Object} tile sprite
     */
    tilePick(location) {

      const row =  Math.floor((Math.floor(location.y - CONFIG.fieldBorderY) - CONFIG.fieldBorderY + CONFIG.tileHalf)/CONFIG.tileSize);
      const col =  Math.floor((Math.floor(location.x - CONFIG.fieldBorderX) - CONFIG.fieldBorderX + CONFIG.tileHalf)/CONFIG.tileSize);
      const tile = this.fieldLogic.tilesSpr[row][col];

      return tile;
    },

    /**
     * Add a tile sprite to the field
     * @param {number} a row to place the tile
     * @param {number} a column to place the tile
     */
    addOneTile(row, col) {
      const type = Math.floor(Math.random() * 5) + 1;

      this.fieldLogic.tilesSpr[row][col] = new Tile(type, row, col);
      this.fieldLogic.tilesSpr[row][col].setPosition(this.fieldLogic.tilesPos[row][col].x, 740);
      this.fieldLogic.tilesSpr[row][col].setOpacity(0);
;
      this.fieldLogic.tilesSpr[row][col].runAction(this.tileAnimation(this.fieldLogic.tilesPos[row][col].x, this.fieldLogic.tilesPos[row][col].y));
      this.addChild(this.fieldLogic.tilesSpr[row][col]);

    },


    /**
     * Animates and deletes tiles that make a superTile
     * @param {Array} of tiles to make a superTile
     * @param {Object} a root tile for the superTile
     */
    assembleSuperTile(arr, superTile) {
      superTile.zIndex = CONFIG.topMostIndex;
      superTile.resemblance = superTile.extraAttr;
      superTile.extraAttr = Math.floor(CONFIG.bombType + Math.random() * (CONFIG.colorDestroy + 1 - CONFIG.bombType));
      superTile.setTexture(this.chooseTexture(superTile));
      arr.forEach(tile => {
        if(!tile.isSuperTile) {
          const unify = new cc.MoveTo(CONFIG.stdAnimationTime, superTile.x, superTile.y);
          const deletion = new cc.CallFunc(tile => this.removeChild(tile), this);
          const chain = new cc.Sequence(unify, deletion);
          tile.runAction(chain);
          this.fieldLogic.tilesSpr[tile.rowIndex][tile.colIndex] = null;
        }
      });
    },

    /**
     * Provides animation and removes tiles
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
     * Moves remaining tiles down to fill in empty spaces
     */
    tilesSlideDown(arr) {
      const tilesToMove = this.fieldLogic.whichTilesNeedMove(arr);

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
     * adds tiles to empty spaces
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
     * Animation to react on non-double click
     * @param {Object} tile to animate
     */
    superTileAnimation(superTile) {
      const shrinking = new cc.ScaleTo(CONFIG.stdAnimationTime, 0.8);
      const expanding = new cc.ScaleTo(CONFIG.stdAnimationTime, 1);
      const chain = new cc.Sequence(shrinking, expanding);
      const repeat = new cc.RepeatForever(chain);
      superTile.runAction(repeat);
    },

    chooseTexture(superTile) {
      switch(superTile.extraAttr) {

        case CONFIG.bombType:
           return `res/bombie.png`;
           break;

        case CONFIG.crossie:
           return `res/crossie.png`;
           break;

        case CONFIG.colorDestroy:
          return `res/${superTile.resemblance}a.png`;
          break;

        default:
          return `res/bombie.png`;
    }
  },

  tileAnimation(locX, locY) {
    const slide = new cc.MoveTo(CONFIG.stdAnimationTime, locX, locY);
    const delay = cc.delayTime((CONFIG.stdAnimationTime / 3) * 2); //to keep tile invisible for 2/3 of its way down
    const makeVisible = new cc.FadeIn(CONFIG.stdAnimationTime / 3);
    const chain = new cc.Sequence(delay, makeVisible);
    const spawn = new cc.Spawn(slide, chain);

    return spawn;
  }
});
