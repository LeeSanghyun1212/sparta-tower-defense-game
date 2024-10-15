// key: uuid, value: array
const catchMonsters = {};
const attackedBase = {};

export const getCatchMonster = (uuid) => {
  if (!catchMonsters[uuid]) {
    catchMonsters[uuid] = [];
  }
  return catchMonsters[uuid];
};

// 몬스터 킬 점수를 획득한 데이터를 기록
export const setCatchMonster = (uuid, stageId, monsterId, monsterLevel, monsterGold, monsterScore, timestamp) => {
  return catchMonsters[uuid].push({ stageId, monsterId, monsterLevel, monsterGold, monsterScore, timestamp });
};

export const clearCatchMonster = (uuid) => {
  catchMonsters[uuid] = [];
};

// 몬스터 자폭 생성, 조회, 변경
export const getAttackedBase = (uuid) => {
  if (!attackedBase[uuid]) {
    attackedBase[uuid] = [];
  }
  return attackedBase[uuid];
};

// 몬스터가 기지에서 자폭한 데이터를 기록
export const setAttackedBase = (uuid, stageId, monsterId, monsterLevel, attackedDamage, baseHp, timestamp) => {
  return attackedBase[uuid].push({ stageId, monsterId, monsterLevel, attackedDamage, baseHp, timestamp });
};

export const clearAttackedBase = (uuid) => {
  attackedBase[uuid] = [];
};