export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export const Vec3 = (x: number, y: number, z: number) => ({
  x,
  y,
  z,
});

export const dot2 = (v: Vec3, x: number, y: number) => v.x * x + v.y * y;

export const dot3 = (v: Vec3, x: number, y: number, z: number) =>
  v.x * x + v.y * y + v.z * z;
