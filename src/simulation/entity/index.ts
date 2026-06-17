import type { EntityType } from '@/simulation/entity/type';
import type { QWorld } from '@/simulation/qworld';
import { XY } from '@/util';

export class Entity {
  type: EntityType;
  origin: XY;
  world: QWorld;
  changed: boolean = false;

  get points(): XY[] {
    return this._points;
  }

  get chunkOrigin(): number {
    const { x, y } = this.origin;
    return this.world.getChunkAtWorld(x, y).index;
  }

  get chunks(): number[] {
    if (this.changed) {
      this._chunks = this.points.reduce((acc, { x, y }): number[] => {
        const ci = this.world.getChunkAtWorld(x, y).index;
        if (!acc.includes(ci)) acc.push(ci);
        return acc;
      }, []);
      this.changed = false;
    }
    return this._chunks;
  }

  constructor(type: EntityType, origin: XY, world: QWorld) {
    this.type = type;
    this.origin = origin;
    this.world = world;
  }

  public addPoint(point: XY) {
    this._points.push(point);
  }

  public grow(): void {}

  private _points: XY[] = [];
  private _chunks!: number[];
}
