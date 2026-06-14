import { Logger } from '../lib/Logger';
import { getNeighbors } from '../util';

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

  constructor(w: number, h: number) {
    this._w = w;
    this._h = h;
    const size = w * h;
    this.motes = new Array(size);
    this.motes.fill(0);
    Logger.debug('World:new', { w, h, size, v: this.motes });
  }

  // TODO: support generics for value

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
      index = y * this._w + index;
    }
    return this.motes[index];
  }

  getNeighborValues(i: number, eightWay: boolean = true): number[] {
    const x = Math.floor(i % this._w);
    const y = Math.floor(i / this._w);
    return this.getNeighborValuesAt(x, y, eightWay);
  }

  getNeighborValuesAt(
    x: number,
    y: number,
    eightWay: boolean = true,
  ): number[] {
    const maxx = this._w - 1;
    const maxy = this._h - 1;
    const minx = 0;
    const miny = 0;
    const coords = getNeighbors(
      { x, y },
      maxx,
      maxy,
      minx,
      miny,
      false,
      eightWay,
    );
    return coords.map(({ x, y }) => this.get(x, y));
  }

  // get the neighbors values for a given index.
  getNeighbors(
    i: number,
    eightWay: boolean = true,
    wrap: boolean = false,
  ): number[] {
    const x = Math.floor(i % this._w);
    const y = Math.floor(i / this._w);
    return this.getNeighborsAt(x, y, eightWay, wrap);
  }

  // get the neighbors values for a given positions coord.
  getNeighborsAt(
    x: number,
    y: number,
    eightWay: boolean = true,
    wrap: boolean = false,
  ): number[] {
    // TODO: optimize this - getNeighbors is expensive to call like this (generates a lot of memory garbage).
    const maxx = this._w - 1;
    const maxy = this._h - 1;
    const minx = 0;
    const miny = 0;
    const coords = getNeighbors(
      { x, y },
      maxx,
      maxy,
      minx,
      miny,
      wrap,
      eightWay,
    );
    Logger.debug('getNeighborsAt', { x, y, maxx, maxy, minx, miny, coords });
    return coords.map(({ x, y }) => y * this._w + x);
  }

  set(i: number, v: number, forceNext: boolean = false) {
    if (i == null || v == null) debugger;
    this.motes[i] = v;
    forceNext ? this.changes.push(i) : this.changes.unshift(i);
    Logger.debug('World:set', {
      i,
      v,
      force: forceNext,
      changes: JSON.stringify(this.changes),
    });
  }

  setAt(x: number, y: number, v: number, forceNext: boolean = false) {
    let i = y * this._w + x;
    if (i == null || v == null) debugger;
    this.motes[i] = v;
    forceNext ? this.changes.push(i) : this.changes.unshift(i);
    Logger.debug('World:setAt', {
      x,
      y,
      i,
      v,
      force: forceNext,
      changes: JSON.stringify(this.changes),
    });
  }

  process() {
    if (!this.hasChanges) return null;
    const i = this.changes.pop()!;
    const x = Math.floor(i % this._w);
    const y = Math.floor(i / this._w);
    const v = this.motes[i];
    Logger.debug('world:process', { x, y, i, v });
    return { i, x, y, v };
  }
}
