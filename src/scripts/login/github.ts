import { getTotpCode } from '#dilatorily/advent-of-code/scripts/login/bitwarden';

import type { GitHubCredentials } from '#dilatorily/advent-of-code/scripts/login/types';
import type { Ora } from 'ora';
import type { Page } from 'puppeteer';

export const handleGitHubLogin = async (
  page: Page,
  credentials: GitHubCredentials,
  spinner: Ora,
): Promise<void> => {
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
      spinner.fail('2FA required but no TOTP configured');
      throw new Error('2FA required but no TOTP configured');
    }

    spinner.text = 'Generating 2FA code...';
    const totpCode = getTotpCode(credentials.itemId);
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

          const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
          if (btn) btn.click();
          return true;
        }
      }
      return false;
    }, totpCode);

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};

export const handleOAuthAuthorize = async (page: Page, spinner: Ora): Promise<void> => {
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
      } catch {
        spinner.text = 'OAuth may have completed...';
      }
    } catch (e) {
      spinner.warn(`OAuth note: ${(e as Error).message}`);
    }
  }
};
