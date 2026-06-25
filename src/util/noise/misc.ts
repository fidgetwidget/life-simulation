import { rng } from '../Random';
import type { SeededNoise } from './noise';
import { perlin2 } from './perlin';
import { simplex2 } from './simplex';

const LUCUNARITY = 1.98;
const GAIN = 0.51;

// Fractal Brownian Motion
// @see https://blog.pkh.me/p/42-sharing-everything-i-could-understand-about-gradient-noise.html
export function fmp(x: number, y: number, octaves: number, n?: SeededNoise) {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * simplex2(x * freq, y * freq, n);
    freq *= LUCUNARITY;
    amp *= GAIN;
  }
  return sum;
}

export function scattered(x: number, y: number, n?: SeededNoise) {
  const sx = rng.next(0.5, 0.51);
  const sy = rng.next(0.5, 0.51);
  return perlin2(x * sx, y * sy, n);
}

export function ampFreqNoise(
  x: number,
  y: number,
  amp: number[],
  freq: number[],
  n?: SeededNoise,
) {
  const e = amp.reduce((acc, cur, index) => {
    const f = freq[index];
    const a = cur;
    acc += a * simplex2(x * f, y * f, n);
    return acc;
  }, 0);
  const ampSum = amp.reduce((acc, cur) => {
    acc += cur;
    return acc;
  }, 0);
  return e / ampSum;
}

export function blue(x: number, y: number, n?: SeededNoise) {
  let values = [];
  let amp = 1;
  let freq = 2;
  for (let i = 0; i < 5; i++) {
    values.push(amp * scattered(x * freq, y * freq, n));
    freq **= 2;
    amp *= GAIN;
  }
  return values.reduce((acc, cur) => {
    acc = cur - acc;
    return acc;
  }, 0);
}
