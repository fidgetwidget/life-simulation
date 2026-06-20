import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vite-plus/test';

import { QWorld } from './qworld';

describe('QWorld', () => {
  let consoleMock: any;

  beforeEach(() => {
    // Intercept and swallow all console.debug calls
    consoleMock = vi.spyOn(console, 'debug').mockImplementation(() => {}); //
  });

  afterEach(() => {
    consoleMock.mockRestore();
  });

  test('constructor', () => {
    const qworld = new QWorld(32, 32, 3);
    // @ts-expect-error access private variable
    const qworldWorld = qworld.world;
    expect(qworldWorld.w).toEqual(32);
    expect(qworldWorld.h).toEqual(32);

    // @ts-expect-error access private variable
    const qworldRoot = qworld.root;
    expect(qworldRoot.w).toEqual(32);
    expect(qworldRoot.h).toEqual(32);
    expect(qworldRoot.chunkWidth).toEqual(4);
    expect(qworldRoot.chunkHeight).toEqual(4);
    expect(qworldRoot.chunksWide).toEqual(8);
    expect(qworldRoot.chunksHigh).toEqual(8);
  });

  // TODO: expand this test to other sized worlds and other depths.
  test.each([
    { w: 32, h: 32, d: 3, get: { x: 0, y: 0, chunkIndex: 0 } },
    { w: 32, h: 32, d: 3, get: { x: 10, y: 0, chunkIndex: 2 } },
    { w: 32, h: 32, d: 3, get: { x: 0, y: 10, chunkIndex: 16 } },
    { w: 32, h: 32, d: 3, get: { x: 10, y: 10, chunkIndex: 18 } },
    { w: 64, h: 64, d: 4, get: { x: 10, y: 10, chunkIndex: 34 } },
    { w: 64, h: 64, d: 3, get: { x: 63, y: 10, chunkIndex: 15 } },
    { w: 128, h: 128, d: 5, get: { x: 10, y: 10, chunkIndex: 66 } },
    { w: 128, h: 128, d: 5, get: { x: 128, y: 120, chunkIndex: 992 } },
  ])(
    `getChunkAtWorld [w:$w h:$h, d:$d] @ x:$get.x y:$get.y `,
    ({ w, h, d, get }) => {
      const qworld = new QWorld(w, h, d);
      const { x, y, chunkIndex: index } = get;
      const chunk = qworld.getChunkAtWorld(x, y);
      expect(chunk.index).toBe(index);
      expect(qworld.chunkCount > chunk.index);
    },
  );
});
