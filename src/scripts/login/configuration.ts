import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { config } from 'dotenv';
import prompts from 'prompts';

import { logger } from '#dilatorily/advent-of-code/utility/logger';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
export const rootDir = join(__dirname, '..', '..', '..');
const DEFAULT_SERVER_URL = 'https://vault.bitwarden.com';

config({ path: join(rootDir, '.env'), quiet: true });

export const getEnvPath = () => join(rootDir, '.env');
export const getSessionPath = () => join(rootDir, '.session');
export const getBitwardenPath = () =>
  join(rootDir, 'node_modules', '@bitwarden', 'cli', 'build', 'bw.js');
export const getBitwardenAppDataDir = () => join(rootDir, '.bitwarden-cli');

export const firstTimeSetup = async () => {
  logger.log(chalk.cyan.bold('\n🎄 First-time Setup 🎄\n'));
  logger.log(chalk.gray("Let's configure Bitwarden to securely store your credentials.\n"));

  const response = await prompts([
    {
      initial: DEFAULT_SERVER_URL,
      message: 'Bitwarden server URL (leave empty for bitwarden.com):',
      name: 'serverUrl',
      type: 'text',
    },
    {
      message: 'Bitwarden API Client ID:',
      name: 'clientId',
      type: 'text',
      validate: (value: string) => value.length > 0 || 'Client ID is required',
    },
    {
      message: 'Bitwarden API Client Secret:',
      name: 'clientSecret',
      type: 'password',
      validate: (value: string) => value.length > 0 || 'Client Secret is required',
    },
  ]);

  if (
    !response.clientId ||
    typeof response.clientId !== 'string' ||
    !response.clientSecret ||
    typeof response.clientSecret !== 'string'
  ) {
    logger.log(chalk.yellow('Setup cancelled'));
    process.exit(1);
  }

  const envContent = `BITWARDEN_SERVER_URL=${response.serverUrl || DEFAULT_SERVER_URL}
BITWARDEN_CLIENT_ID=${response.clientId}
BITWARDEN_CLIENT_SECRET=${response.clientSecret}
`;

  writeFileSync(getEnvPath(), envContent);
  logger.log(chalk.green('✅ Configuration saved to .env\n'));

  return {
    clientId: response.clientId,
    clientSecret: response.clientSecret,
    serverUrl: typeof response.serverUrl === 'string' ? response.serverUrl : DEFAULT_SERVER_URL,
  };
};

export const loadEnvConfig = () => {
  const envPath = getEnvPath();

  return {
    clientId: process.env.BITWARDEN_CLIENT_ID,
    clientSecret: process.env.BITWARDEN_CLIENT_SECRET,
    exists: existsSync(envPath),
    serverUrl: process.env.BITWARDEN_SERVER_URL ?? DEFAULT_SERVER_URL,
  };
};
