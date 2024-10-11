// key : userId, value : array -> stage 정보는 복수이기떄문에 배열
const stages = {};

// 스테이지 초기화
export const createStage = (userId) => {
  stages[userId] = [];
};

export const getStage = (userId) => {
  return stages[userId];
};

export const setStage = (userId, id, timestamp, startScore) => {
  // stage[userId] 에 스테이지 정보를 추가해준다.
  const catchMonsterList = {};

  return stages[userId].push({ id, timestamp, startScore });
};

export const clearStage = (userId) => {
  return (stages[userId] = []);
};
