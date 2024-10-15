// key: userId, value: array
const catchMonsters = {};
const attackedBase = {};

export const getCatchMonster = (userId) => {
  if (!catchMonsters[userId]) {
    catchMonsters[userId] = [];
  }
  return catchMonsters[userId];
};

// 몬스터 킬 점수를 획득한 데이터를 기록
export const setCatchMonster = (userId, stageLevel, monsterId, monsterLevel, monsterGold, monsterScore, timestamp) => {
  return catchMonsters[userId].push({ stageLevel, monsterId, monsterLevel, monsterGold, monsterScore, timestamp });
};

export const clearCatchMonster = (userId) => {
  catchMonsters[userId] = [];
};

// 몬스터 자폭 생성, 조회, 변경
export const getAttackedBase = (userId) => {
  if (!attackedBase[userId]) {
    attackedBase[userId] = [];
  }
  return attackedBase[userId];
};

// 몬스터가 기지에서 자폭한 데이터를 기록
export const setAttackedBase = (userId, stageLevel, monsterId, monsterLevel, attackedDamage, baseHp, timestamp) => {
  return attackedBase[userId].push({ stageLevel, monsterId, monsterLevel, attackedDamage, baseHp, timestamp });
};

export const clearAttackedBase = (userId) => {
  attackedBase[userId] = [];
};