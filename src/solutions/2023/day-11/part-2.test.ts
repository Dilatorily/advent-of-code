import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/2023/day-11/part-2';
import { testCases } from '#dilatorily/advent-of-code/solutions/2023/day-11/test-cases';

describe('2023-12-11 part 2', () => {
  it.each(testCases.filter((testCase) => 'part2Output' in testCase))(
    'returns $part2Output for $input',
    ({ expansion, input, part2Output }) => {
      expect(solution(input.split('\n'), expansion)).toBe(part2Output);
    },
  );
});
