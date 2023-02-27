export const range = (size: number) => Array.from(Array(size).keys());
export const step = (x: number) => (x >= 0 ? 1 : 0);
export const ramp = (x: number) => x * step(x);
export const xrange = (start: number, size: number) =>
  Array.from(Array(size - start + 1).keys()).map(
    (_, j) => j + Math.floor(start),
  );
