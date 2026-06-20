import type { QWorld } from '@/simulation/qworld';

import type { Tree } from '.';

type TreeFilterProps = {
  tree: Tree;
  world: QWorld;
};

type TreeActionProps = {
  tree: Tree;
  world: QWorld;
};

type TreeBehaviour = {
  filter: (props: TreeFilterProps) => boolean;
  action: (props: TreeActionProps) => void;
};
