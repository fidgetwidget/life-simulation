import { wrapAround, clampFail } from './Math';
import { XY } from './XY';

const offset_nw = XY(-1, -1);
const offset_n = XY(0, -1);
const offset_ne = XY(1, -1);
const offset_w = XY(-1, 0);
// const offset_c = { x: 0, y: 0 };
const offset_e = XY(1, 0);
const offset_sw = XY(-1, 1);
const offset_s = XY(0, 1);
const offset_se = XY(1, 1);

const Neighbors8Way: XY[] = [
  offset_nw,
  offset_n,
  offset_ne,
  offset_e,
  offset_se,
  offset_s,
  offset_sw,
  offset_w,
];

const Neighbors4Way: XY[] = [offset_n, offset_e, offset_s, offset_w];

// Returns the wrapped around neighbor indexes for a given coord in a 2d grid for all 8 directions.
export function getNeighbors(
  coord: XY,
  min: XY,
  max: XY,
  wrap: boolean = true,
  eightWay: boolean = true,
): XY[] {
  const mapFn = (offset: XY) => ({
    x: wrap
      ? wrapAround(coord.x + offset.x, min.x, max.x)
      : clampFail(coord.x + offset.x, min.x, max.x),
    y: wrap
      ? wrapAround(coord.y + offset.y, min.y, max.y)
      : clampFail(coord.y + offset.y, min.y, max.y),
  });
  // TODO: do something that generates less garbage to be collected...
  const all = eightWay ? Neighbors8Way.map(mapFn) : Neighbors4Way.map(mapFn);
  return all.filter((coord) => coord.x != null && coord.y != null) as XY[];
}
