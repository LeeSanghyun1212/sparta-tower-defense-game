import { pawnTower, rookTower, knightTower, bishopTower, queenTower, kingTower } from './tower.js';

export class TowerManager {
  constructor() {
    this.towers = [];
  }

  addTower(towerType, x, y) {
    let tower;
    switch (towerType) {
      case 'pawn':
        tower = new pawnTower(x, y);
        break;
      case 'rook':
        tower = new rookTower(x, y);
        break;
      case 'knight':
        tower = new knightTower(x, y);
        break;
      case 'bishop':
        tower = new bishopTower(x, y);
        break;
      case 'queen':
        tower = new queenTower(x, y);
        break;
      case 'king':
        tower = new kingTower(x, y);
        break;
      default:
        console.error(`Unknown tower type: ${towerType}`);
        return;
    }
    this.towers.push(tower);
  }

  updateTowers(monsters) {
    for (const tower of this.towers) {
      tower.updateCooldown();
      if (tower.target) {
        if (tower.beamDuration > 0) {
          tower.attack(tower.target);
        } else {
          tower.target = null; // 타겟이 죽거나 범위를 벗어나면 타겟 초기화
        }
      } else {
        // 타겟 찾기
        for (const monster of monsters) {
          const distance = Math.sqrt(Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2));
          if (distance <= tower.range) {
            tower.target = monster;
            break;
          }
        }
      }
    }
  }

  drawTowers(ctx, towerImages) {
    for (const tower of this.towers) {
      const towerImage = towerImages[tower.id]; // towerImages는 타워 이미지 객체입니다.
      tower.draw(ctx, towerImage);
    }
  }

  upgradeTower(towerIndex) {
    if (this.towers[towerIndex]) {
      this.towers[towerIndex].upgrade();
    }
  }
}
