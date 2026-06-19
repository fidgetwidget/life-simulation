import { clampFail, getCirclePoints, getNeighbors, wrapAround } from '.';
import { XY } from './XY';
import { expect, describe, test } from 'vite-plus/test';

describe('Math', () => {
  describe('clampFail', () => {
    test.each([0, 1, 2, 9, 10])('in range', (v) => {
      expect(clampFail(v, 0, 10)).toBe(v);
    });
    test.each([-2, -1, 11, 12])('out of range', (v) => {
      expect(clampFail(v, 0, 10)).toBe(null);
    });
  });

  describe('wrapAround', () => {
    test.each([0, 1, 2, 9, 10])('in range', (v) => {
      expect(wrapAround(v, 0, 10)).toBe(v);
    });
    test.each([
      [-2, 10], // should be 9?
      [-1, 10],
      [11, 0],
      [12, 0], // should be 1?
    ])('out of range', (v, result) => {
      expect(wrapAround(v, 0, 10)).toBe(result);
    });
  });
});

describe('Neighbors', () => {
  describe('getNeighbors', () => {
    //  +-----------------+
    //  | nw  | n   | ne  |
    //  | w   | c   | e   |
    //  | sw  | s   | se  |
    //  +-----------------+
    const nw = XY(0, 0);
    const n = XY(1, 0);
    const ne = XY(2, 0);
    const w = XY(0, 1);
    const c = XY(1, 1);
    const e = XY(2, 1);
    const sw = XY(0, 2);
    const s = XY(1, 2);
    const se = XY(2, 2);
    test.each`
      name    | coord | results
      ${'C'}  | ${c}  | ${[nw, n, ne, e, se, s, sw, w]}
      ${'N'}  | ${n}  | ${[ne, e, c, w, nw]}
      ${'NW'} | ${nw} | ${[n, c, w]}
      ${'E'}  | ${e}  | ${[n, ne, se, s, c]}
      ${'S'}  | ${s}  | ${[w, c, e, se, sw]}
    `('$name : $coord - 8way noWrap', ({ coord, results }) => {
      expect(getNeighbors(coord, XY.Zero, XY(2, 2), false, true)).toEqual(
        results,
      );
    });

    test.each`
      name    | coord | results
      ${'C'}  | ${c}  | ${[nw, n, ne, e, se, s, sw, w]}
      ${'N'}  | ${n}  | ${[sw, s, se, ne, e, c, w, nw]}
      ${'NW'} | ${nw} | ${[se, sw, s, n, c, w, e, ne]}
      ${'E'}  | ${e}  | ${[n, ne, nw, w, sw, se, s, c]}
      ${'S'}  | ${s}  | ${[w, c, e, se, ne, n, nw, sw]}
    `('$name : $coord - 8way wrap', ({ coord, results }) => {
      expect(getNeighbors(coord, XY.Zero, XY(2, 2), true, true)).toEqual(
        results,
      );
    });

    test.each`
      name    | coord | results
      ${'C'}  | ${c}  | ${[n, e, s, w]}
      ${'N'}  | ${n}  | ${[ne, c, nw]}
      ${'NW'} | ${nw} | ${[n, w]}
      ${'E'}  | ${e}  | ${[ne, se, c]}
      ${'S'}  | ${s}  | ${[c, se, sw]}
    `('$name : $coord - 4way noWrap', ({ coord, results }) => {
      expect(getNeighbors(coord, XY.Zero, XY(2, 2), false, false)).toEqual(
        results,
      );
    });

    test.each`
      name    | coord | results
      ${'C'}  | ${c}  | ${[n, e, s, w]}
      ${'N'}  | ${n}  | ${[s, ne, c, nw]}
      ${'NW'} | ${nw} | ${[sw, n, w, ne]}
      ${'E'}  | ${e}  | ${[ne, w, se, c]}
      ${'S'}  | ${s}  | ${[c, se, n, sw]}
    `('$name : $coord - 4way wrap', ({ coord, results }) => {
      expect(getNeighbors(coord, XY.Zero, XY(2, 2), true, false)).toEqual(
        results,
      );
    });
  });

  describe('getNeighborsAtRange', () => {
    //  +----------------------+
    //  | -1,-1 |  0,-1 | 1,-1 |
    //  | -1, 0 |  0, 0 | 1, 0 |
    //  | -1, 1 |  0, 1 | 1, 1 |
    //  +----------------------+
    test.each`
      name     | coord       | range  | count | results
      ${'0,0'} | ${XY(0, 0)} | ${1}   | ${4}  | ${[XY(-1, 0), XY(1, 0), XY(0, -1), XY(0, 1)]}
      ${'0,0'} | ${XY(0, 0)} | ${1.5} | ${8}  | ${[XY(-1, 0), XY(1, 0), XY(0, -1), XY(0, 1), XY(-1, 1), XY(1, 1), XY(-1, -1), XY(1, -1)]}
      ${'0,0'} | ${XY(0, 0)} | ${2}   | ${8}  | ${[XY(-2, 0), XY(2, 0), XY(0, -2), XY(0, 2), XY(-1, 1), XY(1, 1), XY(-1, -1), XY(1, -1)]}
    `('$name : $range', ({ coord, range, count, results }) => {
      const actual = getCirclePoints(coord, range);
      expect(actual.length).toBe(count);
      expect(actual).toEqual(results);
    });
  });
});
