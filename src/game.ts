import { Elements, World, QWorld } from './simulation/index.ts';
import {
  TILE_SIZE,
  QUAD_DEPTH,
  HEIGHT,
  WIDTH,
  CHUNK_LINES_COLOR,
  SIM_PER_TICK_CAP,
  MAX_CHANGE_PER_TICK,
} from './const.ts';
import { MOTE_COLOR_MAP } from './color-map.ts';
import { Simulation } from './simulation/simulation.ts';
import { HoverUI } from './debug/HoverUI.ts';
import { Logger } from './lib/Logger.ts';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  world: World;
  qworld: QWorld;
  sim: Simulation;
  changes: QuadData[];

  paused: boolean = true;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.qworld = new QWorld(WIDTH, HEIGHT, QUAD_DEPTH);
    this.world = this.qworld.world;
    this.sim = new Simulation(this.qworld);
    this.changes = [];

    const hui = new HoverUI(canvas, this.qworld);
    document.body.appendChild(hui.dom);
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
    console.debug('game:init', { world: this.world, qworld: this.qworld });
  }

  attachEventListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    // const rect: DOMRect = this.canvas.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
  }

  handleMouseClick(event: MouseEvent) {
    this.paused = !this.paused;
    Logger.debug('click', { x: event.clientX, y: event.clientY });
    // TODO: add controls to add different elements to the map.
  }

  initPaint() {
    // clear canvas
    const x = 0;
    const y = 0;
    const w = WIDTH * TILE_SIZE;
    const h = HEIGHT * TILE_SIZE;
    this.ctx.clearRect(x, y, w, h);
    // paint the default world state
    this.ctx.fillStyle = MOTE_COLOR_MAP[Elements.EMPTY];
    this.ctx.fillRect(x, y, w, h);
  }

  renderQuads() {
    this.qworld.root.chunks.forEach((c) => {
      this.ctx.strokeStyle = CHUNK_LINES_COLOR;
      let { x, y, w, h } = c;
      x *= TILE_SIZE;
      y *= TILE_SIZE;
      w *= TILE_SIZE;
      h *= TILE_SIZE;
      this.ctx.strokeRect(x, y, w, h);
    });
  }

  update() {
    // Don't do more simulation if there are changes not yet rendered...
    if (!this.qworld.hasChanges && this.changes.length == 0) {
      this.sim.tick();
    }

    if (this.qworld.hasChanges) {
      const val = this.qworld.process()!;
      this.changes.unshift(val);
    }
  }

  render() {
    let count = 0;
    while (count < MAX_CHANGE_PER_TICK && this.changes.length > 0) {
      const { x, y, v } = this.changes.pop()!;
      // @ts-ignore - the MOTE_COLOR_MAP won't ever exactly map to the changes data type
      const color = MOTE_COLOR_MAP[v];

      this.ctx.fillStyle = color;
      this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      this.ctx.strokeStyle = 'green';
      count++;
    }
  }
}
