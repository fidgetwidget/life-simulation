import { MOTE_COLOR_MAP } from '../color-map';
import { TILE_SIZE } from '../const';
import type { QWorld } from '../simulation';
import { Chunk } from '../simulation/chunk';
import './HoverUI.css';

export const CONTAINER_CLASS = 'hover-ui-container';

export class HoverUI {
  canvas: HTMLCanvasElement;
  qworld: QWorld;
  chunk?: Chunk;
  active: boolean = false;

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

  attachEventListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.active) return;
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

  updateChunk(chunk: Chunk) {
    console.debug('HoverUi:updateChunk', { chunk, index: chunk.index });
    if (this.chunk?.index === chunk.index) return;

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
    const x = (this.chunk?.x ?? 0) * TILE_SIZE - rect.left;
    const y = (this.chunk?.y ?? 0) * TILE_SIZE - rect.top;
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
                <ul class='hover-ui-list'>
                    ${Object.keys(valueRecords)
                      .map(
                        (key) => `
                    <li>
                        <div class='hover-ui-color-box' style="background-color: ${MOTE_COLOR_MAP[key]}"></div>
                        <span>${valueRecords[key]}</span>
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
        style="width: ${(this.chunk?.w ?? 1) * TILE_SIZE}px; height: ${(this.chunk?.h ?? 1) * TILE_SIZE}px; left: ${x}px; top: ${y}px;"
    ></div>
    `;
  }
}
