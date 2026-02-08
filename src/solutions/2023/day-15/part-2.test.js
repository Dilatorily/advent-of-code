import { describe, expect, it } from '@jest/globals';

import part2 from '#dilatorily/advent-of-code/solutions/2023/day-15/part-2.js';

describe('2023-12-15 part 2', () => {
  it("returns the example's solution", () => {
    const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
    const output = 145;

    const results = part2(input);
    expect(results).toBe(output);
  });
});
