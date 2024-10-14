import { stageDataTable } from '../init/asset.js';

export const getTargetStageId = (currentStageId) => {
  const currentStageIndex = stageDataTable.data.findIndex((stage) => stage.id === currentStageId);

  if (currentStageIndex + 1 >= stageDataTable.data.length) return null;
  return stageDataTable.data[currentStageIndex + 1].id;
};
