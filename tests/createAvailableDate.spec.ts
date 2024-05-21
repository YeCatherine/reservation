import { test, expect } from '@playwright/test';

test.describe('DateTimeRangePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/provider');
  });

  test('test', async ({ page }) => {
    // await page.goto('http://localhost:5174/provider');
    await page
      .locator('.MuiPaper-root > div > div > button:nth-child(3)')
      .click();
    await page
      .locator('.MuiPaper-root > div > div > button:nth-child(3)')
      .click();
    await page.getByRole('button', { name: 'Set Default Time' }).click();
    await page.getByTestId('submit-event-button').click();
    await page.getByText('Thursday, 23rd May').click();
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
