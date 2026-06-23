import { GrowFlowersInFields } from './grow-flowers-in-fields';
import { GrowGrassInMeadows } from './grow-grass-in-meadows';
import { GrowGrassNearTrees } from './grow-grass-near-trees';
import { GrowNewSaplingsNearForests } from './grow-new-saplings-near-forests';
import { SpreadGrassOutFromMeadows } from './spread-grass-out-from-meadows';

export const behaviors: WorldBehavior[] = [
  GrowGrassInMeadows,
  GrowGrassNearTrees,
  GrowFlowersInFields,
  SpreadGrassOutFromMeadows,
  GrowNewSaplingsNearForests,
];
