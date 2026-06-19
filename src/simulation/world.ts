import { Logger } from '@/lib/Logger';
import { getNeighbors, XY } from '@/util';

export class World {
  private _w: number;
  private _h: number;
  private motes: Array<number> = [];
  private changes: Array<number> = [];

  get w(): number {
    return this._w;
  }

  get h(): number {
    return this._h;
  }

  get hasChanges(): boolean {
    return this.changes.length > 0;
  }

  // TODO: support generics for value
  constructor(w: number, h: number) {
    this._w = w;
    this._h = h;
    const length = w * h;
    this.motes = Array.from({ length });
    this.motes.fill(0);
    Logger.debug('World:new', { w, h, length, v: this.motes });
  }

  getIndex(x: number, y: number): number {
    return y * this.w + x;
  }

  getXY(index: number): XY {
    const y = Math.floor(index / this.w);
    const x = Math.floor(index % this.w);
    return XY(x, y);
  }

  /**
   * get value via index.
   */
  get(index: number): number;
  /**
   * get value via x, y coord index.
   */
  get(x: number, y: number): number;

  get(index: number, y?: number): number {
    if (y !== undefined) {
      index = y * this.w + index;
    }
    return this.motes[index];
  }

  getNeighborValues(index: number, eightWay?: boolean): number[];
  getNeighborValues(x: number, y: number, eightWay?: boolean): number[];

  getNeighborValues(
    x: number,
    y?: number | boolean,
    eightWay: boolean = true,
  ): number[] {
    let index: number;
    if (y === undefined || typeof y === 'boolean') {
      if (typeof y === 'boolean') eightWay = y;
      index = x;
      y = Math.floor(index / this.w);
      x = Math.floor(index % this.w);
    } else {
      // x, y and eightWay are already assigned to the correct name
      index = y * this.w + x;
    }
    const min = XY.Zero;
    const max = XY(this.w - 1, this.h - 1);
    const coords = getNeighbors(XY(x, y), min, max, false, eightWay);
    return coords.map(({ x, y }) => this.get(x, y));
  }

  getNeighbors(index: number, eightWay?: boolean, wrap?: boolean): number[];
  getNeighbors(
    x: number,
    y: number,
    eightWay?: boolean,
    wrap?: boolean,
  ): number[];

  // get the neighbors values for a given index.
  getNeighbors(
    x: number,
    y?: number | boolean,
    eightWay?: boolean,
    wrap: boolean = false,
  ): number[] {
    let index: number;
    if (y === undefined || typeof y === 'boolean') {
      // shift the params left...
      wrap = eightWay === undefined ? false : eightWay;
      eightWay = y === undefined ? true : y;
      index = x;
      x = Math.floor(index % this.w);
      y = Math.floor(index / this.w);
    } else {
      if (eightWay === undefined) eightWay = true;
      index = y * this.w + x;
    }
    const min = XY.Zero;
    const max = XY(this.w - 1, this.h - 1);
    const coords = getNeighbors({ x, y }, min, max, wrap, eightWay);
    // Logger.debug("getNeighborsAt", { x, y, min, max, coords });
    return coords.map(({ x, y }) => y * this.w + x);
  }

  /**
   * set the value at the given index. optionally force it to be the next change processed.
   */
  set(index: number, value: number, forceNext?: boolean): void;
  set(x: number, y: number, value: number, forceNext?: boolean): void;

  set(
    index: number,
    y: number,
    v?: boolean | number,
    forceNext: boolean = false,
  ) {
    let x: number;
    let value: number;
    if (v === undefined || typeof v === 'boolean') {
      if (typeof v === 'boolean') forceNext = v;
      value = y;
      x = Math.floor(index % this.w);
      y = Math.floor(index / this.w);
    } else {
      // y and forceNext are already assigned to the correct name
      x = index;
      value = v;
      index = y * this.w + x;
    }
    this.motes[index] = value;
    if (forceNext) {
      this.changes.push(index);
    } else {
      this.changes.unshift(index);
    }
  }

  process() {
    if (!this.hasChanges) return null;
    const i = this.changes.pop()!;
    const x = Math.floor(i % this.w);
    const y = Math.floor(i / this.w);
    const v = this.motes[i];
    // Logger.debug("world:process", { x, y, i, v });
    return { i, x, y, v };
  }
}
