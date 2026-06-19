import type { QWorld } from '../../qworld';
import { EntityType } from '../type';
import { Entity } from '..';
// import { d20 } from "@/util/Random";
import { XY } from '@/util';
import { Elements } from '@/elements';
import type { TreeBehaviour } from './type';
import { GrowIntoTree } from './behaviours/grow-into-tree';
import { GrowIntoNeighbors } from './behaviours/grow-into-neighbors';
import { GrowRoots } from './behaviours/grow-roots';

export class Tree extends Entity {
  growth: number = 1;
  radius: number = 0;
  behaviors: TreeBehaviour[] = [GrowIntoTree, GrowIntoNeighbors, GrowRoots];

  // Get the count of roots that belong to the tree entity
  get roots() {
    return this.points.reduce((acc, cur) => {
      if (this.world.getValue(cur.x, cur.y) === Elements.ROOTS) acc += 1;
      return acc;
    }, 0);
  }

  get isSapling() {
    const { x, y } = this.origin;
    return this.world.getValue(x, y) === Elements.SAPLING;
  }

  constructor(origin: XY, world: QWorld) {
    super(EntityType.Tree, origin, world);
    this.world.setValue(this.origin.x, this.origin.y, Elements.SAPLING);
  }

  override addPoint(point: XY, elm: Elements): void {
    super.addPoint(point, elm);
    if (elm === Elements.TREE) this.growth++;
  }

  override grow() {
    this.behaviors
      .filter((b) => b.filter({ tree: this, world: this.world }))
      .forEach((b) => b.action({ tree: this, world: this.world }));
  }
}
