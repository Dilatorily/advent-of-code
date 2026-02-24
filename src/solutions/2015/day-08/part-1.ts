import { sum } from '#dilatorily/advent-of-code/utility/sum';

export const solution = (lines: string[]) =>
  lines.map((string) => string.length - (eval(string) as string).length).reduce(sum);
