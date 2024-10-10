import { getStage } from "../models/stage.model.js";
import { getCatchMonster, setCatchMonster } from "../models/monster.model.js";

export const catchMonster = (userId, payload) => {
  // 클라이언트가 잡은 몬스터의 정보

  // const { stages } = getGameAssets();
  const { monsterNumber, level, monsterScore } = payload;
  const currentStages = getStage(userId);
  const userGetCatchMonster = getCatchMonster(userId);

  if(!userGetCatchMonster) {
    return { status: 'fail', message: '유저의 몬스터 사냥 기록을 불러오지 못했습니다.'};
  }

  if (!currentStages.length) {
    return { status: 'fail', message: '유저의 스테이지 정보를 불러오지 못했습니다.' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);

  // 서버가 가진 유저 현재 스테이지 정보 가져오기
  const userStageInfo = currentStages[currentStages.length - 1];

  // 현재 스테이지의 레벨과 몬스터의 레벨 차이가 2보다 크면 에러
  if (Math.abs(userStageInfo.stageLevel - payload.level)>2) {
    return { status: 'fail', message: '스테이지 레벨과 몬스터의 레벨 차이가 예상 범위 밖입니다.' };
  }

  // 킬 점수로 인한 증가량이 정상적인가?
  if (!payload.monsterScore === payload.level*10){
    return {status: 'fail', message: '비정상적인 킬 점수입니다.'};
  }
  console.log(userGetCatchMonster);

  const serverTime = Date.now();
  setCatchMonster(userId, monsterNumber, level, monsterScore, serverTime); // 유저가 잡은 몬스터번호, 레벨, 점수, 시간을 기록

  return { status: 'success' };
};
