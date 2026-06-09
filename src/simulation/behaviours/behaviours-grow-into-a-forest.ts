import { Elements } from "../elements";

export const BehavioursGrowIntoAForest: Behaviour[] = [
  {
    // has lots of grass, but no tree, but neighbors a big tree
    filter: ({ values, counts, world, chunk }) => {
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
];
