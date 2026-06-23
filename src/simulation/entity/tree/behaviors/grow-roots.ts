import { Elements } from '@/elements';
import type { EntityBehavior } from '@/simulation/type';
import { filterInPlace, getNeighborsPlus, pickRandom } from '@/util';

import type { Tree } from '..';

const CAN_GROW_ON = [Elements.EMPTY, Elements.GRASS, Elements.TALL_GRASS];

export const GrowRoots: EntityBehavior = {
  filter: ({ entity }) =>
    (entity as Tree).growth > 3 && (entity as Tree).roots < 5,
  action: ({ entity, world }) => {
    let ncoords: XY[] = [];
    const { min, max } = world;
    const { points } = entity;
    const eightWay = true;
    const wrap = false;
    points.forEach((p) => {
      let n = getNeighborsPlus(p, min, max, eightWay, wrap);
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
    entity.addPoint(point, Elements.ROOTS);
  },
};
