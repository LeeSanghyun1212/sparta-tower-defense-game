import { INIT_GAME_DATA } from '../constant.js';
import { getServerGameAssets } from '../init/asset.js';
import { clearStage, setStage } from '../models/stage.model.js';

/** 게임 시작에 대한 핸들러**/
export const gameStart = (userId, payload) => {
  const { stages } = getServerGameAssets();

  // 유저의 스테이지 정보를 비워준다.
  clearStage(userId);

  // stage 배열에서 0번째 -> 1 스테이지
  // 원래라면 클라의 시간을 저장하는 서버는 절대 없다! (클라를 신용할 수 없으므로)

  // 게임 시작 시, 해당 유저의 스테이지 테이블에 다음과 같은 정보를 저장한다.
  // - stageId : 스테이지 ID => 여기서는 (1001) 고정
  // - timestamp : 게임 시작한 클라이언트의 시간
  // - score : 게임 시작시, 서버에서 관리할 점수 (클라이언트와의 레이턴시로 약간의 오차가 있을 수 있다.)
  // - items : 스테이지간의 획득한 아이템 리스트 (setStgae 함수 내부에서 자동으로 초기화 해준뒤 세팅해준다)
  setStage(userId, stages.data[0].id, payload.timestamp, 0);

  // 클라이언트에게 서버도 게임 시작을 인지했음을 알려준다.
  return {
    status: 'success',
    message: 'game Start Complete',
    handlerId: 11,
    initGameData: INIT_GAME_DATA,
  };
};
