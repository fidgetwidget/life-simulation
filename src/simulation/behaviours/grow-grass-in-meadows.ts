import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const GrowGrassInMeadows: Behaviour = {
  // has trees and grass and lots of empty space
  filter: ({ values, counts }) =>
    counts[Elements.TREE] > 0 && // has at least 1 tree
    counts[Elements.GRASS] >= 5 && // has at least 5 grass already
    counts[Elements.EMPTY] > values.length * 0.2, // has enough empty space that needs filling.
  // grow grass in the chunk
  action: ({ world, chunk }) => {
    const empties = chunk.indexes.filter(
      (i) => world.get(i) === Elements.EMPTY,
    );
    const i = pickRandom(empties);
    world.set(i, Elements.GRASS);
  },
};
