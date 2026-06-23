import { Elements } from '@/elements';
import type { EntityBehavior } from '@/simulation/type';

import type { Tree } from '..';

export const GrowIntoTree: EntityBehavior = {
  filter: ({ entity }) => (entity as Tree).isSapling,
  action: ({ entity }) => {
    entity.addPoint(entity.origin, Elements.TREE_TRUNK);
  },
};
