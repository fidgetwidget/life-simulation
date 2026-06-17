import { Chunk, ChunkFactory } from './chunk';
import { Logger } from '@/lib/Logger';

export interface RootParams {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
}

export const RootFactory = ({ x, y, w, h, depth }: RootParams) =>
  new Root(x, y, w, h, depth);

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

  constructor(x: number, y: number, w: number, h: number, depth: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.depth = depth;
    const quadLength = 2 ** depth;
    const length = quadLength * quadLength;
    if (w < quadLength || h < quadLength)
      throw new Error(
        `cannot divide into < 1 mote Width:${w} Height:${h} / ${quadLength}`,
      );
    this.chunks = Array.from({ length });
    Logger.debug('Root:new', {
      x,
      y,
      w,
      h,
      depth,
      length,
      quadLength,
    });
    // loop through the number of quad children it has and create the quad
    for (let index = 0; index < length; index++) {
      // Note: something about this is wrong, because it seems to only work right at certain depths...
      const w = this.chunkWidth;
      const h = this.chunkHeight;
      const ix = Math.floor(index % this.chunksWide);
      const iy = Math.floor(index / this.chunksWide);
      const xoffset = Math.floor(ix * w);
      const yoffset = Math.floor(iy * h);
      const x = this.x + xoffset;
      const y = this.y + yoffset;
      // Logger.debug(`root:new chunk[${index}]`, {
      //   ix,
      //   iy,
      //   xoffset,
      //   yoffset,
      //   x,
      //   y,
      //   w,
      //   h,
      // });
      const c = ChunkFactory({
        index,
        x,
        y,
        w,
        h,
        root: this,
      });
      // c.forceCache();

      this.chunks[index] = c;
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
      index = y * this.chunksWide + index;
    }
    return this.chunks[index];
  }
}
