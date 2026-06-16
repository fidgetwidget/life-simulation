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
import { Root, RootFactory, type RootParams } from './root';
import { XY } from '../util/XY';

describe.only('Root', () => {
  test.each([
    {
      //    x-→ 0  .  .  .
      //      +------------+
      //  0 y | 0  .  .  . |
      //  . ↓ | .  .  .  . |
      //  .   | .  .  .  . |
      //  .   | .  .  .  . |
      //      +------------+
      root: { x: 0, y: 0, w: 4, h: 4, depth: 0 },
      chunks: [{ index: 0, coord: XY.Zero, x: 0, y: 0, w: 4, h: 4 }],
    },
    {
      //    x-→ 0  .  1  .
      //      +------------+
      //  0 y | 0  .  1  . |
      //  . ↓ | .  .  .  . |
      //  1   | 2  .  3  . |
      //  .   | .  .  .  . |
      //      +------------+
      root: { x: 0, y: 0, w: 4, h: 4, depth: 1 },
      chunks: [
        { index: 0, coord: XY(0, 0), x: 0, y: 0, w: 2, h: 2 },
        { index: 1, coord: XY(1, 0), x: 2, y: 0, w: 2, h: 2 },
        { index: 2, coord: XY(0, 1), x: 0, y: 2, w: 2, h: 2 },
        { index: 3, coord: XY(1, 1), x: 2, y: 2, w: 2, h: 2 },
      ],
    },
    {
      //    x-→ 0 . . . 1 . . . .
      //      +-------------------+
      //  0 y | 0 . . . 1 . . . . |
      //  . ↓ | . . . . . . . . . |
      //  .   | . . . . . . . . . |
      //  1   | 2 . . . 3 . . . . |
      //  .   | . . . . . . . . . |
      //  .   | . . . . . . . . . |
      //      +-------------------+
      root: { x: 0, y: 0, w: 8, h: 8, depth: 1 },
      chunks: [
        { index: 0, coord: XY(0, 0), x: 0, y: 0, w: 4, h: 4 },
        { index: 1, coord: XY(1, 0), x: 4, y: 0, w: 4, h: 4 },
        { index: 2, coord: XY(0, 1), x: 0, y: 4, w: 4, h: 4 },
        { index: 3, coord: XY(1, 1), x: 4, y: 4, w: 4, h: 4 },
      ],
    },
    {
      //    x-→ 0  .  1  .
      //      +------------+
      //  0 y | 0  .  1  . |
      //  . ↓ | .  .  .  . |
      //  1   | 2  .  3  . |
      //  .   | .  .  .  . |
      //      +------------+
      root: { x: 0, y: 0, w: 16, h: 16, depth: 1 },
      chunks: [
        { index: 0, coord: XY(0, 0), x: 0, y: 0, w: 8, h: 8 },
        { index: 1, coord: XY(1, 0), x: 8, y: 0, w: 8, h: 8 },
        { index: 2, coord: XY(0, 1), x: 0, y: 8, w: 8, h: 8 },
        { index: 3, coord: XY(1, 1), x: 8, y: 8, w: 8, h: 8 },
      ],
    },
  ])(
    `constructor: root[$root.x $root.y $root.w $root.h $root.depth]`,
    ({ root: rootParams, chunks }) => {
      const root: Root = RootFactory(rootParams);
      expect(root.chunks.length).toBe(root.chunksHigh * root.chunksWide);
      expect(root.quadLength).toBe(2 ** rootParams.depth);
      expect(root.chunks.length).toEqual(chunks.length);
      expect(
        root.chunks.map(({ index, coord, x, y, w, h }) => ({
          index,
          coord,
          x,
          y,
          w,
          h,
        })),
      ).toEqual(chunks);
    },
  );

  //  chunk (depth of 2 on 16 is 4)
  //  x -→   0    1    2    3
  //      +-------------------
  //  0 y |  0 |  1 |  2 |  3
  //  1 ↓ |  4 |  5 |  6 |  7
  //  2   |  8 |  9 | 10 | 11
  //  3   | 12 | 13 | 14 | 15
  //      +-------------------
  describe('chunk', () => {
    test.each([
      {
        root: { x: 0, y: 0, w: 16, h: 16, depth: 2 },
        i: 0,
        result: [1, 5, 4],
      },
      {
        root: { x: 0, y: 0, w: 8, h: 16, depth: 2 },
        i: 0,
        result: [1, 5, 4],
      },
      {
        root: { x: 0, y: 0, w: 8, h: 16, depth: 2 },
        i: 1,
        result: [2, 6, 5, 4, 0],
      },
      {
        root: { x: 0, y: 0, w: 32, h: 32, depth: 3 },
        i: 1,
        result: [2, 10, 9, 8, 0],
      },
    ])(
      'root { x:$root.x y:$root.y w:$root.w h:$root.h depth:$root.depth }: chunk[$i]:neighbors',
      ({ root: rootParams, i, result }) => {
        const root: Root = RootFactory(rootParams);
        const chunk = root.chunks[i];
        expect(chunk.neighbors).toEqual(result);
      },
    );
  });

  describe('getChunk', () => {
    test.each([
      { index: 0, x: 0, y: 0 },
      { index: 1, x: 1, y: 0 },
      // { index: 1, x: 4, y: 4 },
    ])('xy and index work the same way', ({ index, x, y }) => {
      const root: Root = RootFactory({ x: 0, y: 0, w: 32, h: 32, depth: 3 });
      expect(index).toBeLessThan(root.chunks.length);
      expect(root.getChunk(x, y).index).toEqual(index);
      expect(root.getChunk(index).coord).toEqual({ x, y });
    });
  });
});
