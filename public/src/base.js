import { sendEvent } from './socket.js';

export class Base {
  constructor(x, y, maxHp) {
    // 생성자 안에서 기지의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 기지 이미지 x 좌표
    this.y = y; // 기지 이미지 y 좌표
    this.width = 170; // 기지 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 225; // 기지 이미지 세로 길이
    this.hp = maxHp; // 기지의 현재 HP
    this.maxHp = maxHp; // 기지의 최대 HP
  }

  draw(ctx, baseImage) {
    ctx.drawImage(
      baseImage,
      this.x - this.width + 5,
      this.y - this.height / 2,
      this.width,
      this.height,
    );

    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const barWidth = 150; // 채력바의 가로 길이
    const barHeight = 30; // 채력바의 세로 길이
    const healthRatio = this.hp / this.maxHp;

    // 채력바 배경
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 반투명 검정색
    ctx.fillRect(
      this.x - this.width / 2 - barWidth / 2 + 5,
      this.y + this.height / 2,
      barWidth,
      barHeight,
    );

    // 채력바 현재 HP
    ctx.fillStyle = 'red'; // 채력바 색상
    ctx.fillRect(
      this.x - this.width / 2 - barWidth / 2 + 5,
      this.y + this.height / 2,
      barWidth * healthRatio,
      barHeight,
    );
  }

  takeDamage(amount) {
    // 기지가 파괴되었는지를 구분하는 메소드입니다.
    // 몬스터가 기지의 HP를 감소시키고, HP가 0 이하가 되면 게임 오버 처리를 해요!
    this.hp -= amount;
    return this.hp <= 0;
  }
}
