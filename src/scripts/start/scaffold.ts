import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';

import type { ScaffoldPaths } from '#dilatorily/advent-of-code/scripts/start/types';

const solutionTemplate = `export default (lines: string[]): number | string => {
  let solution = lines.length;
  // Your solution here
  return solution;
};
`;

const testCasesTemplate = `export interface TestCase {
  input: string[];
  part1Output: number | string;
  part2Output: number | string;
  description?: string;
}

export const testCases: TestCase[] = [];
`;

const getTestTemplate = (year: number, day: number, part: number): string => {
  const outputField = part === 1 ? 'part1Output' : 'part2Output';
  const dayStr = day.toString().padStart(2, '0');
  return `import { describe, expect, it } from '@jest/globals';

import solution from '#dilatorily/advent-of-code/solutions/${year}/day-${dayStr}/part-${part}';
import { testCases } from '#dilatorily/advent-of-code/solutions/${year}/day-${dayStr}/test-cases';

describe('${year}-12-${dayStr} part ${part}', () => {
  it.each(testCases)('$description', ({ input, ${outputField} }) => {
    expect(solution(input)).toBe(${outputField});
  });
});
`;
};

export const createScaffold = (year: number, day: number, paths: ScaffoldPaths): void => {
  console.log(`${chalk.cyan('🎨 Unwrapping scaffold...')}\n`);

  // Create day directory if it doesn't exist
  if (!fs.existsSync(paths.dayDir)) {
    fs.mkdirSync(paths.dayDir, { recursive: true });
    console.log(chalk.green('✨ Created directory:'), chalk.white(paths.dayDir));
  }

  // Create solution files if they don't exist
  if (!fs.existsSync(paths.part1File)) {
    fs.writeFileSync(paths.part1File, solutionTemplate);
    console.log(chalk.green('🎁 Created:'), chalk.white(paths.part1File));
  } else {
    console.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.part1File));
  }

  if (!fs.existsSync(paths.part2File)) {
    fs.writeFileSync(paths.part2File, solutionTemplate);
    console.log(chalk.green('🎁 Created:'), chalk.white(paths.part2File));
  } else {
    console.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.part2File));
  }

  // Create test cases file if it doesn't exist
  if (!fs.existsSync(paths.testCasesFile)) {
    fs.writeFileSync(paths.testCasesFile, testCasesTemplate);
    console.log(chalk.green('🎁 Created:'), chalk.white(paths.testCasesFile));
  } else {
    console.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.testCasesFile));
  }

  // Create test files if they don't exist
  if (!fs.existsSync(paths.test1File)) {
    fs.writeFileSync(paths.test1File, getTestTemplate(year, day, 1));
    console.log(chalk.green('🎁 Created:'), chalk.white(paths.test1File));
  } else {
    console.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.test1File));
  }

  if (!fs.existsSync(paths.test2File)) {
    fs.writeFileSync(paths.test2File, getTestTemplate(year, day, 2));
    console.log(chalk.green('🎁 Created:'), chalk.white(paths.test2File));
  } else {
    console.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.test2File));
  }
};

export const getScaffoldPaths = (year: number, day: number): ScaffoldPaths => {
  const dayDir = path.join(
    process.cwd(),
    'src',
    'solutions',
    year.toString(),
    `day-${day.toString().padStart(2, '0')}`,
  );

  return {
    dayDir,
    part1File: path.join(dayDir, 'part-1.ts'),
    part2File: path.join(dayDir, 'part-2.ts'),
    testCasesFile: path.join(dayDir, 'test-cases.ts'),
    test1File: path.join(dayDir, 'part-1.test.ts'),
    test2File: path.join(dayDir, 'part-2.test.ts'),
    inputFile: path.join(dayDir, 'input.txt'),
  };
};
