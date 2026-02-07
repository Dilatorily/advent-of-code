import reduceSum from './reduce-sum.ts';

export default function findStringsDistance(a: string, b: string): number {
  return a
    .split('')
    .map((character, index) => (character === b[index] ? 0 : 1) as number)
    .reduce(reduceSum, 0);
}
