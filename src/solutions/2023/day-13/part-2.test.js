import { describe, expect, it } from '@jest/globals';

import part2 from '#dilatorily/advent-of-code/solutions/2023/day-13/part-2.js';

describe('2023-12-13 part 2', () => {
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
    const output = 400;

    const results = part2(input);
    expect(results).toBe(output);
  });
});
