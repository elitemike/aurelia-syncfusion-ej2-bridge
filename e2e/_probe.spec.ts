import { test, expect } from './fixtures';

test('probe', async ({ app, page }) => {
  await app.open('overview');
  const s = app.section('overview-basic');
  await expect(s.locator('.e-overview')).toBeVisible();
  await page.waitForTimeout(1500);
  console.log('OV', await s.locator('.e-overview').evaluate((e: any) => e.id + ' ' + e.getBoundingClientRect().width + 'x' + e.getBoundingClientRect().height + ' ' + e.innerHTML.replace(/ (style|class|role|transform|stroke[-a-z]*|fill[-a-z]*|opacity)="[^"]*"/g, '').slice(0, 900)));
  const e = app.section('overview-before');
  console.log('EARLY', await e.locator('.e-overview').evaluate((e: any) => e.innerHTML.length));
});
