export interface CliArgs {
  date?: string;
  part?: string;
}

export interface ScaffoldPaths {
  dayDir: string;
  part1File: string;
  part2File: string;
  testCasesFile: string;
  test1File: string;
  test2File: string;
  inputFile: string;
}

export interface TestCase {
  input: string[];
  part1Output: number | string;
  part2Output: number | string;
  description?: string;
}

export type SolutionFunction = (lines: string[]) => number | string;
