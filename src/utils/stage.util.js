import { getServerGameAssets } from '../init/asset.js';

export const getScore = (currentStage) => {
  const { monsters } = getServerGameAssets();
  let score = 0;

  currentStage.catchMonsters.forEach((catchMonster) => {
    const monsterData = monsters.data.find((monster) => monster.id === catchMonster.monsterId);
    score += catchMonster.catchCount * monsterData.score;
  });

  return score;
};

export const getBaseHp = (currentStage) => {
  const { monsters } = getServerGameAssets();
  let damage = 0;

  currentStage.attackMonsters.forEach((attackMonster) => {
    const monsterData = monsters.data.find((monster) => monster.id === attackMonster.monsterId);
    damage += attackMonster.attackCount * monsterData.attack_power;
  });

  const baseHp = currentStage.baseHp - damage;

  return baseHp;
};
