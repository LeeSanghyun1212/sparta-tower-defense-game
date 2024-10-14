import { INIT_GAME_DATA } from '../constant.js';
import { getUser } from '../models/user.model.js';

// user에 담긴 데이터들 중 게임에 관한 필드를 리셋시킨다.
// - 게임 재시작을 위해서 이 작업이 필요했다.
export const resetUser = (userId) => {
  const user = getUser(userId);
  user.userGold = INIT_GAME_DATA.userGold;
  user.baseHp = INIT_GAME_DATA.baseHp;
  user.numOfInitialTowers = INIT_GAME_DATA.numOfInitialTowers;
  user.score = INIT_GAME_DATA.score;
  user.towers = [];

  return {
    userGold: INIT_GAME_DATA.userGold,
    baseHp: INIT_GAME_DATA.baseHp,
    numOfInitialTowers: INIT_GAME_DATA.numOfInitialTowers,
    score: INIT_GAME_DATA.score,
  };
};
