import { distinctUntilChanged, tap } from "rxjs";
import { InitOutput, World } from "snake-game";
import { createCellSize$, direction$, keydown$, wasm$ } from "./utils/events";
import { randomInt } from "./utils/js2rust";

function main(wasm: InitOutput) {
  let CELL_SIZE: number;
  const WORLD_WIDTH = 10;
  const SNAKE_INIT_SIZE = 2;
  const SNAKE_SPAWN_IDX = randomInt(WORLD_WIDTH * WORLD_WIDTH);
  const cellSize$ = createCellSize$(WORLD_WIDTH);

  const world = World.new(
    WORLD_WIDTH,
    SNAKE_SPAWN_IDX,
    SNAKE_INIT_SIZE,
    direction$.value
  );
  const worldWidth = world.width();

  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

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

  function drawReward() {
    const rewardCellIdx = world.reward_cell();
    const col = rewardCellIdx % worldWidth;
    const row = Math.floor(rewardCellIdx / worldWidth);

    ctx.fillStyle = "#FFA600";
    ctx.beginPath();
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.stroke();
  }

  function drawSnake() {
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      world.snake_cells(), // byteOffset
      world.snake_length() // length
    );

    snakeCells.forEach((cellIndex, i) => {
      // debugger
      const col = cellIndex % worldWidth;
      const row = Math.floor(cellIndex / worldWidth);

      ctx.fillStyle = i === 0 ? "#7878db" : "#000000";
      ctx.beginPath();
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawReward();
    drawSnake();
  }

  function refreshFrame() {
    const fps = 10;
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      requestAnimationFrame(refreshFrame);
    }, 1000 / fps);
  }

  // Listening cell size
  cellSize$
    .pipe(
      tap((cellSize) => {
        CELL_SIZE = cellSize;
        canvas.height = worldWidth * CELL_SIZE;
        canvas.width = worldWidth * CELL_SIZE;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paint();
      })
    )
    .subscribe();
  // Listening keydown code
  keydown$.subscribe();
  // Two way binding direction between js and rust.
  direction$
    .asObservable()
    .pipe(
      distinctUntilChanged(),
      tap((nextDirection) => world.change_snake_direction(nextDirection))
    )
    .subscribe();

  paint();
  refreshFrame();
}

wasm$.subscribe(main);
