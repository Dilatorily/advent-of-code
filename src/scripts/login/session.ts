import { writeFileSync } from 'node:fs';

import chalk from 'chalk';

import { getSessionPath } from '#dilatorily/advent-of-code/scripts/login/configuration';

export const saveSession = (sessionValue: string): void => {
  const sessionPath = getSessionPath();
  writeFileSync(sessionPath, sessionValue, { encoding: 'utf-8' });
  console.log(chalk.green(`✓ Session saved to ${chalk.bold('.session')}`));
};
