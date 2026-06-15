import './style.css';
import { WIDTH, HEIGHT, TILE_SIZE } from './const.ts';
import { Game, GameEventTypes } from './game.ts';
import Stats from 'fps.ts';
import { convertStyleObjectToString } from './util/Dom.ts';

// TODO: move this to a template or something to be better managed/maintained...
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class='center'>
  <div
    id='mainmenu'
    class='imposter imposter--fixed'
  >
    <h1 class='h3 center-text'>Life simulation prototype</h1>
    <button id='start-game-btn'>Start</button>
    <section>
      <p class='center-text'>Press "P" to pause/unpause the simulation.</p>
    </section>
  </div>

  <div
    id='pausebtn'
    class='hide pause imposter imposter--fixed'
  ></div>

  <canvas
    id='canvas'
    width="${WIDTH * TILE_SIZE}"
    height="${HEIGHT * TILE_SIZE}"
  ></div>
</div>
`;

const stats = new Stats();
stats.showPanel(0);
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
  if (!game.paused) {
    game.update();
    game.render();
  }
  stats.end();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

game.debugUi.hide();

const mainMenu = document.getElementById('mainmenu');
const pauseBtn = document.getElementById('pausebtn');
const startGameBtn = document.getElementById('start-game-btn');
startGameBtn?.addEventListener('click', () => {
  game.debugUi.show();
  game.paused = false;
  mainMenu?.classList.add('hide');
});

pauseBtn?.addEventListener('click', () => {
  game.paused = false;
});
game.addEventListener(GameEventTypes.UnPause, () => {
  pauseBtn?.classList.add('hide');
});
game.addEventListener(GameEventTypes.Pause, () => {
  pauseBtn?.classList.remove('hide');
});

if (__DEBUG__) {
  // @ts-expect-error attaching variable to window without defining it on window.
  window.Stats = stats;
  // @ts-expect-error
  window.Game = game;
}
