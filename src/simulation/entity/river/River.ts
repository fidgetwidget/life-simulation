import { Elements } from '@/elements';
import { Logger } from '@/lib/Logger';
import type { QWorld } from '@/simulation/qworld';
import type { EntityBehavior } from '@/simulation/type';
import { equals, filterInPlace, mapInPlace, XY } from '@/util';
import { getPointsAlongLine } from '@/util/Line';
import { rng } from '@/util/Random';

import { Entity } from '..';
import { EntityType } from '../type';
// import { Bend } from './behaviors/bend';
import { Flow } from './behaviors/flow';
// import { Split } from './behaviors/split';

const MIN = 80;
const MAX = 160;

export type RiverSegment = {
  start: XY;
  end: XY;
};

export class River extends Entity {
  direction: XY;
  length: number = 1;
  maxLength: number;
  segments: RiverSegment[] = [];
  splitPoints: XY[] = [];
  bendPoints: XY[] = [];
  behaviors: EntityBehavior[] = [
    Flow,
    // Bend,
    // Split
  ];

  get start() {
    return this.segments.length > 0
      ? this.segments[0]
      : {
          start: this.origin,
          end: this.origin,
        };
  }

  // River segment ends.
  get ends() {
    const endSegments = filterInPlace(
      this.segments.map((seg, index) => ({ ...seg, index })),
      ({ end }, _, arr) =>
        arr.findIndex(({ start }) => equals(end, start)) === -1,
    );
    return mapInPlace(endSegments, ({ index }) => index);
  }

  constructor(
    origin: XY,
    world: QWorld,
    direction: XY,
    flowCount: number = 4,
    maxLength?: number,
  ) {
    super(EntityType.River, origin, world);
    this.maxLength = maxLength ?? Math.floor(rng.next(MIN, MAX));
    this.direction = direction;
    this.world.setValue(this.origin.x, this.origin.y, Elements.MOVING_WATER);
    const props = { entity: this, world: world };
    for (let i = 0; i < flowCount; i++) Flow.action(props);
    Logger.info('River:constructor', this);
  }

  override addPoint(point: XY, elm: Elements): void {
    super.addPoint(point, elm);
    if (elm === Elements.MOVING_WATER) this.length++;
  }

  addSegment(segment: RiverSegment): void {
    this.segments.push(segment);
    const { start, end } = segment;
    const { min, max } = this.world;
    const line = getPointsAlongLine(start, end, min, max);
    Logger.info('River::addSegment', { line });
    line.forEach((p) => {
      this.addPoint(p, Elements.MOVING_WATER);
    });
  }

  override grow() {
    this.behaviors
      .filter((b) => b.filter({ entity: this, world: this.world }))
      .forEach((b) => b.action({ entity: this, world: this.world }));
  }
}
