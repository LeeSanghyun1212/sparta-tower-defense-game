import { getServerGameAssets } from '../init/asset.js';

export const initCatchMosters = (stageId) => {
  // 해당 Stage 플레이 중, 클라이언트가 잡은 monster들을 저장할 Array를 초기화해준다.
  // monster_unlock.json 데이터를 기준으로 Array를 생성해준다.
  const { stages } = getServerGameAssets();
  const stageDataIndex = stages.data.findIndex((stage) => stage.id === stageId);

  const catchMonsters = [];
  // 남아있는 이전 스테이지의 몬스터, 현재 스테이지의 몬스터를 위한 catchMonsters 배열 초기화.
  for (let i = 1; i >= 0; i--) {
    if (stageDataIndex - i < 0) continue;
    catchMonsters.push({ monsterId: stages.data[stageDataIndex - i].monster_id, catchCount: 0 });
  }

  return catchMonsters;
};

export const initAttackMonsters = (stageId) => {
  // 해당 Stage 플레이 중, 기지를 공격한 monster들을 저장할 Array를 초기화해준다.
  // monster_unlock.json 데이터를 기준으로 Array를 생성해준다.
  const { stages } = getServerGameAssets();
  const stageDataIndex = stages.data.findIndex((stage) => stage.id === stageId);

  const attackMonsters = [];
  for (let i = 1; i >= 0; i--) {
    if (stageDataIndex - i < 0) continue;
    attackMonsters.push({ monsterId: stages.data[stageDataIndex - i].monster_id, attackCount: 0 });
  }

  return attackMonsters;
};
