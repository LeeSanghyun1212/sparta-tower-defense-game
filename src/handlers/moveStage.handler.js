import { getServerGameAssets } from '../init/asset.js';
import { getAttackedBase, getCatchMonster } from '../models/monster.model.js';
import { getCurrentStage, setStage } from '../models/stage.model.js';
import { getUser } from '../models/user.model.js';
import { getStageAttackedDamage, getStageScore } from '../utils/stage.util.js';

export const moveStage = (userId, payload) => {
  const { stages } = getServerGameAssets();
  const { stageId, targetStageId, timestamp, score, hp } = payload;

  const currentStage = getCurrentStage(userId);

  if (!currentStage) {
    return { status: 'fail', message: 'Not founded currentStage1234' };
  }

  if (currentStage.id !== payload.stageId) {
    return { status: 'fail', message: 'Dismatch currentStage' };
  }

  const stageData = stages.data.find((stage) => stage.id === payload.stageId);
  if (!stageData) {
    return { status: 'fail', message: 'Not founded stage Data' };
  }

  // 스테이지 경과 시간 유효성 검증
  const clientDeltatime = payload.timestamp - currentStage.timestamp;
  if (clientDeltatime < stageData.timestamp) {
    return { status: 'fail', message: 'Client<->Server unmet goalTimestamp' };
  }

  // 스테이지 점수 유효성 검증
  const clientScore = payload.score - currentStage.score;
  const serverScore = getUser(userId).score - currentStage.score;
  const userCatchMonsters = getCatchMonster(userId);
  const serverCalculateScore = getStageScore(userCatchMonsters, stageId);
  console.log(
    `Client Score: ${payload.score}, Server Score: ${serverScore}, ServerCalculateScore: ${serverCalculateScore}`,
  );

  if (serverScore !== serverCalculateScore) {
    return { status: 'fail', message: 'Server dismatch score' };
  }

  if (clientScore !== serverScore) {
    return { status: 'fail', message: 'Client<->Server dismatch score' };
  }

  // 스테이지 베이스캠프 hp 유효성 검증
  const clientBaseHp = payload.hp;
  const serverBaseHp = getUser(userId).baseHp;
  const userAttackedMonsters = getAttackedBase(userId);
  const serverCalculatedBaseHp =
    currentStage.baseHp - getStageAttackedDamage(userAttackedMonsters, stageId);

  console.log(
    `ClientHp : ${clientBaseHp} | ServerHp : ${serverBaseHp} | ServerCalculateHp : ${serverCalculatedBaseHp}`,
  );

  if (serverBaseHp !== serverCalculatedBaseHp) {
    return { status: 'fail', message: 'Server dismatch BaseHp' };
  }

  if (clientBaseHp !== serverBaseHp) {
    return { status: 'fail', message: 'Client<->Server dismatch BaseHp' };
  }

  // 모든 검사를 통과했다면, 다음 스테이지 정보들을 stages에 추가해준다.
  setStage(userId, targetStageId, timestamp, score, hp);
  return {
    status: 'success',
    message: `Stage Clear! Next Stage Id : ${payload.targetStageId}`,
    handlerId: 13,
    stageId: targetStageId,
  };
};