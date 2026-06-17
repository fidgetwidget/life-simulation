import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const SpreadGrassOutFromMeadows: Behaviour = {
  // has a tree and enough grass
  filter: ({ values, counts }) =>
    values.includes(Elements.TREE_STUMP) &&
    counts[Elements.GRASS] > values.length * 0.25,
  // spread grass beyond the chunk
  action: ({ world, chunk }) => {
    const neighbors = chunk.neighbors;
    const nci = pickRandom(neighbors);
    const nchunk = chunk.root.chunks[nci];
    // TODO: have chunks keep a 'state' based on their composition
    //  to make checking/rejecting faster.
    const indexes = nchunk.indexes;
    const empties = indexes.filter((i) => world.get(i) === Elements.EMPTY);
    if (empties.length === 0 || empties.length < 5) return;
    world.set(pickRandom(empties), Elements.GRASS);
  },
};
