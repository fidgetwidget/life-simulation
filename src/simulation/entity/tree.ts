import type { QWorld } from '../qworld';
import { EntityType } from './type';
import { Entity } from '.';
import { d20 } from '@/util/Random';
import { filterInPlace, getNeighbors, pickRandom } from '@/util';
import { Elements } from '@/elements';
import { Logger } from '@/lib/Logger';

const CAN_GROW_ON = [
  Elements.EMPTY,
  Elements.GRASS,
  Elements.TALL_GRASS,
  Elements.ROOTS,
];

// const SELF_ELEMENTS = [Elements.SAPLING, Elements.TREE_TRUNK, Elements.TREE, Elements.ROOTS];

export class EntityTree extends Entity {
  growth: number = 1;

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

  override grow() {
    const ac = this.isSapling ? 16 : 16 - this.growth / 2;
    const roll = d20() + this.roots;
    const expand = roll > ac;
    Logger.info('Tree:grow', { roll, ac, expand, growth: this.growth });
    if (expand) {
      if (this.isSapling) {
        this.growIntoTree();
      }
      // grow the tree, or expand with roots
      if (this.growth < 4 || (this.growth < 32 && this.roots > 3)) {
        this.growIntoNeighbors();
      } else if (this.growth > 3 && this.roots < 5) {
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
    this.addPoint(point);
    this.world.setValue(point.x, point.y, Elements.TREE);
    this.growth++;
  }

  growRoots() {
    let ncoords: XY[] = [];
    this.points.forEach((p) => {
      let n = getNeighbors(p, this.world.min, this.world.max, false, true);
      ncoords.push(...n);
    });
    filterInPlace(
      ncoords,
      (p) =>
        !this.points.includes(p) &&
        CAN_GROW_ON.includes(this.world.getValue(p.x, p.y)),
    );
    if (ncoords.length === 0) return;
    const point = pickRandom(ncoords);
    this.addPoint(point);
    this.world.setValue(point.x, point.y, Elements.ROOTS);
  }
}
