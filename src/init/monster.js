import { getServerGameAssets } from './assets.js';

export const initItemList = (stageId) => {
  // Stage 진행 시, 클라이언트가 획득한 item을 저장할 list를 초기화해준다.
  // item_unlock.json 데이터를 기준으로 아이템 리스트를 만든다.
  const { itemUnlocks } = getServerGameAssets();
  const itemUnlock = itemUnlocks.data.find((itemUnlock) => itemUnlock.stage_id === stageId);

  const itemList = [];
  for (let i = 1; i < itemUnlock.item_id + 1; i++) {
    itemList.push({ itemId: i, count: 0 });
  }

  return itemList;
};
