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

export const sendGameStartEvent = (userId, handlerId, timeStamp) => {
  const gameStartPayload = { timeStamp };
  serverSocket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload: gameStartPayload,
  });
};
