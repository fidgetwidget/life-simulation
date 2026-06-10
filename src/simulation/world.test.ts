import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { World } from './world';

describe('World', () => {
	let consoleMock: any;

	beforeEach(() => {
		// Intercept and swallow all console.debug calls
		consoleMock = vi.spyOn(console, 'debug').mockImplementation(() => {}); //
	});

	afterEach(() => {
		consoleMock.mockRestore();
	});

	test.each([
		{ w: 5, h: 5 },
		{ w: 1, h: 5 },
		{ w: 5, h: 1 },
	])('constructor', ({ w, h }) => {
		const world = new World(w, h);
		// @ts-expect-error private property access.
		expect(world.motes.length).toBe(w * h);
		expect(world.hasChanges).toBe(false);
	});

	describe('square 5x5 world', () => {
		const w = 5;
		const h = 5;

		test('get and set', () => {
			const world = new World(w, h);
			const index = 1;
			let value = 0;
			expect(world.get(index)).toBe(0);
			value = 5;
			world.set(index, value);
			expect(world.get(index)).toBe(value);
		});

		test('getAt and setAt', () => {
			//  x -→   0    1    2    3    4
			//      +-----------------------
			//  0 y |  0 |  1 |  2 |  3 |  4
			//  1 ↓ |  5 |  6 |  7 |  8 |  9
			//  2   | 10 | 11 | 12 | 13 | 14
			//  3   | 15 | 15 | 17 | 18 | 19
			//  4   | 20 | 21 | 22 | 23 | 24
			//      +-----------------------
			//  Therfore 3, 1 => 8
			const world = new World(w, h);
			const value = 5;
			const x = 3;
			const y = 1;
			const index = 8;
			world.setAt(x, y, value);
			expect(world.get(index)).toBe(value);
			expect(world.getAt(x, y)).toBe(value);
		});
	});

	describe('square 3x3 world', () => {
		const w = 3;
		const h = 3;

		describe('getNeighbors', () => {
			//    x-→ 0  1  2
			//      +---------+
			//  0 y | 0  1  2 |
			//  1 ↓ | 3  4  5 |
			//  2   | 6  7  8 |
			//      +---------+
			test.each`
				index | sorted                      | actual
				${4}  | ${[0, 1, 2, 3, 5, 6, 7, 8]} | ${[0, 1, 2, 5, 8, 7, 6, 3]}
			`(`$index 8way noWrap`, ({ index, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighbors(index);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});
		});

		describe('getNeighborsAt', () => {
			//    x-→ 0  1  2
			//      +---------+
			//  0 y | 0  1  2 |
			//  1 ↓ | 3  4  5 |
			//  2   | 6  7  8 |
			//      +---------+
			test.each`
				index | coord             | sorted                      | actual
				${4}  | ${{ x: 1, y: 1 }} | ${[0, 1, 2, 3, 5, 6, 7, 8]} | ${[0, 1, 2, 5, 8, 7, 6, 3]}
				${1}  | ${{ x: 1, y: 0 }} | ${[0, 2, 3, 4, 5]}          | ${[2, 5, 4, 3, 0]}
				${0}  | ${{ x: 0, y: 0 }} | ${[1, 3, 4]}                | ${[1, 4, 3]}
				${5}  | ${{ x: 2, y: 1 }} | ${[1, 2, 4, 7, 8]}          | ${[1, 2, 8, 7, 4]}
				${7}  | ${{ x: 1, y: 2 }} | ${[3, 4, 5, 6, 8]}          | ${[3, 4, 5, 8, 6]}
				${8}  | ${{ x: 2, y: 2 }} | ${[4, 5, 7]}                | ${[4, 5, 7]}
			`(`$index $coord 8way noWrap (default)`, ({ coord, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighborsAt(coord.x, coord.y);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});

			//    x-→ 0  1  2
			//      +---------+
			//  0 y | 0  1  2 |
			//  1 ↓ | 3  4  5 |
			//  2   | 6  7  8 |
			//      +---------+
			test.each`
				index | coord             | sorted                      | actual
				${4}  | ${{ x: 1, y: 1 }} | ${[0, 1, 2, 3, 5, 6, 7, 8]} | ${[0, 1, 2, 5, 8, 7, 6, 3]}
				${1}  | ${{ x: 1, y: 0 }} | ${[0, 2, 3, 4, 5, 6, 7, 8]} | ${[6, 7, 8, 2, 5, 4, 3, 0]}
				${0}  | ${{ x: 0, y: 0 }} | ${[1, 2, 3, 4, 5, 6, 7, 8]} | ${[8, 6, 7, 1, 4, 3, 5, 2]}
				${5}  | ${{ x: 2, y: 1 }} | ${[0, 1, 2, 3, 4, 6, 7, 8]} | ${[1, 2, 0, 3, 6, 8, 7, 4]}
				${7}  | ${{ x: 1, y: 2 }} | ${[0, 1, 2, 3, 4, 5, 6, 8]} | ${[3, 4, 5, 8, 2, 1, 0, 6]}
			`(`$index $coord 8way wrap`, ({ coord, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighborsAt(coord.x, coord.y, true, true);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});
		});
	});

	describe('rect 5x3 world', () => {
		const w = 5;
		const h = 3;

		describe('getNeighbors', () => {
			//  x -→   0    1    2    3    4
			//      +-----------------------
			//  0 y |  0 |  1 |  2 |  3 |  4
			//  1 ↓ |  5 |  6 |  7 |  8 |  9
			//  2   | 10 | 11 | 12 | 13 | 14
			//      +-----------------------
			test.each`
				index | sorted                         | actual
				${0}  | ${[1, 5, 6]}                   | ${[1, 6, 5]}
				${2}  | ${[1, 3, 6, 7, 8]}             | ${[3, 8, 7, 6, 1]}
				${8}  | ${[2, 3, 4, 7, 9, 12, 13, 14]} | ${[2, 3, 4, 9, 14, 13, 12, 7]}
				${14} | ${[8, 9, 13]}                  | ${[8, 9, 13]}
			`(`$index 8way noWrap`, ({ index, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighbors(index);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});
		});

		describe('getNeighborsAt', () => {
			//  x -→   0    1    2    3    4
			//      +-----------------------
			//  0 y |  0 |  1 |  2 |  3 |  4
			//  1 ↓ |  5 |  6 |  7 |  8 |  9
			//  2   | 10 | 11 | 12 | 13 | 14
			//      +-----------------------
			test.each`
				index | coord             | sorted                         | actual
				${0}  | ${{ x: 0, y: 0 }} | ${[1, 5, 6]}                   | ${[1, 6, 5]}
				${2}  | ${{ x: 2, y: 0 }} | ${[1, 3, 6, 7, 8]}             | ${[3, 8, 7, 6, 1]}
				${8}  | ${{ x: 3, y: 1 }} | ${[2, 3, 4, 7, 9, 12, 13, 14]} | ${[2, 3, 4, 9, 14, 13, 12, 7]}
				${14} | ${{ x: 4, y: 2 }} | ${[8, 9, 13]}                  | ${[8, 9, 13]}
			`(`$index $coord 8way noWrap (default)`, ({ coord, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighborsAt(coord.x, coord.y);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});

			//  x -→   0    1    2    3    4
			//      +-----------------------
			//  0 y |  0 |  1 |  2 |  3 |  4
			//  1 ↓ |  5 |  6 |  7 |  8 |  9
			//  2   | 10 | 11 | 12 | 13 | 14
			//      +-----------------------
			test.each`
				index | coord             | sorted                         | actual
				${0}  | ${{ x: 0, y: 0 }} | ${[1, 4, 5, 6, 9, 10, 11, 14]} | ${[14, 10, 11, 1, 6, 5, 9, 4]}
				${2}  | ${{ x: 2, y: 0 }} | ${[1, 3, 6, 7, 8, 11, 12, 13]} | ${[11, 12, 13, 3, 8, 7, 6, 1]}
				${8}  | ${{ x: 3, y: 1 }} | ${[2, 3, 4, 7, 9, 12, 13, 14]} | ${[2, 3, 4, 9, 14, 13, 12, 7]}
				${14} | ${{ x: 4, y: 2 }} | ${[0, 3, 4, 5, 8, 9, 10, 13]}  | ${[8, 9, 5, 10, 0, 4, 3, 13]}
			`(`$index $coord 8way wrap`, ({ coord, sorted, actual }) => {
				const world = new World(w, h);
				const result = world.getNeighborsAt(coord.x, coord.y, true, true);
				expect([...result].sort((a, b) => a - b)).toEqual(sorted);
				// the actual results is clockwise from top left -> left
				expect(result).toEqual(actual);
			});
		});
	});
});
