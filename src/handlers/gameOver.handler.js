import { getServerGameAssets } from '../init/asset.js';
import { getUser } from '../models/user.model.js';
import { createGameLog, updateGameLog, getUserGameLog } from '../models/gameLog.model.js';

/** 게임 오버에 대한 핸들러 **/
export const gameOver = async (userId, payload) => {
  const { score, highscore } = payload; // payload에서 score를 가져옴
  const userGameLog = await getUserGameLog(userId);

  if (!userGameLog) {
    // 만약 사용자의 게임 로그가 없으면 새로 생성
    await createGameLog({
      userId: userId,
      score: score,
    });
    console.log(`새로운 게임 로그가 생성되었습니다. 사용자 ID: ${userId}, 점수: ${highscore}`);
  } else {
    const previousHighScore = userGameLog.score;

    if (highscore > previousHighScore) {
      // 하이스코어가 이전 기록보다 높으면 기존 게임 로그 업데이트
      await updateGameLog(userGameLog.id, {
        score: highscore, // 새로운 하이스코어로 업데이트
        playedAt: new Date(), // 현재 시간을 playedAt으로 업데이트
      });
      console.log(`새 하이스코어: ${highscore}로 업데이트되었습니다.`);
    } else {
      console.log(`점수가 낮아 기록하지 않음: 현재 점수 ${score}, 이전 하이스코어 ${previousHighScore}`);
    }
  }

  // 클라이언트에 게임 오버 상태 반환
  return {
    status: 'game_over',
    message: '게임이 종료되었습니다.',
    finalScore: score, // 최종 점수 반환
  };
};
