import { attackedBase } from './attackedBase.handler.js';
import { catchMonster } from './catchMonter.handler.js';
import { gameStart } from './gameStart.handler.js';
import { moveStage } from './moveStage.handler.js';
import { placeAddTower } from './placeAddTower.handler.js';
import { placeInitTower } from './placeInitTower.handler.js';

const handlerMappings = {
  11: gameStart, // 게임 시작 Event,
  13: moveStage, // 다음 스테이지 이동 Event,
  21: placeInitTower, // 무료 타워 배치 Event,
  22: placeAddTower, // 유료 타워 배치 Event,
  31: catchMonster, // 몬스터 처치 Event
  32: attackedBase, // 몬스터 자폭 Event
};

export default handlerMappings;
