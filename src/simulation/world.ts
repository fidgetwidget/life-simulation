import { getNeighbors } from '../util';

export class World {
	// These shouldn't be changed external to the methods that manipulate them.
	private w: number;
	private h: number;
	private motes: Array<number> = [];
	private changes: Array<number> = [];

	get hasChanges(): boolean {
		return this.changes.length > 0;
	}

	constructor(w: number, h: number) {
		this.w = w;
		this.h = h;
		const size = w * h;
		this.motes = new Array(size);
		this.motes.fill(0);
		console.debug('World:new', { w, h, size, v: this.motes });
	}

	get(i: number) {
		return this.motes[i];
	}

	getAt(x: number, y: number) {
		let i = y * this.w + x;
		return this.motes[i];
	}

	getNeighborValues(i: number, eightWay: boolean = true): number[] {
		const x = Math.floor(i % this.w);
		const y = Math.floor(i / this.w);
		return this.getNeighborValuesAt(x, y, eightWay);
	}

	getNeighborValuesAt(
		x: number,
		y: number,
		eightWay: boolean = true,
	): number[] {
		return getNeighbors({ x, y }, this.w, this.h, 0, 0, false, eightWay).map(
			({ x, y }) => this.getAt(x, y),
		);
	}

	// get the neighbors values for a given index.
	getNeighbors(
		i: number,
		eightWay: boolean = true,
		wrap: boolean = false,
	): number[] {
		const x = Math.floor(i % this.w);
		const y = Math.floor(i / this.w);
		return this.getNeighborsAt(x, y, eightWay, wrap);
	}

	// get the neighbors values for a given positions coord.
	getNeighborsAt(
		x: number,
		y: number,
		eightWay: boolean = true,
		wrap: boolean = false,
	): number[] {
		// TODO: optimize this - getNeighbors is expensive to call like this (generates a lot of memory garbage).
		const maxx = this.w - 1;
		const maxy = this.h - 1;
		const minx = 0;
		const miny = 0;
		const coords = getNeighbors(
			{ x, y },
			maxx,
			maxy,
			minx,
			miny,
			wrap,
			eightWay,
		);
		console.debug('getNeighborsAt', { x, y, maxx, maxy, minx, miny, coords });
		return coords.map(({ x, y }) => y * this.w + x);
	}

	set(i: number, v: number, forceNext: boolean = false) {
		if (i == null || v == null) debugger;
		this.motes[i] = v;
		forceNext ? this.changes.push(i) : this.changes.unshift(i);
		console.debug('World:set', {
			i,
			v,
			force: forceNext,
			changes: JSON.stringify(this.changes),
		});
	}

	setAt(x: number, y: number, v: number, forceNext: boolean = false) {
		let i = y * this.w + x;
		if (i == null || v == null) debugger;
		this.motes[i] = v;
		forceNext ? this.changes.push(i) : this.changes.unshift(i);
		console.debug('World:setAt', {
			x,
			y,
			i,
			v,
			force: forceNext,
			changes: JSON.stringify(this.changes),
		});
	}

	process() {
		if (!this.hasChanges) return null;
		const i = this.changes.pop()!;
		const x = Math.floor(i % this.w);
		const y = Math.floor(i / this.w);
		const v = this.motes[i];
		console.debug('world:process', { x, y, i, v });
		return { i, x, y, v };
	}
}
