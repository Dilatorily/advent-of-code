import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { type Browser, type Page, type Cookie } from 'puppeteer';
import prompts from 'prompts';
import { config } from 'dotenv';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..', '..');

const localBwPath = join(rootDir, 'node_modules', '@bitwarden', 'cli', 'build', 'bw.js');

config({ path: join(rootDir, '.env'), quiet: true });

interface SetupResponse {
  serverUrl?: string;
  clientId: string;
  clientSecret: string;
}

interface GitHubCredentials {
  username: string;
  password: string;
  totp?: string;
  itemId: string;
}

interface BwCommandOptions {
  env?: Record<string, string | undefined>;
}

async function ensureBitwardenCLI(): Promise<string> {
  const spinner = ora('Checking for Bitwarden CLI...').start();

  if (existsSync(localBwPath)) {
    spinner.succeed(chalk.green('Bitwarden CLI found'));
    return localBwPath;
  }

  spinner.fail(chalk.red('Bitwarden CLI not found'));
  throw new Error('Bitwarden CLI not found. Run: npm install @bitwarden/cli');
}

function bwCommand(args: string[], options: BwCommandOptions = {}): SpawnSyncReturns<string> {
  const env = {
    ...process.env,
    BITWARDENCLI_APPDATA_DIR: join(rootDir, '.bitwarden-cli'),
    ...options.env,
  };

  const result = spawnSync(process.execPath, [localBwPath, ...args], {
    encoding: 'utf-8',
    shell: false,
    cwd: rootDir,
    env,
  });

  return result;
}

function bwCommandWithRetry(
  args: string[],
  options: BwCommandOptions = {},
  maxRetries = 3,
): SpawnSyncReturns<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = bwCommand(args, options);

    if (result.status === 0) {
      return result;
    }

    if (attempt < maxRetries) {
      const delay = attempt * 1000;
      console.log(chalk.yellow(`  Attempt ${attempt} failed, retrying in ${delay}ms...`));
      if (result.stderr) {
        console.log(chalk.gray(`    stderr: ${result.stderr.trim()}`));
      }
      const { execSync } = require('node:child_process');
      execSync(`sleep ${delay / 1000}`, { stdio: 'ignore' });
    } else {
      return result;
    }
  }

  return bwCommand(args, options);
}

async function firstTimeSetup(): Promise<SetupResponse> {
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
    process.exit(1);
  }

  const envContent = `BITWARDEN_SERVER_URL=${response.serverUrl || 'https://vault.bitwarden.com'}
BITWARDEN_CLIENT_ID=${response.clientId}
BITWARDEN_CLIENT_SECRET=${response.clientSecret}
`;

  writeFileSync(join(rootDir, '.env'), envContent);
  console.log(chalk.green('✓ Configuration saved to .env\n'));

  return response;
}

function logout(): void {
  const result = bwCommand(['logout']);
  if (result.status === 0) {
    console.log(chalk.gray('  Logged out'));
  }
}

function hasActiveSession(): boolean {
  const status = bwCommand(['status']);
  if (status.status !== 0) return false;

  try {
    const data = JSON.parse(status.stdout);
    return data.status === 'locked' || data.status === 'unlocked';
  } catch {
    return false;
  }
}

async function unlockVault(
  serverUrl: string,
  clientId: string,
  clientSecret: string,
  spinner: Ora,
): Promise<string> {
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
      BITWARDENCLI_APPDATA_DIR: join(rootDir, '.bitwarden-cli'),
      BW_SESSION: undefined,
    },
    input: `${masterPassword}\n`,
  });

  if (unlockResult.status !== 0) {
    throw new Error(`Unlock failed: ${unlockResult.stderr}`);
  }

  const sessionKey = unlockResult.stdout.trim();
  if (!sessionKey) {
    console.log(chalk.red('  Empty session key from unlock'));
    console.log(chalk.gray(`  stdout: ${unlockResult.stdout}`));
    console.log(chalk.gray(`  stderr: ${unlockResult.stderr}`));
    throw new Error('Could not extract session key');
  }

  spinner.text = 'Vault unlocked';
  return sessionKey;
}

function findGitHubCredentials(sessionKey: string, spinner: Ora): GitHubCredentials {
  process.env.BW_SESSION = sessionKey;

  spinner.text = 'Searching for GitHub credentials...';
  const searchResult = bwCommandWithRetry(['list', 'items', '--url', 'github.com']);

  if (searchResult.status !== 0) {
    throw new Error(`Search failed: ${searchResult.stderr}`);
  }

  const items = JSON.parse(searchResult.stdout);

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
}

async function loginToAoC(
  serverUrl: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const spinner = ora('Authenticating with Advent of Code').start();

  const browser: Browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  let sessionKey: string | null = null;

  try {
    const page: Page = await browser.newPage();

    spinner.text = 'Navigating to AoC...';
    await page.goto('https://adventofcode.com', { waitUntil: 'networkidle2' });

    const signoutLink = await page.$('a[href*="/auth/signout"]');
    if (signoutLink) {
      spinner.succeed(chalk.green('Already logged in'));
      const cookies: Cookie[] = await page.cookies();
      const sessionCookie = cookies.find((c) => c.name === 'session');
      if (sessionCookie) {
        console.log(chalk.green('✓ Session obtained'));
        return sessionCookie.value;
      }
    }

    spinner.text = 'Clicking login...';
    const loginLink = await page.$('a[href*="/auth/login"]');
    if (!loginLink) {
      spinner.fail(chalk.red('Could not find login link'));
      throw new Error('Could not find login link');
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      loginLink.click(),
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const githubButton = await page.$('a[href*="github.com/login/oauth"], a[href*="auth/github"]');
    if (!githubButton) {
      spinner.fail(chalk.red('Could not find GitHub auth button'));
      throw new Error('Could not find GitHub auth button');
    }

    spinner.text = 'Clicking GitHub auth...';
    await githubButton.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const pathname = urlObj.pathname;

    if (pathname === '/login' || pathname.startsWith('/login?')) {
      spinner.text = 'Unlocking Bitwarden...';
      sessionKey = await unlockVault(serverUrl, clientId, clientSecret, spinner);
      const credentials = findGitHubCredentials(sessionKey, spinner);

      spinner.text = 'Logging into GitHub...';

      await page.type('#login_field', credentials.username);
      await page.type('#password', credentials.password);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
        page.click('input[name="commit"]'),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const afterLoginUrl = page.url();
      if (afterLoginUrl.includes('/two-factor') || afterLoginUrl.includes('/sessions/two-factor')) {
        if (!credentials.itemId) {
          spinner.fail(chalk.red('2FA required but no TOTP configured'));
          throw new Error('2FA required but no TOTP configured');
        }

        spinner.text = 'Generating 2FA code...';
        const totpResult = bwCommandWithRetry(['get', 'totp', credentials.itemId]);
        if (totpResult.status !== 0) {
          spinner.fail(chalk.red('Failed to generate TOTP'));
          throw new Error(`Failed to generate TOTP: ${totpResult.stderr}`);
        }

        const totpCode = totpResult.stdout.trim();
        spinner.text = 'Submitting 2FA code...';

        await page.evaluate((code) => {
          const selectors = [
            'input[name="app_otp"]',
            'input[name="otp"]',
            '#app_totp',
            '[data-testid="two-factor-code-input"]',
          ];
          for (const sel of selectors) {
            const el = document.querySelector(sel) as HTMLInputElement | null;
            if (el) {
              el.value = code;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));

              const btn = document.querySelector(
                'button[type="submit"]',
              ) as HTMLButtonElement | null;
              if (btn) btn.click();
              return true;
            }
          }
          return false;
        }, totpCode);

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    const afterUrl = page.url();

    if (afterUrl.includes('/login/oauth/authorize') || afterUrl.includes('/login/oauth')) {
      spinner.text = 'Authorizing OAuth...';
      try {
        await page.waitForSelector('button[type="submit"], input[type="submit"]', {
          timeout: 10000,
        });
        await page.click('button[type="submit"], input[type="submit"]');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        spinner.text = 'Waiting for OAuth redirect...';
        try {
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        } catch (e) {
          spinner.text = 'OAuth may have completed...';
        }
      } catch (e) {
        spinner.warn(chalk.yellow(`OAuth note: ${(e as Error).message}`));
      }
    }

    spinner.text = 'Waiting for redirect to AoC...';
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      await page.waitForFunction(() => window.location.hostname === 'adventofcode.com', {
        timeout: 60000,
      });
    } catch (e) {
      const finalUrl = page.url();
      spinner.fail(chalk.red(`Failed to redirect to AoC`));
      console.log(chalk.gray(`  Current URL: ${finalUrl}`));
      throw new Error(`Failed to redirect back to AoC. Current URL: ${finalUrl}`);
    }

    spinner.text = 'Waiting for network idle...';
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 15000 }).catch(() => {
      spinner.text = 'Network may not be fully idle...';
    });

    spinner.text = 'Extracting session cookie...';
    const cookies: Cookie[] = await page.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');

    if (!sessionCookie) {
      console.log(chalk.red('  Available cookies:'));
      cookies.forEach((c) => console.log(chalk.gray(`    ${c.name}`)));
      throw new Error('Could not find Advent of Code session cookie');
    }

    spinner.succeed(chalk.green('Authenticated'));
    console.log(chalk.green('✓ Session obtained'));
    return sessionCookie.value;
  } finally {
    await browser.close();
  }
}

function saveSession(sessionValue: string): void {
  const sessionPath = join(rootDir, '.session');
  writeFileSync(sessionPath, sessionValue, { encoding: 'utf-8' });
  console.log(chalk.green(`✓ Session saved to ${chalk.bold('.session')}`));
}

async function main(): Promise<void> {
  const cleanup = () => {
    console.log(chalk.yellow('\n🚪 Logging out from Bitwarden...'));
    logout();
    process.exit(1);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  const sessionPath = join(rootDir, '.session');
  if (existsSync(sessionPath)) {
    console.log(chalk.green('✓ Session file exists') + chalk.gray(' (.session)'));
    console.log(
      chalk.cyan('Run ') +
        chalk.bold('npm start') +
        chalk.cyan(' to download inputs and run solutions.\n'),
    );
    process.exit(0);
  }

  try {
    await ensureBitwardenCLI();

    const envPath = join(rootDir, '.env');
    let serverUrl: string, clientId: string, clientSecret: string;

    if (!existsSync(envPath)) {
      const setup = await firstTimeSetup();
      serverUrl = setup.serverUrl || 'https://vault.bitwarden.com';
      clientId = setup.clientId;
      clientSecret = setup.clientSecret;
    } else {
      serverUrl = process.env.BITWARDEN_SERVER_URL || 'https://vault.bitwarden.com';
      clientId = process.env.BITWARDEN_CLIENT_ID!;
      clientSecret = process.env.BITWARDEN_CLIENT_SECRET!;
    }

    if (!clientId || !clientSecret) {
      throw new Error('Bitwarden credentials not configured. Run setup again.');
    }

    const sessionValue = await loginToAoC(serverUrl, clientId, clientSecret);

    saveSession(sessionValue);

    console.log(chalk.bold.cyan('\n🎉 Success! Ready to download inputs and run solutions.\n'));
  } catch (error) {
    console.error(chalk.red(`\n✖ ${(error as Error).message}\n`));
    process.exit(1);
  } finally {
    if (hasActiveSession()) {
      console.log(chalk.yellow('🚪 Logging out from Bitwarden...'));
      logout();
    }
  }
}

main();
