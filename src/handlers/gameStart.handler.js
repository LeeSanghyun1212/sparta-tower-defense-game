import { getServerGameAssets } from '../init/asset.js';
import { clearStage, setStage } from '../models/stage.model.js';
import { resetUser } from '../utils/user.util.js';

/** 게임 시작에 대한 핸들러**/
export const gameStart = (userId, payload) => {
  const { stages } = getServerGameAssets();

  // 유저의 게임 정보를 초기화 / 리셋 해준다.
  const initGameData = resetUser(userId);

  // 유저의 스테이지 정보를 비워준다.
  clearStage(userId);
  setStage(userId, stages.data[0].id, payload.timestamp, 0, initGameData.baseHp);

  // 클라이언트에게 서버도 게임 시작을 인지했음을 알려준다.
  return {
    status: 'success',
    message: 'game Start Complete',
    handlerId: 11,
    stageId: stages.data[0].id,
    initGameData,
  };
};
