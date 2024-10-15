import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalTime from '../utils/calculateTotalTime.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 게임 에셋에서 스테이지 정보 가져오기
  const { stages } = getGameAssets();

  // 현재 스테이지의 정보를 stageTable 에서 가져옴
  const currentStageInfo = stages.data.find((stage) => stage.id === payload.currentStage);
  if (!currentStageInfo) {
    return { status: 'fail', message: 'Current stage info not found' };
  }

  // 목표 스테이지의 정보를 stageTable 에서 가져옴
  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: 'fail', message: 'Target stage info not found' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const totalTime = calculateTotalTime(currentStages, serverTime, true);

  if (targetStageInfo.score > totalTime) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success', handler: 13 };
};
