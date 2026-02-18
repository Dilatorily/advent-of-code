import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  {
    input: `turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500`,
    part1Output: 998996,
  },
  { input: 'turn on 0,0 through 0,0', part2Output: 1 },
  { input: 'toggle 0,0 through 999,999', part2Output: 2000000 },
];
