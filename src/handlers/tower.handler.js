import { getServerGameAssets } from '../init/asset.js';
import { getUser } from '../models/user.model.js';

export const placeAddTower = (userId, payload) => {
  const { userGold, towerId, x, y } = payload;

  const user = getUser(userId);

  const { towers } = getServerGameAssets();

  const towerData = towers.data.find((tower) => tower.id === towerId);
  if (!towerData) {
    return { status: 'fail', message: '타워 데이터가 존재하지 않습니다.' };
  }

  user.towers.push({ towerId, x, y });
  user.userGold -= towerData.cost;

  if (userGold - towerData.cost !== user.userGold) {
    return { status: 'fail', message: '골드가 일치하지 않습니다.' };
  }

  return { status: 'success', handlerId: 22, userGold: user.userGold, towerId, x, y };
};

export const sellTower = (userId, payload) => {
  const { towerId, x, y } = payload;

  const user = getUser(userId);

  const { towers } = getServerGameAssets();

  const towerData = towers.data.find((tower) => tower.id === towerId);
  if (!towerData) {
    return { status: 'fail', message: '타워 데이터가 존재하지 않습니다.' };
  }

  user.userGold += Math.floor(towerData.cost / 2);
  const towerIndex = user.towers.findIndex(
    (tower) => tower.x === x && tower.y === y && tower.towerId === towerId,
  );
  if (towerIndex === -1) {
    return { status: 'fail', message: '유저는 해당 타워를 가지고 있지 않습니다.' };
  }
  user.towers.splice(towerIndex, 1);

  return { status: 'success', handlerId: 23, userGold: user.userGold, towerId, x, y };
};
