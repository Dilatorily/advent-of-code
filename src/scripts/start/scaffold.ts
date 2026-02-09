import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';

import { logger } from '#dilatorily/advent-of-code/utility/logger';

import type { ScaffoldPaths } from '#dilatorily/advent-of-code/scripts/start/types';

const solutionTemplate = `export const solution = (lines: string[]) => {
  const solution = lines.length;

  // Your solution here

  return solution;
};
`;

const testCasesTemplate = `import type { TestCase } from '#dilatorily/advent-of-code/scripts/start/types';

export const testCases: TestCase[] = [{ input: '', part1Output: 0, part2Output: 0 }];
`;

const getTestTemplate = (year: number, day: number, part: number) => {
  const outputField = part === 1 ? 'part1Output' : 'part2Output';
  const dayStr = `${day}`.padStart(2, '0');
  return `import { describe, expect, it } from '@jest/globals';

import { solution } from '#dilatorily/advent-of-code/solutions/${year}/day-${dayStr}/part-${part}';
import { testCases } from '#dilatorily/advent-of-code/solutions/${year}/day-${dayStr}/test-cases';

describe('${year}-12-${dayStr} part ${part}', () => {
  it.each(testCases.filter((testCase) => '${outputField}' in testCase))(
    'returns $${outputField} for $input',
    ({ input, ${outputField} }) => {
      expect(solution(input.split('\\n'))).toBe(${outputField});
    },
  );
});
`;
};

export const createScaffold = (year: number, day: number, paths: ScaffoldPaths) => {
  logger.log(`${chalk.cyan('🎨 Unwrapping scaffold...')}\n`);

  // Create day directory if it doesn't exist
  if (!fs.existsSync(paths.dayDir)) {
    fs.mkdirSync(paths.dayDir, { recursive: true });
    logger.log(chalk.green('✨ Created directory:'), chalk.white(paths.dayDir));
  }

  // Create solution files if they don't exist
  if (!fs.existsSync(paths.part1File)) {
    fs.writeFileSync(paths.part1File, solutionTemplate);
    logger.log(chalk.green('🎁 Created:'), chalk.white(paths.part1File));
  } else {
    logger.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.part1File));
  }

  if (!fs.existsSync(paths.part2File)) {
    fs.writeFileSync(paths.part2File, solutionTemplate);
    logger.log(chalk.green('🎁 Created:'), chalk.white(paths.part2File));
  } else {
    logger.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.part2File));
  }

  // Create test cases file if it doesn't exist
  if (!fs.existsSync(paths.testCasesFile)) {
    fs.writeFileSync(paths.testCasesFile, testCasesTemplate);
    logger.log(chalk.green('🎁 Created:'), chalk.white(paths.testCasesFile));
  } else {
    logger.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.testCasesFile));
  }

  // Create test files if they don't exist
  if (!fs.existsSync(paths.test1File)) {
    fs.writeFileSync(paths.test1File, getTestTemplate(year, day, 1));
    logger.log(chalk.green('🎁 Created:'), chalk.white(paths.test1File));
  } else {
    logger.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.test1File));
  }

  if (!fs.existsSync(paths.test2File)) {
    fs.writeFileSync(paths.test2File, getTestTemplate(year, day, 2));
    logger.log(chalk.green('🎁 Created:'), chalk.white(paths.test2File));
  } else {
    logger.log(chalk.gray('⏭️  Skipping (exists):'), chalk.white(paths.test2File));
  }
};

export const getScaffoldPaths = (year: number, day: number) => {
  const dayDir = path.join(
    process.cwd(),
    'src',
    'solutions',
    `${year}`,
    `day-${`${day}`.padStart(2, '0')}`,
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
