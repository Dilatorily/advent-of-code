import { writeFileSync } from 'node:fs';

import chalk from 'chalk';

import { getSessionPath } from '#dilatorily/advent-of-code/scripts/login/configuration';
import { logger } from '#dilatorily/advent-of-code/utility/logger';

import type { Cookie } from 'playwright';

const getSession = (cookies: Cookie[]) => {
  const sessionCookie = cookies.find(({ name }) => name === 'session');

  if (!sessionCookie) {
    logger.log(chalk.red('  Available cookies:'));
    cookies.forEach(({ name }) => {
      logger.log(chalk.gray(`    ${name}`));
    });
    throw new Error('Could not find Advent of Code session cookie');
  }

  return sessionCookie.value;
};

export const saveSession = (cookies: Cookie[]) => {
  const session = getSession(cookies);
  const sessionPath = getSessionPath();
  writeFileSync(sessionPath, session, { encoding: 'utf-8' });
  logger.log(chalk.green(`🎄✨ Session saved to ${chalk.bold('.session')}`));
};
