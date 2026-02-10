import { deepCopy } from '#dilatorily/advent-of-code/utility/deep-copy';

export const fillArray = <T>(length: number, fill: T = undefined as T) =>
  Array.from({ length }, () => deepCopy(fill));
