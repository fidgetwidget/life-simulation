import { filterInPlace, mapInto } from './Array';
import { wrapNumber, clampFail } from './Math';
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

/**
 * Returns the neighbor XY coord indexes for a given coord in a 2d grid 4 or 8 directions.
 */
export function getNeighbors(
  coord: XY,
  eightWay: boolean = false,
  out: XY[] = [],
): XY[] {
  const ncoords = eightWay ? Neighbors8Way : Neighbors4Way;
  return mapInto(
    ncoords,
    ({ x, y }) => {
      return XY(x + coord.x, y + coord.y);
    },
    out,
  );
}

/**
 * Returns the neighbor XY coord indexes for a given coord in a 2d grid 4 or 8 directions.
 * Note: requires constraints min and max limits for the neighbors, but allows those values
 *   to wrap and come out the other side.
 */
export function getNeighborsPlus(
  coord: XY,
  min: XY,
  max: XY,
  eightWay: boolean = false,
  wrap: boolean = false,
  out: XY[] = [],
): XY[] {
  const transform = (
    value: number,
    offset: number,
    min: number,
    max: number,
  ): number | null =>
    wrap
      ? wrapNumber(value + offset, min, max)
      : clampFail(value + offset, min, max);
  const ncoord = eightWay ? Neighbors8Way : Neighbors4Way;
  let i = 0,
    j = 0;
  while (i < ncoord.length) {
    const offset = ncoord[i++];
    const x = transform(coord.x, offset.x, min.x, max.x);
    const y = transform(coord.y, offset.y, min.y, max.y);
    if (x !== null && y !== null) out[j++] = XY(x, y);
  }
  return out;
}

/**
 * Returns the wrapped around neighbor indexes for a given coord in a 2d grid for all 8 directions.
 */
export function getExpandedNeighbors(
  coord: XY,
  range: number = 1,
  eightWay: boolean = false,
  out: XY[] = [],
) {
  const set = eightWay ? Neighbors8Way : Neighbors4Way;
  for (let r = 1; r <= range; r++) {
    out.push(...set.map((c) => XY(coord.x + c.x * r, coord.y + c.y * r)));
  }
  return out;
}

// using drawBresenhamCircle as a reference
// https://www.redblobgames.com/grids/circle-drawing/
export function getCirclePoints(
  center: XY,
  radius: number,
  min?: XY,
  max?: XY,
  out: XY[] = [],
) {
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
  return filterInPlace(out, (point, index, arr) => {
    const isFirstAtThatPosition =
      arr.findIndex((p) => p.x === point.x && p.y === point.y) === index;
    const inRange =
      min === undefined ||
      max === undefined ||
      (clampFail(point.x, min.x, max.x) !== null &&
        clampFail(point.y, min.y, max.y) !== null);
    return isFirstAtThatPosition && inRange;
  });
  // TODO: sort these into clockwise from left (like the neighbors result)
}
