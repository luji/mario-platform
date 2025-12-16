import { LevelData, TileType, EnemyType, ItemType, TILE_SIZE } from '../engine/types';

// Classic World 1-1 inspired level
// 0 = Empty, 1 = Ground, 2 = Brick, 3 = Question, 4 = Used Block
// 5/6 = Pipe Top, 7/8 = Pipe Body, 9 = Hard Block

const T = TileType;

export const LEVEL_1_1: LevelData = {
  width: 212, // tiles wide
  height: 15, // tiles tall (240px screen height / 16px tiles = 15)
  playerStart: { x: 48, y: 192 },
  flagPosition: { x: 3152, y: 48 },
  tiles: [
    // Row 0 (top - sky)
    Array(212).fill(T.EMPTY),
    // Row 1
    Array(212).fill(T.EMPTY),
    // Row 2
    Array(212).fill(T.EMPTY),
    // Row 3 - some clouds (decorative, non-solid)
    Array(212).fill(T.EMPTY),
    // Row 4
    Array(212).fill(T.EMPTY),
    // Row 5
    Array(212).fill(T.EMPTY),
    // Row 6 - question blocks and bricks
    [
      ...Array(16).fill(T.EMPTY),
      T.QUESTION, // Question block with coin
      ...Array(5).fill(T.EMPTY),
      T.BRICK, T.QUESTION, T.BRICK, T.QUESTION, T.BRICK, // Brick-question-brick-question-brick
      ...Array(13).fill(T.EMPTY),
      T.QUESTION, // Hidden mushroom block
      ...Array(173).fill(T.EMPTY)
    ],
    // Row 7
    [
      ...Array(22).fill(T.EMPTY),
      T.QUESTION, // Single question block below
      ...Array(189).fill(T.EMPTY)
    ],
    // Row 8 - some platforms
    [
      ...Array(77).fill(T.EMPTY),
      T.BRICK, T.BRICK, T.BRICK, // Platform
      ...Array(10).fill(T.EMPTY),
      T.BRICK, T.QUESTION, T.BRICK, // Another set
      ...Array(121).fill(T.EMPTY)
    ],
    // Row 9 - pipe tops and platforms
    [
      ...Array(28).fill(T.EMPTY),
      T.PIPE_TOP_LEFT, T.PIPE_TOP_RIGHT, // First pipe
      ...Array(8).fill(T.EMPTY),
      T.PIPE_TOP_LEFT, T.PIPE_TOP_RIGHT, // Second pipe (taller)
      ...Array(10).fill(T.EMPTY),
      T.PIPE_TOP_LEFT, T.PIPE_TOP_RIGHT, // Third pipe
      ...Array(20).fill(T.EMPTY),
      T.PIPE_TOP_LEFT, T.PIPE_TOP_RIGHT, // Fourth pipe
      ...Array(138).fill(T.EMPTY)
    ],
    // Row 10 - pipe bodies
    [
      ...Array(28).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(8).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(10).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(20).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(138).fill(T.EMPTY)
    ],
    // Row 11 - more pipe and staircase start
    [
      ...Array(28).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(8).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(10).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(20).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(30).fill(T.EMPTY),
      // Staircase
      T.HARD_BLOCK,
      ...Array(4).fill(T.EMPTY),
      T.HARD_BLOCK, T.HARD_BLOCK, T.HARD_BLOCK, T.HARD_BLOCK, // descending
      ...Array(15).fill(T.EMPTY),
      // Second staircase (ascending to flag)
      T.HARD_BLOCK,
      ...Array(64).fill(T.EMPTY)
    ],
    // Row 12 - ground level details
    [
      ...Array(28).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(8).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(10).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(20).fill(T.EMPTY),
      T.PIPE_BODY_LEFT, T.PIPE_BODY_RIGHT,
      ...Array(29).fill(T.EMPTY),
      T.HARD_BLOCK, T.HARD_BLOCK,
      ...Array(3).fill(T.EMPTY),
      T.HARD_BLOCK, T.HARD_BLOCK, T.HARD_BLOCK, // descending
      ...Array(16).fill(T.EMPTY),
      T.HARD_BLOCK, T.HARD_BLOCK,
      ...Array(62).fill(T.EMPTY)
    ],
    // Row 13 - ground
    [
      ...Array(69).fill(T.GROUND),
      ...Array(2).fill(T.EMPTY), // Gap/pit
      ...Array(15).fill(T.GROUND),
      ...Array(3).fill(T.EMPTY), // Another gap
      ...Array(123).fill(T.GROUND)
    ],
    // Row 14 - underground ground
    [
      ...Array(69).fill(T.GROUND),
      ...Array(2).fill(T.EMPTY),
      ...Array(15).fill(T.GROUND),
      ...Array(3).fill(T.EMPTY),
      ...Array(123).fill(T.GROUND)
    ]
  ],
  enemies: [
    { type: EnemyType.GOOMBA, x: 352, y: 192 },
    { type: EnemyType.GOOMBA, x: 640, y: 192 },
    { type: EnemyType.GOOMBA, x: 816, y: 192 },
    { type: EnemyType.GOOMBA, x: 848, y: 192 },
    { type: EnemyType.KOOPA, x: 1680, y: 184 },
    { type: EnemyType.GOOMBA, x: 1760, y: 192 },
    { type: EnemyType.GOOMBA, x: 1792, y: 192 }
  ],
  items: [
    // Coins will be spawned from question blocks
  ]
};

// Create a more compact test level for easier testing
export const TEST_LEVEL: LevelData = {
  width: 100,
  height: 15,
  playerStart: { x: 48, y: 176 },
  flagPosition: { x: 1440, y: 48 },
  tiles: createTestLevelTiles(),
  enemies: [
    { type: EnemyType.GOOMBA, x: 200, y: 192 },
    { type: EnemyType.GOOMBA, x: 400, y: 192 },
    { type: EnemyType.KOOPA, x: 600, y: 184 },
    { type: EnemyType.GOOMBA, x: 800, y: 192 },
    { type: EnemyType.GOOMBA, x: 850, y: 192 }
  ],
  items: []
};

function createTestLevelTiles(): number[][] {
  const tiles: number[][] = [];

  // Initialize all rows with empty tiles
  for (let y = 0; y < 15; y++) {
    tiles[y] = Array(100).fill(T.EMPTY);
  }

  // Row 6 - Question blocks (y=6 means 96px from top)
  tiles[6][10] = T.QUESTION; // Coin
  tiles[6][16] = T.BRICK;
  tiles[6][17] = T.QUESTION; // Mushroom
  tiles[6][18] = T.BRICK;
  tiles[6][19] = T.QUESTION; // Coin
  tiles[6][20] = T.BRICK;
  tiles[6][30] = T.QUESTION; // Star
  tiles[6][50] = T.BRICK;
  tiles[6][51] = T.BRICK;
  tiles[6][52] = T.BRICK;

  // Row 8 - Lower platform
  tiles[8][22] = T.QUESTION;

  // Row 9 - Pipes
  tiles[9][24] = T.PIPE_TOP_LEFT;
  tiles[9][25] = T.PIPE_TOP_RIGHT;
  tiles[9][35] = T.PIPE_TOP_LEFT;
  tiles[9][36] = T.PIPE_TOP_RIGHT;
  tiles[9][55] = T.PIPE_TOP_LEFT;
  tiles[9][56] = T.PIPE_TOP_RIGHT;

  // Row 10 - Pipe bodies
  tiles[10][24] = T.PIPE_BODY_LEFT;
  tiles[10][25] = T.PIPE_BODY_RIGHT;
  tiles[10][35] = T.PIPE_BODY_LEFT;
  tiles[10][36] = T.PIPE_BODY_RIGHT;
  tiles[10][55] = T.PIPE_BODY_LEFT;
  tiles[10][56] = T.PIPE_BODY_RIGHT;

  // Row 11 - Pipe bodies and stairs
  tiles[11][24] = T.PIPE_BODY_LEFT;
  tiles[11][25] = T.PIPE_BODY_RIGHT;
  tiles[11][35] = T.PIPE_BODY_LEFT;
  tiles[11][36] = T.PIPE_BODY_RIGHT;
  tiles[11][55] = T.PIPE_BODY_LEFT;
  tiles[11][56] = T.PIPE_BODY_RIGHT;

  // Stairs going up (right side of level)
  tiles[11][85] = T.HARD_BLOCK;
  tiles[10][86] = T.HARD_BLOCK;
  tiles[11][86] = T.HARD_BLOCK;
  tiles[9][87] = T.HARD_BLOCK;
  tiles[10][87] = T.HARD_BLOCK;
  tiles[11][87] = T.HARD_BLOCK;
  tiles[8][88] = T.HARD_BLOCK;
  tiles[9][88] = T.HARD_BLOCK;
  tiles[10][88] = T.HARD_BLOCK;
  tiles[11][88] = T.HARD_BLOCK;
  tiles[7][89] = T.HARD_BLOCK;
  tiles[8][89] = T.HARD_BLOCK;
  tiles[9][89] = T.HARD_BLOCK;
  tiles[10][89] = T.HARD_BLOCK;
  tiles[11][89] = T.HARD_BLOCK;

  // Row 12 - More pipe body
  tiles[12][24] = T.PIPE_BODY_LEFT;
  tiles[12][25] = T.PIPE_BODY_RIGHT;
  tiles[12][35] = T.PIPE_BODY_LEFT;
  tiles[12][36] = T.PIPE_BODY_RIGHT;
  tiles[12][55] = T.PIPE_BODY_LEFT;
  tiles[12][56] = T.PIPE_BODY_RIGHT;

  // Ground (rows 13-14)
  for (let x = 0; x < 100; x++) {
    // Add gaps/pits
    if ((x >= 45 && x <= 47) || (x >= 65 && x <= 67)) {
      continue; // Gap
    }
    tiles[13][x] = T.GROUND;
    tiles[14][x] = T.GROUND;
  }

  return tiles;
}

// Define what's inside question blocks
export interface BlockContent {
  x: number;
  y: number;
  item: ItemType | 'coin';
}

export const LEVEL_1_1_BLOCKS: BlockContent[] = [
  { x: 16, y: 6, item: 'coin' },
  { x: 21, y: 6, item: 'coin' },
  { x: 22, y: 6, item: ItemType.MUSHROOM },
  { x: 23, y: 6, item: 'coin' },
  { x: 24, y: 6, item: 'coin' },
  { x: 22, y: 7, item: 'coin' },
  { x: 37, y: 6, item: ItemType.MUSHROOM }
];

export const TEST_LEVEL_BLOCKS: BlockContent[] = [
  { x: 10, y: 6, item: 'coin' },
  { x: 17, y: 6, item: ItemType.MUSHROOM },
  { x: 19, y: 6, item: 'coin' },
  { x: 22, y: 8, item: 'coin' },
  { x: 30, y: 6, item: ItemType.STAR }
];
