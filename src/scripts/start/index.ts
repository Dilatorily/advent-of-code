import { parseArgs } from 'node:util';

import chalk from 'chalk';

import { downloadInput } from '#dilatorily/advent-of-code/scripts/start/input';
import { runSolution } from '#dilatorily/advent-of-code/scripts/start/runner';
import {
  createScaffold,
  getScaffoldPaths,
} from '#dilatorily/advent-of-code/scripts/start/scaffold';
import { triggerLogin, validateSession } from '#dilatorily/advent-of-code/scripts/start/session';

import type { CliArgs } from '#dilatorily/advent-of-code/scripts/start/types';

const parseCliArgs = (): CliArgs => {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      date: {
        type: 'string',
      },
      part: {
        type: 'string',
      },
    },
    allowPositionals: true,
  });

  if (positionals.length > 0) {
    throw new Error(
      `Unknown positional argument(s): ${positionals.join(', ')}. Did you forget to use --date flag?`,
    );
  }

  return values as CliArgs;
};

const validateYear = (year: number): void => {
  if (Number.isNaN(year) || year < 2015) {
    throw new Error(`Invalid year: ${year}. Must be 2015 or later.`);
  }
};

const validateDay = (day: number, year: number): void => {
  const maxDay = year >= 2025 ? 12 : 25;
  if (Number.isNaN(day) || day < 1 || day > maxDay) {
    throw new Error(`Invalid day: ${day}. Must be between 1 and ${maxDay}.`);
  }
};

const validatePart = (part: number): void => {
  if (part !== 1 && part !== 2) {
    throw new Error(`Invalid part: ${part}. Must be either 1 or 2.`);
  }
};

const validateDateNotInFuture = (year: number, month: number, day: number): void => {
  const now = new Date();
  const inputDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (inputDate > today) {
    throw new Error(
      `Cannot use future date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}. Advent of Code puzzles unlock daily at midnight EST.`,
    );
  }
};

const parseDate = (dateStr?: string): { year: number; day: number } => {
  if (!dateStr) {
    throw new Error('Date is required. Please use --date YYYY-MM-DD format.');
  }

  // Only accept "YYYY-MM-DD" format
  const parts = dateStr.split('-').map(Number);

  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD format.`);
  }

  const [year, month, day] = parts;

  validateYear(year);

  if (month !== 12) {
    throw new Error(`Invalid month: ${month}. Advent of Code is in December.`);
  }

  validateDateNotInFuture(year, month, day);
  validateDay(day, year);
  return { year, day };
};

const printFestiveHeader = (): void => {
  const tree = `
      🎄
     🎄🎄
    🎄🎄🎄
   🎄🎄🎄🎄
  🎄🎄🎄🎄🎄
     🟫
  `;

  console.log(tree);
  console.log(chalk.red.bold('★ Advent of Code ★'));
  console.log(chalk.green.bold('Solution Runner\n'));
};

const main = async (): Promise<void> => {
  printFestiveHeader();

  const args = parseCliArgs();
  const { year, day } = parseDate(args.date);
  const part = args.part ? parseInt(args.part, 10) : undefined;

  if (part !== undefined) {
    validatePart(part);
  }

  const yearLine = `${chalk.yellow('🎁 Year:')} ${chalk.white(year)}`;
  const dayLine = `${chalk.yellow('📅 Day:')} ${chalk.white(day)}`;
  const partLine = part ? `${chalk.yellow('⭐ Part:')} ${chalk.white(part)}` : '';
  console.log(`${[yearLine, dayLine, partLine].filter(Boolean).join('\n')}\n`);

  // Validate session
  let isSessionValid = await validateSession();
  if (!isSessionValid) {
    triggerLogin();
    // Re-validate after login
    isSessionValid = await validateSession();
    if (!isSessionValid) {
      console.error(chalk.red('Failed to validate session after login. Exiting.'));
      process.exit(1);
    }
  }

  // Get scaffold paths
  const paths = getScaffoldPaths(year, day);

  // Create scaffold
  createScaffold(year, day, paths);

  // Download input if needed
  const inputDownloaded = await downloadInput(year, day, paths.inputFile);
  if (!inputDownloaded) {
    console.error(chalk.red('Failed to download input. Exiting.\n'));
    process.exit(1);
  }

  // Run solutions only if --part flag is specified
  const shouldRunSolutions = args.part !== undefined;

  if (shouldRunSolutions) {
    if (part === 1 || part === undefined) {
      await runSolution(year, day, 1, paths.inputFile);
    }

    if (part === 2 || part === undefined) {
      await runSolution(year, day, 2, paths.inputFile);
    }
  }
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
})();
