import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect } from './fixtures';

// nav.ts is the single route registry, parse it so the suite never drifts from the app
const navSource = readFileSync(join(__dirname, '..', 'dev-app', 'nav.ts'), 'utf8');
const routes = [...navSource.matchAll(/route: '([^']+)', title: '([^']+)'/g)].map(m => ({ route: m[1], title: m[2] }));

test('registry parsed', () => {
  expect(routes.length).toBeGreaterThanOrEqual(31);
});

test.describe('every control demo renders', () => {
  for (const { route, title } of routes) {
    test(`${title} (/${route})`, async ({ app, page }) => {
      await app.open(route);
      // at least one widget was instantiated and decorated by Syncfusion
      await expect(page.locator('main [class*="e-"]').first()).toBeAttached();
    });
  }
});

test('sidebar navigation and search', async ({ app, page }) => {
  await app.open('home');
  await expect(page.getByTestId('home-title')).toBeVisible();
  await page.getByTestId('nav-grid').click();
  await expect(page).toHaveURL(/\/grid$/);
  await page.getByTestId('nav-search').fill('date');
  await expect(page.getByTestId('nav-datePicker')).toBeVisible();
  await expect(page.getByTestId('nav-grid')).toHaveCount(0);
});
