import "./style.css";
import { WIDTH, HEIGHT, TILE_SIZE } from "./simulation/index.ts";
import { Game } from "./game.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<canvas
  id='canvas' 
  width="${WIDTH * TILE_SIZE}"
  height="${HEIGHT * TILE_SIZE}"
/>
`;

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas",
)! as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const game = new Game(canvas, ctx);

game.init();

function render() {
  game.update();
  game.render();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
