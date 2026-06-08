import { Elements, World, QWorld } from "./simulation/index.ts";
import { TILE_SIZE, QUAD_DEPTH, HEIGHT, WIDTH } from "./const.ts";
import { MOTE_COLOR_MAP } from "./color-map.ts";
import { Simulation } from "./simulation/simulation.ts";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  world: World;
  qworld: QWorld;
  sim: Simulation;
  changes: QuadData[];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.qworld = new QWorld(WIDTH, HEIGHT, QUAD_DEPTH);
    this.world = this.qworld.world;
    this.sim = new Simulation(this.qworld);
    this.changes = [];
  }

  init() {
    this.attachEventListeners();
    this.qworld.setAt(24, 31, Elements.TREE_STUMP);

    this.qworld.setAt(23, 31, Elements.TREE_STUMP);
    this.qworld.setAt(23, 30, Elements.TREE_STUMP);

    this.qworld.setAt(25, 31, Elements.TREE_STUMP);
    this.qworld.setAt(24, 32, Elements.TREE_STUMP);

    this.initPaint();
    this.renderQuads();
    console.debug("game:init", { world: this.world, qworld: this.qworld });
  }

  attachEventListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("click", this.handleMouseClick.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    // const rect: DOMRect = this.canvas.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
  }

  handleMouseClick(event: MouseEvent) {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("click", { x, y });
    this.qworld.setAt(
      Math.floor(x / TILE_SIZE),
      Math.floor(y / TILE_SIZE),
      Elements.TREE_STUMP,
      true,
    );
  }

  initPaint() {
    // clear canvas
    const x = 0;
    const y = 0;
    const w = WIDTH * TILE_SIZE;
    const h = HEIGHT * TILE_SIZE;
    this.ctx.clearRect(x, y, w, h);
    // paint the default world state
    this.ctx.fillStyle = `#${MOTE_COLOR_MAP[Elements.EMPTY].toString(16)}`;
    this.ctx.fillRect(x, y, w, h);
  }

  renderQuads() {
    this.qworld.render(this.ctx, TILE_SIZE);
  }

  update() {
    this.sim.tick();
    if (this.qworld.hasChanges) {
      const val = this.qworld.process()!;
      this.changes.unshift(val);
    }
  }

  render() {
    if (this.changes.length > 0) {
      const { x, y, v } = this.changes.pop()!;
      // @ts-ignore - the MOTE_COLOR_MAP won't ever exactly map to the changes data type
      const color = `#${MOTE_COLOR_MAP[v].toString(16)}`;

      this.ctx.fillStyle = color;
      this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      this.ctx.strokeStyle = "green";
    }
  }
}
