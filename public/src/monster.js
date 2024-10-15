import { monsterDataTable } from './init/asset.js';
import { stageDataTable } from './init/asset.js';

export class Monster {
  constructor(path, monsterImages, id, stageId) {
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }

    this.id = id;
    this.path = path;
    this.currentIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.level = stageDataTable.data.findIndex((stage) => stage.id === stageId) + 1;

    this.init(monsterImages, this.level);

    this.isSlowed = false;
    this.slowDuration = 0;
    this.slowAmount = 0; // 슬로우 효과의 크기 저장
  }

  init(monsterImages, level) {
    const monsterData = monsterDataTable.data.find((monster) => monster.id === this.id);
    if (!monsterData) {
      console.log(`Not Found Monster Data : id [${id}]`);
      return;
    }
    this.maxHp = monsterData.hp + level * 20;
    this.hp = this.maxHp;
    this.attackPower = monsterData.attackPower + level * 5;
    this.speed = monsterData.speed + level * 0.25;
    this.originalSpeed = this.speed; // 원래 속도 저장
    this.width = monsterData.width;
    this.height = monsterData.height;
    this.image = monsterImages[monsterData.imageIndex];
    this.score = monsterData.score + level * 10;
    this.gold = monsterData.gold + level * 1;
  }

  move(base) {
    const effectiveSpeed = this.isSlowed ? this.originalSpeed * (1 - this.slowAmount) : this.speed;
    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < effectiveSpeed) {
        this.currentIndex++;
      } else {
        this.x += (deltaX / distance) * effectiveSpeed;
        this.y += (deltaY / distance) * effectiveSpeed;
      }
      return false;
    } else {
      const isDestroyed = base.takeDamage(this.attackPower);
      const isAttacked = true;
      return { isDestroyed, isAttacked }; // 목표 지점 도착 시 처리
    }
  }

  update() {
    if (this.isSlowed) {
      this.slowDuration--;
      if (this.slowDuration <= 0) {
        this.isSlowed = false;
        this.speed = this.originalSpeed; // 슬로우가 끝나면 원래 속도로 복구
      }
    }
  }
  
  applySlow(amount, duration) {
    if (!this.isSlowed) {
      this.isSlowed = true;
      this.slowAmount = amount; // 슬로우 비율 저장
      this.slowDuration = duration; // 슬로우 지속 시간 설정
    } else {
      // 슬로우가 이미 적용된 상태라면, 남은 지속 시간을 연장할 수 있습니다.
      this.slowDuration = Math.max(this.slowDuration, duration);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y - this.height / 2, this.width, this.height);
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText(`${this.hp}`, this.x + this.width / 2, this.y - this.height / 2);
  }
}
