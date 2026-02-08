import { describe, expect, it } from '@jest/globals';

import part1 from '#dilatorily/advent-of-code/solutions/2023/day-13/part-1.js';

describe('2023-12-13 part 1', () => {
  it.each`
    input | output
    ${`.#.
##.
##.`} | ${200}
  `('returns $output for $input', ({ input, output }) => {
    const results = part1(input);
    expect(results).toBe(output);
  });

  it("returns the example's solution", () => {
    const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;
    const output = 405;

    const results = part1(input);
    expect(results).toBe(output);
  });
});
