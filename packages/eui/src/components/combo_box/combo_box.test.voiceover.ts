/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { type Browser, type Page, chromium } from 'playwright';
import {
  type VoiceOver,
  voiceOver,
  voiceOverKeyCodeCommands,
} from '@guidepup/guidepup';

const screenreader = voiceOver;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const setupTest = async (page: Page) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=forms-euicombobox--screenreader&viewMode=story',
    {
      waitUntil: 'load',
      timeout: 300000,
    }
  );

  await page.waitForSelector('#storybook-root');
};

const setVoiceOverSpeakingRateMax = async (screenreader: VoiceOver) => {
  await screenreader.press('Control+Alt+Command+Shift+ArrowLeft');

  await delay(200);

  while ((await screenreader.lastSpokenPhrase()).includes('Rate') !== true) {
    await screenreader.press('ArrowLeft');
    await delay(100);
  }

  while ((await screenreader.lastSpokenPhrase()).includes('100') !== true) {
    await screenreader.press('ArrowUp');
    await delay(100);
  }

  await voiceOver.press('Escape');
};

const repeatActionTimes = async (
  action: () => any | Promise<any>,
  count: number
) => {
  // @ts-expect-error - var i as index is not needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const i of Array(count)) {
    await action();
  }
};

const clearScreenreaderLogs = async () => {
  await screenreader.clearItemTextLog();
  await screenreader.clearSpokenPhraseLog();
};

const navigateToWebContent = async ({
  page,
  screenreader,
  initialFocusSelector,
  setupScreenreaderSettings = false,
}: {
  page: Page;
  screenreader: VoiceOver;
  initialFocusSelector?: string;
  setupScreenreaderSettings?: boolean;
}) => {
  await screenreader.start({
    capture: true,
    retries: 1,
  });

  if (setupScreenreaderSettings) {
    await setVoiceOverSpeakingRateMax(screenreader);
  }

  await page.bringToFront();
  await page.locator('#story-wrapper').waitFor();

  if (initialFocusSelector) {
    await clearScreenreaderLogs();
    await page.locator(initialFocusSelector).click();
  } else {
    await page.locator('#sr-test-start').focus();
    await clearScreenreaderLogs();
    await screenreader.perform(voiceOverKeyCodeCommands.moveToNext);
  }

  await delay(100);
};

describe('EuiComboBox // VoiceOver', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    await jestPlaywright.resetBrowser();
    await jestPlaywright.resetPage();

    browser = await chromium.launch({
      headless: false,
      // devtools: true,
    });

    const context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  afterAll(async () => {
    try {
      await screenreader.stop();
    } catch {}
  });

  it('should navigate and announce correct options', async () => {
    await setupTest(page);

    await navigateToWebContent({
      page,
      screenreader,
    });

    await screenreader.next();
    expect(page.locator('.euiComboBox__input')).toHaveFocus();

    // Move to option 1
    await screenreader.press('ArrowDown');

    // assert correct start item
    expect((await screenreader.lastSpokenPhrase()).includes('Item 1')).toBe(
      true
    );
    // assert correct list length
    expect((await screenreader.lastSpokenPhrase()).includes('1 of 10')).toBe(
      true
    );

    await screenreader.press('ArrowDown');

    await repeatActionTimes(async () => await screenreader.press('ArrowUp'), 2);

    // assert correct last item
    expect((await screenreader.lastSpokenPhrase()).includes('Item 10')).toBe(
      true
    );

    expect((await screenreader.lastSpokenPhrase()).includes('10 of 10')).toBe(
      true
    );

    const log = JSON.stringify(await screenreader.spokenPhraseLog());

    console.log('spokenPhraseLog', log);

    expect(log).toMatchSnapshot();
  });
});
