import { describe, expect, it } from '@jest/globals';

import part1 from '#dilatorily/advent-of-code/solutions/2023/day-12/part-1.js';

describe('2023-12-12 part 1', () => {
  it.each`
    input                          | output
    ${'.#. 1'}                     | ${1}
    ${'.?? 1'}                     | ${2}
    ${'???.### 1,1,3'}             | ${1}
    ${'.??..??...?##. 1,1,3'}      | ${4}
    ${'?#?#?#?#?#?#?#? 1,3,1,6'}   | ${1}
    ${'????.#...#... 4,1,1'}       | ${1}
    ${'????.######..#####. 1,6,5'} | ${4}
    ${'?###???????? 3,2,1'}        | ${10}
  `('returns $output for $input', ({ input, output }) => {
    const results = part1(input);
    expect(results).toBe(output);
  });

  it("returns the example's solution", () => {
    const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
    const output = 21;

    const results = part1(input);
    expect(results).toBe(output);
  });
});
