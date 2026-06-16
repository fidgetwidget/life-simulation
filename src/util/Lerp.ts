import { XY } from './XY';

export function lerpNumber(start: number, end: number, t: number): number {
  return start * (1.0 - t) + t * end;
}

export function lerpXY(a: XY, b: XY, t: number, out: XY = XY(0, 0)): XY {
  out.x = lerpNumber(a.x, b.x, t);
  out.y = lerpNumber(a.y, b.y, t);
  return out;
}
