import fs from 'fs';

export class Tower {
  constructor(x, y, cost) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = attackPower; // 타워 공격력
    this.range = range; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = cooldown; // 타워 공격 쿨타임
    this.beamDuration = beamDuration; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.towerLevel = 1; //타워 레벨
    this.upgradeCost = 50; //기본 업그레이드 비용
  }

  draw(ctx, towerImage) {
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = 'skyblue';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  upgrade() {
    if (this.towerLevel < 3) {
      this.towerLevel++;
      if (this.towerLevel === 2) {
        this.attackPower += 10; // 1레벨에서 2레벨로 업그레이드 시 공격력 증가
        this.range += 30; // 1레벨에서 2레벨로 업그레이드 시 사거리 증가
      } else if (this.towerLevel === 3) {
        this.attackPower += 50; // 2레벨에서 3레벨로 업그레이드 시 공격력 증가
        this.range += 50; // 2레벨에서 3레벨로 업그레이드 시 사거리 증가
      }
      this.upgradeCost += 20; // 업그레이드 비용 증가
    }
  }
}

//사거리 짧은 단일 공격 타워
export class pawnTower extends Tower {
  constructor(x, y) {
    super(x, y, 100, 20, 150, 180, 30); //비용, 공격력, 사거리, 쿨타임, 지속시간
    this.upgradeCost = 50; // 업그레이드 비용
  }
}

//사거리 긴 단일 공격 타워
export class rookTower extends Tower {
  constructor(x, y) {
    super(x, y, 80, 40, 400, 160, 60);
    this.upgradeCost = 50; // 업그레이드 비용
  }
}

//여러마리 때릴 수 있는 타워(최대 3마리)
export class knightTower extends Tower {
  constructor(x, y) {
    super(x, y, 120, 30, 300, 300, 60);
    this.upgradeCost = 50; // 업그레이드 비용
    this.attackInterval = 300; // 5초에 한번 공격
    this.lastAttackTime = 0; // 마지막 공격 시간
  }

  attack(monsters) {
    if (this.lastAttackTime <= 0) {
      let attackedCount = 0;

      for (const monster of monsters) {
        if (attackedCount < 3) {
          const distance = Math.sqrt(
            Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2),
          );
          if (distance < this.range) {
            monster.hp -= this.attackPower; // 공격
            attackedCount++;
          }
        }
      }
      this.lastAttackTime = this.attackInterval; // 공격 쿨타임 설정
    } else {
      this.lastAttackTime--; // 쿨타임 감소
    }
  }
}

// 슬로우 타워
export class bishopTower extends Tower {
  constructor(x, y) {
    super(x, y, 130, 10, 300, 60, 30);
    this.slowAmount = 0.5; // 몬스터 속도를 50% 감소시킴
    this.slowDuration = 120; // 속도 감소 지속 시간
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower; // 몬스터 공격
      monster.speed *= this.slowAmount; // 몬스터 속도 감소
      monster.slowDuration = this.slowDuration; // 속도 감소 지속 시간 설정
      this.cooldown = 60; // 공격 쿨타임 설정
    }
  }
}

//가까이오면 죽을때까지 때리는 타워
export class queenTower extends Tower {
  constructor(x, y) {
    super(x, y, 200, 60, 450, 60, 60);
    this.upgradeCost = 150; // 업그레이드 비용
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower; // 공격
      this.cooldown = 60; // 1초마다 공격
    }
  }
}

export class kingTower extends Tower {
  constructor(x, y) {
    super(x, y, 250, 500, 150, 60, 60);
    this.upgradeCost = 150; // 업그레이드 비용
  }

  attack(monster) {
    super.attack(monster);
  }
}
