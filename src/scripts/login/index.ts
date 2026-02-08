import { existsSync } from 'node:fs';

import chalk from 'chalk';

import { loginToAoC } from '#dilatorily/advent-of-code/scripts/login/aoc';
import { logout } from '#dilatorily/advent-of-code/scripts/login/bitwarden';
import {
  firstTimeSetup,
  getSessionPath,
  loadEnvConfig,
} from '#dilatorily/advent-of-code/scripts/login/configuration';
import { saveSession } from '#dilatorily/advent-of-code/scripts/login/session';

const cleanup = () => {
  logout();
  process.exitCode = 1;
};

(async () => {
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  const sessionPath = getSessionPath();
  if (existsSync(sessionPath)) {
    console.log(chalk.green('✓ Session file exists') + chalk.gray(' (.session)'));
    console.log(
      chalk.cyan('Run ') +
        chalk.bold('npm start') +
        chalk.cyan(' to download inputs and run solutions.\n'),
    );
    return;
  }

  try {
    const envConfig = loadEnvConfig();

    let clientId = envConfig.clientId;
    let clientSecret = envConfig.clientSecret;
    let serverUrl = envConfig.serverUrl;

    if (!envConfig.exists) {
      const setup = await firstTimeSetup();
      serverUrl = setup.serverUrl ?? 'https://vault.bitwarden.com';
      clientId = setup.clientId;
      clientSecret = setup.clientSecret;
    }

    if (!clientId || !clientSecret) {
      throw new Error('Bitwarden credentials not configured. Run setup again.');
    }

    const sessionValue = await loginToAoC(serverUrl, clientId, clientSecret);
    saveSession(sessionValue);

    console.log(chalk.bold.cyan('\n🎉 Success! Ready to download inputs and run solutions.\n'));
  } catch (error) {
    console.error(chalk.red(`\n✖ ${(error as Error).message}\n`));
    process.exitCode = 1;
  } finally {
    logout();
  }
})();
