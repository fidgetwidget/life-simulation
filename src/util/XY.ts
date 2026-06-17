export type XY = {
  x: number;
  y: number;
};

export const XY = (x: number, y: number) => ({ x, y });
XY.Zero = Object.freeze(XY(0, 0));
XY.One = Object.freeze(XY(1, 1));

export function magnitude(p: XY): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

export function normalize(p: XY, inPlace: boolean = true): XY {
  const m = magnitude(p);
  if (!inPlace) return XY(p.x / m, p.y / m);
  p.x /= m;
  p.y /= m;
  return p;
}

export function round(p: XY, inPlace: boolean = true): XY {
  if (!inPlace) return XY(Math.round(p.x), Math.round(p.y));
  p.x = Math.round(p.x);
  p.y = Math.round(p.y);
  return p;
}

export function add(p: XY, amount: XY | number, inPlace: boolean = true): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (!inPlace) return XY(p.x + ax, p.y + ay);
  p.x += ax;
  p.y += ay;
  return p;
}

export function subtract(
  p: XY,
  amount: XY | number,
  inPlace: boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (!inPlace) return XY(p.x - ax, p.y - ay);
  p.x -= ax;
  p.y -= ay;
  return p;
}

export function multiply(
  p: XY,
  amount: XY | number,
  inPlace: boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (!inPlace) return XY(p.x * ax, p.y * ay);
  p.x -= ax;
  p.y -= ay;
  return p;
}

export function divide(
  p: XY,
  amount: XY | number,
  inPlace: boolean = true,
): XY {
  const a = typeof amount !== 'number' ? amount : _tempVal(amount);
  const { x: ax, y: ay } = a;
  if (!inPlace) return XY(p.x / ax, p.y / ay);
  p.x /= ax;
  p.y /= ay;
  return p;
}

export function dot(a: XY, b: XY): number {
  return a.x * b.x + a.y * b.y;
}

export function cross(a: XY, b: XY): number {
  return a.x * b.x - a.y * b.y;
}

export function difference(a: XY, b: XY, out: XY = XY(0, 0)): XY {
  out.x = b.x - a.x;
  out.y = b.y - a.y;
  return out;
}

export function diagonalDistance(a: XY, b: XY): number {
  difference(a, b, _temp);
  return Math.max(Math.abs(_temp.x), Math.abs(_temp.y));
}

// For when we need a temp xy version of a number
const _tempVal = (val: number) => {
  _temp.x = _temp.y = val;
  return _temp;
};
const _temp: XY = { x: 0, y: 0 };
