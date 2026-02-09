import chalk from 'chalk';

import {
  getCredentials,
  getTwoFactorCode,
  logout,
  unlock,
} from '#dilatorily/advent-of-code/scripts/login/bitwarden';
import { spinner } from '#dilatorily/advent-of-code/scripts/login/spinner';

import type { BitwardenConfiguration } from '#dilatorily/advent-of-code/scripts/login/types';
import type { Page } from 'puppeteer';

export const githubLogin = async (page: Page, bitwardenConfiguration: BitwardenConfiguration) => {
  let currentUrl = new URL(page.url());

  // Verify that we need to login to GitHub
  if (currentUrl.hostname !== 'github.com') {
    return;
  }

  spinner.text = '🎁 Unlocking Bitwarden vault...';
  const sessionKey = await unlock(bitwardenConfiguration);
  const credentials = getCredentials(sessionKey);

  // Handle GitHub login
  if (currentUrl.pathname === '/login') {
    spinner.text = '🔑 Logging into GitHub...';
    await page.type('#login_field', credentials.username);
    await page.type('#password', credentials.password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('input[name="commit"]'),
    ]);
  }

  // Handle 2FA flow
  currentUrl = new URL(page.url());
  if (currentUrl.pathname === '/sessions/two-factor/app') {
    if (!credentials.itemId) {
      spinner.fail('2FA required but no TOTP configured');
      throw new Error('2FA required but no TOTP configured');
    }

    spinner.text = '🔢 Generating 2FA code...';
    const totpCode = getTwoFactorCode(credentials.itemId);

    spinner.text = '📱 Submitting 2FA code...';
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.type('#app_totp', totpCode),
    ]);
  }

  logout();
};

export const githubOauth = async (page: Page) => {
  const currentUrl = new URL(page.url());

  // Verify that we need to provide OAuth permissions
  if (currentUrl.hostname !== 'github.com' || currentUrl.pathname !== '/login/oauth/authorize') {
    return;
  }

  spinner.text = '🔐 Authorizing OAuth...';
  const authorizeButton = await page.$('button[type="submit"][value="1"]');
  if (!authorizeButton) {
    spinner.fail(chalk.red('Could not find authorize button'));
    throw new Error('Could not find authorize button');
  }

  spinner.text = '🎄 Waiting for OAuth redirect...';
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    authorizeButton.click(),
  ]);
};
