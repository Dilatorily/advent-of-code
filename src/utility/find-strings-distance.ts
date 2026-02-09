import { sum } from '#dilatorily/advent-of-code/utility/sum';

export const findStringsDistance = (a: string, b: string) => {
  return a
    .split('')
    .map((character, index) => (character === b[index] ? 0 : 1) as number)
    .reduce(sum, 0);
};
