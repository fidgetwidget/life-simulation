import type { Chunk } from './chunk';
import { Root } from './root';
import { World } from './world';
import { Logger } from '@/lib/Logger';

/**
 * Provide an interface to a World with Quads/Chunks.
 *
 * TODO: add set methods that impact multiple motes at once (point + radius around it, and point to point lines)
 */
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

  /**
   * get the value via world index.
   */
  getValue(index: number): number;
  /**
   * get the value via world x, y coord index.
   */
  getValue(x: number, y: number): number;

  getValue(x: number, y?: number): number {
    return y === undefined ? this.world.get(x) : this.world.get(x, y);
  }

  /**
   * get chunk via index.
   */
  getChunk(index: number): Chunk {
    return this.root.getChunk(index);
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

  // TODO: update this to support the same syntax as world (support index OR x, y)
  /**
   * set the world value.
   */
  setValue(x: number, y: number, v: number, forceNext = false): void {
    this.world.set(x, y, v, forceNext);
  }

  // TODO: look at ways to limit the world changes in smarter ways
  /**
   * get the next change from the world.
   */
  process(): null | QuadData {
    if (!this.hasChanges) return null;
    const { i, x, y, v } = this.world.process()!;
    Logger.debug('QWorld.process', { i, x, y, v });
    return { i, x, y, v };
  }
}
