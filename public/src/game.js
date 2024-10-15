import { Base } from './base.js';
import { CLIENT_VERSION } from './constant.js';
import { stageDataTable } from './init/asset.js';
import { Monster } from './monster.js';
import { sendEvent, sendGameStartEvent } from './socket.js';
import { Tower } from './tower.js';

let userId;
let isConnectionHandled = false;

export let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력
let startTimestamp = 0; // 게임 시작 시간
let timestamp = 0; // 게임 진행 시간
let goalTimestamp = 0; // 스테이지 목표 시간

let numOfInitialTowers = 0; // 초기 타워 개수

let stageId = 0;
let stageChange = false;
let monsterId = 0; // 몬스터 ID
let monsterSpawnInterval = 1000; // 몬스터 생성 주기
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 타워 이미지 배열 추가
const towerImages = {
  pawnTower: new Image(),
  rookTower: new Image(),
  knightTower: new Image(),
  bishopTower: new Image(),
  queenTower: new Image(),
  kingTower: new Image(),
};

// 각 타워 이미지 소스 설정
towerImages.pawnTower.src = '../images/tower_pawnTower.png';
towerImages.rookTower.src = '../images/tower_rookTower.png';
towerImages.knightTower.src = '../images/tower_knightTower.png';
towerImages.bishopTower.src = '../images/tower_bishopTower.png';
towerImages.queenTower.src = '../images/tower_queenTower.png';
towerImages.kingTower.src = '../images/tower_kingTower.png';

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = '../images/bg.webp';

const baseImage = new Image();
baseImage.src = '../images/base.png';

const pathImage = new Image();
pathImage.src = '../images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `../images/monster${i}.png`;
  monsterImages.push(img);
}

let monsterPath;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function generateCustomMonsterPath() {
  const path = [];

  let canvasQuarterWidth = Math.floor(canvas.width / 4);
  let canvasHalfHeight = Math.floor(canvas.height / 2);
  let cornerGap = Math.floor(canvasQuarterWidth / 2);
  let pathGap = 60;
  let quarterNumber = 0;
  const isSigned = Math.floor(Math.random() * 2) ? true : false;
  let yPosArr = [];

  for (let i = 0; i < 3; i++) {
    const halfHeight = Math.floor(canvas.height / 2);
    let randomYPos = Math.floor(Math.random() * 300) + 100;
    if (i % 2 === 0) {
      randomYPos = isSigned ? halfHeight + randomYPos : halfHeight - randomYPos;
    } else {
      randomYPos = isSigned ? halfHeight - randomYPos : halfHeight + randomYPos;
    }
    yPosArr.push(randomYPos);
  }
  yPosArr.push(Math.floor(canvas.height / 2));

  let currentX = 0;
  let currentY = canvasHalfHeight;

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    if (currentX < canvasQuarterWidth * (quarterNumber + 1) - cornerGap) {
      currentX += pathGap;
    } else {
      if (currentY < yPosArr[quarterNumber]) {
        currentY += pathGap;
        if (currentY >= yPosArr[quarterNumber]) {
          quarterNumber += 1;
        }
      } else {
        currentY -= pathGap;
        if (currentY <= yPosArr[quarterNumber]) {
          quarterNumber += 1;
        }
      }
    }
    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 60; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!
    ctx.drawImage(pathImage, startX, startY, imageWidth, imageHeight);
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function checkPlaceTowerPos(x, y) {
  const maxDistanceNearPath = 70; // 타워 배치 가능 거리
  return monsterPath.every(({ x: pathX, y: pathY }) => {
    const distance = Math.sqrt(Math.pow(x - pathX, 2) + Math.pow(y - pathY, 2));
    return distance > maxDistanceNearPath;
  });
}

function placeNewTower(towerType, x, y) {
  console.log('Tower type:', towerType);
  const towerData = Tower.getTowerData(towerType); // 타워 데이터 가져오기
  if (!towerData) {
    alert('타워 타입이 유효하지 않습니다!');
    return;
  }

  if (userGold < towerData.cost) {
    alert('골드가 부족합니다!');
    return;
  }

  userGold -= towerData.cost;

  const tower = new Tower(x, y, towerData.type); // 타워 생성
  towers.push(tower);
  tower.draw(ctx, towerImages);
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

// 드래그 앤 드롭 이벤트 추가
canvas.addEventListener('dragover', (event) => {
  event.preventDefault(); // 기본 동작 방지
});

canvas.addEventListener('drop', (event) => {
  event.preventDefault();
  const towerType = event.dataTransfer.getData('text/plain');
  console.log('Dropped tower type:', towerType);
  const { offsetX, offsetY } = event;

  // 타워 배치 위치 유효성 검사
  if (checkPlaceTowerPos(offsetX, offsetY)) {
    placeNewTower(towerType, offsetX, offsetY); // 타워 배치
  } else {
    alert('경로 위에는 타워를 배치할 수 없습니다!');
  }
});

function spawnMonster() {
  monsters.push(new Monster(monsterPath, monsterImages, monsterId, stageId));
}

function gameLoop() {
  if (checkGameOver()) {
    return;
  }

  // 스테이지 경과 시간 text로 출력
  timestamp = Date.now();
  const deltaTime = (timestamp - startTimestamp) / 1000;
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '40px Times New Roman';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'black';
  ctx.fillText(`최고 기록: ${highScore}`, 50, 50); // 최고 기록 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`점수: ${score}`, 50, 100); // 현재 스코어 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`골드: ${userGold}`, 50, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  const stageNumber = stageDataTable.data.findIndex((stage) => stage.id === stageId) + 1;
  ctx.fillText(`${stageNumber} Stage`, canvas.width / 2, 100, 200); // 최고 기록 표시

  ctx.font = '50px Times New Roman';
  ctx.fillStyle = 'black';
  ctx.fillText(`남은 시간 : ${goalTimestamp - Math.floor(deltaTime)}`, canvas.width / 2, 50);

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImages);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기

  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isAttacked = monster.move();
      if (isAttacked) {
        // 기지에 자폭한 몬스터 제거
        sendEvent(userId, 32, {
          stageId: stageId,
          monsterId: monster.id,
          monsterLevel: monster.level,
          attackedDamage: monster.attackPower,
        });
        monsters.splice(i, 1);
      }
      const isDestroyed = base.destroyed();
      if (isDestroyed) {
        sendEvent(userId, 12, {
          score: score,
          highscore: highScore,
        });
        /* 게임 오버 */
        monsters.splice(0);
        alert('게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ');
        location.reload(2000);
      }

      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      sendEvent(userId, 31, {
        stageId: stageId,
        monsterId: monster.id,
        monsterLevel: monster.level,
        monsterScore: monster.score,
      });
      monsters.splice(i, 1);
      score += monster.score;
      if (score >= highScore) {
        highScore = score;
      }
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function checkGameOver() {
  if (baseHp <= 0) {
    console.log('사망');
    sendEvent(userId, 32, {
      stageLevel: stageId,
      monsterNumber: monster.monsterNumber,
      monsterLevel: monster.level,
      monsterScore: monster.score,
    });
  }
}

function initStageData(data) {
  stageId = data;

  const stageData = stageDataTable.data.find((stage) => stage.id === stageId);
  if (!stageData) {
    throw new Error(`Not Founded stage data`);
  }

  monsterId = stageData.monster_id;
  monsterSpawnInterval = stageData.monster_spawn_interval;
  goalTimestamp = stageData.timestamp;
  stageChange = true;
}

function initGameData(data) {
  userGold = data.userGold; // 유저 골드
  baseHp = data.baseHp; // 기지 체력
  numOfInitialTowers = data.numOfInitialTowers; // 초기 타워 개수
  score = data.score; // 게임 점수
}

export function initGame() {
  if (isInitGame) {
    return;
  }

  //monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  monsterPath = generateCustomMonsterPath();
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  //placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치
  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}
// 쿠키에서 토큰 가져오기
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  // let somewhere;
  const token = getCookie('authorization');
  const decodedToken = token ? decodeURIComponent(token) : null;

  if (!token) {
    alert('로그인이 필요합니다');
    window.location.href = 'login.html';
  } else {
    serverSocket = io('http://localhost:3000', {
      query: {
        clientVersion: CLIENT_VERSION,
      },
      auth: {
        userId: userId,
        token: decodedToken,
      },
    });
    serverSocket.on('connection', (data) => {
      if (!isConnectionHandled) {
        console.log('connection Complete');
        startTimestamp = Date.now();
        userId = data.userId;
        sendEvent(userId, 41);
        sendGameStartEvent(userId, 11, startTimestamp);
        isConnectionHandled = true;
      }
    });
    serverSocket.on('response', (data) => {
      console.log(data);

      try {
        switch (data.handlerId) {
          case 11:
            {
              if (!isInitGame) {
                initGameData(data.initGameData);
                initStageData(data.stageId);
                initGame();
              }
            }
            break;
          case 31:
            {
              score = data.score;
            }
            break;
          case 32:
            {
              base.hp = data.baseHp;
            }
            break;
            case 41:
            {
              highScore = data.highScore;
            }
            break;
          default: {
            throw new Error(`Unknown Response : ${data.handlerId}`);
          }
        }
      } catch (err) {
        console.error('Error => ', err.message);
      }
    });
  }
});
