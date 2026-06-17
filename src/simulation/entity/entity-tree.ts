import type { QWorld } from '../qworld';
import { EntityType } from './type';
import { Entity } from './world-entity';

export class EntityTree extends Entity {
  constructor(origin: XY, world: QWorld) {
    super(EntityType.Tree, origin, world);
  }

  grow() {}
}
