export type XY = {
  x: number;
  y: number;
};

export const XY = (x: number, y: number) => ({ x, y });
XY.Zero = Object.freeze(XY(0, 0));
XY.One = Object.freeze(XY(1, 1));

// Create XY from some other value

export function fromRadians(r: number, out: XY = XY(0, 0)) {
  out.x = Math.cos(r);
  out.y = Math.sin(r);
  normalize(out);
  return out;
}

// Get some other value from a single point

export function magnitude(p: XY): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

export function toRadians(p: XY): number {
  return Math.atan2(p.y, p.x);
}

// Comparison between two points

export function equals(a: XY, b: XY): boolean {
  return a.x === b.x && a.y === b.y;
}

export function dot(a: XY, b: XY): number {
  return a.x * b.x + a.y * b.y;
}

export function cross(a: XY, b: XY): number {
  return a.x * b.x - a.y * b.y;
}

export function diagonalDistance(a: XY, b: XY): number {
  difference(a, b, _temp);
  return Math.max(Math.abs(_temp.x), Math.abs(_temp.y));
}

export function difference(a: XY, b: XY, out: XY = XY(0, 0)): XY {
  out.x = b.x - a.x;
  out.y = b.y - a.y;
  return out;
}

export function add(p: XY, amount: XY | number, out: XY | boolean = true): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (typeof out === 'boolean') out = out === true ? p : XY(p.x, p.y);
  out.x += ax;
  out.y += ay;
  return out;
}

export function subtract(
  p: XY,
  amount: XY | number,
  out: XY | boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (typeof out === 'boolean') out = out === true ? p : XY(p.x, p.y);
  out.x -= ax;
  out.y -= ay;
  return out;
}

export function multiply(
  p: XY,
  amount: XY | number,
  out: XY | boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (typeof out === 'boolean') out = out === true ? p : XY(p.x, p.y);
  out.x *= ax;
  out.y *= ay;
  return out;
}

export function divide(
  p: XY,
  amount: XY | number,
  out: XY | boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (typeof out === 'boolean') out = out === true ? p : XY(p.x, p.y);
  out.x /= ax;
  out.y /= ay;
  return out;
}

// Get a transformation of a point

export function normalize(p: XY, out: XY | boolean = true): XY {
  if (typeof out === 'boolean') out = out === true ? p : XY(0, 0);
  const m = magnitude(p);
  out.x /= m;
  out.y /= m;
  return out;
}

export function floor(a: XY, out: XY | boolean = true): XY {
  if (typeof out === 'boolean') out = out === true ? a : XY(0, 0);
  out.x = Math.floor(a.x);
  out.y = Math.floor(a.y);
  return out;
}

export function round(p: XY, out: XY | boolean = true): XY {
  if (typeof out === 'boolean') out = out === true ? p : XY(0, 0);
  out.x = Math.round(p.x);
  out.y = Math.round(p.y);
  return out;
}

// For when we need a temp xy version of a number
const _tempVal = (val: number) => {
  _temp.x = _temp.y = val;
  return _temp;
};
const _temp: XY = { x: 0, y: 0 };
