type World = import("./simulation/world").World;
type Chunk = import("./simulation/chunk").Chunk;
type Element = import("./simulation/elements").Elements;

type QuadData = {
  x: number;
  y: number;
  i: number;
  v: number;
};

type XY = {
  x: number;
  y: number;
};

type ConditionProps = {
  world: World;
  chunk: Chunk;
  values: number[];
  counts: Record<Elements, number>;
};

type ActionProps = {
  world: World;
  chunk: Chunk;
};

type Behaviour = {
  condition: (props: ConditionProps) => boolean;
  action: (props: ActionProps) => void;
};
