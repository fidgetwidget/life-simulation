import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
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
    expect(qworld.world.w).toEqual(32);
    expect(qworld.world.h).toEqual(32);
    expect(qworld.root.w).toEqual(32);
    expect(qworld.root.h).toEqual(32);
    expect(qworld.root.chunkWidth).toEqual(4);
    expect(qworld.root.chunkHeight).toEqual(4);
    expect(qworld.root.chunksWide).toEqual(8);
    expect(qworld.root.chunksHigh).toEqual(8);
  });

  test.each([
    { w: 32, h: 32, d: 3, get: { x: 0, y: 0, result: 0 } },
    { w: 32, h: 32, d: 3, get: { x: 10, y: 0, result: 2 } },
    { w: 32, h: 32, d: 3, get: { x: 0, y: 10, result: 8 } },
    { w: 32, h: 32, d: 3, get: { x: 10, y: 10, result: 10 } },
  ])(
    `getChunkAtWorld [w:$w h:$h, d:$d] @ x:$get.x y:$get.y `,
    ({ w, h, d, get }) => {
      const qworld = new QWorld(w, h, d);
      const { x, y, result } = get;
      const chunk = qworld.getChunkAtWorld(x, y);
      expect(chunk.index).toBe(result);
    },
  );
});
