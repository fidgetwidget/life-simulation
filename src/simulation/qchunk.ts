import type { Entity } from './entity';
import type { QWorld } from './qworld';
import type { Chunk } from './structure/chunk';

export type QChunk = {
  qworld: QWorld;
  chunk: Chunk;
  index: number;
};

export const QChunk = (qworld: QWorld, index: number) => ({
  qworld,
  index,
  chunk: qworld.getChunk(index),
});

export function getEntities({ qworld, chunk }: QChunk): Entity[] {
  return qworld.entities.filter((e) => chunk.index === e.chunkOrigin);
}

export function getValues({ qworld, chunk }: QChunk): number[] {
  return chunk.indexes.map((i) => qworld.getValue(i));
}

export function getValuesRecords(qchunk: QChunk): Record<number, number> {
  const values = getValues(qchunk);
  const valueCounts: Record<number, number> = {};

  // calculate the total of each type in the chunk.
  values?.reduce((acc, cur) => {
    if (acc[cur] === undefined) {
      acc[cur] = 0;
    }
    acc[cur] += 1;
    return acc;
  }, valueCounts);

  // To transform valueCounts into % of the total rather than just counts of each type:
  // const total = values.length;
  // Array.from(Object.keys(valueCounts) as unknown[] as number[]).forEach(
  //   (key: number) => {
  //     const count = valueCounts[key];
  //     valueCounts[key] = Math.floor((count / total) * 100) / 100;
  //   },
  // );

  return valueCounts;
}

// export function getType(qchunk: QChunk): string {
// TODO: given a QChunk, return a ChunkType
// }
