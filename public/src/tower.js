export class Tower {
  constructor(x, y, cost) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = 40; // 타워 공격력
    this.range = 300; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.towerLevel = 1; //타워 레벨
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
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
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
      this.attackPower += 10;
      this.range += 20;
    }
  }
}

//사거리 짧은 단일 공격 타워
export class StrongSingleTower extends Tower {
  constructor(x, y) {
    super(x, y, 100);
    this.attackPower = 80; // 강력한 공격력
    this.range = 150; // 짧은 사정거리
  }

  attack(monster) {
    super.attack(monster); // 기본 공격 메소드 사용
  }
}

//사거리 긴 단일 공격 타워
export class WeakRangeTower extends Tower {
  constructor(x, y) {
    super(x, y, 80);
    this.attackPower = 20; // 약한 공격력
    this.range = 400; // 긴 사정거리
  }

  attack(monster) {
    super.attack(monster); // 기본 공격 메소드 사용
  }
}

//여러마리 때릴 수 있는 타워(최대 3마리)
export class MultiTargetTower extends Tower {
  constructor(x, y) {
    super(x, y, 120);
    this.attackPower = 30;
    this.range = 300; // 중간 사정거리
    this.attackInterval = 300; // 5초에 한번 공격
    this.lastAttackTime = 0; // 마지막 공격 시간
  }

  attack(monsters) {
    if (this.lastAttackTime <= 0) {
      let attackedCount = 0;

      for (const monster of monsters) {
        if (attackedCount < 3) {
          // 최대 3마리 공격
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

//가까이오면 죽을때까지 때리는 타워
export class LaserTower extends Tower {
  constructor(x, y) {
    super(x, y, 130);
    this.attackPower = 30;
    this.range = 300; // 중간 사정거리
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower; // 공격
      this.cooldown = 60; // 1초마다 공격
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
