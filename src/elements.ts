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

export enum Biomes {
  OCEAN = 'ocean',
  BEACH = 'beach',
  // plains & others
  DESERT = 'desert',
  FIELDS = 'fields',
  GRASSLAND = 'grassland',
  SHRUBLAND = 'shrubland',
  FOREST = 'forest',
  MARSH = 'marsh',
  // mountains
  SCORCHED = 'scorched',
  BARE = 'bare',
  TUNDRA = 'tundra',
}

export function getBiome(elevation: number, moisture: number, _: number) {
  if (elevation < 0.1) return Biomes.OCEAN;
  if (elevation < 0.2) return Biomes.BEACH;
  if (elevation < 0.3) {
    // plains
    if (moisture < 0.1) return Biomes.DESERT;
    if (moisture < 0.325) return Biomes.FIELDS;
    if (moisture < 0.55) return Biomes.GRASSLAND;
    if (moisture < 0.66) return Biomes.FOREST;
    return Biomes.MARSH;
  }
  if (elevation < 0.5) {
    // hills
    if (moisture < 0.2) return Biomes.DESERT;
    if (moisture < 0.35) return Biomes.FIELDS;
    if (moisture < 0.48) return Biomes.SHRUBLAND;
    if (moisture < 0.8) return Biomes.FOREST;
    return Biomes.MARSH;
  }
  if (elevation < 0.8) {
    // mountains
    if (moisture < 0.1) return Biomes.SCORCHED;
    if (moisture < 0.33) return Biomes.BARE;
  }
  return Biomes.TUNDRA;
}

export const BIOME_COLOR_MAP: Record<string, string> = {
  [Biomes.OCEAN]: '#2a5fb0',
  [Biomes.BEACH]: '#feffcf',
  [Biomes.DESERT]: '#ecedd3',
  [Biomes.FIELDS]: '#83a561',
  [Biomes.GRASSLAND]: '#6b9244',
  [Biomes.SHRUBLAND]: '#4c6e2a',
  [Biomes.FOREST]: '#3e5328',
  [Biomes.MARSH]: '#498c76',
  [Biomes.SCORCHED]: '#be9292',
  [Biomes.BARE]: '#e6e8e8',
  [Biomes.TUNDRA]: '#edf5ff',
};

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
