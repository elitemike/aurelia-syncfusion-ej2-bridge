import { test } from '@playwright/test';

test('debug', async ({ page }) => {
  page.on('pageerror', e => console.log('PAGEERROR', e.stack!.slice(0, 900)));
  await page.goto('/gantt');
  await page.waitForTimeout(8000);
});
