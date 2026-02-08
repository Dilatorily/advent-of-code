import { describe, expect, it } from '@jest/globals';

import part1 from '#dilatorily/advent-of-code/solutions/2023/day-14/part-1.js';

describe('2023-12-14 part 1', () => {
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
    const output = 136;

    const results = part1(input);
    expect(results).toBe(output);
  });
});
