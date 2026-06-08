import { expect, describe, test } from "vitest";
import { clampFail, getNeighbors, wrapAround } from "./utils";

describe("clampFail", () => {
  test.each([0, 1, 2, 9, 10])("in range", (v) => {
    expect(clampFail(v, 0, 10)).toBe(v);
  });
  test.each([-2, -1, 11, 12])("out of range", (v) => {
    expect(clampFail(v, 0, 10)).toBe(null);
  });
});

describe("wrapAround", () => {
  test.each([0, 1, 2, 9, 10])("in range", (v) => {
    expect(wrapAround(v, 0, 10)).toBe(v);
  });
  test.each([
    [-2, 10], // should be 9?
    [-1, 10],
    [11, 0],
    [12, 0], // should be 1?
  ])("out of range", (v, result) => {
    expect(wrapAround(v, 0, 10)).toBe(result);
  });
});

describe("getNeighbors", () => {
  //  +-----------------+
  //  | nw  | n   | ne  |
  //  | w   | c   | e   |
  //  | sw  | s   | se  |
  //  +-----------------+
  const nw = { x: 0, y: 0 };
  const n = { x: 1, y: 0 };
  const ne = { x: 2, y: 0 };
  const w = { x: 0, y: 1 };
  const c = { x: 1, y: 1 };
  const e = { x: 2, y: 1 };
  const sw = { x: 0, y: 2 };
  const s = { x: 1, y: 2 };
  const se = { x: 2, y: 2 };
  test.each`
    name    | coord | results
    ${"C"}  | ${c}  | ${[nw, n, ne, e, se, s, sw, w]}
    ${"N"}  | ${n}  | ${[ne, e, c, w, nw]}
    ${"NW"} | ${nw} | ${[n, c, w]}
    ${"E"}  | ${e}  | ${[n, ne, se, s, c]}
    ${"S"}  | ${s}  | ${[w, c, e, se, sw]}
  `("$name : $coord - 8way noWrap", ({ coord, results }) => {
    expect(getNeighbors(coord, 2, 2, 0, 0, false, true)).toEqual(results);
  });

  test.each`
    name    | coord | results
    ${"C"}  | ${c}  | ${[nw, n, ne, e, se, s, sw, w]}
    ${"N"}  | ${n}  | ${[sw, s, se, ne, e, c, w, nw]}
    ${"NW"} | ${nw} | ${[se, sw, s, n, c, w, e, ne]}
    ${"E"}  | ${e}  | ${[n, ne, nw, w, sw, se, s, c]}
    ${"S"}  | ${s}  | ${[w, c, e, se, ne, n, nw, sw]}
  `("$name : $coord - 8way wrap", ({ coord, results }) => {
    expect(getNeighbors(coord, 2, 2, 0, 0, true, true)).toEqual(results);
  });

  test.each`
    name    | coord | results
    ${"C"}  | ${c}  | ${[n, e, s, w]}
    ${"N"}  | ${n}  | ${[ne, c, nw]}
    ${"NW"} | ${nw} | ${[n, w]}
    ${"E"}  | ${e}  | ${[ne, se, c]}
    ${"S"}  | ${s}  | ${[c, se, sw]}
  `("$name : $coord - 4way noWrap", ({ coord, results }) => {
    expect(getNeighbors(coord, 2, 2, 0, 0, false, false)).toEqual(results);
  });

  test.each`
    name    | coord | results
    ${"C"}  | ${c}  | ${[n, e, s, w]}
    ${"N"}  | ${n}  | ${[s, ne, c, nw]}
    ${"NW"} | ${nw} | ${[sw, n, w, ne]}
    ${"E"}  | ${e}  | ${[ne, w, se, c]}
    ${"S"}  | ${s}  | ${[c, se, n, sw]}
  `("$name : $coord - 4way wrap", ({ coord, results }) => {
    expect(getNeighbors(coord, 2, 2, 0, 0, true, false)).toEqual(results);
  });
});
