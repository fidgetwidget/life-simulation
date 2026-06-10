import { SIM_PER_TICK_CAP } from '../const';
import { behaviours } from './behaviours';
import type { QWorld } from './qworld';
import type { World } from './world';

export class Simulation {
	world: World;
	qworld: QWorld;
	curInx: number = 0;

	constructor(qworld: QWorld) {
		this.qworld = qworld;
		this.world = qworld.world;
	}

	tick() {
		for (let count = 0; count < SIM_PER_TICK_CAP; count++) {
			const chunk = this.qworld.root.chunks[this.curInx++];
			if (this.curInx >= this.qworld.root.chunks.length) this.curInx = 0;
			this.simulate(chunk);
		}
	}

	private simulate(chunk: Chunk) {
		const world = this.world;
		const values = chunk.indexes.map((i) => world.get(i));
		const counts = values.reduce((acc: Record<number, number>, cur: number) => {
			if (acc[cur] === undefined) acc[cur] = 0;
			acc[cur] += 1;
			return acc;
		}, {});

		// NOTE: This pattern is less efficient than doing the filtering and acting in one loop
		//  but this is better for debugging.
		// TODO: have a debug vs build version of this for speed reasons.
		const actionable = behaviours.filter(({ filter }) =>
			filter({ world, chunk, values, counts }),
		);
		actionable.forEach(({ action }) => action({ world, chunk }));

		return actionable.length > 0 ? chunk : null;
	}
}
