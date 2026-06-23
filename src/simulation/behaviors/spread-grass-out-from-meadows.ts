import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const SpreadGrassOutFromMeadows: WorldBehavior = {
  // has a tree and enough grass
  filter: ({ values, counts }) => counts[Elements.GRASS] > values.length * 0.25,
  // spread grass beyond the chunk
  action: ({ qworld, chunk }) => {
    const neighbors = chunk.neighbors;
    const nci = pickRandom(neighbors);
    const nchunk = chunk.root.chunks[nci];
    // TODO: have chunks keep a 'state' based on their composition to make checking/rejecting faster
    const empties = nchunk.indexes.filter(
      (i) => qworld.getValue(i) === Elements.EMPTY,
    );
    if (empties.length === 0 || empties.length < 5) return;
    qworld.setValue(pickRandom(empties), Elements.GRASS);
  },
};
