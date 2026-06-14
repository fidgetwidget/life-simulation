import { Logger } from '../lib/Logger';
import type { Chunk } from './chunk';
import { Root } from './root';
import { World } from './world';

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
    return this.world.get(x, y);
  }

  /**
   * get chunk via index.
   */
  getChunk(i: number): Chunk {
    return this.root.getChunk(i);
  }

  /**
   * get chunk via x, y coord index.
   */
  getChunkAtLocal(x: number, y: number): Chunk {
    return this.root.getChunk(x, y);
  }

  /**
   * get chunk via x, y world position.
   */
  getChunkAtWorld(x: number, y: number): Chunk {
    const lx = Math.floor(x / this.root.chunkWidth);
    const ly = Math.floor(y / this.root.chunkHeight);
    Logger.debug('QWorld:getChunkAtWorld', { x, y, lx, ly });
    return this.getChunkAtLocal(lx, ly);
  }

  setAt(x: number, y: number, v: number, forceNext = false): void {
    this.world.setAt(x, y, v, forceNext);
  }

  process(): null | QuadData {
    if (!this.hasChanges) return null;
    const { i, x, y, v } = this.world.process()!;
    return { i, x, y, v };
  }
}
