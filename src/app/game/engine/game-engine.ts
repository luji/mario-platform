import { Vector2, TileType, ItemType, GameState, PlayerState, LevelData, TILE_SIZE, Direction } from './types';
import { InputHandler } from './input-handler';
import { Physics } from './physics';
import { ParticleSystem, ScreenShake } from './effects';
import { SpriteRenderer } from '../sprites/sprite-renderer';
import { Player } from '../entities/player';
import { Enemy, Goomba, Koopa, PiranhaPlant } from '../entities/enemies';
import { Item, Coin, Mushroom, FireFlower, Star, OneUp, BrickDebris } from '../entities/items';
import { TEST_LEVEL, TEST_LEVEL_BLOCKS, BlockContent } from '../levels/level-1-1';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private inputHandler: InputHandler;
  private spriteRenderer: SpriteRenderer;
  private particleSystem: ParticleSystem;
  private screenShake: ScreenShake;

  private gameWidth = 256; // NES resolution
  private gameHeight = 240;
  private scale = 2;

  private player: Player;
  private enemies: Enemy[] = [];
  private items: Item[] = [];
  private debris: BrickDebris[] = [];

  private camera: Vector2 = { x: 0, y: 0 };
  private level: LevelData;
  private blockContents: Map<string, BlockContent>;
  private hitBlocks: Set<string> = new Set();

  private gameState: GameState = {
    score: 0,
    coins: 0,
    lives: 3,
    time: 400,
    world: '1-1',
    playerState: PlayerState.SMALL
  };

  private paused = false;
  private gameOver = false;
  private levelComplete = false;

  private frame = 0;
  private lastTime = 0;
  private accumulator = 0;
  private fixedDeltaTime = 1 / 60; // 60 FPS

  private animationId: number | null = null;
  private timerInterval: number | null = null;

  private onScoreUpdate?: (state: GameState) => void;
  private onGameOver?: () => void;
  private onLevelComplete?: () => void;

  // Track player state for effects
  private playerWasGrounded = false;
  private playerLastDirection = Direction.RIGHT;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    this.inputHandler = new InputHandler();
    this.spriteRenderer = new SpriteRenderer();
    this.particleSystem = new ParticleSystem();
    this.screenShake = new ScreenShake();

    // Load level
    this.level = TEST_LEVEL;
    this.blockContents = new Map();
    TEST_LEVEL_BLOCKS.forEach(block => {
      this.blockContents.set(`${block.x},${block.y}`, block);
    });

    // Create player
    this.player = new Player(this.level.playerStart.x, this.level.playerStart.y);

    // Spawn enemies
    this.spawnEnemies();

    // Start game timer
    this.startTimer();
  }

  private spawnEnemies(): void {
    this.enemies = [];
    this.level.enemies.forEach(spawn => {
      switch (spawn.type) {
        case 'goomba':
          this.enemies.push(new Goomba(spawn.x, spawn.y));
          break;
        case 'koopa':
          this.enemies.push(new Koopa(spawn.x, spawn.y));
          break;
      }
    });
  }

  private startTimer(): void {
    this.timerInterval = window.setInterval(() => {
      if (!this.paused && !this.gameOver && !this.levelComplete) {
        this.gameState.time--;
        if (this.gameState.time <= 0) {
          this.player.die();
        }
        this.onScoreUpdate?.(this.gameState);
      }
    }, 1000);
  }

  setCallbacks(
    onScoreUpdate: (state: GameState) => void,
    onGameOver: () => void,
    onLevelComplete: () => void
  ): void {
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onLevelComplete = onLevelComplete;
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private gameLoop = (currentTime: number): void => {
    this.animationId = requestAnimationFrame(this.gameLoop);

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Check pause
    if (this.inputHandler.isPause()) {
      this.paused = !this.paused;
    }

    if (this.paused || this.gameOver) {
      this.render();
      return;
    }

    // Fixed timestep update
    this.accumulator += deltaTime;
    while (this.accumulator >= this.fixedDeltaTime) {
      this.update(this.fixedDeltaTime);
      this.accumulator -= this.fixedDeltaTime;
    }

    this.render();
    this.frame++;
  };

  private update(deltaTime: number): void {
    if (this.levelComplete) return;

    // Update effects systems
    this.particleSystem.update(deltaTime);
    this.screenShake.update(deltaTime);

    // Store player state before update for effect detection
    const wasGrounded = this.player.isGrounded();
    const prevDirection = this.player.direction;
    const prevVelocityX = this.player.velocity.x;

    // Update player
    this.player.update(deltaTime, this.inputHandler, this.level.tiles);
    this.gameState.playerState = this.player.state;

    // Detect landing - emit dust particles
    if (!wasGrounded && this.player.isGrounded()) {
      const dustX = this.player.position.x + this.player.width / 2;
      const dustY = this.player.position.y + this.player.height;
      this.particleSystem.emitLandingDust(dustX, dustY);
    }

    // Detect quick direction change (skidding) - emit skid dust
    const currentVelocityX = this.player.velocity.x;
    if (this.player.isGrounded() &&
        Math.abs(prevVelocityX) > 1.5 &&
        Math.sign(prevVelocityX) !== Math.sign(currentVelocityX) &&
        currentVelocityX !== 0) {
      const skidX = this.player.position.x + this.player.width / 2;
      const skidY = this.player.position.y + this.player.height;
      this.particleSystem.emitSkidDust(skidX, skidY, prevVelocityX > 0 ? 1 : -1);
    }

    // Check player death
    if (this.player.isDead()) {
      if (this.player.position.y > this.gameHeight + 32) {
        this.handleDeath();
      }
      return;
    }

    // Update camera (follow player, smooth scrolling)
    const targetCameraX = this.player.position.x - this.gameWidth / 3;
    this.camera.x = Math.max(0, Math.min(targetCameraX, this.level.width * TILE_SIZE - this.gameWidth));

    // Check block hits from below
    this.checkBlockHits();

    // Update enemies
    this.enemies.forEach(enemy => {
      if (enemy.isActive()) {
        // Only update enemies near the player (performance)
        if (Math.abs(enemy.position.x - this.player.position.x) < this.gameWidth) {
          enemy.update(deltaTime, this.level.tiles);
        }
      }
    });

    // Update items
    this.items.forEach(item => {
      if (item.isActive()) {
        item.update(deltaTime, this.level.tiles);
      }
    });

    // Update debris
    this.debris = this.debris.filter(d => {
      d.update(deltaTime);
      return d.active;
    });

    // Check collisions
    this.checkCollisions();

    // Check level complete (flag)
    if (this.level.flagPosition) {
      const flagX = this.level.flagPosition.x;
      if (this.player.position.x >= flagX - 16) {
        this.completeLevel();
      }
    }

    // Update score display
    this.onScoreUpdate?.(this.gameState);
  }

  private checkBlockHits(): void {
    const playerBounds = this.player.getBounds();
    const playerTop = playerBounds.y;
    const playerCenterX = playerBounds.x + playerBounds.width / 2;

    // Check tiles above player when jumping up
    if (this.player.velocity.y < 0) {
      const tileX = Math.floor(playerCenterX / TILE_SIZE);
      const tileY = Math.floor((playerTop - 1) / TILE_SIZE);

      const key = `${tileX},${tileY}`;
      if (this.hitBlocks.has(key)) return;

      const tileType = this.level.tiles[tileY]?.[tileX];

      if (tileType === TileType.QUESTION) {
        this.hitBlock(tileX, tileY);
        this.hitBlocks.add(key);
      } else if (tileType === TileType.BRICK) {
        if (this.player.state !== PlayerState.SMALL) {
          // Break brick
          this.breakBrick(tileX, tileY);
        } else {
          // Bump brick
          this.hitBlock(tileX, tileY);
        }
        this.hitBlocks.add(key);
      }
    }
  }

  private hitBlock(tileX: number, tileY: number): void {
    const key = `${tileX},${tileY}`;
    const content = this.blockContents.get(key);

    // Small screen shake when hitting block
    this.screenShake.shakeSmall();

    // Change question block to used block
    if (this.level.tiles[tileY][tileX] === TileType.QUESTION) {
      this.level.tiles[tileY][tileX] = TileType.USED_BLOCK;
    }

    if (content) {
      const itemX = tileX * TILE_SIZE;
      const itemY = tileY * TILE_SIZE;

      if (content.item === 'coin') {
        const coin = new Coin(itemX, itemY, false);
        coin.startBounce();
        this.items.push(coin);
        this.addScore(200);
        this.gameState.coins++;
        // Coin collect particles
        this.particleSystem.emitCoinCollect(itemX + 8, itemY);
        if (this.gameState.coins >= 100) {
          this.gameState.coins = 0;
          this.gameState.lives++;
        }
      } else {
        switch (content.item) {
          case ItemType.MUSHROOM:
            if (this.player.state === PlayerState.SMALL) {
              this.items.push(new Mushroom(itemX, itemY));
            } else {
              this.items.push(new FireFlower(itemX, itemY));
            }
            break;
          case ItemType.FIRE_FLOWER:
            this.items.push(new FireFlower(itemX, itemY));
            break;
          case ItemType.STAR:
            this.items.push(new Star(itemX, itemY));
            break;
          case ItemType.ONE_UP:
            this.items.push(new OneUp(itemX, itemY));
            break;
        }
      }

      this.blockContents.delete(key);
    }
  }

  private breakBrick(tileX: number, tileY: number): void {
    this.level.tiles[tileY][tileX] = TileType.EMPTY;

    // Create debris
    const brickX = tileX * TILE_SIZE;
    const brickY = tileY * TILE_SIZE;

    this.debris.push(new BrickDebris(brickX, brickY, -2, -6));
    this.debris.push(new BrickDebris(brickX + 8, brickY, 2, -6));
    this.debris.push(new BrickDebris(brickX, brickY + 8, -1.5, -4));
    this.debris.push(new BrickDebris(brickX + 8, brickY + 8, 1.5, -4));

    // Brick break particles and screen shake
    this.particleSystem.emitBrickBreak(brickX + 8, brickY + 8);
    this.screenShake.shakeMedium();

    this.addScore(50);
  }

  private checkCollisions(): void {
    const playerBounds = this.player.getBounds();

    // Enemy collisions
    this.enemies.forEach(enemy => {
      if (!enemy.isActive() || enemy.dying) return;

      const enemyBounds = enemy.getBounds();

      if (Physics.rectanglesIntersect(playerBounds, enemyBounds)) {
        // Check if player is stomping (falling on enemy)
        const playerFalling = this.player.velocity.y > 0;
        const playerAbove = playerBounds.y + playerBounds.height - 8 < enemyBounds.y + enemyBounds.height / 2;

        if (this.player.hasStarPower()) {
          // Star power kills enemy
          enemy.onHit();
          this.addScore(100);
          // Enemy defeat effects
          this.particleSystem.emitEnemyDefeat(enemy.position.x + enemy.width / 2, enemy.position.y + enemy.height / 2);
          this.screenShake.shakeSmall();
        } else if (playerFalling && playerAbove) {
          // Stomp enemy
          const points = enemy.onStomp();
          this.addScore(points);
          this.player.bounce();

          // Stomp effects
          this.particleSystem.emitStomp(enemy.position.x + enemy.width / 2, enemy.position.y);
          this.screenShake.shakeSmall();

          // Kick koopa shell
          if (enemy instanceof Koopa && enemy.isInShell() && !enemy.isShellMoving()) {
            const kickDir = this.player.position.x < enemy.position.x ? Direction.RIGHT : Direction.LEFT;
            enemy.kickShell(kickDir);
          }
        } else {
          // Player takes damage
          // Don't hurt player from stationary koopa shell
          if (enemy instanceof Koopa && enemy.isInShell() && !enemy.isShellMoving()) {
            const kickDir = this.player.position.x < enemy.position.x ? Direction.RIGHT : Direction.LEFT;
            enemy.kickShell(kickDir);
          } else {
            const died = this.player.hurt();
            // Screen shake on damage
            if (died) {
              this.screenShake.shakeLarge();
            } else {
              this.screenShake.shakeMedium();
            }
          }
        }
      }
    });

    // Item collisions
    this.items.forEach(item => {
      if (!item.isActive()) return;

      if (Physics.rectanglesIntersect(playerBounds, item.getBounds())) {
        item.collect();
        const itemCenter = { x: item.position.x + 8, y: item.position.y + 8 };

        switch (item.type) {
          case ItemType.MUSHROOM:
            this.player.grow();
            this.addScore(item.getPoints());
            // Power-up effects
            this.particleSystem.emitPowerUp(this.player.position.x + this.player.width / 2, this.player.position.y);
            break;
          case ItemType.FIRE_FLOWER:
            this.player.getFirePower();
            this.addScore(item.getPoints());
            this.particleSystem.emitPowerUp(this.player.position.x + this.player.width / 2, this.player.position.y);
            break;
          case ItemType.STAR:
            this.player.activateStarPower();
            this.addScore(item.getPoints());
            this.particleSystem.emitPowerUp(this.player.position.x + this.player.width / 2, this.player.position.y);
            break;
          case ItemType.ONE_UP:
            this.gameState.lives++;
            this.particleSystem.emitPowerUp(itemCenter.x, itemCenter.y);
            break;
          case ItemType.COIN:
            this.addScore(item.getPoints());
            this.gameState.coins++;
            this.particleSystem.emitCoinCollect(itemCenter.x, itemCenter.y);
            if (this.gameState.coins >= 100) {
              this.gameState.coins = 0;
              this.gameState.lives++;
            }
            break;
        }
      }
    });

    // Clean up inactive entities
    this.enemies = this.enemies.filter(e => e.isActive());
    this.items = this.items.filter(i => i.isActive());
  }

  private addScore(points: number): void {
    this.gameState.score += points;
  }

  private handleDeath(): void {
    this.gameState.lives--;

    if (this.gameState.lives <= 0) {
      this.gameOver = true;
      this.onGameOver?.();
    } else {
      this.resetLevel();
    }
  }

  private resetLevel(): void {
    this.player.reset(this.level.playerStart.x, this.level.playerStart.y);
    this.camera = { x: 0, y: 0 };
    this.gameState.time = 400;
    this.hitBlocks.clear();

    // Reload block contents
    this.blockContents.clear();
    TEST_LEVEL_BLOCKS.forEach(block => {
      this.blockContents.set(`${block.x},${block.y}`, block);
    });

    // Reset tiles (restore broken bricks and question blocks)
    this.level = { ...TEST_LEVEL, tiles: JSON.parse(JSON.stringify(TEST_LEVEL.tiles)) };

    // Respawn enemies
    this.spawnEnemies();

    // Clear items, debris, and particles
    this.items = [];
    this.debris = [];
    this.particleSystem.clear();
  }

  private completeLevel(): void {
    this.levelComplete = true;
    this.addScore(this.gameState.time * 50); // Time bonus
    this.onLevelComplete?.();
  }

  restart(): void {
    this.gameState = {
      score: 0,
      coins: 0,
      lives: 3,
      time: 400,
      world: '1-1',
      playerState: PlayerState.SMALL
    };
    this.gameOver = false;
    this.levelComplete = false;
    this.paused = false;
    this.resetLevel();
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#5C94FC'; // Sky blue
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context state
    this.ctx.save();

    // Apply scale
    this.ctx.scale(this.scale, this.scale);

    // Apply screen shake offset
    const shakeOffset = this.screenShake.getOffset();
    this.ctx.translate(shakeOffset.x, shakeOffset.y);

    // Draw background decorations
    this.drawBackground();

    // Draw tiles
    this.drawTiles();

    // Draw items
    this.items.forEach(item => {
      if (item.isActive()) {
        item.draw(this.ctx, this.camera, this.spriteRenderer);
      }
    });

    // Draw enemies
    this.enemies.forEach(enemy => {
      if (enemy.isActive()) {
        enemy.draw(this.ctx, this.camera, this.spriteRenderer);
      }
    });

    // Draw player
    this.player.draw(this.ctx, this.camera, this.spriteRenderer, this.frame);

    // Draw debris
    this.debris.forEach(d => d.draw(this.ctx, this.camera));

    // Draw particles
    this.particleSystem.draw(this.ctx, this.camera);

    // Draw flagpole
    if (this.level.flagPosition) {
      this.drawFlagpole();
    }

    // Restore context state
    this.ctx.restore();

    // Draw pause overlay
    if (this.paused) {
      this.drawPauseOverlay();
    }

    // Draw game over overlay
    if (this.gameOver) {
      this.drawGameOverOverlay();
    }

    // Draw level complete overlay
    if (this.levelComplete) {
      this.drawLevelCompleteOverlay();
    }
  }

  private drawBackground(): void {
    // Draw some clouds
    const cloudPositions = [
      { x: 100, y: 40 },
      { x: 300, y: 32 },
      { x: 600, y: 48 },
      { x: 900, y: 36 },
      { x: 1200, y: 44 }
    ];

    cloudPositions.forEach(pos => {
      const screenX = pos.x - this.camera.x;
      if (screenX > -48 && screenX < this.gameWidth) {
        this.spriteRenderer.drawCloud(this.ctx, screenX, pos.y);
      }
    });

    // Draw some hills
    const hillPositions = [
      { x: 0, y: 176, size: 2 },
      { x: 250, y: 192, size: 1 },
      { x: 500, y: 176, size: 2 },
      { x: 750, y: 192, size: 1 },
      { x: 1000, y: 176, size: 2 }
    ];

    hillPositions.forEach(hill => {
      const screenX = hill.x - this.camera.x;
      if (screenX > -128 && screenX < this.gameWidth) {
        this.spriteRenderer.drawHill(this.ctx, screenX, hill.y, hill.size);
      }
    });

    // Draw some bushes
    const bushPositions = [
      { x: 180, y: 192 },
      { x: 430, y: 192 },
      { x: 680, y: 192 },
      { x: 930, y: 192 }
    ];

    bushPositions.forEach(pos => {
      const screenX = pos.x - this.camera.x;
      if (screenX > -48 && screenX < this.gameWidth) {
        this.spriteRenderer.drawBush(this.ctx, screenX, pos.y);
      }
    });
  }

  private drawTiles(): void {
    const startTileX = Math.floor(this.camera.x / TILE_SIZE);
    const endTileX = Math.ceil((this.camera.x + this.gameWidth) / TILE_SIZE);

    for (let y = 0; y < this.level.height; y++) {
      for (let x = startTileX; x <= endTileX; x++) {
        if (x < 0 || x >= this.level.width) continue;

        const tileType = this.level.tiles[y][x];
        if (tileType === TileType.EMPTY) continue;

        const screenX = x * TILE_SIZE - this.camera.x;
        const screenY = y * TILE_SIZE;

        switch (tileType) {
          case TileType.GROUND:
            this.spriteRenderer.drawGroundTile(this.ctx, screenX, screenY);
            break;
          case TileType.BRICK:
            this.spriteRenderer.drawBrickTile(this.ctx, screenX, screenY);
            break;
          case TileType.QUESTION:
            this.spriteRenderer.drawQuestionBlock(this.ctx, screenX, screenY, this.frame);
            break;
          case TileType.USED_BLOCK:
            this.spriteRenderer.drawUsedBlock(this.ctx, screenX, screenY);
            break;
          case TileType.PIPE_TOP_LEFT:
          case TileType.PIPE_TOP_RIGHT:
            if (tileType === TileType.PIPE_TOP_LEFT) {
              this.spriteRenderer.drawPipeTop(this.ctx, screenX, screenY);
            }
            break;
          case TileType.PIPE_BODY_LEFT:
          case TileType.PIPE_BODY_RIGHT:
            if (tileType === TileType.PIPE_BODY_LEFT) {
              this.spriteRenderer.drawPipeBody(this.ctx, screenX, screenY);
            }
            break;
          case TileType.HARD_BLOCK:
            this.spriteRenderer.drawGroundTile(this.ctx, screenX, screenY);
            break;
        }
      }
    }
  }

  private drawFlagpole(): void {
    if (!this.level.flagPosition) return;

    const screenX = this.level.flagPosition.x - this.camera.x;
    const screenY = this.level.flagPosition.y;

    if (screenX > -16 && screenX < this.gameWidth + 16) {
      this.spriteRenderer.drawFlagpole(this.ctx, screenX, screenY, 8);
      this.spriteRenderer.drawFlag(this.ctx, screenX + 10, screenY + 16);
    }
  }

  private drawPauseOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 24px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = '16px monospace';
    this.ctx.fillText('Press ESC or P to continue', this.canvas.width / 2, this.canvas.height / 2 + 30);
  }

  private drawGameOverOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 32px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
  }

  private drawLevelCompleteOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 24px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.font = '18px monospace';
    this.ctx.fillText(`Score: ${this.gameState.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
  }

  // Touch control methods
  setTouchLeft(pressed: boolean): void {
    this.inputHandler.setTouchLeft(pressed);
  }

  setTouchRight(pressed: boolean): void {
    this.inputHandler.setTouchRight(pressed);
  }

  setTouchJump(pressed: boolean): void {
    this.inputHandler.setTouchJump(pressed);
  }

  setTouchRun(pressed: boolean): void {
    this.inputHandler.setTouchRun(pressed);
  }

  resize(width: number, height: number): void {
    // Calculate scale to fit screen while maintaining aspect ratio
    const scaleX = width / this.gameWidth;
    const scaleY = height / this.gameHeight;
    this.scale = Math.min(scaleX, scaleY);

    this.canvas.width = this.gameWidth * this.scale;
    this.canvas.height = this.gameHeight * this.scale;
    this.ctx.imageSmoothingEnabled = false;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  isPaused(): boolean {
    return this.paused;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  isLevelComplete(): boolean {
    return this.levelComplete;
  }
}
