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

export const downloadInput = async (
  year: number,
  day: number,
  inputFile: string,
): Promise<boolean> => {
  // Check if input already exists
  if (fs.existsSync(inputFile)) {
    return true;
  }

  const spinner = ora(
    `❄️  Fetching puzzle input for ${year}-12-${day.toString().padStart(2, '0')}...`,
  ).start();

  try {
    const session = readSessionFile();

    if (!session) {
      spinner.fail('🔴 No session found');
      return false;
    }

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
      headers: {
        Cookie: `session=${session}`,
      },
    });

    if (!response.ok) {
      spinner.fail(`🔴 Failed to download input: ${response.status} ${response.statusText}`);
      return false;
    }

    const input = await response.text();
    fs.writeFileSync(inputFile, input.trim());
    spinner.succeed(chalk.green('🎄 Input wrapped and delivered!'));
    return true;
  } catch (error) {
    spinner.fail('🔴 Failed to download input');
    console.error(chalk.red(error));
    return false;
  }
};

export const readInput = (inputFile: string): string[] => {
  const content = fs.readFileSync(inputFile, 'utf-8');
  return content.split('\n');
};
