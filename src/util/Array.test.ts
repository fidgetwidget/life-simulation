import { expect, describe, test } from 'vite-plus/test';

import { filterInPlace, filterInto, mapInPlace, mapInto } from './Array';

describe('Array', () => {
  // Testing finterInto first because filterInPlace uses it.
  describe('filterInto', () => {
    test.each([
      {
        arr: [1, 2, 3, 4],
        condition: (value: number) => value % 2 === 0,
        result: [2, 4],
      },
      {
        arr: ['a', 'b', '10', 'NaN'],
        condition: (value: string) =>
          !Number.isNaN(Number(value)) && value.trim() !== '',
        result: ['10'],
      },
    ])(
      'result at index matches given at index',
      ({ arr, condition, result }) => {
        const into: any[] = [];
        const temp = [...arr];
        // @ts-expect-error untyped array arr
        const out = filterInto(temp, condition, into);
        // returned array has the expected values
        expect(out).toEqual(result);

        // array input doesn't match output
        expect(temp).not.toBe(out);

        // array input values are unchanged
        expect(temp).not.toEqual(result);
        expect(temp).toEqual(arr);

        // returned array matches the given array to be used
        expect(out).toBe(into);
      },
    );
  });

  describe('filterInPlace', () => {
    test.each([
      {
        arr: [1, 2, 3, 4],
        condition: (value: number) => value % 2 === 0,
        result: [2, 4],
      },
      {
        arr: ['a', 'b', '10', 'NaN'],
        condition: (value: string) =>
          !Number.isNaN(Number(value)) && value.trim() !== '',
        result: ['10'],
      },
    ])(
      'result at index matches given at index',
      ({ arr, condition, result }) => {
        // @ts-expect-error untyped array arr
        const out = filterInPlace(arr, condition);
        // has the expected values
        expect(out).toEqual(result);
        // first values match between given and output
        expect(out[0]).toBe(arr[0]);
        // arrays are the same array
        expect(out).toBe(arr);
      },
    );
  });

  describe('mapInto', () => {
    test.each([
      {
        arr: [1, 2, 3, 4],
        transform: (value: number) => value * 2,
        result: [2, 4, 6, 8],
      },
    ])(
      'result at index matches given at index',
      ({ arr, transform, result }) => {
        let into: any[] = [];
        let temp = [...arr];
        const out = mapInto(temp, transform, into);

        // returned array has the expected values
        expect(out).toEqual(result);

        // array input doesn't match output
        expect(temp).not.toBe(out);

        // array input values are unchanged
        expect(temp).not.toEqual(result);
        expect(temp).toEqual(arr);

        // returned array matches the given array to be used
        expect(out).toBe(into);
      },
    );
  });

  describe('mapInPlace', () => {
    test.each([
      {
        arr: [1, 2, 3, 4],
        transform: (value: number) => value * 2,
        result: [2, 4, 6, 8],
      },
    ])(
      'result at index matches given at index',
      ({ arr, transform, result }) => {
        const out = mapInPlace(arr, transform);
        // has the expected values
        expect(out).toEqual(result);
        // first values match between given and output
        expect(out[0]).toBe(arr[0]);
        // arrays are the same array
        expect(out).toBe(arr);
      },
    );
  });
});
