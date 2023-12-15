import part1 from './part-1.js';

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
