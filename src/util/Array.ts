// Returns a random element from a given array of elements.
export function pickRandom<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Filers an array in place without generating garbage.
 */
export function filterInPlace<T>(
  arr: T[],
  condition: (val: T, index: number, arr: T[]) => boolean,
): T[] {
  return filterInto(arr, condition, arr);
}

/**
 * Filters an array into a given array instead of creating a new one.
 * Note: creates a new array if no out array given.
 */
export function filterInto<T>(
  arr: T[],
  condition: (val: T, index: number, arr: T[]) => boolean,
  out: T[] = [],
): T[] {
  let i = 0,
    j = 0;
  while (i < arr.length) {
    if (condition(arr[i], i, arr)) out[j++] = arr[i];
    i++;
  }
  out.length = j;
  return out;
}

/**
 * Map an array into the same array without creating a new array.
 */
export function mapInPlace<T, V>(
  arr: T[],
  transform: (val: T, index: number, arr: any[]) => V,
): V[] {
  let temp: unknown[] = arr;
  return mapInto(arr, transform, temp as V[]);
}

/**
 * Map into an optional given array rather than create a new one.
 * Note: creates a new one if no out array given.
 */
export function mapInto<T, V>(
  arr: T[],
  transform: (val: T, index: number, arr: any[]) => V,
  out: V[] = [],
): V[] {
  arr.forEach((value, index, array) => {
    out[index] = transform(value, index, array);
  });
  return out;
}
