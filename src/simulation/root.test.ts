import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';
import { Root } from './root';

describe('Root', () => {
	test.each([
		{ x: 0, y: 0, w: 2, h: 2, d: 1 },
		{ x: 0, y: 0, w: 8, h: 8, d: 2 },
		{ x: 0, y: 0, w: 2, h: 2, d: 1 },
	])('constructor', ({ x, y, w, h, d }) => {
		const root = new Root(x, y, w, h, d);
		expect(root.chunks.length).toBe(root.chunksHigh * root.chunksWide);
		expect(root.quadLength).toBe(2 ** d);
	});

	//  chunk (depth of 2 on 16 is 4)
	//  x -→   0    1    2    3
	//      +-------------------
	//  0 y |  0 |  1 |  2 |  3
	//  1 ↓ |  4 |  5 |  6 |  7
	//  2   |  8 |  9 | 10 | 11
	//  3   | 12 | 13 | 14 | 15
	//      +-------------------
	describe('chunk', () => {
		test.each([
			{
				root: { x: 0, y: 0, w: 16, h: 16, d: 2 },
				i: 0,
				result: [1, 5, 4],
			},
			{
				root: { x: 0, y: 0, w: 8, h: 16, d: 2 },
				i: 0,
				result: [1, 5, 4],
			},
			{
				root: { x: 0, y: 0, w: 8, h: 16, d: 2 },
				i: 1,
				result: [2, 6, 5, 4, 0],
			},
		])(
			'root { x:$root.x y:$root.y w:$root.w h:$root.h d:$root.d }: chunk[$i]:neighbors',
			({ root: { x, y, w, h, d }, i, result }) => {
				const root = new Root(x, y, w, h, d);
				const chunk = root.chunks[i];
				console.log(chunk.root.chunkWidth);
				expect(chunk.neighbors).toEqual(result);
			},
		);
	});
});
