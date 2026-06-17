export enum Elements {
  EMPTY = 0,

  SAPLING = 5,
  TREE_TRUNK = 6,
  TREE = 7,
  ROOTS = 10,

  GRASS = 20,
  TALL_GRASS = 21,

  FLOWERS = 25,

  STILL_WATER = 50,
  MOVING_WATER = 60,
}

export const MOTE_COLOR_MAP: Record<number, string> = {
  [Elements.EMPTY]: '#fdebb6',

  [Elements.SAPLING]: '#9bff9d',
  [Elements.TREE_TRUNK]: '#4f4536',
  [Elements.TREE]: '#6d604d',
  [Elements.ROOTS]: '#848275',

  [Elements.GRASS]: '#83a561',
  [Elements.TALL_GRASS]: '#6b9244',

  [Elements.FLOWERS]: '#ffff66',

  [Elements.STILL_WATER]: '#2a5fb0',
  [Elements.MOVING_WATER]: '#2a83b0',
};
