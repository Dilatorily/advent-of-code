import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/2021/day-02/part-2';
import { testCases } from '#dilatorily/advent-of-code/solutions/2021/day-02/test-cases';

describe('2021-12-02 part 2', () => {
  it.each(testCases.filter((testCase) => 'part2Output' in testCase))(
    'returns $part2Output for $input',
    ({ input, part2Output }) => {
      expect(solution(input.split('\n'))).toBe(part2Output);
    },
  );
});
