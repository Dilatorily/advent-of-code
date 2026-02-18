import { spawn } from 'node:child_process';
import { parseArgs } from 'node:util';

import chalk from 'chalk';

import { downloadInput } from '#dilatorily/advent-of-code/scripts/start/input';
import { runSolution } from '#dilatorily/advent-of-code/scripts/start/runner';
import {
  createScaffold,
  getScaffoldPaths,
} from '#dilatorily/advent-of-code/scripts/start/scaffold';
import {
  deleteSessionFile,
  triggerLogin,
  validateSession,
} from '#dilatorily/advent-of-code/scripts/start/session';
import { parseDate, validatePart } from '#dilatorily/advent-of-code/scripts/start/validation';
import { logger, setQuietMode } from '#dilatorily/advent-of-code/utility/logger';

const parseCliArgs = () => {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    args: process.argv.slice(2),
    options: {
      date: { short: 'd', type: 'string' },
      part: { short: 'p', type: 'string' },
      quiet: { default: false, short: 'q', type: 'boolean' },
      watch: { default: false, short: 'w', type: 'boolean' },
    },
  });

  if (positionals.length > 0) {
    throw new Error(
      `Unknown positional argument(s): ${positionals.join(', ')}. Did you forget to use --date flag?`,
    );
  }

  return values;
};

const printFestiveHeader = () => {
  const tree = `
      🎄
     🎄🎄
    🎄🎄🎄
   🎄🎄🎄🎄
  🎄🎄🎄🎄🎄
     🟫
  `;

  logger.log(tree);
  logger.log(chalk.red.bold('★ Advent of Code ★'));
  logger.log(chalk.green.bold('Solution Runner\n'));
};

const runWatchMode = (year: number, day: number, part: number) => {
  const dayStr = `${day}`.padStart(2, '0');
  const testPattern = `src/solutions/${year}/day-${dayStr}/part-${part}.test.ts`;

  return new Promise<void>((resolve) => {
    const jestProcess = spawn('npm', ['test', '--', '--watch', testPattern], {
      shell: true,
      stdio: 'inherit',
    });

    jestProcess.on('close', () => {
      resolve();
    });
  });
};

await (async () => {
  try {
    const args = parseCliArgs();
    setQuietMode(args.quiet);

    printFestiveHeader();
    const { day, year } = parseDate(args.date);
    const part = args.part ? parseInt(args.part, 10) : undefined;

    if (part !== undefined) {
      validatePart(part);
    }

    if (args.watch && !part) {
      throw new Error('Watch mode requires --part flag. Usage: --watch --part [1|2]');
    }

    const yearLine = `${chalk.yellow('🎁 Year:')} ${chalk.white(year)}`;
    const dayLine = `${chalk.yellow('📅 Day:')} ${chalk.white(day)}`;
    const partLine = part ? `${chalk.yellow('⭐ Part:')} ${chalk.white(part)}` : '';
    logger.log(`${[yearLine, dayLine, partLine].filter(Boolean).join('\n')}\n`);

    // Validate session
    let isSessionValid = await validateSession();
    if (!isSessionValid) {
      deleteSessionFile();
      triggerLogin(args.quiet);
      // Re-validate after login
      isSessionValid = await validateSession();
      if (!isSessionValid) {
        logger.error(chalk.red('Failed to validate session after login. Exiting.'));
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
      logger.error(chalk.red('Failed to download input. Exiting.\n'));
      process.exit(1);
    }

    // Run solutions only if --part flag is specified
    const shouldRunSolutions = args.part !== undefined;

    if (args.watch && !!part) {
      // Watch mode: start Jest, skip solution execution
      logger.log(chalk.cyan('👀 Starting watch mode for tests...\n'));
      await runWatchMode(year, day, part);
    } else if (shouldRunSolutions) {
      if (part === 1 || part === undefined) {
        await runSolution(year, day, 1, paths.inputFile);
      }

      if (part === 2 || part === undefined) {
        await runSolution(year, day, 2, paths.inputFile);
      }
    }
  } catch (error) {
    logger.error(chalk.red('Error:'), error);
    process.exit(1);
  }
})();
