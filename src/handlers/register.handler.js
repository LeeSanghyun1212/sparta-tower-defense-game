import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 접속 시 이벤트
    try {
      const token = socket.handshake.auth.token.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (!token) {
        //토큰이 없으면 연결 종료
        throw new Error('토큰이 존재하지 않습니다 로그인을 해 주세요', 'unauthorized');
      }
      jwt.verify(token, jwtSecret, (err, tokenPayload) => {
        
        if (err) {
          console.error('JWT Verification Error:', err);
          throw new Error('JWT 검증중 오류 발생', err);
        }
        console.log('JWT 검증 성공');
        socket.data = {
          user_id: tokenPayload.loginId,
          isAuthenticated: true,
        }; //인증된 사용자의 상태를 저장
      });
      const userId = socket.data.user_id;
      if (!userId) {
        throw new Error('Auth Not Found');
      }
      socket.emit('connection', { status: 'success', message: 'connection successfully', userId });
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
