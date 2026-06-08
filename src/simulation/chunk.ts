import { getNeighbors } from "../utils.ts";
import { Root } from "./root.ts";

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
      let ql, maxx, maxy;
      ql = this.root.quadLength;
      maxx = maxy = this.root.quadLength - 1;
      const ncoords = getNeighbors(this.coord, maxx, maxy);
      this._neighbors = ncoords.map((coord) => coord.y * ql + coord.x);
      console.debug("Chunk:neighbors", {
        i: this.index,
        x: this.coord.x,
        y: this.coord.y,
        n: ncoords,
      });
    }
    return this._neighbors;
  }

  get coord(): XY {
    if (this._coord == null) {
      this._coord = {
        x: Math.floor(this.index % this.w),
        y: Math.floor(this.index / this.w),
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

  private _indexes!: number[];
  private _neighbors!: number[];
  private _coord!: XY;
}
