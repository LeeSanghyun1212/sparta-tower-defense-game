//catchMonsterList = getCatchMonsters() 필요
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