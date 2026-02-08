import { pathToFileURL } from 'node:url';

import chalk from 'chalk';
import clipboardy from 'clipboardy';
import ora from 'ora';

import { readInput } from '#dilatorily/advent-of-code/scripts/start/input';

import type { SolutionFunction } from '#dilatorily/advent-of-code/scripts/start/types';

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
      `${process.cwd()}/src/solutions/${year}/day-${day.toString().padStart(2, '0')}/part-${part}.ts`,
    ).toString();

    const module = await import(solutionPath);
    const solution: SolutionFunction = module.default;

    if (!solution) {
      spinner.fail(`🔴 No default export found in part-${part}.ts`);
      return;
    }

    const lines = readInput(inputFile);
    const startTime = performance.now();
    const result = solution(lines);
    const duration = performance.now() - startTime;

    spinner.succeed(chalk.green(`⭐ Part ${part} solved in ${duration.toFixed(2)}ms!`));

    const resultStr = result.toString();
    console.log(chalk.yellow('\n🎄 Answer:'), chalk.bold(chalk.white(resultStr)));

    // Copy to clipboard
    await clipboardy.write(resultStr);
    console.log(chalk.gray('📋 (Copied to clipboard)\n'));
  } catch (error) {
    spinner.fail(`🔴 Failed to solve part ${part}`);
    console.error(chalk.red(error));
  }
};
