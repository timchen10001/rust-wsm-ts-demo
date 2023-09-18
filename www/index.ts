import {
  Observable,
  Subject,
  defer,
  delay,
  distinctUntilChanged,
  filter,
  mergeMap,
  of,
  repeat,
  repeatWhen,
  take,
  takeUntil,
  tap,
} from "rxjs";
import { InitOutput, World } from "snake-game";
import {
  createCellSize$,
  direction$,
  keydown$,
  wasm$,
  worldWidth$,
} from "./utils/events";
import { randomInt } from "./utils/js2rust";

function main(wasm: InitOutput) {
  let SNAKE_INIT_SIZE = 2;
  let CELL_SIZE: number = 0;
  let world: World | undefined;
  let worldWidth: number;
  let cellSize$: Observable<number>;
  let animationFrameId: number;
  let timer: NodeJS.Timeout;
  const refresher$ = new Subject<void>();

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
    if (!world) return;
    drawWorld();
    drawReward();
    drawSnake();
  }

  function refreshFrame() {
    if (!world) return;
    const fps = 10;
    timer = setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      animationFrameId = requestAnimationFrame(refreshFrame);
    }, 1000 / fps);
  }

  // Listening world width
  worldWidth$
    .pipe(
      tap((WORLD_WIDTH) => {
        // destroy previous states - start
        clearTimeout(timer);
        cancelAnimationFrame(animationFrameId);
        refresher$.next();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // destroy previous states - end

        const SNAKE_SPAWN_IDX = randomInt(WORLD_WIDTH * WORLD_WIDTH);
        const newWorld = World.new(
          WORLD_WIDTH,
          SNAKE_SPAWN_IDX,
          SNAKE_INIT_SIZE,
          direction$.value
        );
        world?.free();
        world = newWorld;
        worldWidth = world.width();
        paint();
        refreshFrame();
      }),
      mergeMap((_worldWidth) =>
        createCellSize$(_worldWidth).pipe(
          tap((cellSize) => {
            CELL_SIZE = cellSize;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.height = _worldWidth * CELL_SIZE;
            canvas.width = _worldWidth * CELL_SIZE;
            paint();
          }),
          takeUntil(refresher$)
        )
      )
    )
    .subscribe();
  // Listening keydown code
  keydown$.subscribe();
  // Two way binding direction between js and rust.
  direction$
    .asObservable()
    .pipe(
      distinctUntilChanged(),
      tap((nextDirection) => world?.change_snake_direction(nextDirection))
    )
    .subscribe();
}

wasm$.subscribe(main);
