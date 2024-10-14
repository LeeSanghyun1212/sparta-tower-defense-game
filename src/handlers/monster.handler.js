import { setCatchMonster, setAttackedBase, getCatchMonster, getAttackedBase } from "../models/monster.model.js";

export const catchMonster = (userId, payload) => {
  // 클라이언트가 잡은 몬스터의 정보
  const { stageLevel, monsterNumber, monsterLevel, monsterScore } = payload;

  const userCatchMonsters = getCatchMonster(userId);
  if (!userCatchMonsters) {
    return {status: 'fail', message: '유저가 잡은 몬스터 데이터 초기화에 실패했습니다.'};
  }

  // 현재 스테이지의 레벨과 몬스터의 레벨 차이가 2보다 크면 에러 
  if (Math.abs(userStage.stageLevel - payload.monsterLevel)>2) {
    return { status: 'fail', message: '스테이지 레벨과 몬스터의 레벨 차이가 예상 범위 밖입니다.' };
  }

  const serverTime = Date.now();
  setCatchMonster(userId, stageLevel, monsterNumber, monsterLevel, monsterScore, serverTime); // 유저의 현재 스테이지레벨, 몬스터번호, 몬스터레벨, 점수, 잡은 시간을 기록

  return { status: 'success' };
};

export const attackedBase = (userId, payload) => {
  // 기지가 받은 데미지 정보.
  const {stageLevel, attackedDamage, baseHp} = payload;

  const userAttackedBase = getAttackedBase(userId);
  if (!userAttackedBase) {
    return {status: 'fail', message: '기지가 받은 피해 데이터 초기화에 실패했습니다.'};
  }

  // 받은 데미지가 스테이지 레벨에 맞는 데미지 범위?
  if (Math.abs(attackedDamage - (10 + 1 * stageLevel))>2) {
    return {status: 'fail', message: '스테이지 레벨에 맞지 않는 피해입니다.'};
  }

  const serverTime = Date.now();
  setAttackedBase(userId, stageLevel, attackedDamage, baseHp, serverTime); // 유저의 현재 스테이지레벨, 받은 데미지, 남은 건물 체력, 시간을 기록

  return { status: 'success' };
}