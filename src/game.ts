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
import { XY } from '@/util';
import { getPointsAlongLine } from '@/util/Line.ts';

import { Tree } from './simulation/entity/tree';

export enum GameEventTypes {
  Pause = 'pause',
  UnPause = 'unpause',
}

const PauseEvent = new Event(GameEventTypes.Pause);
const UnPauseEvent = new Event(GameEventTypes.UnPause);
export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  qworld: QWorld;
  sim: Simulation;
  changes: QuadData[];
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
    this.qworld = new QWorld(WIDTH, HEIGHT, QUAD_DEPTH);
    this.sim = new Simulation(this.qworld);
    this.changes = [];

    this.debugUi = new HoverUI(canvas, this.qworld);
    document.body.appendChild(this.debugUi.dom);
  }

  init() {
    this.attachEventListeners();
    this.initTrees();
    this.initRiver();

    this.initPaint();
    this.renderQuads();

    this.flushRender();
  }

  initTrees() {
    this.qworld.addEntity(new Tree(XY(24, 31), this.qworld));
    this.qworld.addEntity(new Tree(XY(12, 10), this.qworld));
    this.qworld.addEntity(new Tree(XY(34, 16), this.qworld));
  }

  initRiver() {
    // TODO: Change this to an entity that randomly splits/turns and supports varying widths.
    const setments = [
      ...getPointsAlongLine(
        XY(WIDTH - 5, 0),
        XY(WIDTH - 8, HEIGHT / 2),
        XY.Zero,
        XY(WIDTH, HEIGHT),
      ),
      getPointsAlongLine(
        XY(WIDTH - 8, HEIGHT / 2),
        XY(WIDTH - 3, HEIGHT),
        XY.Zero,
        XY(WIDTH, HEIGHT),
      ),
    ];
    setments.flat().forEach(({ x, y }) => {
      this.qworld.setValue(x, y, Elements.MOVING_WATER);
    });
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
    const canvasx = clientX - rect.left;
    const canvasy = clientY - rect.top;
    // x,y position on the canvas to world x,y
    const worldx = Math.floor(canvasx / TILE_SIZE);
    const worldy = Math.floor(canvasy / TILE_SIZE);
    const value = this.qworld.getValue(worldx, worldy);
    if (value !== Elements.EMPTY)
      this.qworld.setValue(worldx, worldy, Elements.EMPTY);
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
    this.qworld.chunks.forEach((c) => {
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
      count++;
    }
  }

  flushRender() {
    while (this.qworld.hasChanges) {
      const { x, y, v } = this.qworld.process()!;
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
