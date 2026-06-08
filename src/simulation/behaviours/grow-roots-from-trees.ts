import { pickRandom } from "../../utils";
import { Elements } from "../elements";

export const GrowRootsFromTrees: Behaviour = {
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
};
