import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/2023/day-11/part-1';
import { testCases } from '#dilatorily/advent-of-code/solutions/2023/day-11/test-cases';

describe('2023-12-11 part 1', () => {
  it.each(testCases.filter((testCase) => 'part1Output' in testCase))(
    'returns $part1Output for $input',
    ({ input, part1Output }) => {
      expect(solution(input.split('\n'))).toBe(part1Output);
    },
  );
});
