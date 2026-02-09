import { pathToFileURL } from 'node:url';

import chalk from 'chalk';
import clipboardy from 'clipboardy';
import ora from 'ora';

import { readInput } from '#dilatorily/advent-of-code/scripts/start/input';
import { logger } from '#dilatorily/advent-of-code/utility/logger';

import type { SolutionModule } from '#dilatorily/advent-of-code/scripts/start/types';

export const runSolution = async (
  year: number,
  day: number,
  part: number,
  inputFile: string,
): Promise<void> => {
  const spinner = ora(`🎅 Solving part ${part}...`).start();

  try {
    // Dynamically import the solution
    const solutionPath = pathToFileURL(
      `${process.cwd()}/src/solutions/${year}/day-${`${day}`.padStart(2, '0')}/part-${part}.ts`,
    ).toString();

    const module = (await import(solutionPath)) as SolutionModule;

    if (!module.solution) {
      spinner.fail(`🔴 No default export found in part-${part}.ts`);
      return;
    }

    const lines = readInput(inputFile);
    const startTime = performance.now();
    const result = module.solution(lines);
    const duration = performance.now() - startTime;

    spinner.succeed(chalk.green(`⭐ Part ${part} solved in ${duration.toFixed(2)}ms!`));

    const resultStr = `${result}`;
    logger.log(chalk.yellow('\n🎄 Answer:'), chalk.bold(chalk.white(resultStr)));

    // Copy to clipboard
    await clipboardy.write(resultStr);
    logger.log(chalk.gray('📋 (Copied to clipboard)\n'));
  } catch (error) {
    spinner.fail(`🔴 Failed to solve part ${part}`);
    logger.error(chalk.red(error));
  }
};
