import { gameStart } from './gameStart.handler.js';
import { attackedBase, catchMonster } from './monster.handler.js';
import { gameOver } from './gameOver.handler.js';
import { getHighScore } from './getHighScore.handler.js';
import { moveStage } from './moveStage.handler.js';
import { placeAddTower, sellTower, upgradeTower } from './tower.handler.js';

const handlerMappings = {
  11: gameStart,
  12: gameOver,
  13: moveStage,
  22: placeAddTower,
  23: sellTower, 
  24: upgradeTower,
  31: catchMonster,
  32: attackedBase,
  41: getHighScore,
};

export default handlerMappings;
