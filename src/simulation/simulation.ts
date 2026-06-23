import { MAX_CHUNKS_PER_TICK } from '@/const';

import { behaviors } from './behaviors';
import type { QWorld } from './qworld';

export class Simulation {
  qworld: QWorld;
  curInx: number = 0;

  constructor(qworld: QWorld) {
    this.qworld = qworld;
  }

  public tick() {
    for (let count = 0; count < MAX_CHUNKS_PER_TICK; count++) {
      const chunk = this.qworld.getChunk(this.curInx++);
      if (this.curInx >= this.qworld.chunkCount) this.curInx = 0;
      this.simulateChunk(chunk);
    }
  }

  private simulateChunk(chunk: Chunk) {
    const { qworld } = this;
    qworld.entities.forEach((e) => chunk.index === e.chunkOrigin && e.grow());
    const values = chunk.indexes.map((i) => qworld.getValue(i));
    const counts = values.reduce((acc: Record<number, number>, cur: number) => {
      if (acc[cur] === undefined) acc[cur] = 0;
      acc[cur] += 1;
      return acc;
    }, {});

    // NOTE: This pattern is less efficient than doing the filtering and acting in one loop
    //  but this is better for debugging.
    // TODO: have a debug vs build version of this for speed reasons.
    behaviors.forEach(
      ({ filter, action }) =>
        filter({ qworld, chunk, values, counts }) && action({ qworld, chunk }),
    );
  }
}
