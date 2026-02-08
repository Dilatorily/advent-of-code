import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import ora from 'ora';

const SESSION_FILE = path.join(process.cwd(), '.session');

const readSessionFile = (): string | undefined => {
  try {
    return fs.readFileSync(SESSION_FILE, 'utf-8').trim();
  } catch {
    return undefined;
  }
};

export const validateSession = async (): Promise<boolean> => {
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
      headers: {
        Cookie: `session=${session}`,
      },
    });

    if (!response.ok || response.status === 400) {
      spinner.fail('🔴 Session has expired');
      return false;
    }

    spinner.succeed(chalk.green('✅ Session validated!'));
    return true;
  } catch (error) {
    spinner.fail('🔴 Failed to validate session');
    console.error(chalk.red(error));
    return false;
  }
};

export const triggerLogin = (): void => {
  console.log(chalk.yellow('🎅 Ho ho ho! Your session needs a refresh. Running login...\n'));
  try {
    execSync('npm run login', { stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.red('🔴 Login failed:'), error);
    process.exit(1);
  }
};
