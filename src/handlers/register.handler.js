import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 접속 시 이벤트
    try {
      const userId = socket.handshake.auth.userId;

      if (!userId) {
        throw new Error('Auth Not Found');
      }

      handleConnection(socket, userId);

      // 이벤트
      socket.on('event', (data) => handlerEvent(io, socket, data));

      // 접속 해제시 이벤트
      socket.on('disconnect', (socket) => handleDisconnect(socket, userId));
    } catch (err) {
      console.error('Connection Error : ', err.message);
    }
  });
};

export default registerHandler;
