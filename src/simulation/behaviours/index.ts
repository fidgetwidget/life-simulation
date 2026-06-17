// import { BehavioursExpandTreeIntoRoot } from './behaviours-expand-tree-into-root';
// import { BehavioursGrowIntoAForest } from "./behaviours-grow-into-a-forest";
import { GrowFlowersInFields } from './grow-flowers-in-fields';
import { GrowGrassInMeadows } from './grow-grass-in-meadows';
import { GrowGrassNearTrees } from './grow-grass-near-trees';
// import { GrowRootsFromTrees } from "./grow-roots-from-trees";
import { SpreadGrassOutFromMeadows } from './spread-grass-out-from-meadows';

export const behaviours: Behaviour[] = [
  // ...BehavioursExpandTreeIntoRoot,
  // ...BehavioursGrowIntoAForest,
  GrowGrassInMeadows,
  GrowGrassNearTrees,
  // GrowRootsFromTrees,
  GrowFlowersInFields,
  SpreadGrassOutFromMeadows,
];
