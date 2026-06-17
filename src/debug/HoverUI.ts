import { MOTE_COLOR_MAP } from '../color-map';
import { TILE_SIZE } from '../const';
import { Logger } from '../lib/Logger';
import type { QWorld } from '../simulation';
import { Chunk } from '../simulation/chunk';
import './HoverUI.css';

export const CONTAINER_CLASS = 'hover-ui-container';

export class HoverUI {
  canvas: HTMLCanvasElement;
  qworld: QWorld;
  chunk?: Chunk;
  active: boolean = false;
  visible: boolean = __DEBUG__;

  public dom: HTMLDivElement;

  constructor(canvas: HTMLCanvasElement, qworld: QWorld) {
    this.canvas = canvas;
    this.qworld = qworld;
    this.chunk = undefined;
    this.dom = document.createElement('div');
    this.dom.classList.add('hover-ui');

    this.attachEventListeners();
    console.debug('HoverUi:new');
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
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.active || !this.visible) return;
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const canvasx = event.clientX - rect.left;
    const canvasy = event.clientY - rect.top;
    // x,y position on the canvas to world x,y
    const wx = Math.floor(canvasx / TILE_SIZE);
    const wy = Math.floor(canvasy / TILE_SIZE);
    console.debug('HoverUi:handleMouseMove', { canvasx, canvasy, wx, wy });
    const chunk = this.qworld.getChunkAtWorld(wx, wy);

    this.updateChunk(chunk);
  }

  handleMouseOver() {
    this.active = true;
    console.debug('HoverUi:handleMouseOver');
    if (this.dom.classList.contains('hide')) this.dom.classList.remove('hide');
  }

  handleMouseOut() {
    this.active = false;
    this.chunk = undefined;
    console.debug('HoverUi:handleMouseOut');
    if (!this.dom.classList.contains('hide')) this.dom.classList.add('hide');
  }

  updateChunk(chunk?: Chunk) {
    console.debug('HoverUi:updateChunk', { chunk, index: chunk?.index });
    if (this.chunk?.index === chunk?.index) return;

    this.chunk = chunk;
    this.updateDom();
  }

  updateDom() {
    const values = this.chunk?.indexes.map((i) => this.qworld.world.get(i));
    const valueRecords: Record<number, number> =
      values?.reduce((acc: Record<number, number>, cur: number) => {
        if (acc[cur] === undefined) {
          acc[cur] = 0;
        }
        acc[cur] += 1;
        return acc;
      }, {}) ?? {};
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cx = this.chunk?.x ?? 0;
    const cy = this.chunk?.y ?? 0;
    const cw = this.chunk?.w ?? 0;
    const ch = this.chunk?.h ?? 0;
    const x = cx * TILE_SIZE + rect.left;
    const y = cy * TILE_SIZE + rect.top;
    const w = cw * TILE_SIZE;
    const h = ch * TILE_SIZE;
    const scrollx = document.scrollingElement?.scrollLeft ?? 0;
    const scrolly = document.scrollingElement?.scrollTop ?? 0;
    const count = values?.length ?? 0;
    Logger.info('HoverUi:updateDom', { x, y, cx, cy, scrollx, scrolly, rect });

    // TODO: move this to a template or something to be better managed/maintained...
    this.dom.innerHTML = `
    <div class='hover-ui-container'>
        <ul class='hover-ui-list'>
            <li>
                <label>index</label>
                <span>${this.chunk?.index}</span>
            </li>
            <li>
                <label>type</label>
                <span>${'unknown'}</span>
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
        style="width: ${w}px; height: ${h}px; left: ${x - scrollx}px; top: ${y - scrolly}px;"
    ></div>
    `;
  }
}
