import { catchMonster, attackedBase } from './monster.handler.js';

const handlerMappings = {
  31: catchMonster,
  32: attackedBase,
};

export default handlerMappings;