/**
 * @class represents model for game tile
 * @extends cc.Sprite
 */
const Tile = cc.Sprite.extend({

  ctor(type, row, col) {
    this._super(`res/${type}.png`);
    this.init(type, row, col);
  },

  init(type, row, col) {
    this.rowIndex = row;
    this.colIndex = col;
    this.extraAttr = type;
    this.isBomb = false;
    this.setAnchorPoint(0.5, 0.5);
  }
});
