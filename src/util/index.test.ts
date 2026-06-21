import { expect, describe, test } from 'vite-plus/test';

import { clampFail, clampNumber, wrapNumber } from '.';

describe('Math', () => {
  describe('clampFail', () => {
    test.each([0, 1, 2, 9, 10])(
      'in range (0-10): given %i -> expect same',
      (v) => {
        expect(clampFail(v, 0, 10)).toBe(v);
      },
    );
    test.each([-2, -1, 11, 12])(
      'out of range (0-10): given %i -> expect null',
      (v) => {
        expect(clampFail(v, 0, 10)).toBe(null);
      },
    );
  });

  describe('clampNumber', () => {
    test.each([0, 1, 2, 9, 10])(
      'in range (0-10): given %i -> expect same',
      (v) => {
        expect(clampNumber(v, 0, 10)).toBe(v);
      },
    );
    test.each([
      [-2, 0],
      [-1, 0],
      [11, 10],
      [12, 10],
    ])(`out of range (0-10): given %i -> expect %i`, (v, result) => {
      expect(clampNumber(v, 0, 10)).toBe(result);
    });
  });

  describe('wrapNumber', () => {
    test.each([0, 1, 2, 9, 10])(
      'in range (0-10): given %i -> expect same',
      (v) => {
        expect(wrapNumber(v, 0, 10)).toBe(v);
      },
    );
    test.each([
      [-2, 9],
      [-1, 10],
      [11, 0],
      [12, 1],
    ])(`out of range (0-10): given %i -> expect %i`, (v, result) => {
      expect(wrapNumber(v, 0, 10)).toBe(result);
    });
  });
});
