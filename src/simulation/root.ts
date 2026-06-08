import { Chunk } from "./chunk";

export class Root {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public chunks: Chunk[];

  // Size should never change after the Root qt is created.
  private size: number; // depth of quad dividing the Root: 1 = 4 Root.

  // how many quads tall or wide is the qt
  get quadLength(): number {
    return 2 ** this.size;
  }

  get chunkWidth(): number {
    return this.w / this.quadLength;
  }

  get chunkHeight(): number {
    return this.h / this.quadLength;
  }

  constructor(x: number, y: number, w: number, h: number, size: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.size = size;
    this.chunks = new Array(4 ** size);
    console.debug("Root:new", {
      x,
      y,
      w,
      h,
      size,
      count: 4 ** size,
      quadLength: 2 ** size,
    });
    const length = this.chunks.length;
    // loop through the number of quad children it has and create the quad
    for (let i = 0; i < length; i++) {
      // Note: something about this is wrong, because it seems to only work right at certain depths...
      const ix = Math.floor(i % this.quadLength);
      const iy = Math.floor(i / this.quadLength);
      const x = Math.floor(this.x + ix * this.chunkWidth);
      const y = Math.floor(this.y + iy * this.chunkHeight);
      const c = new Chunk(i, x, y, this.chunkWidth, this.chunkHeight, this);
      this.chunks[i] = c;
    }
  }

  // get chunk by x,y 2d index
  getChunk(x: number, y: number): Chunk {
    const i = y * this.quadLength + x;
    return this.chunks[i];
  }

  // get a chunk by x,y world position.
  getChunkAt(x: number, y: number): Chunk {
    const lx = Math.floor(x / this.chunkWidth);
    const ly = Math.floor(y / this.chunkHeight);
    return this.getChunk(lx, ly);
  }
}
