// https://github.com/joshforisha/fast-simplex-noise-js/blob/main/src/2d.ts
// https://gamedev.stackexchange.com/questions/20880/simple-noise-generation

import { rng } from '../Random';

let perm: Uint8Array;
let permMod12: Uint8Array;

type RngFn = () => number;

// 2D Simplex UnSkew Factor
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const SKEW_FACTOR = 0.5 * (Math.sqrt(3.0) - 1.0);
const NORM_FACTOR = 70.14805770653952;

const Grad = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0, 1],
  [0, -1],
];

export const generatePermutations = (rng: RngFn) => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;

  let n: number;
  let q: number;
  for (let i = 255; i > 0; i--) {
    n = Math.floor((i + 1) * rng());
    q = p[i];
    p[i] = p[n];
    p[n] = q;
  }

  perm = new Uint8Array(512);
  permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
};
generatePermutations(rng.next);
rng.reset();

// returns a number between 0 and 1 for any given x,y value.
export const noise = (x: number, y: number): number => {
  const s = (x + y) * SKEW_FACTOR;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1.0 + 2.0 * G2;
  const y2 = y0 - 1.0 + 2.0 * G2;

  const ii = i & 255;
  const jj = j & 255;
  const g0 = Grad[permMod12[ii + perm[jj]]];
  const g1 = Grad[permMod12[ii + i1 + perm[jj + j1]]];
  const g2 = Grad[permMod12[ii + 1 + perm[jj + 1]]];

  const t0 = 0.5 - x0 * x0 - y0 * y0;
  const n0 = t0 < 0 ? 0.0 : t0 ** 4 * (g0[0] * x0 + g0[1] * y0);

  const t1 = 0.5 - x1 * x1 - y1 * y1;
  const n1 = t1 < 0 ? 0.0 : t1 ** 4 * (g1[0] * x1 + g1[1] * y1);

  const t2 = 0.5 - x2 * x2 - y2 * y2;
  const n2 = t2 < 0 ? 0.0 : t2 ** 4 * (g2[0] * x2 + g2[1] * y2);

  return NORM_FACTOR * (n0 + n1 + n2);
};
