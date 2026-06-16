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
  let i = 0,
    j = 0;
  while (i < arr.length) {
    if (condition(arr[i], i, arr)) arr[j++] = arr[i];
    i++;
  }
  arr.length = j;
  return arr;
}

export function mapInPlace<T, V>(
  arr: T[],
  transform: (val: T, index: number, arr: any[]) => V,
): V[] {
  let temp: unknown[] = arr;
  arr.forEach((value, index, array) => {
    temp[index] = transform(value, index, array);
  });
  return temp as V[];
}
