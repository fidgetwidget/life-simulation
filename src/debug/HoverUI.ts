import { TILE_SIZE } from '@/const';
import { MOTE_COLOR_MAP } from '@/elements';
import { Logger } from '@/lib/Logger';
import type { QWorld } from '@/simulation';
import { Chunk } from '@/simulation/chunk';

import './HoverUI.css';
import type { Entity } from '@/simulation/entity';

export const CONTAINER_CLASS = 'hover-ui-container';

type DebugData = {
  chunk: Chunk;
  values: number[];
  valueRecords: Record<number, number>;
  entities: Entity[];
};

export class HoverUI {
  canvas: HTMLCanvasElement;
  qworld: QWorld;
  chunk?: Chunk;
  active: boolean = false;
  visible: boolean = __DEBUG__;
  debugUI: any;

  public dom: HTMLDivElement;

  constructor(canvas: HTMLCanvasElement, qworld: QWorld) {
    this.canvas = canvas;
    this.qworld = qworld;
    this.chunk = undefined;
    this.debugUI = {
      chunkIndex: -1,
      chunk: null,
      entities: null,
    };
    this.dom = document.createElement('div');
    this.dom.classList.add('hover-ui');

    this.attachEventListeners();
    console.debug('HoverUi:new');
    (window as any).DebugUI = this.debugUI;
  }

  public show() {
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  attachEventListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
    // Lets you push to logs the info currently in the debugUI data.
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      switch (e.key.toUpperCase()) {
        case 'L':
          Logger.info('LOG: ', structuredClone(this.debugUI));
          Logger.info('dump: ', { qworld: this.qworld });
          break;
      }
    });
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.active || !this.visible) return;
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const canvasx = event.clientX - rect.left;
    const canvasy = event.clientY - rect.top;
    // x,y position on the canvas to world x,y
    const wx = Math.floor(canvasx / TILE_SIZE);
    const wy = Math.floor(canvasy / TILE_SIZE);
    const chunk = this.qworld.getChunkAtWorld(wx, wy);

    this.updateChunk(chunk);
  }

  handleMouseOver() {
    this.active = true;
    if (this.dom.classList.contains('hide')) this.dom.classList.remove('hide');
  }

  handleMouseOut() {
    this.active = false;
    this.chunk = undefined;
    if (!this.dom.classList.contains('hide')) this.dom.classList.add('hide');
  }

  updateChunk(chunk?: Chunk) {
    if (this.chunk?.index === chunk?.index) return;

    this.chunk = chunk;
    const data = this.updateData();
    this.updateDom(data);
  }

  updateData(): DebugData {
    const chunk = this.chunk!;
    const entities = this.qworld.entities.filter(
      (e) => chunk.index === e.chunkOrigin,
    );
    const values = chunk.indexes.map((i) => this.qworld.getValue(i));
    const valueRecords: Record<number, number> =
      values?.reduce((acc: Record<number, number>, cur: number) => {
        if (acc[cur] === undefined) {
          acc[cur] = 0;
        }
        acc[cur] += 1;
        return acc;
      }, {}) ?? {};
    const data = {
      chunk,
      values,
      valueRecords,
      entities,
    };
    this.debugUI.chunkIndex = chunk?.index ?? -1;
    this.debugUI.chunk = chunk;
    this.debugUI.entities = entities;
    return data;
  }

  updateDom({ chunk, values, valueRecords, entities }: DebugData) {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const scroll = {
      x: document.scrollingElement?.scrollLeft ?? 0,
      y: document.scrollingElement?.scrollTop ?? 0,
    };
    const { w, h, top, left } = getPosition(rect, scroll, chunk);

    const count = values?.length ?? 0;

    // TODO: move this to a template or something to be better managed/maintained...
    this.dom.innerHTML = `
    <div class='hover-ui-container'>
        <ul class='hover-ui-list'>
            <li>
                <label>index</label>
                <span>${chunk?.index}</span>
            </li>
            <li>
                <label>type</label>
                <span>${'unknown'}</span>
            </li>
            <li>
                <label>entity count</label>
                <span>${entities.length}</span>
            </li>
            <li>
                <label>values</label>
                <ul class='hover-ui-list hover-ui-value-records'>
                    ${Object.keys(valueRecords)
                      .map(
                        // hack to make typescript not complain about using key in number index ways.
                        (key: any) => `
                    <li>
                        <div class='hover-ui-color-box' style="background-color: ${MOTE_COLOR_MAP[key]}"></div>
                        <span>${valueRecords[key]}</span>
                        <span>${Math.floor((valueRecords[key] / count) * 100)}%</span>
                    </li>
                    `,
                      )
                      .join(' ')}
                </ul>
            </li>
        </ul>
    </div>
    <div
        class='hover-ui-chunk-highlight'
        style="width: ${w}px; height: ${h}px; left: ${left}px; top: ${top}px;"
    ></div>
    `;
  }
}

function getPosition(rect: DOMRect, scroll: XY, chunk: Chunk) {
  const cx = chunk.x;
  const cy = chunk.y;
  const cw = chunk.w;
  const ch = chunk.h;
  const x = cx * TILE_SIZE + rect.left;
  const y = cy * TILE_SIZE + rect.top;
  const w = cw * TILE_SIZE;
  const h = ch * TILE_SIZE;
  const left = x - scroll.x;
  const top = y - scroll.y;
  return { w, h, top, left };
}
