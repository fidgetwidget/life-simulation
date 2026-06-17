import type { QWorld } from '../qworld';
import { EntityType } from './type';
import { Entity } from '.';
import { d20 } from '@/util/Random';
import { getNeighbors, pickRandom } from '@/util';
import { Elements } from '@/elements';
import { Logger } from '@/lib/Logger';

const CAN_GROW_ON = [
  Elements.EMPTY,
  Elements.GRASS,
  Elements.TALL_GRASS,
  Elements.ROOTS,
];

export class EntityTree extends Entity {
  growth: number = 1;

  get isSapling() {
    const { x, y } = this.origin;
    return this.world.getValue(x, y) === Elements.SAPLING;
  }

  constructor(origin: XY, world: QWorld) {
    super(EntityType.Tree, origin, world);
    this.world.setValue(this.origin.x, this.origin.y, Elements.SAPLING);
  }

  override grow() {
    const ac = this.isSapling ? 13 : 13 + this.growth;
    const roll = d20() + this.growth / 2;
    const expand = roll > ac;
    Logger.info('Tree:grow', { roll, ac, expand, growth: this.growth });
    if (expand) {
      if (this.isSapling) {
        this.growIntoTree();
      } else if (this.growth < 10) {
        this.growIntoNeighbors();
      } else {
        this.growRoots();
      }
    }
  }

  private growIntoTree() {
    const { x, y } = this.origin;
    Logger.info('Tree:growIntoTree', this);
    this.world.setValue(x, y, Elements.TREE_TRUNK);
  }

  private growIntoNeighbors() {
    const ncoords = getNeighbors(
      this.origin,
      this.world.min,
      this.world.max,
      false,
      this.growth > 4,
    );
    Logger.info(
      'Tree:growIntoNeighbors',
      { origin: this.origin, ncoords },
      this,
    );

    const options = ncoords.filter(
      (p) =>
        !this.points.includes(p) &&
        CAN_GROW_ON.includes(this.world.world.get(p.x, p.y)),
    );
    if (options.length === 0) return;
    const point = pickRandom(options);
    this.points.push(point);
    this.world.setValue(point.x, point.y, Elements.TREE);
    this.growth++;
  }

  growRoots() {}
}
