import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  from,
  fromEvent,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from "rxjs";
import init, { Direction } from "snake-game";

export const wasm$ = from(init()).pipe(shareReplay(1)).pipe(take(1));

export const direction$ = new BehaviorSubject<Direction>(Direction.Right);

export const keydown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  tap((e) => {
    switch (e.code) {
      case "ArrowUp":
        direction$.next(Direction.Up);
        break;
      case "ArrowRight":
        direction$.next(Direction.Right);
        break;
      case "ArrowDown":
        direction$.next(Direction.Down);
        break;
      case "ArrowLeft":
        direction$.next(Direction.Left);
        break;
      default:
        break;
    }
  })
);

export const resize$ = fromEvent<UIEvent>(window, "resize", {
  passive: true,
});

// World Width
export const worldWidth$ = wasm$.pipe(
  map(() => document.getElementById("world-width")),
  filter((worldWidthEl) => !!worldWidthEl),
  switchMap((worldWidthEl) => fromEvent<InputEvent>(worldWidthEl, "change")),
  map((event) => <HTMLInputElement>event.target),
  map((el) => el.valueAsNumber),
  startWith(10),
  distinctUntilChanged()
);

/** Cell Size */
export const createCellSize$ = (width: number, totalVw = 0.5) => {
  const cellSize = () => {
    const totalCellPixel = document.documentElement.clientWidth * totalVw;
    return Math.floor(totalCellPixel / width);
  };
  return of(null).pipe(
    switchMap(() => resize$),
    startWith(cellSize()),
    map(() => cellSize()),
    distinctUntilChanged()
  );
};

export const startGame$ = fromEvent(
  <HTMLButtonElement>document.getElementById("start-game-btn"),
  "click"
);
