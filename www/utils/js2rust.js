export const log = console.log;
export const notify = window.alert;

export function randomInt(max = 1) {
  return Math.floor(Math.random() * max);
}
