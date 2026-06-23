import type { EntityBehavior } from '@/simulation/type';
import { difference, normalize, pickRandom, XY } from '@/util';
import { rng } from '@/util/Random';

import type { River, RiverSegment } from '..';
import { MAX_LENGTH, MAX_SPLITS } from '../constants';

export const Split: EntityBehavior = {
  filter: ({ entity }) => {
    const river = entity as River;
    const longEnough = river.segments.length > 3;
    const notTooSplit = river.splitPoints.length < MAX_SPLITS;
    const notTooLong = river.segments.length < MAX_LENGTH;
    return longEnough && notTooLong && notTooSplit;
  },
  action: ({ entity }) => {
    const river = entity as River;
    const endIndex = pickRandom(river.ends);
    const segment = river.segments[endIndex];
    river.splitPoints.push(segment.end);
    addSegment(river, segment, rng.next(5, 12));
    addSegment(river, segment, rng.next(5, 12));
  },
};

function addSegment(
  river: River,
  { start, end }: RiverSegment,
  length: number,
) {
  // set a direction
  const direction = difference(start, end);
  direction.x += ((direction.x > 0 ? 1 : -1) * rng.next()) / 1000;
  direction.y += ((direction.y > 0 ? 1 : -1) * rng.next()) / 1000;
  normalize(direction, true);

  const endPoint = XY(
    Math.floor(direction.x * length),
    Math.floor(direction.y * length),
  );

  river.addSegment({
    start: end,
    end: endPoint,
  });
}
