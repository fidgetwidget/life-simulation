import { pickRandom } from '../../util';
import { Elements } from '../../elements';
import { getCountsReducer } from './utils';

export const BehavioursExpandTreeIntoRoot: Behaviour[] = [
  {
    // has roots, not not too many, and a tree
    filter: ({ values, counts }) =>
      counts[Elements.ROOTS] > 0 &&
      counts[Elements.ROOTS] < values.length * 0.1 &&
      counts[Elements.TREE_STUMP] > 0,
    // spread roots
    action: ({ world, chunk }) => {
      const rootsIndexes = chunk.indexes.filter(
        (i) => world.get(i) === Elements.ROOTS,
      );
      const randomRoot = pickRandom(rootsIndexes);
      const nonRootOrTreeNeighbors = world
        .getNeighbors(randomRoot)
        .filter((i) => {
          const val = world.get(i);
          return val !== Elements.ROOTS && val !== Elements.TREE_STUMP;
        });
      if (nonRootOrTreeNeighbors.length === 0) return;
      const randomValidNeighbor = pickRandom(nonRootOrTreeNeighbors);
      world.set(randomValidNeighbor, Elements.ROOTS);
    },
  },
  {
    // has multiple roots and not too much tree
    filter: ({ counts }) =>
      counts[Elements.ROOTS] > 1 &&
      (counts[Elements.TREE_STUMP] == null || counts[Elements.TREE_STUMP] < 9),
    // roots become tree
    action: ({ world, chunk }) => {
      const rootsIndexes = chunk.indexes.filter(
        (i) => world.get(i) === Elements.ROOTS,
      );
      const randomRoot = pickRandom(rootsIndexes);
      const neighborValues = world.getNeighborValues(randomRoot);
      const counts = neighborValues.reduce(getCountsReducer, {});
      // has at least 1 root neighbor and a tree stump neighbor
      if (counts[Elements.ROOTS] >= 1 && Elements.TREE_STUMP >= 1) {
        world.set(randomRoot, Elements.TREE_STUMP);
      }
    },
  },
];
