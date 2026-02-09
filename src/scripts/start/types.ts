export interface ScaffoldPaths {
  dayDir: string;
  inputFile: string;
  part1File: string;
  part2File: string;
  testCasesFile: string;
  test1File: string;
  test2File: string;
}

interface Part1TestCase {
  input: string;
  part1Output: number | string;
}

interface Part2TestCase {
  input: string;
  part2Output: number | string;
}

interface BothPartTestCase {
  input: string;
  part1Output: number | string;
  part2Output: number | string;
}

export type TestCase = Part1TestCase | Part2TestCase | BothPartTestCase;

export interface SolutionModule<T = number | string> {
  solution?: (lines: string[]) => T;
}
