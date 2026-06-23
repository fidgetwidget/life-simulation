import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const GrowGrassInMeadows: WorldBehavior = {
  // has trees and grass and lots of empty space
  filter: ({ values, counts }) =>
    (counts[Elements.TREE] > 0 || counts[Elements.TREE_TRUNK] > 0) && // has at least 1 tree
    counts[Elements.GRASS] >= 6 && // has enough grass already
    counts[Elements.EMPTY] > values.length * 0.2, // has enough empty space that needs filling.
  // grow grass in the chunk
  action: ({ qworld, chunk }) => {
    const empties = chunk.indexes.filter(
      (i) => qworld.getValue(i) === Elements.EMPTY,
    );
    const i = pickRandom(empties);
    qworld.setValue(i, Elements.GRASS);
  },
};
