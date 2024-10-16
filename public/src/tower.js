import { towerDataTable } from './init/asset.js';

export class Tower {
  static towerData = [];

  static loadTowerData(data) {
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
    this.level = 1;
    this.init();
  }

  upgrade(level) {
    const towerData = towerDataTable.data.find((tower) => tower.type === this.type);

    this.level = level;
    this.attackPower = towerData.attack_power + 10 * (this.level - 1); //타워 공격력
    this.range = towerData.range + 10 * (this.level - 1); // 타워 사거리
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
    this.attackPower = towerData.attack_power + 10 * (this.level - 1); //타워 공격력
    this.range = towerData.range + 10 * (this.level - 1); // 타워 사거리
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

    ctx.font = '20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    let levelText = '';
    for (let i = 0; i < this.level; i++) {
      levelText += '★';
    }
    ctx.fillText(`${levelText}`, this.x, this.y - this.height / 2);

    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y);
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
}

//사거리 짧은 단일 공격 타워
export class pawnTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.upgradeCost = 50; //업그레이드 비용
  }
}

//사거리 긴 단일 공격 타워
export class rookTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
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

    ctx.font = '20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    let levelText = '';
    for (let i = 0; i < this.level; i++) {
      levelText += '★';
    }
    ctx.fillText(`${levelText}`, this.x, this.y - this.height / 2);

    if (this.beamDuration > 0 && this.targets.length > 0) {
      this.targets.forEach((target) => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(target.x + target.width / 2, target.y);
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

    ctx.font = '20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    let levelText = '';
    for (let i = 0; i < this.level; i++) {
      levelText += '★';
    }
    ctx.fillText(`${levelText}`, this.x, this.y - this.height / 2);

    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y); // 타워 위치에서 시작
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y);
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
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.upgradeCost = 50; // 업그레이드 비용
    this.startAttackPower = this.attackPower; // 첫 공격 시작 시의 공격력
    this.frameCounting = 0;
    console.log(this.frameCounting);
  }

  upgrade(level) {
    const towerData = towerDataTable.data.find((tower) => tower.type === this.type);

    this.level = level;
    this.attackPower = towerData.attack_power + (this.level - 1); //타워 공격력
    this.range = towerData.range + 10 * (this.level - 1); // 타워 사거리
  }

  attack(monster) {
    // target이 없다면 공격을 시작한다.
    const targetMonster = this.target ? this.target : null;
    if (!targetMonster) {
      this.target = monster;
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

    ctx.font = '20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    let levelText = '';
    for (let i = 0; i < this.level; i++) {
      levelText += '★';
    }
    ctx.fillText(`${levelText}`, this.x, this.y - this.height / 2);

    if (this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();

      this.frameCounting += 1;

      if (this.frameCounting === 10) {
        this.target.hp -= this.startAttackPower;
        this.startAttackPower += 1;
        this.frameCounting = 0;
      }

      if (this.target.hp <= 0) {
        this.target = null;
        this.startAttackPower = this.attackPower;
      }
    }
  }
}

export class kingTower extends Tower {
  constructor(x, y, towerType) {
    super(x, y, towerType);
    this.upgradeCost = 150; // 업그레이드 비용
  }

  attack(monster) {
    super.attack(monster);
  }
}