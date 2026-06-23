import { expect, describe, test } from 'vite-plus/test';

import { XY, add, subtract, multiply, divide, fromRadians, round } from './XY';

describe('XY', () => {
  describe('constructor', () => {
    test.each([{ x: 0, y: 0 }])('constructed', ({ x, y }) => {
      const p = XY(x, y);
      expect(p.x).toBe(x);
      expect(p.y).toBe(y);
    });
    test.each([
      { name: '0', r: 0, result: XY(1, 0) },
      { name: 'π/2', r: Math.PI / 2, result: XY(0, 1) },
      { name: 'π', r: Math.PI, result: XY(-1, 0) },
      { name: '2π', r: 2 * Math.PI, result: XY(1, -0) },
    ])('from radians $name rounded => $result', ({ r, result }) => {
      const p = fromRadians(r);
      expect(round(p)).toEqual(result);
    });
  });
});

describe('add', () => {
  test('mutate by default', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = add(a, b);
    expect(result).toBe(a);
  });

  test('optionally immutable', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = add(a, b, false);
    expect(result).not.toBe(a);
  });

  test.each([{ x: 1, y: 1, value: 1, result: XY(2, 2) }])(
    'XY($x, $y) add $value => $result',
    ({ x, y, value, result }) => {
      const p = XY(x, y);
      expect(add(p, value)).toEqual(result);
    },
  );
});

describe('subtract', () => {
  test('mutate by default', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = subtract(a, b);
    expect(result).toBe(a);
  });

  test('optionally immutable', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = subtract(a, b, false);
    expect(result).not.toBe(a);
  });

  test.each([{ x: 1, y: 1, value: 1, result: XY(0, 0) }])(
    'XY($x, $y) add $value => $result',
    ({ x, y, value, result }) => {
      const p = XY(x, y);
      expect(subtract(p, value)).toEqual(result);
    },
  );
});

describe('multiply', () => {
  test('mutate by default', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = multiply(a, b);
    expect(result).toBe(a);
  });

  test('optionally immutable', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = multiply(a, b, false);
    expect(result).not.toBe(a);
  });

  test.each([
    { x: 1, y: 1, value: 2, result: XY(2, 2) },
    { x: 1, y: 1, value: XY(-1, 10), result: XY(-1, 10) },
  ])('XY($x, $y) add $value => $result', ({ x, y, value, result }) => {
    const p = XY(x, y);
    expect(multiply(p, value)).toEqual(result);
  });
});

describe('divide', () => {
  test('mutate by default', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = divide(a, b);
    expect(result).toBe(a);
  });

  test('optionally immutable', () => {
    const a = XY(1, 1);
    const b = XY(1, 1);
    const result = divide(a, b, false);
    expect(result).not.toBe(a);
  });

  test.each([
    { x: 2, y: 2, value: 2, result: XY(1, 1) },
    { x: 25, y: 4, value: XY(5, 2), result: XY(5, 2) },
  ])('XY($x, $y) add $value => $result', ({ x, y, value, result }) => {
    const p = XY(x, y);
    expect(divide(p, value)).toEqual(result);
  });
});
