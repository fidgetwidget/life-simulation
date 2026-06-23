import type { QWorld } from '@/simulation/qworld';

import type { Entity } from './entity';

type EntityFilterProps = {
  entity: Entity;
  world: QWorld;
};

type EntityActionProps = {
  entity: Entity;
  world: QWorld;
};

type EntityBehavior = {
  filter: (props: EntityFilterProps) => boolean;
  action: (props: EntityActionProps) => void;
};
