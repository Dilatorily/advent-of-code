import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  { input: '>', part1Output: 2 },
  { input: '^>v<', part1Output: 4 },
  { input: '^v^v^v^v^v', part1Output: 2 },
  { input: '^v', part2Output: 3 },
  { input: '^>v<', part2Output: 3 },
  { input: '^v^v^v^v^v', part2Output: 11 },
];
