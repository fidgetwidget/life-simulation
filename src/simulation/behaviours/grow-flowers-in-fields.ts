import { pickRandom } from "../../utils";
import { Elements } from "../elements";

export const GrowFlowersInFields: Behaviour = {
  // has enough grass
  filter: ({ values, counts }) => counts[Elements.GRASS] > values.length * 0.25,
  // maybe grow a flower
  action: ({ world, chunk }) => {
    const grass = chunk.indexes.filter((i) => world.get(i) === Elements.GRASS);
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
};
