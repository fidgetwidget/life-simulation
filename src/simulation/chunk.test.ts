import { Chunk, ChunkFactory } from './chunk';
import { Root, RootFactory } from './root';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

describe('Chunk', () => {
  test.each([
    {
      root: { x: 0, y: 0, w: 2, h: 2, depth: 1 },
      chunk: { index: 0, x: 1, y: 1, w: 1, h: 1 },
      chunkIndexes: [3],
      chunkNeighbors: [1, 3, 2],
    },
    {
      root: { x: 0, y: 0, w: 8, h: 8, depth: 2 },
      chunk: { index: 0, x: 0, y: 0, w: 2, h: 2 },
      chunkIndexes: [0, 1, 8, 9],
      chunkNeighbors: [1, 5, 4],
    },
  ])(
    `constructor root[$root.x $root.y $root.w $root.h $root.depth] $chunk.index`,
    ({
      root: rootParams,
      chunk: chunkParams,
      chunkIndexes,
      chunkNeighbors,
    }) => {
      const root: Root = RootFactory(rootParams);
      const chunk: Chunk = ChunkFactory({ ...chunkParams, root });

      // chunk aligns to the root it belongs to
      // TODO: throw errors/warnings if the chunk constructed isn't aligned
      expect(root.chunkWidth).toEqual(chunk.w);
      expect(root.chunkHeight).toEqual(chunk.h);
      expect(root.chunks[chunk.index].coord).toEqual(chunk.coord);

      // chunk has the expected values
      expect(chunk.indexes).toEqual(chunkIndexes);
      expect(chunk.neighbors).toEqual(chunkNeighbors);
    },
  );
});
