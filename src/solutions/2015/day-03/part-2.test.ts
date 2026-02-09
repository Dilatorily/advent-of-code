import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/2015/day-03/part-2';
import { testCases } from '#dilatorily/advent-of-code/solutions/2015/day-03/test-cases';

describe('2015-12-03 part 2', () => {
  it.each(testCases.filter((testCase) => 'part2Output' in testCase))(
    'returns $part2Output for $input',
    ({ input, part2Output }) => {
      expect(solution(input.split('\n'))).toBe(part2Output);
    },
  );
});
