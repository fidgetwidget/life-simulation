import {
  TILE_SIZE,
  QUAD_DEPTH,
  HEIGHT,
  WIDTH,
  CHUNK_LINES_COLOR,
  MAX_CHANGE_PER_TICK,
} from '@/const.ts';
import { HoverUI } from '@/debug/HoverUI.ts';
import { Elements, MOTE_COLOR_MAP } from '@/elements.ts';
// import { Logger } from "@/lib/Logger.ts";
import { QWorld } from '@/simulation';
import { Simulation } from '@/simulation/simulation.ts';
import { normalize, XY } from '@/util';

import { River } from './simulation/entity/river';
import { Tree } from './simulation/entity/tree';
import { perlin2, seed } from './util/noise';
import { rng } from './util/Random';

// const NOISE_VALUE_FILTERS = [
//   { min: 0, max: 0.3, output: 0 },
//   { min: 0.3, max: 0.5, output: 0.25 },
//   { min: 0.5, max: 0.7, output: 0.5 },
//   { min: 0.7, max: 0.9, output: 0.75 },
//   { min: 0.9, max: 1, output: 1 },
// ];
// const NOISE_MAP = (value: number): number => {
//   NOISE_VALUE_FILTERS.forEach(({ min, max, output }) => {
//     if (
//       Math.floor(value * 100) >= Math.floor(min * 100) &&
//       Math.floor(value * 100) < Math.floor(max * 100)
//     )
//       return output;
//   });
//   return value;
// };

export enum GameEventTypes {
  Pause = 'pause',
  UnPause = 'unpause',
}

const PauseEvent = new Event(GameEventTypes.Pause);
const UnPauseEvent = new Event(GameEventTypes.UnPause);
export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  qWorld: QWorld;
  sim: Simulation;
  changes: ChangeData[];
  debugUi: HoverUI;

  private _paused: boolean = true;
  get paused() {
    return this._paused;
  }

  set paused(val: boolean) {
    this._paused = val;
    if (this._paused) {
      this.eventTarget.dispatchEvent(PauseEvent);
    } else {
      this.eventTarget.dispatchEvent(UnPauseEvent);
    }
  }

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.qWorld = new QWorld(WIDTH, HEIGHT, QUAD_DEPTH);
    this.sim = new Simulation(this.qWorld);
    this.changes = [];

    this.debugUi = new HoverUI(canvas, this.qWorld);
    document.body.appendChild(this.debugUi.dom);
  }

  init() {
    this.attachEventListeners();
    this.initTrees();
    this.initRiver();

    this.initPaint();
    this.renderQuads();

    this.flushRender();
    // this.renderNoise();
  }

  initTrees() {
    this.qWorld.addEntity(new Tree(XY(24, 31), this.qWorld));
    this.qWorld.addEntity(new Tree(XY(12, 10), this.qWorld));
    this.qWorld.addEntity(new Tree(XY(34, 16), this.qWorld));
  }

  initRiver() {
    this.qWorld.addEntity(
      new River(XY(200, 3), this.qWorld, normalize(XY(-1, 100)), 50, 120),
    );
    this.qWorld.addEntity(
      new River(XY(3, 200), this.qWorld, normalize(XY(120, -60)), 15, 30),
    );
  }

  attachEventListeners() {
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    // this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
  }

  handleKeyUp(event: KeyboardEvent) {
    switch (event.key.toUpperCase()) {
      case ' ':
      case 'P':
        this.paused = !this.paused;
        break;
    }
  }

  handleMouseClick(event: MouseEvent) {
    const { clientX, clientY } = event;
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    // x,y position on the canvas to world x,y
    const worldX = Math.floor(canvasX / TILE_SIZE);
    const worldY = Math.floor(canvasY / TILE_SIZE);
    const value = this.qWorld.getValue(worldX, worldY);
    if (value !== Elements.EMPTY)
      this.qWorld.setValue(worldX, worldY, Elements.EMPTY);
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
    this.qWorld.chunks.forEach((c) => {
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
    if (!this.qWorld.hasChanges && this.changes.length == 0) {
      this.sim.tick();
    }

    if (this.qWorld.hasChanges) {
      const val = this.qWorld.process()!;
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
      count++;
    }
  }

  renderNoise() {
    const { min, max } = this.qWorld;
    const res = { x: TILE_SIZE, y: TILE_SIZE };
    const values = [];
    const n = seed(rng.next());
    for (let x = min.x; x < max.x; x++) {
      for (let y = min.y; y < max.y; y++) {
        const v = perlin2(x / res.x, y / res.y, n);
        values.push({ x, y, v });
      }
    }
    values.forEach(({ x, y, v }) => {
      const cval = v * 255;
      this.ctx.fillStyle = `rgb(${cval}, ${cval}, ${cval})`;
      this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
    console.log(values);
  }

  flushRender() {
    while (this.qWorld.hasChanges) {
      const { x, y, v } = this.qWorld.process()!;
      // @ts-ignore - the MOTE_COLOR_MAP won't ever exactly map to the changes data type
      const color = MOTE_COLOR_MAP[v];

      this.ctx.fillStyle = color;
      this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  // events
  addEventListener(
    type: GameEventTypes,
    listener: EventListener | EventListenerObject,
  ) {
    if (!Object.values(GameEventTypes).includes(type)) {
      throw Error('invalid game event');
    }
    this.eventTarget.addEventListener(type, listener);
  }

  private eventTarget: EventTarget = new EventTarget();
}
