import part1 from './part-1.js';

describe('2023-12-15 part 1', () => {
  it.each`
    input     | output
    ${`HASH`} | ${52}
    ${`rn`}   | ${0}
  `('returns $output for $input', ({ input, output }) => {
    const results = part1(input);
    expect(results).toBe(output);
  });

  it("returns the example's solution", () => {
    const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
    const output = 1320;

    const results = part1(input);
    expect(results).toBe(output);
  });
});
