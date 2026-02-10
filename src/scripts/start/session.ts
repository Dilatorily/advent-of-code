import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import ora from 'ora';

import { logger } from '#dilatorily/advent-of-code/utility/logger';

const SESSION_FILE = path.join(process.cwd(), '.session');

const readSessionFile = () => {
  try {
    return fs.readFileSync(SESSION_FILE, 'utf-8').trim();
  } catch {
    // Silently ignore if file doesn't exist
  }
};

export const deleteSessionFile = () => {
  try {
    fs.unlinkSync(SESSION_FILE);
  } catch {
    // Silently ignore if file doesn't exist
  }
};

export const validateSession = async () => {
  const spinner = ora('🎄 Checking your Advent session...').start();

  try {
    // Check if session file exists
    const session = readSessionFile();

    if (!session) {
      spinner.fail('🔴 No session file found');
      return false;
    }

    // Test session by making a request to AoC
    const response = await fetch('https://adventofcode.com/2015/day/1', {
      headers: { Cookie: `session=${session}` },
    });

    if (!response.ok || response.status === 400) {
      spinner.fail('🔴 Session has expired');
      return false;
    }

    spinner.succeed(chalk.green('✅ Session validated!'));
    return true;
  } catch (error) {
    spinner.fail('🔴 Failed to validate session');
    logger.error(chalk.red(error));
    return false;
  }
};

export const triggerLogin = (quiet: boolean) => {
  logger.log(chalk.yellow('🎅 Ho ho ho! Your session needs a refresh. Running login...\n'));
  try {
    const quietFlag = quiet ? ' --quiet' : '';
    execSync(`npm run login${quietFlag}`, { stdio: quiet ? 'pipe' : 'inherit' });
  } catch (error) {
    logger.error(chalk.red('🔴 Login failed:'), error);
    process.exit(1);
  }
};
