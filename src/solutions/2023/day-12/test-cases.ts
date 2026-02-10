import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  { input: '???.### 1,1,3', part1Output: 1, part2Output: 1 },
  { input: '.??..??...?##. 1,1,3', part1Output: 4, part2Output: 16384 },
  { input: '?#?#?#?#?#?#?#? 1,3,1,6', part1Output: 1, part2Output: 1 },
  { input: '????.#...#... 4,1,1', part1Output: 1, part2Output: 16 },
  { input: '????.######..#####. 1,6,5', part1Output: 4, part2Output: 2500 },
  { input: '?###???????? 3,2,1', part1Output: 10, part2Output: 506250 },
  {
    input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
    part1Output: 21,
    part2Output: 525152,
  },
];
