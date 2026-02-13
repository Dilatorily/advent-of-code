import chalk from 'chalk';
import { chromium } from 'playwright';

import { githubLogin, githubOauth } from '#dilatorily/advent-of-code/scripts/login/github';
import { spinner } from '#dilatorily/advent-of-code/scripts/login/spinner';
import { logger } from '#dilatorily/advent-of-code/utility/logger';

import type { BitwardenConfiguration } from '#dilatorily/advent-of-code/scripts/login/types';

export const aocLogin = async (bitwardenConfiguration: BitwardenConfiguration) => {
  spinner.start();

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    spinner.text = '🎄 Navigating to Advent of Code...';
    await page.goto('https://adventofcode.com');

    const signoutLink = await page.$('a[href$="/auth/signout"]');
    if (signoutLink) {
      spinner.succeed(chalk.green('🎅 Already logged in to Advent of Code'));
      logger.log(chalk.green('✨ Session obtained'));
      return await page.context().cookies();
    }

    spinner.text = '🔑 Clicking login...';
    const loginLink = await page.$('a[href$="/auth/login"]');
    if (!loginLink) {
      spinner.fail(chalk.red('Could not find login link'));
      throw new Error('Could not find login link');
    }

    await loginLink.click();

    const githubButton = await page.$('a[href$="/auth/github"]');
    if (!githubButton) {
      spinner.fail(chalk.red('Could not find GitHub auth button'));
      throw new Error('Could not find GitHub auth button');
    }

    spinner.text = '🐙 Clicking GitHub auth...';
    await githubButton.click();

    // Login to GitHub if needed
    await githubLogin(page, bitwardenConfiguration);

    // Provide OAuth permissions if needed
    await githubOauth(page);

    await page.waitForURL('https://adventofcode.com/**');
    const currentUrl = new URL(page.url());
    if (currentUrl.hostname !== 'adventofcode.com') {
      spinner.fail(chalk.red(`Failed to redirect to Advent of Code`));
      logger.log(chalk.gray(`  Current URL: ${currentUrl}`));
      throw new Error(`Failed to redirect back to Advent of Code. Current URL: ${currentUrl}`);
    }

    spinner.succeed(chalk.green('🎄 Authenticated'));
    logger.log(chalk.green('✨ Session obtained'));
    return await page.context().cookies();
  } finally {
    await browser.close();
  }
};
