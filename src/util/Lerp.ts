import { XY } from './XY';

export function smoothStep(min: number, max: number, val: number): number {
  if (min === max) return val < min ? 0 : 1;
  const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function lerpNumber(start: number, end: number, t: number): number {
  return start * (1.0 - t) + t * end;
}

export function lerpXY(a: XY, b: XY, t: number, out: XY = XY(0, 0)): XY {
  out.x = lerpNumber(a.x, b.x, t);
  out.y = lerpNumber(a.y, b.y, t);
  return out;
}
