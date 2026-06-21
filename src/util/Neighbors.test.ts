import { expect, describe, test } from 'vite-plus/test';

import {
  getCirclePoints,
  getExpandedNeighbors,
  getNeighbors,
} from './Neighbors';
import { XY } from './XY';

describe('Neighbors', () => {
  describe('getExpandedNeighbors', () => {
    const MIN = XY(-10, -10);
    const MAX = XY(10, 10);
    test.each([
      { center: XY(0, 0), eightWay: false },
      { center: XY(5, 3), eightWay: false },
      { center: XY(3, 5), eightWay: true },
      { center: XY(3, 3), eightWay: true },
    ])(
      "at range 1, it's results match getNeighbors $center",
      ({ center, eightWay }) => {
        const actual = getExpandedNeighbors(center, 1, eightWay);
        const expected = getNeighbors(center, eightWay, false, MIN, MAX);
        expect(actual).toEqual(expected);
      },
    );

    test.each([
      {
        center: XY(0, 0),
        range: 1,
        eightWay: false,
        length: 4,
        results: [XY(0, -1), XY(1, 0), XY(0, 1), XY(-1, 0)],
      },
      {
        center: XY(0, 0),
        range: 1,
        eightWay: true,
        length: 8,
        results: [
          XY(-1, -1),
          XY(0, -1),
          XY(1, -1),
          XY(1, 0),
          XY(1, 1),
          XY(0, 1),
          XY(-1, 1),
          XY(-1, 0),
        ],
      },
    ])(
      'center: $center, eightWay: $eightWay -> [$count]',
      ({ center, range, eightWay, length, results }) => {
        const actual = getExpandedNeighbors(center, range, eightWay);
        expect(actual.length).toBe(length);
        expect(actual).toEqual(results);
      },
    );
  });
  describe('getCirclePoints', () => {
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
      expect(getNeighbors(coord, true, false, XY.Zero, XY(2, 2))).toEqual(
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
      expect(getNeighbors(coord, true, true, XY.Zero, XY(2, 2))).toEqual(
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
      expect(getNeighbors(coord, false, false, XY.Zero, XY(2, 2))).toEqual(
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
      expect(getNeighbors(coord, false, true, XY.Zero, XY(2, 2))).toEqual(
        results,
      );
    });
  });
});
