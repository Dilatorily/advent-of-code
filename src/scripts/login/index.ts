import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';

import chalk from 'chalk';

import { aocLogin } from '#dilatorily/advent-of-code/scripts/login/aoc';
import {
  firstTimeSetup,
  getSessionPath,
  loadEnvConfig,
} from '#dilatorily/advent-of-code/scripts/login/configuration';
import { saveSession } from '#dilatorily/advent-of-code/scripts/login/session';
import { logger, setQuietMode } from '#dilatorily/advent-of-code/utility/logger';

const parseQuietMode = () => {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: { quiet: { default: false, type: 'boolean' } },
  });

  setQuietMode(values.quiet);
};

const printLoginHeader = (): void => {
  const gift = `
      🎀
    ┌────┐
    │ 🎁 │
    └────┘
  `;

  logger.log(gift);
  logger.log(chalk.red.bold('★ Advent of Code ★'));
  logger.log(chalk.green.bold('Session Login\n'));
};

await (async () => {
  parseQuietMode();
  printLoginHeader();

  const sessionPath = getSessionPath();
  if (existsSync(sessionPath)) {
    logger.log(chalk.green('✓ Session file already exists'));
    logger.log(chalk.gray('   (.session)\n'));
    logger.log(
      `${chalk.cyan('🎄 Run ')}${chalk.bold('npm start')}${chalk.cyan(' to download inputs and run solutions.\n')}`,
    );
    return;
  }

  const envConfig = loadEnvConfig();

  try {
    let clientId = envConfig.clientId;
    let clientSecret = envConfig.clientSecret;
    let serverUrl = envConfig.serverUrl;

    if (!envConfig.exists) {
      const setup = await firstTimeSetup();
      clientId = setup.clientId;
      clientSecret = setup.clientSecret;
      serverUrl = setup.serverUrl;
    }

    if (!clientId || !clientSecret) {
      throw new Error('Bitwarden credentials not configured. Run setup again.');
    }

    const cookies = await aocLogin({ clientId, clientSecret, serverUrl });
    saveSession(cookies);
    logger.log(chalk.bold.green('\n🎄✨ Session authenticated successfully! ✨🎄'));
    logger.log(chalk.cyan('   Run npm start to begin solving puzzles.\n'));
  } catch (error) {
    logger.error(chalk.red(`\n✖ ${(error as Error).message}\n`));
    process.exit(1);
  }
})();
