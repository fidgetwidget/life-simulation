import { describe, expect, test } from 'vite-plus/test';

import { XY } from '@/util';

import { Chunk, ChunkFactory } from './chunk';
import { Root, RootFactory } from './root';

describe('Chunk', () => {
  test.each([
    {
      root: { x: 0, y: 0, w: 8, h: 8, depth: 1 },
      chunk: { index: 0, x: 0, y: 0, w: 4, h: 4 },
      chunkIndexes: [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27],
      chunkNCoords: [XY(1, 0), XY(1, 1), XY(0, 1)],
      chunkNeighbors: [1, 3, 2],
    },
    {
      root: { x: 0, y: 0, w: 8, h: 8, depth: 2 },
      chunk: { index: 1, x: 2, y: 0, w: 2, h: 2 },
      chunkIndexes: [2, 3, 10, 11],
      chunkNCoords: [XY(2, 0), XY(2, 1), XY(1, 1), XY(0, 1), XY(0, 0)],
      chunkNeighbors: [2, 6, 5, 4, 0],
    },
  ])(
    `constructor root[$root.x $root.y $root.w $root.h $root.depth] $chunk.index`,
    ({
      root: rootParams,
      chunk: chunkParams,
      chunkIndexes,
      chunkNCoords,
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
      expect(chunk.neighborCoords).toEqual(chunkNCoords);
      expect(chunk.neighbors).toEqual(chunkNeighbors);
    },
  );
});
