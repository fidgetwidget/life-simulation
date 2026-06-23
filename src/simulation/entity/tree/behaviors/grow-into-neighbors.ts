import { Elements } from '@/elements';
import type { EntityBehavior } from '@/simulation/type';
import { getCirclePoints, getNeighborsPlus, pickRandom } from '@/util';

import type { Tree } from '..';

const CAN_GROW_ON = [
  Elements.EMPTY,
  Elements.GRASS,
  Elements.TALL_GRASS,
  Elements.ROOTS,
];

export const GrowIntoNeighbors: EntityBehavior = {
  filter: ({ entity: e }) =>
    !(e as Tree).isSapling &&
    ((e as Tree).growth < 4 ||
      ((e as Tree).growth < 32 && (e as Tree).roots > 3)),
  action: ({ entity: e, world }) => {
    const { min, max } = world;
    const tree = e as Tree;
    const { origin, growth } = tree;
    let ncoords: XY[] = [];
    if (growth > 8) {
      getCirclePoints(origin, 2, min, max, ncoords);
    } else {
      const eightWay = growth > 4;
      const wrap = false;
      getNeighborsPlus(origin, min, max, eightWay, wrap, ncoords);
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
