import { pickRandom } from "../../utils";
import { Elements } from "../elements";

export const SpreadGrassOutFromMeadows: Behaviour = {
  // has a tree and enough grass
  filter: ({ values, counts }) =>
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
};
