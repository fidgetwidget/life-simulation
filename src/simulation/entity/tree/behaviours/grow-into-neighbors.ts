import { Elements } from '@/elements';
import type { TreeBehaviour } from '../type';
import { getCirclePoints, getNeighbors, pickRandom } from '@/util';

const CAN_GROW_ON = [
  Elements.EMPTY,
  Elements.GRASS,
  Elements.TALL_GRASS,
  Elements.ROOTS,
];

export const GrowIntoNeighbors: TreeBehaviour = {
  filter: ({ tree }) =>
    !tree.isSapling &&
    (tree.growth < 4 || (tree.growth < 32 && tree.roots > 3)),
  action: ({ tree, world }) => {
    const { min, max } = world;
    const { origin, growth } = tree;
    let ncoords: XY[];
    if (growth > 8) {
      ncoords = getCirclePoints(origin, 2);
    } else {
      ncoords = getNeighbors(origin, min, max, false, growth > 4);
    }

    const options = ncoords.filter(
      (coord) =>
        !tree.points.includes(coord) &&
        CAN_GROW_ON.includes(world.getValue(coord.x, coord.y)),
    );
    if (options.length === 0) return;

    const point = pickRandom(options);
    tree.addPoint(point, Elements.TREE);
  },
};
