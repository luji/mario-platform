// Pixel art sprite definitions using canvas drawing
// This creates NES-style Mario sprites programmatically

export const MARIO_COLORS = {
  red: '#B13425',
  darkRed: '#6B1D1D',
  skin: '#E39D75',
  brown: '#6B4423',
  darkBrown: '#3B2310',
  white: '#FFFFFF',
  black: '#000000'
} as const;

export const LUIGI_COLORS = {
  green: '#48A028',
  darkGreen: '#1D5010',
  skin: '#E39D75',
  brown: '#6B4423',
  darkBrown: '#3B2310',
  white: '#FFFFFF',
  black: '#000000'
} as const;

export const TILE_COLORS = {
  brickLight: '#D89868',
  brickDark: '#A85028',
  brickLine: '#000000',
  questionYellow: '#FAC800',
  questionOrange: '#E89800',
  questionDark: '#B86800',
  groundLight: '#D89868',
  groundDark: '#A85028',
  pipeGreen: '#30B020',
  pipeDarkGreen: '#1D6810',
  pipeLight: '#80D878',
  skyBlue: '#5C94FC',
  cloudWhite: '#FFFFFF'
} as const;

export const ENEMY_COLORS = {
  goombaBody: '#D89868',
  goombaDark: '#A85028',
  goombaFeet: '#000000',
  koopaGreen: '#30B020',
  koopaDarkGreen: '#1D6810',
  koopaYellow: '#FAC800',
  koopaShell: '#48A028'
} as const;

export class SpriteRenderer {
  private spriteCache: Map<string, HTMLCanvasElement> = new Map();

  // Draw small Mario standing (16x16)
  drawMarioSmallStand(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1, frame: number = 0): void {
    const key = `mario_small_stand_${direction}_${frame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      // Clear
      sctx.clearRect(0, 0, 16, 16);

      // Mario small sprite (12x16 effective)
      // Hat
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(3, 0, 5, 1);
      sctx.fillRect(2, 1, 8, 1);
      sctx.fillRect(2, 2, 10, 1);

      // Hair and face
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 3, 3, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 3, 2, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(7, 3, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 4, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 4, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(8, 4, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 5, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 5, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 5, 1, 1);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 6, 6, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 6, 2, 1);

      // Body - shirt
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 7, 3, 1);
      sctx.fillRect(6, 7, 3, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 7, 1, 1);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(1, 8, 10, 1);
      sctx.fillRect(1, 9, 10, 1);

      // Belt
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 10, 8, 1);

      // Overalls
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 11, 3, 1);
      sctx.fillRect(7, 11, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(5, 11, 2, 1);

      // Legs
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 12, 4, 2);
      sctx.fillRect(7, 12, 4, 2);

      // Shoes
      sctx.fillStyle = MARIO_COLORS.darkBrown;
      sctx.fillRect(0, 14, 5, 2);
      sctx.fillRect(7, 14, 5, 2);

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw small Mario walking (animated)
  drawMarioSmallWalk(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1, frame: number = 0): void {
    const walkFrame = frame % 3;
    const key = `mario_small_walk_${direction}_${walkFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      // Hat (same as standing)
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(3, 0, 5, 1);
      sctx.fillRect(2, 1, 8, 1);
      sctx.fillRect(2, 2, 10, 1);

      // Face (same as standing)
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 3, 3, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 3, 2, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(7, 3, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 4, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 4, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(8, 4, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 5, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 5, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 5, 1, 1);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 6, 6, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 6, 2, 1);

      // Body
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 7, 3, 1);
      sctx.fillRect(6, 7, 3, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 7, 1, 1);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(1, 8, 10, 1);
      sctx.fillRect(1, 9, 10, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 10, 8, 1);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 11, 3, 1);
      sctx.fillRect(7, 11, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(5, 11, 2, 1);

      // Animated legs based on frame
      if (walkFrame === 0) {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(2, 12, 3, 2);
        sctx.fillRect(8, 12, 3, 2);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(1, 14, 4, 2);
        sctx.fillRect(9, 14, 4, 2);
      } else if (walkFrame === 1) {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(3, 12, 3, 2);
        sctx.fillRect(6, 12, 3, 2);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(2, 14, 4, 2);
        sctx.fillRect(6, 14, 4, 2);
      } else {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(1, 12, 3, 2);
        sctx.fillRect(9, 12, 3, 2);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(0, 14, 4, 2);
        sctx.fillRect(10, 14, 4, 2);
      }

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw small Mario jumping
  drawMarioSmallJump(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1): void {
    const key = `mario_small_jump_${direction}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      // Hat
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(3, 0, 5, 1);
      sctx.fillRect(2, 1, 8, 1);
      sctx.fillRect(2, 2, 10, 1);

      // Face
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 3, 3, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 3, 2, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(7, 3, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 4, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 4, 1, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(5, 4, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(8, 4, 1, 1);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 5, 1, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(4, 5, 2, 1);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 5, 3, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 5, 1, 1);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 6, 6, 1);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(9, 6, 2, 1);

      // Arm raised
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(10, 5, 2, 2);

      // Body
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 7, 8, 3);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 10, 8, 1);

      // Legs spread (jump pose)
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(0, 11, 4, 2);
      sctx.fillRect(8, 11, 4, 2);

      sctx.fillStyle = MARIO_COLORS.darkBrown;
      sctx.fillRect(0, 13, 3, 2);
      sctx.fillRect(10, 13, 3, 2);

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw Big Mario standing (16x32)
  drawMarioBigStand(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1): void {
    const key = `mario_big_stand_${direction}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 32;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 32);

      // Hat
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(4, 0, 6, 2);
      sctx.fillRect(3, 2, 9, 2);
      sctx.fillRect(2, 4, 11, 2);

      // Hair/Face
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(10, 6, 2, 2);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 8, 3, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(4, 8, 7, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 8, 2, 2);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 10, 8, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 10, 2, 2);

      // Body
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 12, 11, 4);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(3, 16, 9, 2);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 18, 4, 4);
      sctx.fillRect(9, 18, 4, 4);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(6, 18, 3, 4);

      // Legs
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 22, 4, 6);
      sctx.fillRect(9, 22, 4, 6);

      // Shoes
      sctx.fillStyle = MARIO_COLORS.darkBrown;
      sctx.fillRect(1, 28, 5, 4);
      sctx.fillRect(9, 28, 5, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw Big Mario walking (animated)
  drawMarioBigWalk(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1, frame: number = 0): void {
    const walkFrame = frame % 3;
    const key = `mario_big_walk_${direction}_${walkFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 32;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 32);

      // Hat
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(4, 0, 6, 2);
      sctx.fillRect(3, 2, 9, 2);
      sctx.fillRect(2, 4, 11, 2);

      // Hair/Face
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(10, 6, 2, 2);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 8, 3, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(4, 8, 7, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 8, 2, 2);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 10, 8, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 10, 2, 2);

      // Body
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 12, 11, 4);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(3, 16, 9, 2);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 18, 4, 4);
      sctx.fillRect(9, 18, 4, 4);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(6, 18, 3, 4);

      // Animated legs
      if (walkFrame === 0) {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(3, 22, 3, 6);
        sctx.fillRect(10, 22, 3, 6);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(2, 28, 4, 4);
        sctx.fillRect(10, 28, 4, 4);
      } else if (walkFrame === 1) {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(4, 22, 3, 6);
        sctx.fillRect(8, 22, 3, 6);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(4, 28, 4, 4);
        sctx.fillRect(8, 28, 4, 4);
      } else {
        sctx.fillStyle = MARIO_COLORS.brown;
        sctx.fillRect(2, 22, 3, 6);
        sctx.fillRect(11, 22, 3, 6);
        sctx.fillStyle = MARIO_COLORS.darkBrown;
        sctx.fillRect(1, 28, 4, 4);
        sctx.fillRect(11, 28, 4, 4);
      }

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw Big Mario jumping
  drawMarioBigJump(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1): void {
    const key = `mario_big_jump_${direction}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 32;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 32);

      // Hat
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(4, 0, 6, 2);
      sctx.fillRect(3, 2, 9, 2);
      sctx.fillRect(2, 4, 11, 2);

      // Face
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(2, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(6, 6, 4, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(10, 6, 2, 2);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(1, 8, 3, 2);
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(4, 8, 7, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 8, 2, 2);

      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(3, 10, 8, 2);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(11, 10, 2, 2);

      // Arm raised
      sctx.fillStyle = MARIO_COLORS.skin;
      sctx.fillRect(13, 8, 2, 3);

      // Body
      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 12, 11, 4);

      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(3, 16, 9, 2);

      sctx.fillStyle = MARIO_COLORS.red;
      sctx.fillRect(2, 18, 4, 4);
      sctx.fillRect(9, 18, 4, 4);
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(6, 18, 3, 4);

      // Jump pose - legs spread
      sctx.fillStyle = MARIO_COLORS.brown;
      sctx.fillRect(0, 22, 4, 5);
      sctx.fillRect(11, 22, 4, 5);

      sctx.fillStyle = MARIO_COLORS.darkBrown;
      sctx.fillRect(0, 27, 3, 4);
      sctx.fillRect(13, 27, 3, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw Ground tile
  drawGroundTile(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'ground_tile';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      // Brown ground with brick pattern
      sctx.fillStyle = TILE_COLORS.groundDark;
      sctx.fillRect(0, 0, 16, 16);

      sctx.fillStyle = TILE_COLORS.groundLight;
      sctx.fillRect(1, 1, 6, 6);
      sctx.fillRect(9, 1, 6, 6);
      sctx.fillRect(1, 9, 6, 6);
      sctx.fillRect(9, 9, 6, 6);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Brick tile
  drawBrickTile(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'brick_tile';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      // Brick pattern
      sctx.fillStyle = TILE_COLORS.brickDark;
      sctx.fillRect(0, 0, 16, 16);

      sctx.fillStyle = TILE_COLORS.brickLight;
      // Top row of bricks
      sctx.fillRect(1, 1, 6, 6);
      sctx.fillRect(9, 1, 6, 6);
      // Bottom row (offset)
      sctx.fillRect(1, 9, 3, 6);
      sctx.fillRect(5, 9, 6, 6);
      sctx.fillRect(12, 9, 3, 6);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Question Block (animated)
  drawQuestionBlock(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number = 0): void {
    const animFrame = Math.floor(frame / 10) % 4;
    const key = `question_block_${animFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      // Background
      const colors = [TILE_COLORS.questionYellow, TILE_COLORS.questionOrange, TILE_COLORS.questionDark, TILE_COLORS.questionOrange];
      sctx.fillStyle = colors[animFrame];
      sctx.fillRect(0, 0, 16, 16);

      // Border
      sctx.fillStyle = TILE_COLORS.questionDark;
      sctx.fillRect(0, 0, 16, 2);
      sctx.fillRect(0, 14, 16, 2);
      sctx.fillRect(0, 0, 2, 16);
      sctx.fillRect(14, 0, 2, 16);

      // Question mark
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 3, 6, 2);
      sctx.fillRect(9, 5, 2, 2);
      sctx.fillRect(7, 7, 2, 2);
      sctx.fillRect(7, 9, 2, 2);
      sctx.fillRect(7, 12, 2, 2);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Used Block (empty question block)
  drawUsedBlock(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'used_block';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      sctx.fillStyle = '#8B4513';
      sctx.fillRect(0, 0, 16, 16);

      sctx.fillStyle = '#654321';
      sctx.fillRect(0, 0, 16, 2);
      sctx.fillRect(0, 14, 16, 2);
      sctx.fillRect(0, 0, 2, 16);
      sctx.fillRect(14, 0, 2, 16);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Pipe (top section)
  drawPipeTop(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'pipe_top';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 32;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      // Main pipe color
      sctx.fillStyle = TILE_COLORS.pipeGreen;
      sctx.fillRect(0, 0, 32, 16);

      // Highlights
      sctx.fillStyle = TILE_COLORS.pipeLight;
      sctx.fillRect(2, 0, 4, 16);

      // Dark edge
      sctx.fillStyle = TILE_COLORS.pipeDarkGreen;
      sctx.fillRect(0, 0, 2, 16);
      sctx.fillRect(30, 0, 2, 16);
      sctx.fillRect(26, 0, 4, 16);

      // Top lip
      sctx.fillStyle = TILE_COLORS.pipeGreen;
      sctx.fillRect(0, 0, 32, 4);
      sctx.fillStyle = TILE_COLORS.pipeLight;
      sctx.fillRect(2, 0, 6, 4);
      sctx.fillStyle = TILE_COLORS.pipeDarkGreen;
      sctx.fillRect(0, 0, 2, 4);
      sctx.fillRect(30, 0, 2, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Pipe body section
  drawPipeBody(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'pipe_body';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 32;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;

      sctx.fillStyle = TILE_COLORS.pipeGreen;
      sctx.fillRect(2, 0, 28, 16);

      sctx.fillStyle = TILE_COLORS.pipeLight;
      sctx.fillRect(4, 0, 4, 16);

      sctx.fillStyle = TILE_COLORS.pipeDarkGreen;
      sctx.fillRect(2, 0, 2, 16);
      sctx.fillRect(28, 0, 2, 16);
      sctx.fillRect(24, 0, 4, 16);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Goomba
  drawGoomba(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number = 0): void {
    const walkFrame = Math.floor(frame / 8) % 2;
    const key = `goomba_${walkFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      // Body (mushroom shape)
      sctx.fillStyle = ENEMY_COLORS.goombaBody;
      sctx.fillRect(3, 0, 10, 4);
      sctx.fillRect(2, 4, 12, 4);
      sctx.fillRect(1, 8, 14, 4);

      // Dark underside
      sctx.fillStyle = ENEMY_COLORS.goombaDark;
      sctx.fillRect(3, 12, 10, 2);

      // Eyes
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(4, 4, 3, 4);
      sctx.fillRect(9, 4, 3, 4);
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 5, 2, 3);
      sctx.fillRect(10, 5, 2, 3);

      // Eyebrows (angry)
      sctx.fillStyle = '#000000';
      sctx.fillRect(4, 3, 3, 1);
      sctx.fillRect(9, 3, 3, 1);

      // Feet
      sctx.fillStyle = ENEMY_COLORS.goombaFeet;
      if (walkFrame === 0) {
        sctx.fillRect(2, 14, 4, 2);
        sctx.fillRect(10, 14, 4, 2);
      } else {
        sctx.fillRect(1, 14, 4, 2);
        sctx.fillRect(11, 14, 4, 2);
      }

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Goomba (squashed)
  drawGoombaSquashed(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'goomba_squashed';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 8;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 8);

      sctx.fillStyle = ENEMY_COLORS.goombaDark;
      sctx.fillRect(2, 4, 12, 4);

      sctx.fillStyle = ENEMY_COLORS.goombaBody;
      sctx.fillRect(3, 2, 10, 2);

      // Squished eyes
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(4, 0, 3, 2);
      sctx.fillRect(9, 0, 3, 2);
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 0, 2, 2);
      sctx.fillRect(10, 0, 2, 2);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y + 8);
  }

  // Draw Koopa Troopa
  drawKoopa(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number = 1, frame: number = 0): void {
    const walkFrame = Math.floor(frame / 8) % 2;
    const key = `koopa_${direction}_${walkFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 24;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 24);

      // Head
      sctx.fillStyle = ENEMY_COLORS.koopaYellow;
      sctx.fillRect(8, 0, 6, 6);

      // Eye
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(10, 1, 3, 3);
      sctx.fillStyle = '#000000';
      sctx.fillRect(11, 2, 2, 2);

      // Shell
      sctx.fillStyle = ENEMY_COLORS.koopaGreen;
      sctx.fillRect(2, 6, 12, 12);
      sctx.fillRect(4, 4, 8, 2);

      // Shell pattern
      sctx.fillStyle = ENEMY_COLORS.koopaDarkGreen;
      sctx.fillRect(4, 8, 8, 2);
      sctx.fillRect(4, 12, 8, 2);

      // Shell belly
      sctx.fillStyle = ENEMY_COLORS.koopaYellow;
      sctx.fillRect(5, 16, 6, 2);

      // Feet
      sctx.fillStyle = ENEMY_COLORS.koopaYellow;
      if (walkFrame === 0) {
        sctx.fillRect(2, 18, 4, 6);
        sctx.fillRect(10, 20, 4, 4);
      } else {
        sctx.fillRect(2, 20, 4, 4);
        sctx.fillRect(10, 18, 4, 6);
      }

      this.spriteCache.set(key, sprite);
    }

    ctx.save();
    if (direction === -1) {
      ctx.translate(x + 16, y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, x, y);
    }
    ctx.restore();
  }

  // Draw Koopa Shell
  drawKoopaShell(ctx: CanvasRenderingContext2D, x: number, y: number, spinning: boolean = false, frame: number = 0): void {
    const spinFrame = spinning ? Math.floor(frame / 4) % 4 : 0;
    const key = `koopa_shell_${spinFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      // Shell
      sctx.fillStyle = ENEMY_COLORS.koopaGreen;
      sctx.fillRect(2, 2, 12, 12);
      sctx.fillRect(4, 0, 8, 2);
      sctx.fillRect(4, 14, 8, 2);

      // Shell pattern (rotates when spinning)
      sctx.fillStyle = ENEMY_COLORS.koopaDarkGreen;
      if (spinFrame === 0 || spinFrame === 2) {
        sctx.fillRect(4, 4, 8, 2);
        sctx.fillRect(4, 10, 8, 2);
      } else {
        sctx.fillRect(4, 6, 8, 4);
      }

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Coin
  drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number = 0): void {
    const animFrame = Math.floor(frame / 8) % 4;
    const key = `coin_${animFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      const widths = [8, 4, 8, 4];
      const width = widths[animFrame];
      const xOffset = (16 - width) / 2;

      sctx.fillStyle = '#FAC800';
      sctx.fillRect(xOffset, 2, width, 12);

      sctx.fillStyle = '#E89800';
      sctx.fillRect(xOffset, 0, width, 2);
      sctx.fillRect(xOffset, 14, width, 2);
      sctx.fillRect(xOffset, 2, 2, 12);
      sctx.fillRect(xOffset + width - 2, 2, 2, 12);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Mushroom
  drawMushroom(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'mushroom';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      // Cap
      sctx.fillStyle = '#FF0000';
      sctx.fillRect(2, 0, 12, 8);
      sctx.fillRect(0, 4, 16, 4);

      // White spots
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(3, 1, 4, 4);
      sctx.fillRect(9, 1, 4, 4);
      sctx.fillRect(6, 5, 4, 2);

      // Stem
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(4, 8, 8, 8);

      // Eyes
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 10, 2, 3);
      sctx.fillRect(9, 10, 2, 3);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Fire Flower
  drawFireFlower(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number = 0): void {
    const animFrame = Math.floor(frame / 8) % 4;
    const key = `fire_flower_${animFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      const colors = ['#FF0000', '#FF8800', '#FFFF00', '#FF8800'];

      // Petals
      sctx.fillStyle = colors[animFrame];
      sctx.fillRect(6, 0, 4, 4);
      sctx.fillRect(0, 4, 4, 4);
      sctx.fillRect(12, 4, 4, 4);
      sctx.fillRect(6, 8, 4, 4);

      // Center
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(5, 4, 6, 4);

      // Eyes
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 5, 2, 2);
      sctx.fillRect(9, 5, 2, 2);

      // Stem
      sctx.fillStyle = '#00AA00';
      sctx.fillRect(6, 12, 4, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Star
  drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number = 0): void {
    const animFrame = Math.floor(frame / 4) % 4;
    const key = `star_${animFrame}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 16;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 16, 16);

      const colors = ['#FAC800', '#FFFFFF', '#FAC800', '#E89800'];

      // Star shape
      sctx.fillStyle = colors[animFrame];
      sctx.fillRect(6, 0, 4, 4);
      sctx.fillRect(0, 4, 16, 4);
      sctx.fillRect(2, 8, 12, 4);
      sctx.fillRect(4, 12, 3, 4);
      sctx.fillRect(9, 12, 3, 4);

      // Eyes
      sctx.fillStyle = '#000000';
      sctx.fillRect(5, 5, 2, 2);
      sctx.fillRect(9, 5, 2, 2);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Cloud
  drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'cloud';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 48;
      sprite.height = 32;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 48, 32);

      sctx.fillStyle = TILE_COLORS.cloudWhite;
      // Main cloud shape
      sctx.fillRect(8, 8, 32, 16);
      sctx.fillRect(4, 12, 8, 8);
      sctx.fillRect(36, 12, 8, 8);
      sctx.fillRect(16, 4, 16, 8);
      sctx.fillRect(12, 24, 24, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Bush
  drawBush(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'bush';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 48;
      sprite.height = 16;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 48, 16);

      sctx.fillStyle = '#00AA00';
      sctx.fillRect(4, 8, 40, 8);
      sctx.fillRect(8, 4, 32, 8);
      sctx.fillRect(16, 0, 16, 8);

      // Lighter spots
      sctx.fillStyle = '#00DD00';
      sctx.fillRect(12, 4, 8, 4);
      sctx.fillRect(28, 4, 8, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Hill (background)
  drawHill(ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 1): void {
    const key = `hill_${size}`;
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      const width = 64 * size;
      const height = 32 * size;
      sprite = document.createElement('canvas');
      sprite.width = width;
      sprite.height = height;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, width, height);

      sctx.fillStyle = '#00AA00';
      // Simple triangular hill
      for (let row = 0; row < height; row++) {
        const rowWidth = (width * (height - row)) / height;
        const xStart = (width - rowWidth) / 2;
        sctx.fillRect(xStart, row, rowWidth, 1);
      }

      // Spots
      sctx.fillStyle = '#009900';
      sctx.fillRect(width / 2 - 4, height / 2, 8, 4);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }

  // Draw Flagpole
  drawFlagpole(ctx: CanvasRenderingContext2D, x: number, y: number, height: number = 10): void {
    // Pole
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(x + 6, y, 4, height * 16);

    // Ball on top
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(x + 4, y - 8, 8, 8);

    // Base
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(x, y + height * 16 - 16, 16, 16);
  }

  // Draw Flag
  drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(x, y, 16, 16);
    ctx.fillRect(x + 16, y + 4, 8, 8);
  }

  // Draw Castle
  drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const key = 'castle';
    let sprite = this.spriteCache.get(key);

    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = 80;
      sprite.height = 80;
      const sctx = sprite.getContext('2d')!;
      sctx.clearRect(0, 0, 80, 80);

      // Main building
      sctx.fillStyle = '#8B4513';
      sctx.fillRect(8, 32, 64, 48);

      // Tower
      sctx.fillRect(24, 8, 32, 24);

      // Battlements
      sctx.fillRect(8, 24, 8, 8);
      sctx.fillRect(24, 24, 8, 8);
      sctx.fillRect(48, 24, 8, 8);
      sctx.fillRect(64, 24, 8, 8);

      sctx.fillRect(24, 0, 8, 8);
      sctx.fillRect(48, 0, 8, 8);

      // Door
      sctx.fillStyle = '#000000';
      sctx.fillRect(32, 56, 16, 24);

      // Windows
      sctx.fillRect(16, 40, 8, 12);
      sctx.fillRect(56, 40, 8, 12);
      sctx.fillRect(36, 16, 8, 8);

      this.spriteCache.set(key, sprite);
    }

    ctx.drawImage(sprite, x, y);
  }
}
