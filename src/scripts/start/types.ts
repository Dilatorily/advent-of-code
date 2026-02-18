export interface ScaffoldPaths {
  dayDir: string;
  inputFile: string;
  part1File: string;
  part2File: string;
  test1File: string;
  test2File: string;
  testCasesFile: string;
}

export interface SolutionModule<T = number | string> {
  solution?: (lines: string[]) => T;
}

export interface TestCase {
  input: string;
  part1Output?: number | string;
  part2Output?: number | string;
}
