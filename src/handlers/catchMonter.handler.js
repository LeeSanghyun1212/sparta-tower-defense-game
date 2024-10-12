import { getServerGameAssets } from '../init/asset.js';
import { getCurrentStage } from '../models/stage.model.js';
import { getUser } from '../models/user.model.js';

/** 몬스터 처치에 대한 핸들러**/
export const catchMonster = (userId, payload) => {
  const { monsters, stages } = getServerGameAssets();
  // monster 유효성 검사 <= monster.json 파일에 있는가?
  const monsterData = monsters.data.find((monster) => monster.id === payload.catchMonsterId);
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
  const catchMonster = currentStage.catchMonsters.find(
    (catchMonster) => catchMonster.monsterId === payload.catchMonsterId,
  );
  if (!catchMonster) {
    return { status: 'fail', message: "attackMonster can't exist currentStage" };
  }

  // 처치한 몬스터의 개수를 1 증가시킨다.
  catchMonster.catchCount += 1;

  // 처치한 몬스터에 대해서 유저의 Gold, Socre를 증가시킨다.
  const user = getUser(userId);
  user.userGold += monsterData.score;
  user.score += monsterData.score;

  console.log(`${userId} user => Gold:${user.userGold}, Score:${user.score}`);
  console.log('catchMonsters : ', currentStage.catchMonsters);

  return {
    status: 'success',
    message: `[${payload.catchMonsterId}] monster Catch!`,
    handlerId: 31,
    userGold: user.userGold,
    score: user.score,
  };
};
