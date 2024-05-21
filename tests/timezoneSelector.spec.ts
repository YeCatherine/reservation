import { test, expect } from '@playwright/test';

test.describe('TimeZoneSelector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/provider');
  });

  test('should render the TimeZoneSelector and allow timezone selection', async ({
    page,
  }) => {
    const selector = 'div.MuiSelect-select';

    // Check for existence of key elements
    const selectLocator = page.locator(selector);
    const exists = await selectLocator.count();

    if (exists === 0) {
      await page.screenshot({
        path: 'screenshot-no-element.png',
        fullPage: true,
      });
      throw new Error('TimeZoneSelector element not found');
    }

    // Ensure the selector is rendered
    try {
      await expect(selectLocator).toBeVisible({ timeout: 10000 });
    } catch (error) {
      await page.screenshot({
        path: 'screenshot-failed-visibility.png',
        fullPage: true,
      });
      throw error;
    }

    // Click the select element to open the dropdown
    await page.click(selector);

    // Check if the options are available
    const options = ['PST', 'CST', 'EST', 'UTC'];
    for (const option of options) {
      try {
        await expect(
          page.locator(`li[role="option"]:has-text("${option}")`)
        ).toBeVisible({ timeout: 5000 });
      } catch (error) {
        await page.screenshot({
          path: `screenshot-failed-option-${option}.png`,
          fullPage: true,
        });
        throw error;
      }
    }

    // Select a timezone
    await page.click('li[role="option"]:has-text("PST")');

    // Verify that the selection has been made
    try {
      await expect(page.locator(selector)).toHaveText('PST', { timeout: 5000 });
    } catch (error) {
      await page.screenshot({
        path: 'screenshot-failed-selection.png',
        fullPage: true,
      });
      throw error;
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshot-${testInfo.title}.png`,
        fullPage: true,
      });
    }
  });
});
