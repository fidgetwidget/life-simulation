/**
 * Takes a value and min, max range and returns the opposite end
 *  of the range if the given value excedes one end of the range.
 * Otherwise it just returns the val given.
 */
export function wrapNumber(
  val: number, //.
  min: number,
  max: number,
): number {
  const range = max - min + 1;
  return min + ((((val - min) % range) + range) % range);
}

/**
 * Takes a value and min, max range and returns the value clamped to the range if it falls outside of it.
 */
export function clampNumber(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
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
