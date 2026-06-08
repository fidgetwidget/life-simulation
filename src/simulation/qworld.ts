import type { Chunk } from "./chunk";
import { Root } from "./root";
import { World } from "./world";

export class QWorld {
  public world: World;
  public root: Root;

  constructor(w: number, h: number, depth: number) {
    this.world = new World(w, h);
    this.root = new Root(0, 0, w, h, depth);
  }

  get hasChanges(): boolean {
    return this.world.hasChanges;
  }

  getAt(x: number, y: number): number {
    return this.world.getAt(x, y);
  }

  getChunk(i: number): Chunk {
    return this.root.chunks[i];
  }

  getChunkAt(x: number, y: number): Chunk {
    return this.root.getChunkAt(x, y);
  }

  setAt(x: number, y: number, v: number, forceNext = false): void {
    this.world.setAt(x, y, v, forceNext);
  }

  process(): null | QuadData {
    if (!this.hasChanges) return null;
    const { i, x, y, v } = this.world.process()!;
    return { i, x, y, v };
  }

  render(ctx: CanvasRenderingContext2D, tileSize: number) {
    this.root.chunks.forEach((c) => {
      ctx.strokeStyle = "#efefef";
      let { x, y, w, h } = c;
      x *= tileSize;
      y *= tileSize;
      w *= tileSize;
      h *= tileSize;
      ctx.strokeRect(x, y, w, h);
    });
  }
}
