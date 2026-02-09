import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  { input: '(())', part1Output: 0 },
  { input: '()()', part1Output: 0 },
  { input: '(((', part1Output: 3 },
  { input: '(()(()(', part1Output: 3 },
  { input: '))(((((', part1Output: 3 },
  { input: '())', part1Output: -1 },
  { input: '))(', part1Output: -1 },
  { input: ')))', part1Output: -3 },
  { input: ')())())', part1Output: -3 },
  { input: ')', part2Output: 1 },
  { input: '()())', part2Output: 5 },
];
