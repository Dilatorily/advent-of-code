import part2 from './part-2.js';

describe('2023-12-12 part 2', () => {
  it.each`
    input                          | output
    ${'???.### 1,1,3'}             | ${1}
    ${'.??..??...?##. 1,1,3'}      | ${16384}
    ${'?#?#?#?#?#?#?#? 1,3,1,6'}   | ${1}
    ${'????.#...#... 4,1,1'}       | ${16}
    ${'????.######..#####. 1,6,5'} | ${2500}
    ${'?###???????? 3,2,1'}        | ${506250}
  `('returns $output for $input', ({ input, output }) => {
    const results = part2(input);
    expect(results).toBe(output);
  });

  it("returns the example's solution", () => {
    const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
    const output = 525152;

    const results = part2(input);
    expect(results).toBe(output);
  });
});
