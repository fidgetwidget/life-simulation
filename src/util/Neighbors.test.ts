import { expect, describe, test } from 'vite-plus/test';

import {
  getCirclePoints,
  getExpandedNeighbors,
  getNeighbors,
  getNeighborsPlus,
} from './Neighbors';
import { XY } from './XY';

describe('Neighbors', () => {
  /**
   * A simple get neighbor XY coords for a given XY coord.
   */
  describe('getNeighbors', () => {
    //  +----------------------+
    //  | -1,-1 |  0,-1 | 1,-1 |
    //  | -1, 0 |  0, 0 | 1, 0 |
    //  | -1, 1 |  0, 1 | 1, 1 |
    //  +----------------------+
    test.each`
      name           | coord      | eightWay | count | results
      ${'0,0: 8Way'} | ${XY.Zero} | ${true}  | ${8}  | ${[XY(-1, -1), XY(0, -1), XY(1, -1), XY(1, 0), XY(1, 1), XY(0, 1), XY(-1, 1), XY(-1, 0)]}
      ${'0,0: 4way'} | ${XY.Zero} | ${false} | ${4}  | ${[XY(0, -1), XY(1, 0), XY(0, 1), XY(-1, 0)]}
    `('$name', ({ coord, eightWay, count, results }) => {
      const actual = getNeighbors(coord, eightWay);
      expect(actual.length).toBe(count);
      expect(actual).toEqual(results);
    });
  });

  describe('getNeighborsPlus', () => {
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

    const MIN = XY.Zero;
    const MAX = XY(2, 2);

    test.each`
      name                 | coord | eightWay | wrap     | results
      ${'C:  4way|nowrap'} | ${c}  | ${false} | ${false} | ${[n, e, s, w]}
      ${'N:  4way|nowrap'} | ${n}  | ${false} | ${false} | ${[ne, c, nw]}
      ${'NW: 4way|nowrap'} | ${nw} | ${false} | ${false} | ${[n, w]}
      ${'E:  4way|nowrap'} | ${e}  | ${false} | ${false} | ${[ne, se, c]}
      ${'S:  4way|nowrap'} | ${s}  | ${false} | ${false} | ${[c, se, sw]}
      ${'C:  8way|nowrap'} | ${c}  | ${true}  | ${false} | ${[nw, n, ne, e, se, s, sw, w]}
      ${'N:  8way|nowrap'} | ${n}  | ${true}  | ${false} | ${[ne, e, c, w, nw]}
      ${'NW: 8way|nowrap'} | ${nw} | ${true}  | ${false} | ${[n, c, w]}
      ${'E:  8way|nowrap'} | ${e}  | ${true}  | ${false} | ${[n, ne, se, s, c]}
      ${'S:  8way|nowrap'} | ${s}  | ${true}  | ${false} | ${[w, c, e, se, sw]}
      ${'C:  4way|wrap'}   | ${c}  | ${false} | ${true}  | ${[n, e, s, w]}
      ${'N:  4way|wrap'}   | ${n}  | ${false} | ${true}  | ${[s, ne, c, nw]}
      ${'NW: 4way|wrap'}   | ${nw} | ${false} | ${true}  | ${[sw, n, w, ne]}
      ${'E:  4way|wrap'}   | ${e}  | ${false} | ${true}  | ${[ne, w, se, c]}
      ${'S:  4way|wrap'}   | ${s}  | ${false} | ${true}  | ${[c, se, n, sw]}
      ${'C:  8way|wrap'}   | ${c}  | ${true}  | ${true}  | ${[nw, n, ne, e, se, s, sw, w]}
      ${'N:  8way|wrap'}   | ${n}  | ${true}  | ${true}  | ${[sw, s, se, ne, e, c, w, nw]}
      ${'NW: 8way|wrap'}   | ${nw} | ${true}  | ${true}  | ${[se, sw, s, n, c, w, e, ne]}
      ${'E:  8way|wrap'}   | ${e}  | ${true}  | ${true}  | ${[n, ne, nw, w, sw, se, s, c]}
      ${'S:  8way|wrap'}   | ${s}  | ${true}  | ${true}  | ${[w, c, e, se, ne, n, nw, sw]}
    `('$name : $coord', ({ coord, eightWay, wrap, results }) => {
      expect(getNeighborsPlus(coord, MIN, MAX, eightWay, wrap)).toEqual(
        results,
      );
    });
  });

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
        const expected = getNeighborsPlus(center, MIN, MAX, eightWay, false);
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
});
