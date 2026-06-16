type World = import('./simulation/world').World;
type Chunk = import('./simulation/chunk').Chunk;
type Element = import('./elements').Elements;
type XY = import('./util/XY').XY;

declare const __DEBUG__: boolean;

type QuadData = {
  x: number;
  y: number;
  i: number;
  v: number;
};

type BehaviourFilterProps = {
  world: World;
  chunk: Chunk;
  values: number[];
  counts: Record<Elements, number>;
};

type BehaviourActionProps = {
  world: World;
  chunk: Chunk;
};

type Behaviour = {
  filter: (props: BehaviourFilterProps) => boolean;
  action: (props: BehaviourActionProps) => void;
};
