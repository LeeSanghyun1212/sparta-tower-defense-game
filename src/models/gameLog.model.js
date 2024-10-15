import { prisma } from '../utils/prisma/index.js';

export const createGameLog = async ({ userId, score }) => {
  try {
    const newGameLog = await prisma.gameLog.create({
      data: {
        userId: userId, // 올바르게 userId를 사용
        score: score, // 올바르게 score를 사용
      },
    });
    return newGameLog; // 생성된 게임 로그 반환
  } catch (error) {
    console.error('Error creating game log:', error);
    throw new Error('Unable to create game log');
  }
};

export const updateGameLog = async (gameLogId, score) => {
  try {
    const updatescore= score.score; 
    const updateplaydeAt = score.playedAt
    const gameLog = await prisma.gameLog.findUnique({
      where: {
        id: gameLogId,
      },
    });
    if (updatescore > gameLog.score) {
      await prisma.gameLog.update({
        where: { id: gameLogId  },
        data: { score: updatescore, playedAt: updateplaydeAt },
      });
    }
  } catch (error) {
    console.error('Failed to update game log:', error);
  }
};

export const getUserGameLog = async (userId) => {
  try {
    const gameLog = await prisma.gameLog.findFirst({
      where: {
        userId: userId, // 사용자의 ID로 조회
      },
    });
    return gameLog; // 사용자 게임 로그 반환
  } catch (error) {
    throw new Error('Unable to retrieve user game log');
  }
};
