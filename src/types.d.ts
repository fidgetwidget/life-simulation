type World = import('./simulation/structure/world').World;
type QWorld = import('./simulation/qworld').QWorld;
type Chunk = import('./simulation/structure/chunk').Chunk;
type Element = import('./elements').Elements;
type XY = import('./util/XY').XY;

declare const __DEBUG__: boolean;

type QuadData = {
  x: number;
  y: number;
  i: number;
  v: number;
};

type WorldBehaviourFilterProps = {
  qworld: QWorld;
  chunk: Chunk;
  values: number[];
  counts: Record<Elements, number>;
};

type WorldBehaviourActionProps = {
  qworld: QWorld;
  chunk: Chunk;
};

type WorldBehaviour = {
  filter: (props: WorldBehaviourFilterProps) => boolean;
  action: (props: WorldBehaviourActionProps) => void;
};
