import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  { input: '[1,2,3]', part1Output: 6, part2Output: 6 },
  { input: '{"a":2,"b":4}', part1Output: 6, part2Output: 6 },
  { input: '[[[3]]]', part1Output: 3, part2Output: 3 },
  { input: '{"a":{"b":4},"c":-1}', part1Output: 3, part2Output: 3 },
  { input: '{"a":[-1,1]}', part1Output: 0, part2Output: 0 },
  { input: '[-1,{"a":1}]', part1Output: 0, part2Output: 0 },
  { input: '[]', part1Output: 0, part2Output: 0 },
  { input: '{}', part1Output: 0, part2Output: 0 },
  { input: '[1,{"c":"red","b":2},3]', part2Output: 4 },
  { input: '{"d":"red","e":[1,2,3,4],"f":5}', part2Output: 0 },
  { input: '[1,"red",5]', part2Output: 6 },
];
