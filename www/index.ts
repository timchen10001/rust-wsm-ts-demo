import { from, shareReplay, take } from "rxjs";
import init, { Direction, World } from "snake-game";

declare global {
  interface Window {
    log: Console["log"];
  }
}

// let rust call the js method.
window.log = console.log;

const wasm$ = from(init()).pipe(shareReplay(1)).pipe(take(1));

wasm$.subscribe(() => {
  const CELL_SIZE = 20; // one cell pixel
  const WORLD_WIDTH = 10;
  const SNAKE_SPAWN_IDX = Date.now() % (WORLD_WIDTH * WORLD_WIDTH); // random number

  const world = World.new(WORLD_WIDTH, SNAKE_SPAWN_IDX, Direction.Down);
  const worldWidth = world.width();

  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;

  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }

    ctx.stroke();
  }

  function drawSnake() {
    const snakeIdx = world.snake_head_idx();
    const col = snakeIdx % worldWidth;
    const row = Math.floor(snakeIdx / worldWidth);

    ctx.beginPath();
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawSnake();
  }

  function update() {
    const fps = 10;
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      requestAnimationFrame(update);
    }, 1000 / fps);
  }

  paint();
  update();
});
