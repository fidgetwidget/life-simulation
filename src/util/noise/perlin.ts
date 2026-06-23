import { seed } from './noise';
import { dot2 } from './vec3';

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}

export function perlin2(x: number, y: number, { perm, gradP } = seed(0)) {
  // Find unit grid cell containing point
  let X = Math.floor(x),
    Y = Math.floor(y);
  // Get relative xy coordinates of point within that cell
  x = x - X;
  y = y - Y;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255;
  Y = Y & 255;

  // Calculate noise contributions from each of the four corners
  const n00 = dot2(gradP[X + perm[Y]], x, y);
  const n01 = dot2(gradP[X + perm[Y + 1]], x, y - 1);
  const n10 = dot2(gradP[X + 1 + perm[Y]], x - 1, y);
  const n11 = dot2(gradP[X + 1 + perm[Y + 1]], x - 1, y - 1);

  // Compute the fade curve value for x
  const u = fade(x);
  const v = fade(y);

  // Interpolate the four results
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
}
