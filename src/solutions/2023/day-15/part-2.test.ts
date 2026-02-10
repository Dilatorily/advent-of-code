import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/2023/day-15/part-2';
import { testCases } from '#dilatorily/advent-of-code/solutions/2023/day-15/test-cases';

describe('2023-12-15 part 2', () => {
  it.each(testCases.filter((testCase) => 'part2Output' in testCase))(
    'returns $part2Output for $input',
    ({ input, part2Output }) => {
      expect(solution(input.split('\n'))).toBe(part2Output);
    },
  );
});
