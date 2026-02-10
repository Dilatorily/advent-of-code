import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  {
    input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`,
    part1Output: 17,
    part2Output: `#####
#...#
#...#
#...#
#####`,
  },
];
