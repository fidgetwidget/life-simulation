import { Elements } from '@/elements';
import type { TreeBehaviour } from '../type';

export const GrowIntoTree: TreeBehaviour = {
  filter: ({ tree }) => tree.isSapling,
  action: ({ tree }) => {
    tree.addPoint(tree.origin, Elements.TREE_TRUNK);
  },
};
