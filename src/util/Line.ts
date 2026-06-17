import { lerpXY } from './Lerp';
import { diagonalDistance, round, XY } from './XY';

export function getPointsAlongLine(start: XY, end: XY, min: XY, max: XY): XY[] {
  // clamp start and end to max and min.
  const points: XY[] = [];
  const N = diagonalDistance(start, end);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    const p = lerpXY(start, end, t);
    round(p);
    // until we clamp the start/end, if we hit the limit, end the loop.
    if (p.x < min.x || p.y < min.y || p.x > max.x || p.y > max.y) step = N;
    points.push(p);
  }
  return points;
}
