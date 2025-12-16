export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Sprite {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale?: number): void;
}

export interface Entity {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D, camera: Vector2): void;
  getBounds(): Rectangle;
}

export interface TileData {
  type: TileType;
  solid: boolean;
  breakable?: boolean;
  contents?: ItemType;
}

export enum TileType {
  EMPTY = 0,
  GROUND = 1,
  BRICK = 2,
  QUESTION = 3,
  USED_BLOCK = 4,
  PIPE_TOP_LEFT = 5,
  PIPE_TOP_RIGHT = 6,
  PIPE_BODY_LEFT = 7,
  PIPE_BODY_RIGHT = 8,
  HARD_BLOCK = 9,
  INVISIBLE_BLOCK = 10,
  FLAGPOLE = 11,
  FLAG = 12,
  CLOUD = 13,
  BUSH = 14,
  HILL = 15,
  CASTLE = 16
}

export enum ItemType {
  COIN = 'coin',
  MUSHROOM = 'mushroom',
  FIRE_FLOWER = 'fire_flower',
  STAR = 'star',
  ONE_UP = 'one_up'
}

export enum EnemyType {
  GOOMBA = 'goomba',
  KOOPA = 'koopa',
  PIRANHA = 'piranha'
}

export enum PlayerState {
  SMALL = 'small',
  BIG = 'big',
  FIRE = 'fire'
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1
}

export interface GameState {
  score: number;
  coins: number;
  lives: number;
  time: number;
  world: string;
  playerState: PlayerState;
}

export interface LevelData {
  width: number;
  height: number;
  tiles: number[][];
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  playerStart: Vector2;
  flagPosition?: Vector2;
}

export interface EnemySpawn {
  type: EnemyType;
  x: number;
  y: number;
}

export interface ItemSpawn {
  type: ItemType;
  x: number;
  y: number;
}

export const TILE_SIZE = 16;
export const GRAVITY = 0.5;
export const MAX_FALL_SPEED = 8;
export const PLAYER_WALK_SPEED = 2;
export const PLAYER_RUN_SPEED = 3.5;
export const PLAYER_JUMP_FORCE = -8;
export const PLAYER_BIG_JUMP_FORCE = -9;
