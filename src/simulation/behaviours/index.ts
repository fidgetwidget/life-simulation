import { GrowGrassNearTrees } from "./grow-grass-near-trees";
import { GrowGrassInMeadows } from "./grow-grass-in-meadows";
import { GrowRootsFromTrees } from "./grow-roots-from-trees";
import { BehavioursExpandTreeIntoRoot } from "./behaviours-expand-tree-into-root";
import { SpreadGrassOutFromMeadows } from "./spread-grass-out-from-meadows";
import { GrowFlowersInFields } from "./grow-flowers-in-fields";
import { BehavioursGrowIntoAForest } from "./behaviours-grow-into-a-forest";

export const behaviours: Behaviour[] = [
  ...BehavioursExpandTreeIntoRoot,
  ...BehavioursGrowIntoAForest,
  GrowGrassInMeadows,
  GrowGrassNearTrees,
  GrowRootsFromTrees,
  GrowFlowersInFields,
  SpreadGrassOutFromMeadows,
];
