import { pickRandom } from '../../util';
import { Elements } from '../../elements';

export const GrowFlowersInFields: Behaviour = {
  // has enough grass
  filter: ({ values, counts }) =>
    counts[Elements.GRASS] > values.length * 0.25 &&
    counts[Elements.FLOWERS] < values.length * 0.2,
  // maybe grow a flower
  action: ({ world, chunk }) => {
    const grass = chunk.indexes.filter((i) => world.get(i) === Elements.GRASS);
    const i = pickRandom(grass);
    const neighbors = world.getNeighborValues(i);
    const grassCount = neighbors.reduce((acc, cur) => {
      acc += cur === Elements.GRASS || cur === Elements.FLOWERS ? 1 : 0;
      return acc;
    }, 0);
    if (grassCount > 6) {
      world.set(i, Elements.FLOWERS);
    }
  },
};
