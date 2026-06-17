import type { EntityType } from '@/simulation/entity/type';
// import { Logger } from '@/lib/Logger.ts';

import type { QWorld } from '@/simulation/qworld';
import { XY } from '@/util';

export class Entity {
  type: EntityType;
  origin: XY;
  points: XY[] = [];
  world: QWorld;

  constructor(type: EntityType, origin: XY, world: QWorld) {
    this.type = type;
    this.origin = origin;
    this.world = world;
  }
}
