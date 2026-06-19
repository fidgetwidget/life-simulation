import { filterInPlace } from './Array';
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

// using drawBresenhamCircle as a reference
// https://www.redblobgames.com/grids/circle-drawing/
export function getCirclePoints(center: XY, radius: number, out: XY[] = []) {
  const { x: cx, y: cy } = center;
  const rl = Math.floor(radius * Math.sqrt(0.5));
  for (let r = 0; r <= rl; r++) {
    let d = Math.floor(Math.sqrt(radius * radius - r * r));
    out.push(
      XY(cx - d, cy + r),
      XY(cx + d, cy + r),
      XY(cx - d, cy - r),
      XY(cx + d, cy - r),
      XY(cx + r, cy - d),
      XY(cx + r, cy + d),
      XY(cx - r, cy - d),
      XY(cx - r, cy + d),
    );
  }

  // ensures that only the first time a coord appears is kept
  return filterInPlace(
    out,
    (point, index, arr) =>
      arr.findIndex((p) => p.x === point.x && p.y === point.y) === index,
  );
  // TODO: sort these into clockwise from left (like the neighbors result)
}
