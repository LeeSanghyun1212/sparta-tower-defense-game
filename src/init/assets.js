import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 파일의 절대 경로
const __dirname = path.dirname(__filename); // 현재 파일이 위치한 디렉토리명
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../public/assets');

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all();
export const loadGameAssets = async () => {
  try {
    const [stages, monsters, towers] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('monster.json'),
      readFileAsync('tower.json'),
    ]);

    gameAssets = { stages, monsters, towers };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
