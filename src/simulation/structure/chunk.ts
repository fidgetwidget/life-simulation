// import { Logger } from '../lib/Logger.ts';
import { getNeighborsPlus, mapInto } from '../../util/index.ts';
import { XY } from '../../util/XY.ts';
import { Root } from './root.ts';

export interface ChunkParams {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  root: Root;
}

export const ChunkFactory = ({ index, x, y, w, h, root }: ChunkParams) =>
  new Chunk(index, x, y, w, h, root);

export class Chunk {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  root: Root;

  /**
   * get the world indexes this chunk represents.
   */
  get indexes(): number[] {
    if (this._indexes == null) this.setIndexes();
    return this._indexes;
  }

  /**
   * get this chunks neighbor chunk indexes.
   */
  get neighbors(): number[] {
    if (this._neighbors == null) this.setNeighbors();
    return this._neighbors;
  }

  /**
   * get this chunks neighbor chunk XY coords.
   */
  get neighborCoords() {
    if (this._ncoords == null) this.setNeighbors();
    return this._ncoords;
  }

  /**
   * get this chunk's XY coord (based on root's )
   */
  get coord(): XY {
    if (this._coord == null) this.setCoord();
    return this._coord;
  }

  constructor(
    index: number,
    x: number,
    y: number,
    w: number,
    h: number,
    root: Root,
  ) {
    this.index = index;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.root = root;
  }

  public forceCache() {
    this.setIndexes();
    this.setCoord();
    this.setNeighbors();
  }

  protected setIndexes() {
    this._indexes = [];
    for (let y = this.y; y < this.y + this.h; y++) {
      for (let x = this.x; x < this.x + this.w; x++) {
        const index = Math.floor(y * this.root.w + x);
        this._indexes.push(index);
      }
    }
  }

  protected setCoord() {
    const x = Math.floor(this.index % this.root.chunksWide);
    const y = Math.floor(this.index / this.root.chunksWide);
    this._coord = {
      x,
      y,
    };
  }

  protected setNeighbors() {
    this._neighbors = [];
    this._ncoords = [];
    const min = XY.Zero;
    const max = {
      x: this.root.chunksWide - 1,
      y: this.root.chunksHigh - 1,
    };
    getNeighborsPlus(this.coord, min, max, true, false, this._ncoords);
    mapInto(
      this._ncoords,
      (coord) => coord.y * this.root.chunksWide + coord.x,
      this._neighbors,
    );
  }

  private _indexes!: number[];
  private _ncoords!: XY[];
  private _neighbors!: number[];
  private _coord!: XY;
}
