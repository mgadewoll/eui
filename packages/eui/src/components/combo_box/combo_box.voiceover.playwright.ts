/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  voiceOverTest as test,
  type VoiceOverPlaywright,
} from '@guidepup/playwright';
import { expect, Page } from '@playwright/test';

// async function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

const setupTest = async (page: Page, voiceOver: VoiceOverPlaywright) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=forms-euicombobox--screenreader&viewMode=story',
    {
      waitUntil: 'load',
    }
  );

  // // take screenshot
  // await page
  //   .locator('#storybook-preview-iframe')
  //   .screenshot({ path: './screenshot.png' });

  const storybookRoot = page.locator('#storybook-root');
  const componentRoot = page.locator('.euiComboBox');
  await expect(storybookRoot).toBeVisible();
  await expect(componentRoot).toBeVisible();

  // Interact with the page
  await voiceOver.navigateToWebContent();
};

test.describe('EuiComboBox VoiceOver', async () => {
  test('It navigates options', async ({ page, voiceOver }) => {
    try {
      await setupTest(page, voiceOver);

      await voiceOver.click();

      await voiceOver.press('ArrowDown'); // 1st option
      await voiceOver.press('ArrowDown'); // 2st option
      await voiceOver.press('ArrowDown'); // 3rd option
      await voiceOver.press('ArrowDown'); // 4th option
      await voiceOver.press('ArrowDown'); // 5th option
      await voiceOver.press('ArrowDown'); // 6th option
      await voiceOver.press('ArrowDown'); // 7th option
      await voiceOver.press('ArrowDown'); // 8th option
      await voiceOver.press('ArrowDown'); // 9th option
      await voiceOver.press('ArrowDown'); // 10th option

      // await voiceOver.click(); // selection

      // Assert that the spoken phrases are as expected
      expect(
        JSON.stringify(await voiceOver.spokenPhraseLog())
      ).toMatchSnapshot();
    } catch {
      await voiceOver.stop();
    } finally {
      await voiceOver.stop();
    }
  });
});
