/** @const {Object} Stores game params */
const CONFIG = {
  maxRows : 9,                     //rows on the gamefield
  maxCols : 9,                    //columns on the gamefield
  stdAnimationTime : 0.4,        //in seconds
  tileSize : 50,                //tiles are squares
  tileHalf: 25,
  base: 38,                   // coords to start tilesPos matrix
  topMostIndex : 99,         //zIndex to display above other sprites
  fieldWidth : 450,         //gamefield params
  fieldHeight : 450,       //without graphical border
  fieldX: 10,
  fieldY: 135,
  fieldBorder: 15,
  middleX: 240,
  progressBarY: 700,
  tilesForBomb: 7,
  blastRadius: 1,
  bombType: 6,         //Unique type, not corresponding with other tile colours
  bonus: 500,        //for reaching the goal in less than given number of turns
};
