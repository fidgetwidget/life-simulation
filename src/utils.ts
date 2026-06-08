// Returns a random element from a given array of elements.
export function pickRandom<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

const offset_nw = { x: -1, y: -1 };
const offset_n = { x: 0, y: -1 };
const offset_ne = { x: 1, y: -1 };
const offset_w = { x: -1, y: 0 };
// const offset_c = { x: 0, y: 0 };
const offset_e = { x: 1, y: 0 };
const offset_sw = { x: -1, y: 1 };
const offset_s = { x: 0, y: 1 };
const offset_se = { x: 1, y: 1 };

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
  maxx: number,
  maxy: number,
  minx: number = 0,
  miny: number = 0,
  wrap: boolean = true,
  eightWay: boolean = true,
): XY[] {
  const mapFn = (offset: XY) => ({
    x: wrap
      ? wrapAround(coord.x + offset.x, minx, maxx)
      : clampFail(coord.x + offset.x, minx, maxx),
    y: wrap
      ? wrapAround(coord.y + offset.y, miny, maxy)
      : clampFail(coord.y + offset.y, miny, maxy),
  });
  const all = eightWay ? Neighbors8Way.map(mapFn) : Neighbors4Way.map(mapFn);
  return all.filter((coord) => !(coord.x == null || coord.y == null)) as XY[];
  // TODO: use something that doesn't create a new array and take in a target value to map to, in order to reduce memory garbage.
}

/**
 * Takes a value and min, max range and returns the opposite end
 *  of the range if the given value excedes one end of the range.
 * Otherwise it just returns the val given.
 */
export function wrapAround(
  val: number, //.
  min: number,
  max: number,
): number {
  if (val < min) return max;
  if (val > max) return min;
  return val;
}

/**
 * Takes a value and min, max range and returns null if the value is out of range.
 * Otherwise it just returns the val given.
 */
export function clampFail(
  val: number,
  min: number,
  max: number,
): number | null {
  if (val < min) return null;
  if (val > max) return null;
  return val;
}
