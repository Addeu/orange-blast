class GameConfig {
  constructor() {
    this.maxRows = 9;
    this.maxCols = 9;
    this.stdAnimationTime = 0.4; //in seconds
    this.tileSize = 50;      //tiles are squares
    this.topMostIndex = 99; //zIndex to display above other sprites
    this.fieldWidth = 450;
    this.fieldHeight = 450;
  }
}

const CONFIG = new GameConfig;
