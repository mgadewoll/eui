/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { type Browser, type Page, firefox } from 'playwright';
import { type NVDA, nvda, NVDAKeyCodeCommands } from '@guidepup/guidepup';

const screenreader = nvda;

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
  screenreader: NVDA;
  initialFocusSelector?: string;
  setupScreenreaderSettings?: boolean;
}) => {
  await screenreader.start({
    capture: true,
  });

  await delay(500);

  if (setupScreenreaderSettings) {
    while (
      (await screenreader.lastSpokenPhrase())
        .toLowerCase()
        .includes('volume') !== true
    ) {
      await screenreader.perform(NVDAKeyCodeCommands.moveToNextSynthSetting);
    }

    if (
      (await screenreader.lastSpokenPhrase()).toLowerCase().includes('volume 0')
    ) {
      await screenreader.perform(
        NVDAKeyCodeCommands.incrementCurrentSynthSetting
      );
      await screenreader.perform(NVDAKeyCodeCommands.saveConfiguration);
    }
  }

  await page.bringToFront();
  await page.locator('#story-wrapper').waitFor();

  if (initialFocusSelector) {
    await clearScreenreaderLogs();
    await page.locator(initialFocusSelector).click();
  } else {
    await page.locator('#sr-test-start').focus();

    await clearScreenreaderLogs();
    await screenreader.press('Tab');
  }
};

describe('EuiComboBox // NVDA', () => {
  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    await jestPlaywright.resetBrowser();
    await jestPlaywright.resetPage();

    // uses firefox due to NVDA + Chrome not behaving the same as in a real testing scenario
    browser = await firefox.launch({
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

    expect(page.locator('.euiComboBox__input')).toHaveFocus();

    // Move to option 1
    await screenreader.press('ArrowDown');

    console.log(await screenreader.lastSpokenPhrase());

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
