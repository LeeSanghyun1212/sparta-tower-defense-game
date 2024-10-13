import { CLIENT_VERSION } from '../constant.js';
import { createStage, removeStage } from '../models/stage.model.js';
import { addUser, getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, userId) => {
  console.log(`info : ${socket}`);

  removeUser(userId);
  console.log(removeStage(userId));

  console.log(`User disconnected: ${userId} with socket ID ${socket.id} `);
  console.log('Current users: ', getUsers());
};

export const handleConnection = async (socket, userId) => {
  // user의 userId, socketId 정보를 저장한다.
  addUser({ userId, socketId: socket.id });

  // user가 플레이한 stage 정보들을 저장할 배열을 생성한다.
  createStage(userId);

  console.log(`New User Connected : ${userId} with socket ID ${socket.id} `);
  console.log('Current Users: ', getUsers());

  socket.emit('connection', { status: 'success', messgae: 'connection successfully' });
  //   // 연결한 클라이언트에게 최고 점수를 알려준다.

  //   socket.emit('response', {
  //     status: 'success',
  //     messgae: 'connection successfully',
  //   });
};

export const handlerEvent = async (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', {
      status: 'fail',
      message: 'Client version mismatch',
    });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = await handler(data.userId, data.payload);

  // 최고 점수가 갱신될 경우, 접속중인 모든 유저에게 알려준다.
  // io.emit() : 모든 클라이언트에게 전달한다.
  if (response.broadcast) {
    io.emit('response', response);
    return;
  }

  socket.emit('response', response);
};
