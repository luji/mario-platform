import {
  Vector2,
  Rectangle,
  PlayerState,
  Direction,
  TILE_SIZE,
  PLAYER_WALK_SPEED,
  PLAYER_RUN_SPEED,
  PLAYER_JUMP_FORCE,
  PLAYER_BIG_JUMP_FORCE,
  GRAVITY,
  MAX_FALL_SPEED
} from '../engine/types';
import { InputHandler } from '../engine/input-handler';
import { Physics } from '../engine/physics';
import { SpriteRenderer } from '../sprites/sprite-renderer';

export class Player {
  position: Vector2;
  velocity: Vector2 = { x: 0, y: 0 };
  width: number = 14;
  height: number = 16;
  state: PlayerState = PlayerState.SMALL;
  direction: Direction = Direction.RIGHT;

  private grounded = false;
  private jumping = false;
  private jumpHeld = false;
  private jumpTime = 0;
  private maxJumpTime = 0.3;

  // Coyote Time - allows jumping shortly after leaving a platform
  private coyoteTime = 0.1; // 100ms window (about 6 frames at 60fps)
  private coyoteTimer = 0;
  private wasGrounded = false;

  // Jump Buffering - registers jump input before landing
  private jumpBufferTime = 0.1; // 100ms buffer window
  private jumpBufferTimer = 0;

  private walkFrame = 0;
  private walkFrameTimer = 0;
  private walkFrameDelay = 0.1;

  private invincible = false;
  private invincibleTimer = 0;
  private invincibleDuration = 2;
  private blinkTimer = 0;

  private dead = false;
  private deathTimer = 0;
  private deathJumpDone = false;

  private pipeEntering = false;
  private flagSliding = false;

  // Star power
  private starPower = false;
  private starTimer = 0;
  private starDuration = 10;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  update(deltaTime: number, input: InputHandler, tiles: number[][]): void {
    if (this.dead) {
      this.updateDeath(deltaTime);
      return;
    }

    if (this.pipeEntering || this.flagSliding) {
      return;
    }

    // Update invincibility
    if (this.invincible) {
      this.invincibleTimer -= deltaTime;
      this.blinkTimer += deltaTime;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Update star power
    if (this.starPower) {
      this.starTimer -= deltaTime;
      if (this.starTimer <= 0) {
        this.starPower = false;
      }
    }

    // Horizontal movement
    const speed = input.isRun() ? PLAYER_RUN_SPEED : PLAYER_WALK_SPEED;
    const acceleration = this.grounded ? 600 : 300;
    const friction = this.grounded ? 500 : 100;

    if (input.isLeft()) {
      this.velocity.x = Math.max(-speed, this.velocity.x - acceleration * deltaTime);
      this.direction = Direction.LEFT;
    } else if (input.isRight()) {
      this.velocity.x = Math.min(speed, this.velocity.x + acceleration * deltaTime);
      this.direction = Direction.RIGHT;
    } else {
      // Apply friction
      if (this.velocity.x > 0) {
        this.velocity.x = Math.max(0, this.velocity.x - friction * deltaTime);
      } else if (this.velocity.x < 0) {
        this.velocity.x = Math.min(0, this.velocity.x + friction * deltaTime);
      }
    }

    // Update Coyote Time
    // Track when we leave the ground (not from jumping)
    if (this.wasGrounded && !this.grounded && !this.jumping) {
      this.coyoteTimer = this.coyoteTime;
    }
    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= deltaTime;
    }
    this.wasGrounded = this.grounded;

    // Update Jump Buffer
    // If player presses jump while in air, buffer it
    if (input.isJumpPressed()) {
      this.jumpBufferTimer = this.jumpBufferTime;
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= deltaTime;
    }

    // Can jump if: grounded OR within coyote time window
    const canJump = this.grounded || this.coyoteTimer > 0;

    // Should jump if: jump was pressed OR jump is buffered
    const shouldJump = input.isJumpPressed() || this.jumpBufferTimer > 0;

    // Jumping - now with Coyote Time and Jump Buffering
    if (shouldJump && canJump && !this.jumping) {
      const jumpForce = this.state === PlayerState.SMALL ? PLAYER_JUMP_FORCE : PLAYER_BIG_JUMP_FORCE;
      this.velocity.y = jumpForce;
      this.jumping = true;
      this.jumpHeld = true;
      this.jumpTime = 0;
      this.grounded = false;
      // Clear coyote timer and jump buffer after jumping
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    // Variable jump height (hold jump for higher jumps)
    if (this.jumping && input.isJump()) {
      this.jumpTime += deltaTime;
      if (this.jumpTime < this.maxJumpTime) {
        this.velocity.y = Math.min(this.velocity.y, this.state === PlayerState.SMALL ? PLAYER_JUMP_FORCE : PLAYER_BIG_JUMP_FORCE);
      }
    } else {
      this.jumping = false;
    }

    if (!input.isJump()) {
      this.jumpHeld = false;
    }

    // Apply gravity
    this.velocity.y = Math.min(this.velocity.y + GRAVITY * deltaTime, MAX_FALL_SPEED);

    // Collision detection
    const collision = Physics.checkTileCollision(
      this.getBounds(),
      this.velocity,
      tiles,
      deltaTime
    );

    this.position = collision.position;
    this.velocity = collision.velocity;
    this.grounded = collision.grounded;

    // Reset coyote timer when landing
    if (this.grounded) {
      this.coyoteTimer = 0;
    }

    // Hit block from below
    if (collision.hitCeiling) {
      collision.collidedTiles
        .filter(t => t.side === 'top')
        .forEach(tile => {
          // This will be handled by the game engine
        });
    }

    // Update walk animation
    if (Math.abs(this.velocity.x) > 0.1 && this.grounded) {
      this.walkFrameTimer += deltaTime;
      if (this.walkFrameTimer >= this.walkFrameDelay) {
        this.walkFrameTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % 3;
      }
    } else {
      this.walkFrame = 0;
      this.walkFrameTimer = 0;
    }

    // Fall death
    if (this.position.y > 240) {
      this.die();
    }

    // Keep player in bounds (left side)
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0;
    }
  }

  private updateDeath(deltaTime: number): void {
    this.deathTimer += deltaTime;

    if (this.deathTimer < 0.5) {
      // Pause before death jump
      return;
    }

    if (!this.deathJumpDone) {
      this.velocity.y = -200;
      this.deathJumpDone = true;
    }

    this.velocity.y += GRAVITY * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2, spriteRenderer: SpriteRenderer, frame: number): void {
    // Blinking when invincible
    if (this.invincible && Math.floor(this.blinkTimer * 10) % 2 === 0) {
      return;
    }

    const screenX = Math.floor(this.position.x - camera.x);
    const screenY = Math.floor(this.position.y - camera.y);

    if (this.state === PlayerState.SMALL || this.dead) {
      if (!this.grounded && !this.dead) {
        spriteRenderer.drawMarioSmallJump(ctx, screenX, screenY, this.direction);
      } else if (Math.abs(this.velocity.x) > 0.1) {
        spriteRenderer.drawMarioSmallWalk(ctx, screenX, screenY, this.direction, this.walkFrame);
      } else {
        spriteRenderer.drawMarioSmallStand(ctx, screenX, screenY, this.direction);
      }
    } else {
      if (!this.grounded) {
        spriteRenderer.drawMarioBigJump(ctx, screenX, screenY - 16, this.direction);
      } else if (Math.abs(this.velocity.x) > 0.1) {
        spriteRenderer.drawMarioBigWalk(ctx, screenX, screenY - 16, this.direction, this.walkFrame);
      } else {
        spriteRenderer.drawMarioBigStand(ctx, screenX, screenY - 16, this.direction);
      }
    }

    // Star power visual effect
    if (this.starPower) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF'][Math.floor(frame / 4) % 4];
      ctx.fillRect(screenX, screenY - (this.state !== PlayerState.SMALL ? 16 : 0), this.width, this.height);
      ctx.globalAlpha = 1;
    }
  }

  getBounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  grow(): void {
    if (this.state === PlayerState.SMALL) {
      this.state = PlayerState.BIG;
      this.height = 32;
      // Only adjust position if grounded to prevent floating
      if (this.grounded) {
        this.position.y -= 16;
      }
    }
  }

  getFirePower(): void {
    if (this.state === PlayerState.SMALL) {
      this.grow();
    }
    this.state = PlayerState.FIRE;
  }

  activateStarPower(): void {
    this.starPower = true;
    this.starTimer = this.starDuration;
  }

  hurt(): boolean {
    if (this.invincible || this.starPower) {
      return false;
    }

    if (this.state === PlayerState.SMALL) {
      this.die();
      return true;
    } else {
      this.state = PlayerState.SMALL;
      this.height = 16;
      this.invincible = true;
      this.invincibleTimer = this.invincibleDuration;
      return false;
    }
  }

  die(): void {
    this.dead = true;
    this.velocity = { x: 0, y: 0 };
    this.deathTimer = 0;
    this.deathJumpDone = false;
  }

  isDead(): boolean {
    return this.dead;
  }

  isInvincible(): boolean {
    return this.invincible;
  }

  hasStarPower(): boolean {
    return this.starPower;
  }

  isGrounded(): boolean {
    return this.grounded;
  }

  reset(x: number, y: number): void {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.state = PlayerState.SMALL;
    this.height = 16;
    this.dead = false;
    this.invincible = false;
    this.starPower = false;
    this.grounded = false;
    this.direction = Direction.RIGHT;
    // Reset coyote time and jump buffer
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.wasGrounded = false;
    this.jumping = false;
  }

  // For stomping enemies
  bounce(): void {
    this.velocity.y = -6;
    this.grounded = false;
  }
}
