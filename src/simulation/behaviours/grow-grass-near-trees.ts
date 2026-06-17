import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const GrowGrassNearTrees: Behaviour = {
  // has trees
  filter: ({ counts }) => counts[Elements.TREE_STUMP] > 0,
  // grow grass against the tree
  action: ({ world, chunk }) => {
    const trees = chunk.indexes.filter(
      (i) => world.get(i) === Elements.TREE_STUMP,
    );
    const randomTree = pickRandom(trees);
    // TODO: make a util in world to get indexes around a point at a given distance so we can have it spread beyond touching
    const neighbors = world.getNeighbors(randomTree);
    // only place grass where there isn't something else
    const options = neighbors.filter((i) => world.get(i) === Elements.EMPTY);
    if (options.length === 0) return;
    world.set(pickRandom(options), Elements.GRASS);
  },
};
