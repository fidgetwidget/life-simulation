import { Logger } from '../lib/Logger';
import { Chunk } from './chunk';

export class Root {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public chunks: Chunk[];

  // Size should never change after the Root qt is created.
  private depth: number; // depth of quad dividing the Root: 1 = 4 Root.

  // how many quads tall or wide is the qt
  get quadLength(): number {
    return 2 ** this.depth;
  }

  get chunksWide(): number {
    return this.quadLength;
  }

  get chunksHigh(): number {
    return this.quadLength;
  }

  get chunkWidth(): number {
    return this.w / this.chunksWide;
  }

  get chunkHeight(): number {
    return this.h / this.chunksHigh;
  }

  constructor(x: number, y: number, w: number, h: number, size: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.depth = size;
    const quadLength = 2 ** size;
    const length = quadLength * quadLength;
    if (w < quadLength || h < quadLength)
      throw new Error(
        `cannot divide into < 1 mote Width:${w} Height:${h} / ${quadLength}`,
      );
    this.chunks = new Array(quadLength);
    Logger.debug('Root:new', {
      x,
      y,
      w,
      h,
      size,
      length,
      quadLength,
    });
    // loop through the number of quad children it has and create the quad
    for (let i = 0; i < length; i++) {
      // Note: something about this is wrong, because it seems to only work right at certain depths...
      const ix = Math.floor(i % this.chunksWide);
      const iy = Math.floor(i / this.chunksWide);
      const x = Math.floor(this.x + ix * this.chunkWidth);
      const y = Math.floor(this.y + iy * this.chunkHeight);
      const c = new Chunk(i, x, y, this.chunkWidth, this.chunkHeight, this);
      c.forceCache();

      this.chunks[i] = c;
    }
  }

  /**
   * get chunk via index.
   */
  getChunk(index: number): Chunk;
  /**
   * get chunk via x, y coord index.
   */
  getChunk(x: number, y: number): Chunk;

  getChunk(index: number, y?: number): Chunk {
    if (y !== undefined) {
      index = y * this.chunkWidth + index;
    }
    return this.chunks[index];
  }
}
