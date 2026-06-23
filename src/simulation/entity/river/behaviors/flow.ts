import { Logger } from '@/lib/Logger';
import type { EntityBehavior } from '@/simulation/type';
import {
  add,
  // difference,
  floor,
  multiply,
  // normalize,
  pickRandom,
  // round,
  // XY,
} from '@/util';
import { rng } from '@/util/Random';

import type { River } from '..';

const MIN_STEP = 2;
const MAX_STEP = 5;

export const Flow: EntityBehavior = {
  filter: ({ entity }) => {
    const river = entity as River;
    return river.segments.length == 0 || river.length < river.maxLength;
  },
  action: ({ entity }) => {
    const river = entity as River;
    let start;
    if (river.segments.length === 0) {
      start = river.origin;
    } else {
      const endIndex = pickRandom(river.ends);
      start = river.segments[endIndex].end;
    }

    const length = Math.floor(rng.next(MIN_STEP, MAX_STEP));
    const direction = river.direction;
    const delta = multiply(river.direction, length, false);
    const end = add(start, delta, false);
    floor(end);
    Logger.info('River:flow', { start, end, delta, direction, length });
    river.addSegment({ start, end });
  },
};
