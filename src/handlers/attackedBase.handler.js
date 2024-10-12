import { getServerGameAssets } from '../init/asset.js';
import { getCurrentStage } from '../models/stage.model.js';
import { getUser } from '../models/user.model.js';

/** 몬스터 처치에 대한 핸들러**/
export const attackedBase = (userId, payload) => {
  const { monsters, stages } = getServerGameAssets();
  // monster 유효성 검사 <= monster.json 파일에 있는가?
  const monsterData = monsters.data.find((monster) => monster.id === payload.attackMonsterId);
  if (!monsterData) {
    return { status: 'fail', message: 'Not founded monster Data' };
  }

  const currentStage = getCurrentStage(userId);
  // stage 유효성 검사 <= stage.json 파일에 있는가?
  const stageData = stages.data.find((stage) => stage.id === currentStage.id);
  if (!stageData) {
    return { status: 'fail', message: 'Not founded stage Data' };
  }

  // "현재 스테이지에서 등장 가능한 몬스터인가"를 검증
  // 이전 스테이지의 몬스터가 남아있을 수 있을 수 있다는 것을 명심!
  const attackMonster = currentStage.attackMonsters.find(
    (attackMonster) => attackMonster.monsterId === payload.attackMonsterId,
  );
  if (!attackMonster) {
    return { status: 'fail', message: "attackMonster can't exist currentStage" };
  }

  // 기지를 공격하고 자폭한 몬스터의 개수를 1 증가시킨다.
  attackMonster.attackCount += 1;

  // 기지를 공격하고 자폭한 몬스터의 공격력만큼 유저의 BaseHp를 감소시킨다.
  const user = getUser(userId);
  user.baseHp -= monsterData.attack_power;

  console.log(`${userId} user => BaseHp:${user.baseHp}, Score:${user.score}`);
  console.log('attackMonsters : ', currentStage.attackMonsters);

  return {
    status: 'success',
    message: `[${payload.attackMonsterId}] monster Attack to BaseCamp!`,
    handlerId: 32,
    baseHp: user.baseHp,
  };
};
