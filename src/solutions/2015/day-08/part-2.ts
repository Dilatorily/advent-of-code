import { sum } from '#dilatorily/advent-of-code/utility/sum';

export const solution = (lines: string[]) =>
  lines.map((string) => JSON.stringify(string).length - string.length).reduce(sum);
