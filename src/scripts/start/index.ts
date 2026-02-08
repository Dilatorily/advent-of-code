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

const validateDay = (day: number): void => {
  if (Number.isNaN(day) || day < 1 || day > 25) {
    throw new Error(`Invalid day: ${day}. Must be between 1 and 25.`);
  }
};

const validatePart = (part: number): void => {
  if (part !== 1 && part !== 2) {
    throw new Error(`Invalid part: ${part}. Must be either 1 or 2.`);
  }
};

const parseDate = (dateStr?: string): { year: number; day: number } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  if (!dateStr) {
    validateDay(currentDay);
    return { year: currentYear, day: currentDay };
  }

  // Parse "YYYY-MM-DD" or "MM-DD" or "DD"
  const parts = dateStr.split('-').map(Number);

  if (parts.length === 3) {
    // YYYY-MM-DD format - validate month is December
    const [, month, day] = parts;
    if (month !== 12) {
      throw new Error(`Invalid month: ${month}. Advent of Code is in December.`);
    }
    validateDay(day);
    return { year: parts[0], day };
  } else if (parts.length === 2) {
    // MM-DD format - validate month is December
    const [month, day] = parts;
    if (month !== 12) {
      throw new Error(`Invalid month: ${month}. Advent of Code is in December.`);
    }
    validateDay(day);
    return { year: currentYear, day };
  } else if (parts.length === 1) {
    const day = parts[0];
    validateDay(day);
    return { year: currentYear, day };
  }

  throw new Error(`Invalid date format: ${dateStr}`);
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

  // Run solutions only if --part flag is specified or if no --date flag was used
  const shouldRunSolutions = args.part !== undefined || args.date === undefined;

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
