export interface ScaffoldPaths {
  dayDir: string;
  inputFile: string;
  part1File: string;
  part2File: string;
  testCasesFile: string;
  test1File: string;
  test2File: string;
}

export interface TestCase {
  description?: string;
  input: string[];
  part1Output: number | string;
  part2Output: number | string;
}

export interface SolutionModule<T = number | string> {
  solution?: (lines: string[]) => T;
}
