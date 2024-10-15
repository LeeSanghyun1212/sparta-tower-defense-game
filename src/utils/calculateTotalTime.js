import { getGameAssets } from '../init/assets.js';

// 스테이지 지속 시간을 기반으로 총 점수를 계산하는 함수
const calculateTotalTime = (stages, gameEndTime, isMoveStage) => {
  let totalTime = 0;

  const { stages: stageData} = getGameAssets();
  const stageTable = stageData.data;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    let stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지 지속 시간 (초 단위)

    // 현재 스테이지의 scorePerSecond를 가져옴
    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : 1;

    if (!isMoveStage && index === stages.length - 1) {
      // 마지막 스테이지의 경우 버림 처리
      stageDuration = Math.floor(stageDuration);
    } else {
      // 중간 스테이지의 경우 반올림 처리
      stageDuration = Math.round(stageDuration);
    }

    totalTime += stageDuration * scorePerSecond; // 각 스테이지의 scorePerSecond를 반영하여 점수 계산
  });

  return totalTime;
};

export default calculateTotalTime;
