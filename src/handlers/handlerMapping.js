import { gameStart } from './gameStart.handler.js';
import { attackedBase, catchMonster } from './monster.handler.js';
import { gameOver } from './gameOver.handler.js';
import { getHighScore } from './getHighScore.handler.js';

const handlerMappings = {
  11: gameStart,
  12: gameOver,
  31: catchMonster,
  32: attackedBase,
  41: getHighScore,
};

export default handlerMappings;
