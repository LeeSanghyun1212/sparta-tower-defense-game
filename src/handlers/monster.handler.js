import { getServerGameAssets } from '../init/asset.js';
import {
  getAttackedBase,
  getCatchMonster,
  setAttackedBase,
  setCatchMonster,
} from '../models/monster.model.js';
import { getCurrentStage } from '../models/stage.model.js';
import { getUser } from '../models/user.model.js';

export const catchMonster = (userId, payload) => {
  // 클라이언트가 잡은 몬스터의 정보
  const { stageId, monsterId, monsterLevel, monsterGold, monsterScore } = payload;
  const { stages, monsters } = getServerGameAssets();

  const currentStage = getCurrentStage(userId);
  if (currentStage.id !== stageId) {
    return { status: 'fail', message: '서버와 클라이언트의 스테이지 정보가 일치하지 않습니다.' };
  }

  // 몬스터 유효성 검사
  const monsterData = monsters.data.find((monster) => monster.id === monsterId);
  if (!monsterData) {
    return { status: 'fail', message: '몬스터의 정보가 유효하지 않습니다.' };
  }

  const userCatchMonsters = getCatchMonster(userId);
  if (!userCatchMonsters) {
    return { status: 'fail', message: '유저가 잡은 몬스터 데이터 초기화에 실패했습니다.' };
  }

  // 스테이지 레벨 계산식
  const stageNumber = stages.data.findIndex((stage) => stage.id === stageId) + 1;
  // 현재 스테이지의 레벨과 몬스터의 레벨 차이가 2보다 크면 에러
  if (Math.abs(stageNumber - payload.monsterLevel) > 2) {
    return { status: 'fail', message: '스테이지 레벨과 몬스터의 레벨 차이가 예상 범위 밖입니다.' };
  }

  // 몬스터별 골드 유효성 검사
  if (Math.abs(monsterData.gold + monsterLevel * 5 - monsterGold) > 5) {
    return { status: 'fail', message: '몬스터 골드가 비정상적인 값입니다.' };
  }

  // 몬스터별 점수 유효성 검사
  if (Math.abs(monsterData.score + monsterLevel * 10 - monsterScore) > 5) {
    return { status: 'fail', message: '몬스터 점수가 비정상적인 값입니다.' };
  }

  const user = getUser(userId);
  user.score += monsterScore;
  user.userGold += monsterData.gold;

  const serverTime = Date.now();
  setCatchMonster(userId, stageId, monsterId, monsterLevel, monsterGold, monsterScore, serverTime); // 유저의 현재 스테이지레벨, 몬스터번호, 몬스터레벨, 점수, 잡은 시간을 기록

  return { status: 'success', handlerId: 31, score: user.score, userGold: user.userGold };
};

export const attackedBase = (userId, payload) => {
  // 기지가 받은 데미지 정보.
  const { stageId, monsterId, monsterLevel, attackedDamage } = payload;
  const { stages, monsters } = getServerGameAssets();

  // 서버와 클라이언트의 스테이지가 일치하는가
  const currentStage = getCurrentStage(userId);
  if (currentStage.id !== stageId) {
    return { status: 'fail', message: '서버와 클라이언트의 스테이지 정보가 일치하지 않습니다.' };
  }

  // 몬스터 정보 조회, 유효성 검사
  const monsterData = monsters.data.find((monster) => monster.id === monsterId);
  if (!monsterData) {
    return { status: 'fail', message: '몬스터의 정보가 유효하지 않습니다.' };
  }

  const userAttackedBase = getAttackedBase(userId);
  if (!userAttackedBase) {
    return { status: 'fail', message: '기지가 받은 피해 데이터 초기화에 실패했습니다.' };
  }

  // 스테이지 레벨 계산식
  const stageNumber = stages.data.findIndex((stage) => stage.id === stageId) + 1;
  // 현재 스테이지의 레벨과 몬스터의 레벨 차이가 2보다 크면 에러
  if (Math.abs(stageNumber - payload.monsterLevel) > 2) {
    return { status: 'fail', message: '스테이지 레벨과 몬스터의 레벨 차이가 예상 범위 밖입니다.' };
  }

  // 받은 데미지가 몬스터가 가진 데미지와 값이 같은지 유효성 검사
  if (Math.abs(monsterData.attackPower + monsterLevel * 5 - attackedDamage) > 5) {
    return { status: 'fail', message: '몬스터 점수가 비정상적인 값입니다.' };
  }

  const user = getUser(userId);
  user.baseHp -= attackedDamage;

  const serverTime = Date.now();
  setAttackedBase(
    userId,
    stageId,
    monsterId,
    monsterLevel,
    attackedDamage,
    user.baseHp,
    serverTime,
  ); // 유저의 현재 스테이지레벨, 받은 데미지, 남은 건물 체력, 시간을 기록
  return { status: 'success', handlerId: 32, baseHp: user.baseHp };
};
