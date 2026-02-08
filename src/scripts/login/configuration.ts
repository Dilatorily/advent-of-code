import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { config } from 'dotenv';
import prompts from 'prompts';

import type { SetupResponse } from '#dilatorily/advent-of-code/scripts/login/types';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..', '..', '..');
const defaultServerUrl = 'https://vault.bitwarden.com';

config({ path: join(rootDir, '.env'), quiet: true });

export const getRootDir = (): string => rootDir;

export const getEnvPath = (): string => join(rootDir, '.env');

export const getSessionPath = (): string => join(rootDir, '.session');

export const getBitwardenPath = (): string =>
  join(rootDir, 'node_modules', '@bitwarden', 'cli', 'build', 'bw.js');

export const getBitwardenAppDataDir = (): string => join(rootDir, '.bitwarden-cli');

export const getDefaultServerUrl = (): string => defaultServerUrl;

export const firstTimeSetup = async (): Promise<SetupResponse> => {
  console.log(chalk.cyan.bold('\n🔐 First-time setup\n'));

  const response = (await prompts([
    {
      type: 'text',
      name: 'serverUrl',
      message: 'Bitwarden server URL (leave empty for bitwarden.com):',
      initial: 'https://vault.bitwarden.com',
    },
    {
      type: 'text',
      name: 'clientId',
      message: 'Bitwarden API Client ID:',
      validate: (value) => value.length > 0 || 'Client ID is required',
    },
    {
      type: 'password',
      name: 'clientSecret',
      message: 'Bitwarden API Client Secret:',
      validate: (value) => value.length > 0 || 'Client Secret is required',
    },
  ])) as SetupResponse;

  if (!response.clientId || !response.clientSecret) {
    console.log(chalk.yellow('Setup cancelled'));
    process.exitCode = 1;
  }

  const envContent = `BITWARDEN_SERVER_URL=${response.serverUrl || 'https://vault.bitwarden.com'}
BITWARDEN_CLIENT_ID=${response.clientId}
BITWARDEN_CLIENT_SECRET=${response.clientSecret}
`;

  writeFileSync(join(rootDir, '.env'), envContent);
  console.log(chalk.green('✓ Configuration saved to .env\n'));

  return response;
};

export const loadEnvConfig = (): {
  clientId: string | undefined;
  clientSecret: string | undefined;
  serverUrl: string;
  exists: boolean;
} => {
  const envPath = getEnvPath();
  const doesEnvExist = existsSync(envPath);

  let clientId = process.env.BITWARDEN_CLIENT_ID;
  let clientSecret = process.env.BITWARDEN_CLIENT_SECRET;
  let serverUrl = process.env.BITWARDEN_SERVER_URL ?? defaultServerUrl;

  return {
    clientId,
    clientSecret,
    serverUrl,
    exists: doesEnvExist,
  };
};
