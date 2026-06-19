import { Elements } from '@/elements';
import { pickRandom } from '@/util';
import { Tree } from '../entity/tree';
// import { Logger } from "@/lib/Logger";

export const GrowNewSaplingsNearForests: WorldBehaviour = {
  // has enough grass
  filter: ({ values, counts }) => {
    return (
      counts[Elements.GRASS] > values.length * 0.5 &&
      (counts[Elements.SAPLING] == null || counts[Elements.SAPLING] === 0)
    );
  },
  // TODO: ensure the distance between an existing tree gives enough room for the tree to grow a min of 3 tiles range.
  action: ({ qworld, chunk }) => {
    const neighbors = chunk.neighbors;
    const hasTreeNeighbor = neighbors.reduce((acc, cur) => {
      if (acc) return acc;
      acc =
        null !==
        chunk.root.chunks[cur].indexes.find(
          (i) => qworld.getValue(i) === Elements.TREE_TRUNK,
        );
      return acc;
    }, false);
    if (!hasTreeNeighbor) return;
    const options = chunk.indexes.filter((i) => {
      const elm = qworld.getValue(i);
      return elm === Elements.EMPTY || elm === Elements.GRASS;
    });
    if (options.length === 0) return;
    const coord = qworld.getXY(pickRandom(options));
    qworld.addEntity(new Tree(coord, qworld));
  },
};
