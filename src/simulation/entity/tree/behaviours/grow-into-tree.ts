import { Elements } from '@/elements';
import type { TreeBehaviour } from '../type';
import { Logger } from '@/lib/Logger';

export const GrowIntoTree: TreeBehaviour = {
  filter: ({ tree }) => tree.isSapling,
  action: ({ tree }) => {
    Logger.info('GrowIntoTree', { point: tree.origin });
    tree.addPoint(tree.origin, Elements.TREE_TRUNK);
  },
};
