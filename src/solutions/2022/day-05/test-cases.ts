import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  {
    input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
    part1Output: 'CMZ',
    part2Output: 'MCD',
  },
];
