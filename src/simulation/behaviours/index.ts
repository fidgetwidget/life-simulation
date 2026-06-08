import { Elements } from "../elements";
import { pickRandom } from "../../utils";

const getCountsReducer = (acc: Record<number, number>, cur: number) => {
  if (acc[cur] == null) {
    acc[cur] = 0;
  }
  acc[cur] += 1;
  return acc;
};

export const behaviours: Behaviour[] = [
  {
    // has trees
    condition: ({ counts }) => counts[Elements.TREE_STUMP] > 0,
    // grow grass against the tree
    action: ({ world, chunk }) => {
      const treeindexes = chunk.indexes.filter(
        (i) => world.get(i) === Elements.TREE_STUMP,
      );
      const randomTreeIndex = pickRandom(treeindexes);
      const neighbors = world.getNeighbors(randomTreeIndex);
      const options = neighbors.filter((i) => world.get(i) === Elements.EMPTY);
      const i = pickRandom(options);
      world.set(i, Elements.GRASS);
    },
  },
  {
    // has trees and grass and lots of empty space
    condition: ({ values, counts }) =>
      counts[Elements.TREE_STUMP] > 0 &&
      counts[Elements.GRASS] > 2 &&
      counts[Elements.EMPTY] > values.length * 0.2,
    // grow grass in the chunk
    action: ({ world, chunk }) => {
      const empties = chunk.indexes.filter(
        (i) => world.get(i) === Elements.EMPTY,
      );
      const i = pickRandom(empties);
      world.set(i, Elements.GRASS);
    },
  },
  {
    // has lots of grass, but no tree, but neighbors a big tree
    condition: ({ values, counts, world, chunk }) => {
      if (counts[Elements.GRASS] < values.length * 0.25) return false;
      const hasTreeNeighbors = chunk.neighbors.reduce((acc, cur) => {
        if (acc) return acc;
        const worldIndexes = chunk.root.chunks[cur].indexes;
        const hasTree = worldIndexes.reduce((acc, cur) => {
          if (acc) return acc;
          const hasTree = world.get(cur) === Elements.TREE_STUMP;
          return hasTree;
        }, false);
        return hasTree;
      }, false);
      return hasTreeNeighbors;
    },
    action: () => null,
  },
  {
    // has multiple tree pieces and some grass
    condition: ({ values, counts }) =>
      counts[Elements.TREE_STUMP] > 1 &&
      counts[Elements.GRASS] > values.length * 0.2,
    // grow roots
    action: ({ world, chunk }) => {
      const trees = chunk.indexes.filter(
        (i) => world.get(i) === Elements.TREE_STUMP,
      );
      const treeindex = pickRandom(trees);
      const neighbors = world.getNeighbors(treeindex);
      const options = neighbors.filter((i) => world.get(i) === Elements.GRASS);
      const i = pickRandom(options);
      world.set(i, Elements.ROOTS);
    },
  },
  {
    // has roots, not not too many, and a tree
    condition: ({ values, counts }) =>
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
    condition: ({ counts }) =>
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
  {
    // has a tree and enough grass
    condition: ({ values, counts }) =>
      values.includes(Elements.TREE_STUMP) &&
      counts[Elements.GRASS] > values.length * 0.25,
    // spread grass beyond the chunk
    action: ({ world, chunk }) => {
      const neighbors = chunk.neighbors;
      const nci = pickRandom(neighbors);
      const indexes = chunk.root.chunks[nci].indexes;
      const empties = indexes.filter((i) => world.get(i) === Elements.EMPTY);
      const i = pickRandom(empties);
      world.set(i, Elements.GRASS);
    },
  },
  {
    // has enough grass
    condition: ({ values, counts }) =>
      counts[Elements.GRASS] > values.length * 0.25,
    // maybe grow a flower
    action: ({ world, chunk }) => {
      const grass = chunk.indexes.filter(
        (i) => world.get(i) === Elements.GRASS,
      );
      const i = pickRandom(grass);
      const neighbors = world.getNeighbors(i);
      const allGrass = neighbors.reduce(
        (acc, cur) => acc && cur === Elements.GRASS,
        true,
      );
      if (allGrass) {
        world.set(i, Elements.FLOWERS);
      }
    },
  },
];
