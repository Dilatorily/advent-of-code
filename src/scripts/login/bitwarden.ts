import { execSync, spawnSync } from 'node:child_process';

import chalk from 'chalk';
import prompts from 'prompts';

import {
  getBitwardenAppDataDir,
  getBitwardenPath,
  getRootDir,
} from '#dilatorily/advent-of-code/scripts/login/configuration';

import type {
  BwCommandOptions,
  GitHubCredentials,
} from '#dilatorily/advent-of-code/scripts/login/types';
import type { Ora } from 'ora';

const rootDir = getRootDir();
const localBwPath = getBitwardenPath();

const bwCommand = (
  args: string[],
  options: BwCommandOptions = {},
): ReturnType<typeof spawnSync> => {
  const env = {
    ...process.env,
    BITWARDENCLI_APPDATA_DIR: getBitwardenAppDataDir(),
    ...options.env,
  };

  const result = spawnSync(process.execPath, [localBwPath, ...args], {
    encoding: 'utf-8',
    shell: false,
    cwd: rootDir,
    env,
  });

  return result;
};

const bwCommandWithRetry = (
  args: string[],
  options: BwCommandOptions = {},
  maxRetries = 3,
): ReturnType<typeof spawnSync> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = bwCommand(args, options);

    if (result.status === 0) {
      return result;
    }

    if (attempt < maxRetries) {
      const delay = attempt * 1000;
      console.log(chalk.yellow(`  Attempt ${attempt} failed, retrying in ${delay}ms...`));
      if (result.stderr) {
        console.log(chalk.gray(`    stderr: ${(result.stderr as string).trim()}`));
      }
      execSync(`sleep ${delay / 1000}`, { stdio: 'ignore' });
    } else {
      return result;
    }
  }

  return bwCommand(args, options);
};

export const hasActiveSession = (): boolean => {
  const status = bwCommand(['status']);
  if (status.status !== 0) return false;

  try {
    const data = JSON.parse(status.stdout as string);
    return data.status === 'locked' || data.status === 'unlocked';
  } catch {
    return false;
  }
};

export const logout = () => {
  if (!hasActiveSession()) {
    return;
  }

  console.log(chalk.yellow('🚪 Logging out from Bitwarden...'));
  const result = bwCommand(['logout']);
  if (result.status === 0) {
    console.log(chalk.gray('  Logged out'));
  }
};

export const unlockVault = async (
  serverUrl: string,
  clientId: string,
  clientSecret: string,
  spinner: Ora,
): Promise<string> => {
  if (hasActiveSession()) {
    spinner.text = 'Cleaning up previous session...';
    logout();
  }

  process.env.BW_CLIENTID = clientId;
  process.env.BW_CLIENTSECRET = clientSecret;

  spinner.text = 'Configuring server...';
  const configResult = bwCommandWithRetry([
    'config',
    'server',
    serverUrl || 'https://vault.bitwarden.com',
  ]);
  if (configResult.status !== 0) {
    console.log(chalk.red(`  Command failed with status ${configResult.status}`));
    console.log(chalk.gray(`  stdout: ${configResult.stdout}`));
    console.log(chalk.gray(`  stderr: ${configResult.stderr}`));
    console.log(chalk.gray(`  error: ${configResult.error?.message}`));
    throw new Error(`Failed to configure server: ${configResult.stderr || configResult.stdout}`);
  }

  spinner.text = 'Authenticating with API key...';
  const loginResult = bwCommandWithRetry(['login', '--apikey']);

  if (loginResult.status !== 0) {
    throw new Error(`Login failed: ${loginResult.stderr}`);
  }

  spinner.stop();
  const response = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Bitwarden master password:',
    validate: (value) => value.length > 0 || 'Master password is required',
  });
  const masterPassword = response.masterPassword;
  spinner.start();

  spinner.text = 'Unlocking vault...';
  const { spawnSync } = await import('node:child_process');
  const unlockResult = spawnSync(process.execPath, [localBwPath, 'unlock', '--raw'], {
    encoding: 'utf-8',
    shell: false,
    cwd: rootDir,
    env: {
      ...process.env,
      BITWARDENCLI_APPDATA_DIR: getBitwardenAppDataDir(),
      BW_SESSION: undefined,
    },
    input: `${masterPassword}\n`,
  });

  if (unlockResult.status !== 0) {
    throw new Error(`Unlock failed: ${unlockResult.stderr}`);
  }

  const sessionKey = (unlockResult.stdout as string).trim();
  if (!sessionKey) {
    console.log(chalk.red('  Empty session key from unlock'));
    console.log(chalk.gray(`  stdout: ${unlockResult.stdout}`));
    console.log(chalk.gray(`  stderr: ${unlockResult.stderr}`));
    throw new Error('Could not extract session key');
  }

  spinner.text = 'Vault unlocked';
  return sessionKey;
};

export const findGitHubCredentials = (sessionKey: string, spinner: Ora): GitHubCredentials => {
  process.env.BW_SESSION = sessionKey;

  spinner.text = 'Searching for GitHub credentials...';
  const searchResult = bwCommandWithRetry(['list', 'items', '--url', 'github.com']);

  if (searchResult.status !== 0) {
    throw new Error(`Search failed: ${searchResult.stderr}`);
  }

  const items = JSON.parse(searchResult.stdout as string);

  if (items.length === 0) {
    throw new Error(
      'No GitHub credentials found in Bitwarden. Ensure you have a login item with URL github.com',
    );
  }

  const item = items[0];
  const login = item.login;

  if (!login || !login.username || !login.password) {
    throw new Error('GitHub credentials incomplete (missing username or password)');
  }

  spinner.text = `Found credentials for ${login.username}`;

  return {
    username: login.username,
    password: login.password,
    totp: login.totp,
    itemId: item.id,
  };
};

export const getTotpCode = (itemId: string): string => {
  const totpResult = bwCommandWithRetry(['get', 'totp', itemId]);
  if (totpResult.status !== 0) {
    throw new Error(`Failed to generate TOTP: ${totpResult.stderr}`);
  }

  return (totpResult.stdout as string).trim();
};
