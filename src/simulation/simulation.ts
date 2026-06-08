import { behaviours } from "./behaviours";
import type { QWorld } from "./qworld";
import type { World } from "./world";

export class Simulation {
  world: World;
  qworld: QWorld;
  curInx: number = 0;

  constructor(qworld: QWorld) {
    this.qworld = qworld;
    this.world = qworld.world;
  }

  tick() {
    const curChunk = this.qworld.root.chunks[this.curInx++];
    if (this.curInx >= this.qworld.root.chunks.length) this.curInx = 0;

    const values = curChunk.indexes.map((i) => this.world.get(i));
    const counts = values.reduce((acc: Record<number, number>, cur: number) => {
      if (acc[cur] === undefined) acc[cur] = 0;
      acc[cur] += 1;
      return acc;
    }, {});
    // test the values set for behaviours
    // do those behaviours (set values on the world)
    let didAction = false;
    behaviours.forEach(({ condition, action }) => {
      if (condition({ world: this.world, chunk: curChunk, values, counts })) {
        didAction = true;
        action({ world: this.world, chunk: curChunk });
      }
    });

    return didAction ? curChunk : null;
  }
}
