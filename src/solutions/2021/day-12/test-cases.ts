import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [
  {
    input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
    part1Output: 10,
    part2Output: 36,
  },
  {
    input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
    part1Output: 19,
    part2Output: 103,
  },
  {
    input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
    part1Output: 226,
    part2Output: 3509,
  },
];
