import { test } from '@playwright/test';

test.describe('DateTimeRangePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/client');
  });

  test('create event', async ({ page }) => {
    await page.getByRole('gridcell', { name: '21' }).click();
    await page.getByRole('button', { name: '08:30 - 08:45' }).click();
    await page.getByRole('button', { name: 'provider1' }).click();
    // Timer left to confirm.
    await page.getByText('Time left to confirm: 29:').click();
    await page.getByText('Reserved time: 08:30 - 08:45').isVisible();
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page
      .getByRole('heading', { name: 'Confirm to Delete Reservation' })
      .click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    // is not visible how to check
    await page.getByText('Reserved time: 08:30 - 08:45').isVisible();
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
