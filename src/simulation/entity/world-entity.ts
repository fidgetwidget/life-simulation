import type { EntityType } from './entity-type';
import { Logger } from '@/lib/Logger.ts';
import { XY } from '@/util';

export class Entity {
  type: EntityType;
  origin: XY;
  points: XY[] = [];

  constructor(type: EntityType, origin: XY) {
    this.type = type;
    this.origin = origin;
  }
}
