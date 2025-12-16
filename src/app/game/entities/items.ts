import { Vector2, Rectangle, ItemType, TILE_SIZE, GRAVITY, MAX_FALL_SPEED } from '../engine/types';
import { Physics } from '../engine/physics';
import { SpriteRenderer } from '../sprites/sprite-renderer';

export abstract class Item {
  position: Vector2;
  velocity: Vector2 = { x: 0, y: 0 };
  width: number = 16;
  height: number = 16;
  type: ItemType;
  active = true;
  collected = false;
  frame = 0;

  constructor(x: number, y: number, type: ItemType) {
    this.position = { x, y };
    this.type = type;
  }

  abstract update(deltaTime: number, tiles: number[][]): void;
  abstract draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void;
  abstract getPoints(): number;

  getBounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  collect(): void {
    this.collected = true;
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }
}

export class Coin extends Item {
  private floating: boolean;
  private bouncing = false;
  private bounceStartY: number;
  private bounceTimer = 0;

  constructor(x: number, y: number, floating = true) {
    super(x, y, ItemType.COIN);
    this.floating = floating;
    this.bounceStartY = y;
  }

  // For coins that pop out of blocks
  startBounce(): void {
    this.bouncing = true;
    this.velocity.y = -8;
    this.bounceStartY = this.position.y;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.bouncing) {
      this.bounceTimer += deltaTime;
      this.velocity.y += GRAVITY * 0.5;
      this.position.y += this.velocity.y;

      if (this.bounceTimer > 0.5) {
        this.active = false;
        this.collected = true;
      }
      return;
    }

    // Floating coins don't move
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);
    spriteRenderer.drawCoin(ctx, screenX, screenY, this.frame);
  }

  getPoints(): number {
    return 200;
  }
}

export class Mushroom extends Item {
  private emerging = true;
  private emergeY: number;
  private moveSpeed = 1;

  constructor(x: number, y: number) {
    super(x, y, ItemType.MUSHROOM);
    this.emergeY = y;
    this.position.y = y + TILE_SIZE;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.emerging) {
      this.position.y -= 0.5;
      if (this.position.y <= this.emergeY) {
        this.position.y = this.emergeY;
        this.emerging = false;
        this.velocity.x = this.moveSpeed;
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
    }

    this.position.x += this.velocity.x * deltaTime;

    // Fall off screen
    if (this.position.y > 300) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);
    spriteRenderer.drawMushroom(ctx, screenX, screenY);
  }

  getPoints(): number {
    return 1000;
  }
}

export class FireFlower extends Item {
  private emerging = true;
  private emergeY: number;

  constructor(x: number, y: number) {
    super(x, y, ItemType.FIRE_FLOWER);
    this.emergeY = y;
    this.position.y = y + TILE_SIZE;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.emerging) {
      this.position.y -= 0.5;
      if (this.position.y <= this.emergeY) {
        this.position.y = this.emergeY;
        this.emerging = false;
      }
    }
    // Fire flower doesn't move after emerging
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);
    spriteRenderer.drawFireFlower(ctx, screenX, screenY, this.frame);
  }

  getPoints(): number {
    return 1000;
  }
}

export class Star extends Item {
  private emerging = true;
  private emergeY: number;
  private moveSpeed = 2;
  private bounceForce = -6;

  constructor(x: number, y: number) {
    super(x, y, ItemType.STAR);
    this.emergeY = y;
    this.position.y = y + TILE_SIZE;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.emerging) {
      this.position.y -= 0.5;
      if (this.position.y <= this.emergeY) {
        this.position.y = this.emergeY;
        this.emerging = false;
        this.velocity.x = this.moveSpeed;
        this.velocity.y = this.bounceForce;
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

    // Bounce on ground
    if (collision.grounded) {
      this.velocity.y = this.bounceForce;
    } else {
      this.velocity.y = collision.velocity.y;
    }

    // Turn around when hitting wall
    if (collision.collidedTiles.some(t => t.side === 'left' || t.side === 'right')) {
      this.velocity.x = -this.velocity.x;
    }

    this.position.x += this.velocity.x * deltaTime;

    // Fall off screen
    if (this.position.y > 300) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);
    spriteRenderer.drawStar(ctx, screenX, screenY, this.frame);
  }

  getPoints(): number {
    return 1000;
  }
}

export class OneUp extends Item {
  private emerging = true;
  private emergeY: number;
  private moveSpeed = 1;

  constructor(x: number, y: number) {
    super(x, y, ItemType.ONE_UP);
    this.emergeY = y;
    this.position.y = y + TILE_SIZE;
  }

  update(deltaTime: number, tiles: number[][]): void {
    this.frame++;

    if (this.emerging) {
      this.position.y -= 0.5;
      if (this.position.y <= this.emergeY) {
        this.position.y = this.emergeY;
        this.emerging = false;
        this.velocity.x = this.moveSpeed;
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
    }

    this.position.x += this.velocity.x * deltaTime;

    if (this.position.y > 300) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    // Green mushroom (1-UP)
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(screenX + 2, screenY, 12, 8);
    ctx.fillRect(screenX, screenY + 4, 16, 4);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(screenX + 3, screenY + 1, 4, 4);
    ctx.fillRect(screenX + 9, screenY + 1, 4, 4);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(screenX + 4, screenY + 8, 8, 8);

    ctx.fillStyle = '#000000';
    ctx.fillRect(screenX + 5, screenY + 10, 2, 3);
    ctx.fillRect(screenX + 9, screenY + 10, 2, 3);
  }

  getPoints(): number {
    return 0; // 1-UP gives life instead of points
  }
}

// Brick debris for when bricks break
export class BrickDebris {
  position: Vector2;
  velocity: Vector2;
  active = true;
  private lifetime = 0;

  constructor(x: number, y: number, velX: number, velY: number) {
    this.position = { x, y };
    this.velocity = { x: velX, y: velY };
  }

  update(deltaTime: number): void {
    this.lifetime += deltaTime;
    this.velocity.y += GRAVITY;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.lifetime > 1 || this.position.y > 300) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2): void {
    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    ctx.fillStyle = '#D89868';
    ctx.fillRect(screenX, screenY, 8, 8);
    ctx.fillStyle = '#A85028';
    ctx.fillRect(screenX, screenY, 8, 2);
    ctx.fillRect(screenX, screenY, 2, 8);
  }
}
