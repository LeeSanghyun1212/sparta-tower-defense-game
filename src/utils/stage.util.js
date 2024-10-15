import { getServerGameAssets } from '../init/asset.js';

export const getScore = (currentStage) => {
  const { monsters } = getServerGameAssets();
  let score = 0;

  currentStage.catchMonsters.forEach((catchMonster) => {
    const monsterData = monsters.data.find((monster) => monster.id === catchMonster.monsterId);
    if (!monsterData) {
        console.log(`Monster not found: ${catchMonster.monsterId}`);
        return; // 몬스터가 없으면 건너뜁니다.
      }
    score += monsterData.score * catchMonster.catchCount;
    console.log(score);
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

export const stageScore = (catchMonsterList, stageId) => {
    let stageScore = 0;
    catchMonsterList.forEach((monster) => {
        if(monster.stageId === stageId){
            stageScore += monster.monsterScore;
        }
    });
    return stageScore;
}

//catchMonsterList = getCatchMonsters() 필요
export const stageGold = (catchMonsterList, stageId) => {
    let stageGold = 0;
    catchMonsterList.forEach((monster) => {
        if(monster.stageId === stageId){
            stageGold += monster.monsterGold;
        }
    });
    return stageGold;
}

//attackedBaseList = getAttackedBase() 필요
export const stageAttackedDamage = (attackedBaseList, stageId) => {
    let stageAttackedDamage = 0;
    attackedBaseList.forEach((monster) => {
        if(monster.stageId === stageId) {
            stageAttackedDamage += monster.attackedDamage;
        }
    })
    return stageAttackedDamage;
}