import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets');

let gameAssets = {};

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all()
export const loadServerGameAssets = async () => {
  try {
    const [stages, towers, towerUnlocks, monsters] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('tower.json'),
      readFileAsync('tower_unlock.json'),
      readFileAsync('monster.json'),
    ]);

    gameAssets = { stages, towers, towerUnlocks, monsters };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getServerGameAssets = () => {
  return gameAssets;
};
