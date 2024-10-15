import { getUserGameLog } from '../models/gameLog.model.js';

/** 기존 하이스코어를 가져오는 핸들러 **/
export const getHighScore = async (userId) => {
  try {
    const userGameLog = await getUserGameLog(userId);

    // 게임 로그가 있을 경우, 해당 점수를 반환하고 없으면 0 반환
    const highScore = userGameLog ? userGameLog.score : 0;
    return {
      status: 'success',
      handlerId: 41,
      highScore: highScore,
    };
  } catch (error) {
    console.error('하이스코어를 가져오는 중 오류 발생:', error);
    return {
      status: 'error',
      message: '하이스코어를 가져오는 데 실패했습니다.',
    };
  }
};
