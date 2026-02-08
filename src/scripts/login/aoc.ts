import chalk from 'chalk';
import ora from 'ora';
import { launch } from 'puppeteer';

import {
  findGitHubCredentials,
  unlockVault,
} from '#dilatorily/advent-of-code/scripts/login/bitwarden';
import {
  handleGitHubLogin,
  handleOAuthAuthorize,
} from '#dilatorily/advent-of-code/scripts/login/github';

import type { Browser, Cookie, Page } from 'puppeteer';

export const loginToAoC = async (
  serverUrl: string,
  clientId: string,
  clientSecret: string,
): Promise<string> => {
  const spinner = ora('Authenticating with Advent of Code').start();

  const browser: Browser = await launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

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
      const sessionKey = await unlockVault(serverUrl, clientId, clientSecret, spinner);
      const credentials = findGitHubCredentials(sessionKey, spinner);

      await handleGitHubLogin(page, credentials, spinner);
    }

    await handleOAuthAuthorize(page, spinner);

    spinner.text = 'Waiting for redirect to AoC...';
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      await page.waitForFunction(() => window.location.hostname === 'adventofcode.com', {
        timeout: 60000,
      });
    } catch {
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
};
