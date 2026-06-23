type World = import('./simulation/structure/world').World;
type QWorld = import('./simulation/qworld').QWorld;
type Chunk = import('./simulation/structure/chunk').Chunk;
type Element = import('./elements').Elements;
type XY = import('./util/XY').XY;

declare const __DEBUG__: boolean;

type ChangeData = {
  x: number;
  y: number;
  i: number;
  v: number;
};

type WorldBehaviorFilterProps = {
  qworld: QWorld;
  chunk: Chunk;
  values: number[];
  counts: Record<Elements, number>;
};

type WorldBehaviorActionProps = {
  qworld: QWorld;
  chunk: Chunk;
};

type WorldBehavior = {
  filter: (props: WorldBehaviorFilterProps) => boolean;
  action: (props: WorldBehaviorActionProps) => void;
};
