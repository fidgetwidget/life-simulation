import { Logger } from '@/lib/Logger';
import type { EntityBehavior } from '@/simulation/type';
import {
  add,
  difference,
  // floor,
  fromRadians,
  multiply,
  // normalize,
  pickRandom,
  round,
  toRadians,
  // XY,
} from '@/util';
import { rng } from '@/util/Random';

import type { River } from '..';
import { MAX_BENDS, MAX_LENGTH } from '../constants';

export const Bend: EntityBehavior = {
  filter: ({ entity }) => {
    const river = entity as River;
    const hasASegment = river.segments.length > 0;
    const notTooBent = river.bendPoints.length < MAX_BENDS;
    const notTooLong = river.segments.length < MAX_LENGTH;
    return hasASegment && notTooLong && notTooBent;
  },
  action: ({ entity }) => {
    const river = entity as River;
    const endIndex = pickRandom(river.ends);
    const { start, end } = river.segments[endIndex];

    const length = rng.next(5, 12);

    // set a direction
    const dir = difference(start, end);
    let r = toRadians(dir);
    const delta = round(fromRadians(r));
    multiply(delta, length);
    const endPoint = round(add(end, delta, false));
    Logger.info('River:bend', { length, start: end, delta, r, endPoint });

    river.bendPoints.push(end);
    river.addSegment({
      start: end,
      end: endPoint,
    });
  },
};
