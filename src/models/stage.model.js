import { initAttackMonsters, initCatchMosters } from '../utils/monsters.util.js';

// key : userId, value : array -> stage 정보는 복수이기떄문에 배열
const stages = {};

// 스테이지 초기화
export const createStage = (userId) => {
  stages[userId] = [];
};

export const getStage = (userId) => {
  return stages[userId];
};

export const setStage = (userId, id, timestamp, score, baseHp) => {
  // catchMonsters : 스테이지동안 처치한 몬스터들을 저장할 배열
  const catchMonsters = initCatchMosters(id);
  // catchMonsters : 스테이지동안 기지를 공격한 몬스터들을 저장할 배열
  const attackMonsters = initAttackMonsters(id);

  return stages[userId].push({ id, timestamp, score, baseHp, catchMonsters, attackMonsters });
};

export const clearStage = (userId) => {
  return (stages[userId] = []);
};

export const removeStage = (userId) => {
  return delete stages[userId];
};

export const getCurrentStage = (userId) => {
  const stages = getStage(userId);

  stages.sort((a, b) => a.id - b.id);

  const currentStage = stages[stages.length - 1];

  return currentStage;
};