import { test, expect } from './fixtures';

test('event log shows bridge events and binding writes', async ({ app, page }) => {
  await app.open('switch');
  await page.getByTestId('log-toggle').click();
  const entries = page.getByTestId('log-entries').locator('li');
  const section = app.section('sw-checked');

  // widget to view-model: a click raises change
  await section.locator('.e-switch-wrapper').click();
  await expect(entries.filter({ hasText: 'switch' }).filter({ hasText: 'change' }).first()).toBeVisible();

  // view-model to widget: the bound value is written to the widget
  await section.getByTestId('sw-disable').check();
  await expect(page.getByTestId('log-entries').locator('li.event-log__property').filter({ hasText: 'disabled' }).first()).toBeVisible();

  await page.getByTestId('log-clear').click();
  await expect(entries).toHaveCount(0);
});
