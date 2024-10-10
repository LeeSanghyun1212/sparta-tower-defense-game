// key: uuid, value: array
const catchMonsters = {};

// 몬스터 킬점수 생성, 조회, 변경
export const createCatchMonster = (uuid) => {
  catchMonsters[uuid] = [];
};

export const getCatchMonster = (uuid) => {
  return catchMonsters[uuid];
};

// 몬스터 킬 점수를 획득한 시간을 기록
export const setCatchMonster = (uuid, monsterNumber, level, monsterScore, timestamp) => {
  return catchMonsters[uuid].push({ monsterNumber, level, monsterScore, timestamp });
};

export const clearCatchMonster = (uuid) => {
  catchMonsters[uuid] = [];
};
