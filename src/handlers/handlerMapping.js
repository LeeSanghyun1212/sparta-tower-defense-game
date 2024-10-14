import { gameStart } from './gameStart.handler.js';
import { attackedBase, catchMonster } from './monster.handler.js';

const handlerMappings = {
  11: gameStart,
  31: catchMonster,
  32: attackedBase,
};

export default handlerMappings;
