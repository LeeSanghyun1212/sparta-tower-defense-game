import { towerDataTable } from './init/asset.js';
import { monsterDataTable } from './init/asset.js';

export class Tower {
  static towerData = [];

  static loadTowerData(data) {
    console.log('Loaded tower data:', Tower.towerData);

    this.towerData = data;
  }

  static getTowerData(towerType) {
    const splitTowerData = towerType.split('/');
    const fileName = splitTowerData[splitTowerData.length - 1];
    const towerName = fileName.slice(6, -4);

    const tower = this.towerData.find((t) => t.type === towerName);
    return tower;
  }
  constructor(x, y, towerType) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.type = towerType;
    this.target = null; // 타워 광선의 목표
    this.upgradeCost = 50;
    this.init();
  }

  init() {
    const towerData = towerDataTable.data.find((tower) => tower.type === this.type);
    if (!towerData) {
      console.log(`Not Fonud tower Data : type [${this.type}]`);
      return;
    }
    this.width = towerData.width; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = towerData.height; // 타워 이미지 세로 길이

    this.cost = towerData.cost; // 타워 구입 비용
    this.attackPower = towerData.attack_power; //타워 공격력
    this.range = towerData.range; // 타워 사거리
    this.defaultCooldown = towerData.cooldown;
    this.cooldown = towerData.cooldown; // 타워 공격 쿨타임
    this.defaultBeamDuration = towerData.beamDuration; // 타워 광선 디폴트 지속 시간
    this.beamDuration = towerData.beamDuration; // 타워 광선 지속 시간
  }

  draw(ctx, towerImages) {
    ctx.drawImage(
      towerImages[`${this.type}`],
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
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
      this.beamDuration = this.defaultBeamDuration; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  upgrade() {
    if (!this.towerLevel) {
      this.towerLevel = 1;
    }
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
  constructor(x, y, towerTower) {
    super(x, y, towerTower);
    this.upgradeCost = 50; //업그레이드 비용
  }
}

//사거리 긴 단일 공격 타워
export class rookTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerTower);
    this.upgradeCost = 50; // 업그레이드 비용
  }
}

//여러마리 때릴 수 있는 타워(최대 3마리)
export class knightTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.upgradeCost = 50; // 업그레이드 비용
    this.targets = [];
  }

  attack(monsters) {
    if (this.cooldown <= 0) {
      let attackedCount = 0;

      for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (attackedCount < 3) {
          const distance = Math.sqrt(
            Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2),
          );
          if (distance < this.range) {
            monster.hp -= this.attackPower; // 공격
            this.targets.push(monster); // 광선의 목표 설정

            attackedCount++;
          }
        } else {
          break;
        }
      }
      this.cooldown = this.defaultCooldown; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = this.defaultBeamDuration; // 광선 지속 시간 (0.5초)
    }
  }

  draw(ctx, towerImages) {
    ctx.drawImage(
      towerImages[`${this.type}`],
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
    if (this.beamDuration > 0 && this.targets.length > 0) {
      this.targets.forEach((target) => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(target.x + target.width / 2, target.y + target.height / 2);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
      });
      this.beamDuration--;
    } else {
      this.targets = [];
    }
  }
}

// 슬로우 타워
export class bishopTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.slowAmount = 0.5; // 몬스터 속도를 50% 감소시킴
    this.slowDuration = 120; // 속도 감소 지속 시간 (2초, 초당 60프레임)
    this.upgradeCost = 50;
    this.target = null;
  }
  attack(monster) {
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      if (!monster.isSlowed) {
        monster.applySlow(this.slowAmount, this.slowDuration);
      }
      this.cooldown = this.defaultCooldown;
      this.target = monster;
      this.beamDuration = this.defaultBeamDuration;
    }
  }
  draw(ctx, towerImages) {
    ctx.drawImage(
      towerImages[`${this.type}`],
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );
    if (this.beamDuration > 0 && this.targets) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y); // 타워 위치에서 시작
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2); // 몬스터 위치로 광선
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }
}

//가까이오면 죽을때까지 때리는 타워
export class queenTower extends Tower {
  constructor(x, y, towerTower) {
    super(x, y, towerTower);
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
  constructor(x, y, towerTower) {
    super(x, y, towerTower);
    this.upgradeCost = 150; // 업그레이드 비용
  }

  attack(monster) {
    super.attack(monster);
  }
}
