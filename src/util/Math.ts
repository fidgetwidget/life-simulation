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
