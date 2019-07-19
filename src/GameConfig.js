/** @const {Object} Stores game params */
const CONFIG = {
  maxRows : 9,                     //rows on the gamefield
  maxCols : 9,                    //columns on the gamefield
  stdAnimationTime : 0.3,        //in seconds
  tileSize : 50,                //tiles are squares
  tileHalf: 25,
  base: 38,                   // coords to start tilesPos matrix
  topMostIndex : 99,         //zIndex to display above other sprites
  fieldWidth : 450,         //gamefield params
  fieldHeight : 450,       //without graphical border
  fieldX: 10,
  fieldY: 135,
  fieldBorderX: 15,
  fieldBorderY: 80,
  middleX: 240,
  progressBarY: 700,
  tilesForBomb: 6,
  blastRadius: 1,
  bombType: 6,         //Unique type, not corresponding with other tile colours
  crossie: 7,          //Unique type, for cross-blast
  colorDestroy: 8,    //Unique type, for descruction of similar-coloured tiles
  bonus: 500,        //for reaching the goal in less than given number of turns
  goal: 10000,
  turns: 50
};
