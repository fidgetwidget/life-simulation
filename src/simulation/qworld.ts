// import { Logger } from "@/lib/Logger";
import { XY } from '@/util';

import type { Entity } from './entity';
import type { Chunk } from './structure/chunk';
import { Root } from './structure/root';
import { World } from './structure/world';

/**
 * Provide an interface to a World with Quads/Chunks.
 *
 * TODO: add set methods that impact multiple motes at once (point + radius around it, and point to point lines)
 */
export class QWorld {
  private world: World;
  private root: Root;
  public entities: Entity[];

  get min() {
    if (!this._min) {
      this._min = Object.freeze(XY(0, 0));
    }
    return this._min;
  }

  get max() {
    if (!this._max) {
      this._max = Object.freeze(XY(this.world.w, this.world.h));
    }
    return this._max;
  }

  get chunkCount() {
    return this.root.chunks.length;
  }

  get chunks() {
    return this.root.chunks;
  }

  constructor(w: number, h: number, depth: number) {
    this.world = new World(w, h);
    this.root = new Root(0, 0, w, h, depth);
    this.entities = [];
  }

  get hasChanges(): boolean {
    return this.world.hasChanges;
  }

  getIndex(x: number, y: number): number {
    return this.world.getIndex(x, y);
  }

  getXY(index: number): XY {
    return this.world.getXY(index);
  }

  /**
   * get the value via world index.
   */
  getValue(index: number): number;
  /**
   * get the value via world x, y coord index.
   */
  getValue(x: number, y: number): number;

  getValue(): number {
    const [index, y] = arguments;
    return this.world.get(index, y);
  }

  /**
   * set the world value via index.
   */
  setValue(index: number, value: number, forceNext?: boolean): void;
  /**
   * set the world value via x, y coord index.
   */
  setValue(x: number, y: number, value: number, forceNext?: boolean): void;

  setValue(): void {
    const [index, y, v, forceNext] = arguments;
    this.world.set(index, y, v, forceNext);
  }

  getNeighborValues(index: number, eightWay?: boolean): number[];
  getNeighborValues(x: number, y: number, eightWay?: boolean): number[];

  getNeighborValues(): number[] {
    const [x, y, eightWay] = arguments;
    return this.world.getNeighborValues(x, y, eightWay);
  }

  getNeighbors(index: number, eightWay?: boolean, wrap?: boolean): number[];
  getNeighbors(
    x: number,
    y: number,
    eightWay?: boolean,
    wrap?: boolean,
  ): number[];

  // get the neighbors values for a given index.
  getNeighbors(): number[] {
    const [x, y, eightWay, wrap] = arguments;
    return this.world.getNeighbors(x, y, eightWay, wrap);
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
    return this.getChunkAtLocal(lx, ly);
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  /**
   * get the next change from the world.
   */
  process(): null | ChangeData {
    if (!this.hasChanges) return null;
    const { i, x, y, v } = this.world.process()!;
    return { i, x, y, v };
  }

  private _min!: XY;
  private _max!: XY;
}
