import { Elements } from "../elements";
import { pickRandom } from "../../utils";
import { GrowGrassNearTrees } from "./grow-grass-near-trees";
import { GrowGrassInMeadows } from "./grow-grass-in-meadows";
import { GrowRootsFromTrees } from "./grow-roots-from-trees";
import { BehavioursExpandTreeIntoRoot } from "./behaviours-expand-tree-into-root";
import { SpreadGrassOutFromMeadows } from "./spread-grass-out-from-meadows";
import { GrowFlowersInFields } from "./grow-flowers-in-fields";

export const behaviours: Behaviour[] = [
  ...BehavioursExpandTreeIntoRoot,
  GrowGrassNearTrees,
  GrowGrassInMeadows,
  GrowRootsFromTrees,
  GrowFlowersInFields,
  SpreadGrassOutFromMeadows,
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
];
