import { Logger } from '../lib/Logger.ts';
import { getNeighbors } from '../util';
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

  // for debugging
  private _ncoords!: XY[];

  /**
   * get the world indexes this chunk represents.
   */
  get indexes(): number[] {
    if (this._indexes == null) {
      this._indexes = [];
      for (let y = this.y; y < this.y + this.h; y++) {
        for (let x = this.x; x < this.x + this.w; x++) {
          const index = Math.floor(y * this.root.w + x);
          this._indexes.push(index);
        }
      }
    }
    return this._indexes;
  }

  /**
   * get this chunks neighbor chunk indexes.
   */
  get neighbors(): number[] {
    if (this._neighbors == null) {
      let maxx, maxy;
      maxx = this.root.chunksWide - 1;
      maxy = this.root.chunksHigh - 1;
      const ncoords = getNeighbors(this.coord, maxx, maxy, 0, 0, false);
      // Logger.debug('Chunk:neighbors', {
      //   maxx,
      //   maxy,
      //   i: this.index,
      //   x: this.coord.x,
      //   y: this.coord.y,
      //   n: ncoords,
      // });
      this._ncoords = ncoords;
      this._neighbors = ncoords.map(
        (coord) => coord.y * this.root.chunksWide + coord.x,
      );
    }
    return this._neighbors;
  }

  get coord(): XY {
    if (this._coord == null) {
      const x = Math.floor(this.index % this.root.chunksWide);
      const y = Math.floor(this.index / this.root.chunksWide);
      this._coord = {
        x,
        y,
      };
    }
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
    this.coord;
    this.neighbors;
  }

  private _indexes!: number[];
  private _neighbors!: number[];
  private _coord!: XY;
}
