import { Elements } from '@/elements';
import { filterInPlace, getNeighbors, pickRandom } from '@/util';

import type { TreeBehaviour } from '../type';

const CAN_GROW_ON = [Elements.EMPTY, Elements.GRASS, Elements.TALL_GRASS];

export const GrowRoots: TreeBehaviour = {
  filter: ({ tree }) => tree.growth > 3 && tree.roots < 5,
  action: ({ tree, world }) => {
    let ncoords: XY[] = [];
    const { min, max } = world;
    const { points } = tree;
    points.forEach((p) => {
      let n = getNeighbors(p, min, max, false, true);
      ncoords.push(...n);
    });
    filterInPlace(
      ncoords,
      (coord) =>
        !points.includes(coord) &&
        CAN_GROW_ON.includes(world.getValue(coord.x, coord.y)),
    );
    if (ncoords.length === 0) return;
    const point = pickRandom(ncoords);
    tree.addPoint(point, Elements.ROOTS);
  },
};
