import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  mergeMap,
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

/** Cell Size */
export const createCellSize$ = (width: number, totalVw = 0.5) => {
  const cellSize = (width: number, totalVw: number) => {
    const totalCellPixel = document.documentElement.clientWidth * totalVw;
    return Math.floor(totalCellPixel / width);
  };

  return resize$.pipe(
    startWith(cellSize(width, totalVw)),
    map(() => cellSize(width, totalVw)),
    distinctUntilChanged()
  );
};
