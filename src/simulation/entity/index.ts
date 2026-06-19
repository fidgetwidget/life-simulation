import type { Elements } from '@/elements';
import type { EntityType } from '@/simulation/entity/type';
import type { QWorld } from '@/simulation/qworld';
import { XY } from '@/util';

export class Entity {
  type: EntityType;
  origin: XY;
  world: QWorld;

  get points(): XY[] {
    if (this._points == undefined) this._points = [];
    return this._points;
  }

  public addPoint(point: XY, elm: Elements) {
    if (this.points.includes(point)) return;
    this.points.push(point);
    this.world.setValue(point.x, point.y, elm);

    const chunk = this.world.getChunkAtWorld(point.x, point.y);
    this.addChunk(chunk);
  }

  get chunks(): number[] {
    if (this._chunks == undefined) this._chunks = [];
    return this._chunks;
  }

  protected addChunk(chunk: Chunk) {
    if (this.chunks.includes(chunk.index)) return;
    this.chunks.push(chunk.index);
  }

  get chunkOrigin(): number {
    const { x, y } = this.origin;
    return this.world.getChunkAtWorld(x, y).index;
  }

  constructor(type: EntityType, origin: XY, world: QWorld) {
    this.type = type;
    this.origin = origin;
    this.world = world;
  }

  public grow(): void {}

  private _points!: XY[];
  private _chunks!: number[];
}
