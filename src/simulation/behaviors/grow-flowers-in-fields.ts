import { Elements } from '@/elements';
import { pickRandom } from '@/util';

export const GrowFlowersInFields: WorldBehavior = {
  // has enough grass
  filter: ({ values, counts }) =>
    counts[Elements.GRASS] > values.length * 0.25 &&
    counts[Elements.FLOWERS] < values.length * 0.2,
  // maybe grow a flower
  action: ({ qworld, chunk }) => {
    const grass = chunk.indexes.filter(
      (i) => qworld.getValue(i) === Elements.GRASS,
    );
    const i = pickRandom(grass);
    const neighbors = qworld.getNeighborValues(i);
    const grassCount = neighbors.reduce((acc, cur) => {
      acc += cur === Elements.GRASS || cur === Elements.FLOWERS ? 1 : 0;
      return acc;
    }, 0);
    if (grassCount > 6) {
      qworld.setValue(i, Elements.FLOWERS);
    }
  },
};
