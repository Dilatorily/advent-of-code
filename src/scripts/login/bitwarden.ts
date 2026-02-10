import { spawnSync } from 'node:child_process';

import chalk from 'chalk';
import prompts from 'prompts';

import { getBitwardenPath, rootDir } from '#dilatorily/advent-of-code/scripts/login/configuration';
import { spinner } from '#dilatorily/advent-of-code/scripts/login/spinner';
import { jsonParse } from '#dilatorily/advent-of-code/utility/json-parse';
import { logger } from '#dilatorily/advent-of-code/utility/logger';

import type {
  BitwardenConfiguration,
  BitwardenItem,
  BitwardenStatusResponse,
} from '#dilatorily/advent-of-code/scripts/login/types';

const localBwPath = getBitwardenPath();

const bwCommand = (...args: string[]) =>
  spawnSync(process.execPath, [localBwPath, ...args], {
    cwd: rootDir,
    encoding: 'utf-8',
    env: process.env,
    shell: false,
  });

const bwCommandWithInput =
  (input: string) =>
  (...args: string[]) =>
    spawnSync(process.execPath, [localBwPath, ...args], {
      cwd: rootDir,
      encoding: 'utf-8',
      env: process.env,
      input: `${input}\n`,
      shell: false,
    });

export const hasActiveSession = () => {
  const status = bwCommand('status');
  if (status.status !== 0) {
    return false;
  }

  try {
    const data = jsonParse<BitwardenStatusResponse>(status.stdout);
    return data.status !== 'unauthenticated';
  } catch {
    return false;
  }
};

export const logout = () => {
  if (!hasActiveSession()) {
    return;
  }

  logger.log(chalk.yellow('🚪 Cleaning up Bitwarden session...'));
  const result = bwCommand('logout');
  if (result.status === 0) {
    logger.log(chalk.gray('  Logged out\n'));
  }
};

export const unlock = async ({ clientId, clientSecret, serverUrl }: BitwardenConfiguration) => {
  if (hasActiveSession()) {
    logger.log(chalk.yellow('🧹 Cleaning up previous Bitwarden session...'));
    logout();
  }

  process.env.BW_CLIENTID = clientId;
  process.env.BW_CLIENTSECRET = clientSecret;
  spinner.text = '🔐 Configuring Bitwarden server...';
  const configResult = bwCommand('config', 'server', serverUrl);
  if (configResult.status !== 0) {
    logger.log(chalk.red(`  Command failed with status ${configResult.status}`));
    logger.log(chalk.gray(`  stdout: ${configResult.stdout}`));
    logger.log(chalk.gray(`  stderr: ${configResult.stderr}`));
    logger.log(chalk.gray(`  error: ${configResult.error?.message}`));
    throw new Error(`Failed to configure server: ${configResult.stderr || configResult.stdout}`);
  }

  spinner.text = '🔑 Authenticating with Bitwarden...';
  const loginResult = bwCommand('login', '--apikey');

  if (loginResult.status !== 0) {
    throw new Error(`Login failed: ${loginResult.stderr}`);
  }

  spinner.stop();
  const response = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Bitwarden master password:',
    validate: (value: string) => value.length > 0 || 'Master password is required',
  });
  if (!response.masterPassword || typeof response.masterPassword !== 'string') {
    throw new Error('Master password is required');
  }

  spinner.start();
  spinner.text = '🎁 Unlocking Bitwarden vault...';
  const unlockResult = bwCommandWithInput(response.masterPassword)('unlock', '--raw');
  if (unlockResult.status !== 0) {
    throw new Error(`Unlock failed: ${unlockResult.stderr}`);
  }

  const sessionKey = unlockResult.stdout.trim();
  if (!sessionKey) {
    logger.log(chalk.red('  Empty session key from unlock'));
    logger.log(chalk.gray(`  stdout: ${unlockResult.stdout}`));
    logger.log(chalk.gray(`  stderr: ${unlockResult.stderr}`));
    throw new Error('Could not extract session key');
  }

  spinner.text = '✅ Vault unlocked';
  return sessionKey;
};

export const getCredentials = (sessionKey: string) => {
  process.env.BW_SESSION = sessionKey;

  spinner.text = '🔍 Searching for GitHub credentials...';
  const searchResult = bwCommand('list', 'items', '--url', 'github.com');
  if (searchResult.status !== 0) {
    throw new Error(`Search failed: ${searchResult.stderr}`);
  }

  const items = jsonParse<BitwardenItem[]>(searchResult.stdout);
  if (items.length <= 0) {
    throw new Error(
      'No GitHub credentials found in Bitwarden. Ensure you have a login item with URL github.com',
    );
  }

  const login = items[0].login;
  if (!login.username || !login.password) {
    throw new Error('GitHub credentials incomplete (missing username or password)');
  }

  spinner.text = `Found credentials for ${login.username}`;
  return {
    itemId: items[0].id,
    password: login.password,
    totp: login.totp ?? undefined,
    username: login.username,
  };
};

export const getTwoFactorCode = (itemId: string) => {
  const totpResult = bwCommand('get', 'totp', itemId);
  if (totpResult.status !== 0) {
    throw new Error(`Failed to generate TOTP: ${totpResult.stderr}`);
  }

  return totpResult.stdout.trim();
};
