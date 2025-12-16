import { Vector2, Rectangle, Direction, EnemyType, TILE_SIZE, GRAVITY, MAX_FALL_SPEED } from '../engine/types';
import { Physics } from '../engine/physics';
import { SpriteRenderer } from '../sprites/sprite-renderer';

export abstract class Enemy {
  position: Vector2;
  velocity: Vector2 = { x: 0, y: 0 };
  width: number = 16;
  height: number = 16;
  direction: Direction = Direction.LEFT;
  active = true;
  dying = false;
  deathTimer = 0;
  type: EnemyType;
  frame = 0;

  constructor(x: number, y: number, type: EnemyType) {
    this.position = { x, y };
    this.type = type;
  }

  abstract update(deltaTime: number, tiles: number[][]): void;
  abstract draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void;
  abstract onStomp(): number; // Returns points
  abstract onHit(): void; // Hit from below or by shell/fireball

  getBounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  isActive(): boolean {
    return this.active;
  }
}

export class Goomba extends Enemy {
  private squashed = false;
  private walkSpeed = 0.5;

  constructor(x: number, y: number) {
    super(x, y, EnemyType.GOOMBA);
    this.velocity.x = -this.walkSpeed;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.squashed) {
      this.deathTimer += deltaTime;
      if (this.deathTimer > 0.5) {
        this.active = false;
      }
      return;
    }

    if (this.dying) {
      this.velocity.y += GRAVITY;
      this.position.y += this.velocity.y;
      if (this.position.y > 300) {
        this.active = false;
      }
      return;
    }

    // Apply gravity
    this.velocity.y = Math.min(this.velocity.y + GRAVITY, MAX_FALL_SPEED);

    // Check collisions
    const collision = Physics.checkTileCollision(
      this.getBounds(),
      this.velocity,
      tiles,
      deltaTime
    );

    this.position = collision.position;
    this.velocity.y = collision.velocity.y;

    // Turn around when hitting wall
    if (collision.collidedTiles.some(t => t.side === 'left' || t.side === 'right')) {
      this.velocity.x = -this.velocity.x;
      this.direction = this.velocity.x > 0 ? Direction.RIGHT : Direction.LEFT;
    }

    // Move
    this.position.x += this.velocity.x * deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    if (this.squashed) {
      spriteRenderer.drawGoombaSquashed(ctx, screenX, screenY);
    } else {
      spriteRenderer.drawGoomba(ctx, screenX, screenY, this.frame);
    }
  }

  onStomp(): number {
    this.squashed = true;
    this.velocity.x = 0;
    return 100;
  }

  onHit(): void {
    this.dying = true;
    this.velocity.y = -5;
  }
}

export class Koopa extends Enemy {
  private inShell = false;
  private shellMoving = false;
  private walkSpeed = 0.4;
  private shellSpeed = 4;
  private shellKickTimer = 0;

  constructor(x: number, y: number) {
    super(x, y, EnemyType.KOOPA);
    this.height = 24;
    this.velocity.x = -this.walkSpeed;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.dying) {
      this.velocity.y += GRAVITY;
      this.position.y += this.velocity.y;
      if (this.position.y > 300) {
        this.active = false;
      }
      return;
    }

    if (this.inShell && !this.shellMoving) {
      // Shell sitting still
      this.shellKickTimer += deltaTime;
      if (this.shellKickTimer > 5) {
        // Koopa comes back out
        this.inShell = false;
        this.height = 24;
        this.shellKickTimer = 0;
      }
      return;
    }

    // Apply gravity
    this.velocity.y = Math.min(this.velocity.y + GRAVITY, MAX_FALL_SPEED);

    // Check collisions
    const collision = Physics.checkTileCollision(
      this.getBounds(),
      this.velocity,
      tiles,
      deltaTime
    );

    this.position = collision.position;
    this.velocity.y = collision.velocity.y;

    // Turn around when hitting wall (or bounce shell)
    if (collision.collidedTiles.some(t => t.side === 'left' || t.side === 'right')) {
      this.velocity.x = -this.velocity.x;
      this.direction = this.velocity.x > 0 ? Direction.RIGHT : Direction.LEFT;
    }

    // Move
    this.position.x += this.velocity.x * deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    if (this.inShell) {
      spriteRenderer.drawKoopaShell(ctx, screenX, screenY + 8, this.shellMoving, this.frame);
    } else {
      spriteRenderer.drawKoopa(ctx, screenX, screenY, this.direction, this.frame);
    }
  }

  onStomp(): number {
    if (!this.inShell) {
      this.inShell = true;
      this.shellMoving = false;
      this.height = 16;
      this.velocity.x = 0;
      this.shellKickTimer = 0;
      return 100;
    } else if (!this.shellMoving) {
      // Kick shell
      this.shellMoving = true;
      return 0;
    } else {
      // Stop shell
      this.shellMoving = false;
      this.velocity.x = 0;
      this.shellKickTimer = 0;
      return 0;
    }
  }

  kickShell(direction: Direction): void {
    if (this.inShell && !this.shellMoving) {
      this.shellMoving = true;
      this.velocity.x = direction * this.shellSpeed;
    }
  }

  onHit(): void {
    this.dying = true;
    this.velocity.y = -5;
  }

  isShellMoving(): boolean {
    return this.shellMoving;
  }

  isInShell(): boolean {
    return this.inShell;
  }
}

export class PiranhaPlant extends Enemy {
  private baseY: number;
  private emergingTimer = 0;
  private emerged = false;
  private emergeHeight = 24;
  private waitTime = 2;

  constructor(x: number, y: number) {
    super(x, y, EnemyType.PIRANHA);
    this.baseY = y + 16;
    this.position.y = this.baseY;
    this.width = 16;
    this.height = 24;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;
    this.emergingTimer += deltaTime;

    const cycleTime = this.waitTime * 2 + 2; // wait, emerge, wait, retreat
    const cyclePos = this.emergingTimer % cycleTime;

    if (cyclePos < this.waitTime) {
      // Hidden
      this.position.y = this.baseY;
      this.emerged = false;
    } else if (cyclePos < this.waitTime + 1) {
      // Emerging
      const progress = (cyclePos - this.waitTime);
      this.position.y = this.baseY - (this.emergeHeight * progress);
      this.emerged = true;
    } else if (cyclePos < this.waitTime * 2 + 1) {
      // Fully emerged
      this.position.y = this.baseY - this.emergeHeight;
    } else {
      // Retreating
      const progress = (cyclePos - this.waitTime * 2 - 1);
      this.position.y = this.baseY - this.emergeHeight + (this.emergeHeight * progress);
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    if (!this.emerged && this.position.y >= this.baseY) return;

    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    // Simple piranha plant drawing
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(screenX + 2, screenY, 12, 12);

    // Mouth
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(screenX + 4, screenY + 4, 8, 4);

    // White teeth
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(screenX + 5, screenY + 4, 2, 2);
    ctx.fillRect(screenX + 9, screenY + 4, 2, 2);

    // Stem
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(screenX + 4, screenY + 12, 8, 12);
  }

  onStomp(): number {
    // Piranha plants can't be stomped
    return 0;
  }

  onHit(): void {
    this.dying = true;
    this.active = false;
  }

  canHurtPlayer(): boolean {
    return this.emerged || this.position.y < this.baseY;
  }
}
