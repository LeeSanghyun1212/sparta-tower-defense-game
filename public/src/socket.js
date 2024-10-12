import { CLIENT_VERSION } from './constant.js';
import { serverSocket } from './game.js';

export const sendEvent = (userId, handlerId, payload) => {
  serverSocket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export const sendGameStartEvent = (userId, timestamp) => {
  const gameStartPayload = { timestamp };
  sendEvent(userId, 11, gameStartPayload);
};

export const sendPlaceInitTowerEvent = (userId, towerId, x, y) => {
  const placeInitTowerPayload = { towerId, x, y };
  sendEvent(userId, 21, placeInitTowerPayload);
};

export const sendPlaceAddTowerEvent = (userId, userGold, towerId, x, y) => {
  const placeAddTowerPayload = { userGold, towerId, x, y };
  sendEvent(userId, 22, placeAddTowerPayload);
};

export const sendCatchMonsterEvent = (userId, monsterId) => {
  const catchMonsterPayload = { catchMonsterId: monsterId };
  sendEvent(userId, 31, catchMonsterPayload);
};

export const sendAttackedBaseEvent = (userId, monsterId) => {
  const attackedBasePayload = { attackMonsterId: monsterId };
  sendEvent(userId, 32, attackedBasePayload);
};

export const sendMoveStageEvent = (userId, stageId, targetStageId, timestamp, score, baseHp) => {
  const moveStagePayload = { stageId, targetStageId, timestamp, score, baseHp };
  sendEvent(userId, 13, moveStagePayload);
};
