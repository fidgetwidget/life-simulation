import { Elements } from '@/elements';
import { filterInPlace, pickRandom } from '@/util';

export const GrowGrassNearTrees: WorldBehaviour = {
  // has trees
  filter: ({ counts }) => counts[Elements.TREE] > 0,
  // grow grass against the tree
  action: ({ qworld, chunk }) => {
    const trees = chunk.indexes.filter(
      (i) => qworld.getValue(i) === Elements.TREE,
    );
    const randomTree = pickRandom(trees);
    // TODO: make a util in world to get indexes around a point at a given distance so we can have it spread beyond touching
    const options = qworld.getNeighbors(randomTree);
    // only place grass where there isn't something else
    filterInPlace(options, (i) => qworld.getValue(i) === Elements.EMPTY);
    if (options.length === 0) return;
    qworld.setValue(pickRandom(options), Elements.GRASS);
  },
};
