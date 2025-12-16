import { Rectangle, Vector2, TileType, TILE_SIZE, GRAVITY, MAX_FALL_SPEED } from './types';

export class Physics {
  static applyGravity(velocity: Vector2, deltaTime: number): Vector2 {
    return {
      x: velocity.x,
      y: Math.min(velocity.y + GRAVITY * deltaTime, MAX_FALL_SPEED)
    };
  }

  static applyFriction(velocity: Vector2, friction: number, deltaTime: number): Vector2 {
    let newVelX = velocity.x;

    if (velocity.x > 0) {
      newVelX = Math.max(0, velocity.x - friction * deltaTime);
    } else if (velocity.x < 0) {
      newVelX = Math.min(0, velocity.x + friction * deltaTime);
    }

    return { x: newVelX, y: velocity.y };
  }

  static rectanglesIntersect(a: Rectangle, b: Rectangle): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static getOverlap(a: Rectangle, b: Rectangle): Vector2 {
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return { x: overlapX, y: overlapY };
  }

  static isTileSolid(tileType: TileType): boolean {
    const solidTiles = [
      TileType.GROUND,
      TileType.BRICK,
      TileType.QUESTION,
      TileType.USED_BLOCK,
      TileType.PIPE_TOP_LEFT,
      TileType.PIPE_TOP_RIGHT,
      TileType.PIPE_BODY_LEFT,
      TileType.PIPE_BODY_RIGHT,
      TileType.HARD_BLOCK
    ];
    return solidTiles.includes(tileType);
  }

  static getTileAtPosition(x: number, y: number, tiles: number[][]): TileType {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    if (tileY < 0 || tileY >= tiles.length || tileX < 0 || tileX >= tiles[0].length) {
      return TileType.EMPTY;
    }

    return tiles[tileY][tileX] as TileType;
  }

  static getTileBounds(tileX: number, tileY: number): Rectangle {
    return {
      x: tileX * TILE_SIZE,
      y: tileY * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE
    };
  }

  static checkTileCollision(
    entity: Rectangle,
    velocity: Vector2,
    tiles: number[][],
    deltaTime: number
  ): { position: Vector2; velocity: Vector2; grounded: boolean; hitCeiling: boolean; collidedTiles: { x: number; y: number; side: string }[] } {
    let newX = entity.x + velocity.x * deltaTime;
    let newY = entity.y + velocity.y * deltaTime;
    let newVelX = velocity.x;
    let newVelY = velocity.y;
    let grounded = false;
    let hitCeiling = false;
    const collidedTiles: { x: number; y: number; side: string }[] = [];

    // Check horizontal collision
    const horizontalBounds: Rectangle = {
      x: newX,
      y: entity.y,
      width: entity.width,
      height: entity.height
    };

    const startTileX = Math.floor(horizontalBounds.x / TILE_SIZE);
    const endTileX = Math.floor((horizontalBounds.x + horizontalBounds.width - 1) / TILE_SIZE);
    const startTileY = Math.floor(horizontalBounds.y / TILE_SIZE);
    const endTileY = Math.floor((horizontalBounds.y + horizontalBounds.height - 1) / TILE_SIZE);

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const tileType = this.getTileAtPosition(tx * TILE_SIZE, ty * TILE_SIZE, tiles);
        if (this.isTileSolid(tileType)) {
          const tileBounds = this.getTileBounds(tx, ty);
          if (this.rectanglesIntersect(horizontalBounds, tileBounds)) {
            if (velocity.x > 0) {
              newX = tileBounds.x - entity.width;
              collidedTiles.push({ x: tx, y: ty, side: 'right' });
            } else if (velocity.x < 0) {
              newX = tileBounds.x + TILE_SIZE;
              collidedTiles.push({ x: tx, y: ty, side: 'left' });
            }
            newVelX = 0;
          }
        }
      }
    }

    // Check vertical collision
    const verticalBounds: Rectangle = {
      x: newX,
      y: newY,
      width: entity.width,
      height: entity.height
    };

    const vStartTileX = Math.floor(verticalBounds.x / TILE_SIZE);
    const vEndTileX = Math.floor((verticalBounds.x + verticalBounds.width - 1) / TILE_SIZE);
    const vStartTileY = Math.floor(verticalBounds.y / TILE_SIZE);
    const vEndTileY = Math.floor((verticalBounds.y + verticalBounds.height - 1) / TILE_SIZE);

    for (let ty = vStartTileY; ty <= vEndTileY; ty++) {
      for (let tx = vStartTileX; tx <= vEndTileX; tx++) {
        const tileType = this.getTileAtPosition(tx * TILE_SIZE, ty * TILE_SIZE, tiles);
        if (this.isTileSolid(tileType)) {
          const tileBounds = this.getTileBounds(tx, ty);
          if (this.rectanglesIntersect(verticalBounds, tileBounds)) {
            if (velocity.y > 0) {
              newY = tileBounds.y - entity.height;
              grounded = true;
              collidedTiles.push({ x: tx, y: ty, side: 'bottom' });
            } else if (velocity.y < 0) {
              newY = tileBounds.y + TILE_SIZE;
              hitCeiling = true;
              collidedTiles.push({ x: tx, y: ty, side: 'top' });
            }
            newVelY = 0;
          }
        }
      }
    }

    return {
      position: { x: newX, y: newY },
      velocity: { x: newVelX, y: newVelY },
      grounded,
      hitCeiling,
      collidedTiles
    };
  }
}
