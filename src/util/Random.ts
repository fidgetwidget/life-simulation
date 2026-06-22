import Prando from 'prando';

const RANDOM_SEED = 'TheQuickBrownFoxJumpsOverTheLazyDog';

export const rng = new Prando(RANDOM_SEED);

/**
 * Random Dice Roll
 * (defaults to 1d100)
 */
export const roll = (n: number = 1, d: number = 100) =>
  Math.floor(rng.next(Math.floor(n), Math.ceil(n * d + 1)));

/**
 * Random Dice Roll: 4 sided die.
 */
export const d4 = (n: number = 1) => roll(n, 4);

/**
 * Random Dice Roll: 6 sided die.
 */
export const d6 = (n: number = 1) => roll(n, 6);

/**
 * Random Dice Roll: 20 sided die.
 */
export const d20 = (n: number = 1) => roll(n, 20);
