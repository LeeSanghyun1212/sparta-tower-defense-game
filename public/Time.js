import { sendEvent } from './Socket.js';

class Time {
  time = 0;
  timeIncrement = 0;
  currentStage = 100; // 현재 스테이지 ID
  stageChanged = {}; // 스테이지 변경 확인용 플래그

  constructor(ctx, scaleRatio, stageTable) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable; // 외부에서 전달된 스테이지 테이블 사용

    // 모든 스테이지에 대해 stageChanged 초기화
    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    // 증가분을 누적
    this.timeIncrement += deltaTime * 0.001 * scorePerSecond;

    // 증가분이 scorePerSecond 만큼 쌓이면 score에 반영하고 초기화
    if (this.timeIncrement >= scorePerSecond) {
      this.time += scorePerSecond;
      this.timeIncrement -= scorePerSecond;
    }

    this.checkStageChange();
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      // 현재 점수가 스테이지 점수 이상이고, 해당 스테이지로 변경된 적이 없는 경우
      if (
        Math.floor(this.time) >= stage.timescore &&
        !this.stageChanged[stage.id] &&
        stage.id !== 100
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경됨을 표시
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트 전송
        sendEvent(13, { currentStage: previousStage, targetStage: this.currentStage });


        // 스테이지 변경 후 반복문 종료
        break;
      }
    }
  }

  reset() {
    this.time = 0;
    this.timeIncrement = 0;
    this.currentStage = 100; // 스테이지 초기화

    // 모든 스테이지에 대한 변경 플래그 초기화
    Object.keys(this.stageChanged).forEach((key) => {
      this.stageChanged[key] = false;
    });

  }

  draw() {
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = this.highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 스테이지 표시
    this.drawStage();
  }

  drawStage() {
    const stageY = 50 * this.scaleRatio;
    const fontSize = 30 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'black';

    const stageText = `Stage ${this.currentStage - 999}`; // 스테이지 번호 계산
    const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Time;
