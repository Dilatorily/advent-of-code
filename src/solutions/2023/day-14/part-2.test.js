import { describe, expect, it } from '@jest/globals';

import part2 from '#dilatorily/advent-of-code/solutions/2023/day-14/part-2.js';

describe('2023-12-14 part 2', () => {
  it("returns the example's solution", () => {
    const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;
    const output = 64;

    const results = part2(input);
    expect(results).toBe(output);
  });
});
