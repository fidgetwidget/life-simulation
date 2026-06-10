import './style.css';
import { WIDTH, HEIGHT, TILE_SIZE } from './const.ts';
import { Game } from './game.ts';
import Stats from 'fps.ts';
import { convertStyleObjectToString } from './util/Dom.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas
  id='canvas' 
  width="${WIDTH * TILE_SIZE}"
  height="${HEIGHT * TILE_SIZE}"
/>
`;

const stats = new Stats();
stats.showPanel(1);
// const defaultStatsDomStyle =
// 	'position: fixed; top: 0px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;';
const statsDomStyle = {
	position: 'fixed',
	bottom: 0,
	right: 0,
	cursor: 'pointer',
	opacity: 0.9,
	zIndex: 2,
};
stats.dom.style = convertStyleObjectToString(statsDomStyle);
document.body.appendChild(stats.dom);

const canvas: HTMLCanvasElement = document.getElementById(
	'canvas',
)! as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

const game = new Game(canvas, ctx);

game.init();

function render() {
	stats.begin();
	game.update();
	game.render();
	stats.end();
	requestAnimationFrame(render);
}
requestAnimationFrame(render);
