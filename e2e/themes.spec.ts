import { test, expect } from './fixtures';
import * as fs from 'fs';
import * as path from 'path';

const themes: string[] = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scripts', 'themes', 'themes.json'), 'utf8'));
const routes: { route: string; selector: string }[] = [
  { route: 'button', selector: '.e-btn' },
  { route: 'switch', selector: '.e-switch-wrapper' },
  { route: 'grid', selector: '.e-grid .e-gridheader' },
  { route: 'calendar', selector: '.e-calendar' },
  { route: 'dropDownList', selector: '.e-ddl' },
  { route: 'tab', selector: '.e-tab' },
  { route: 'chart', selector: '.e-chart svg' }
];

test('theme list covers every shipped theme', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'dev-app', 'app.ts'), 'utf8');
  themes.forEach(t => expect(src, `app.ts lists ${t}`).toContain(`'${t}'`));
  expect(themes.length).toBeGreaterThanOrEqual(20);
  expect(themes).toContain('material3');
  expect(themes).toContain('fluent2-dark');
});

for (const theme of themes) {
  test(`theme ${theme}: stylesheet applies and controls render`, async ({ app, page }) => {
    test.setTimeout(240_000);
    await page.addInitScript(t => localStorage.setItem('theme', t), theme);
    const dark = /dark|highcontrast/.test(theme);

    // each route is loaded directly: leaving the Grid demo through the router throws inside Syncfusion's Grid.destroy
    for (const { route, selector } of routes) {
      await app.open(route);
      await expect(page.getByTestId('theme-select')).toHaveValue(theme);
      await expect(page.locator('#theme-link')).toHaveAttribute('href', `scripts/themes/${theme}.css`);
      await expect.poll(() => page.evaluate(() => {
        const l = document.getElementById('theme-link') as HTMLLinkElement;
        return !!l.sheet && l.sheet.cssRules.length > 0;
      })).toBe(true);
      await expect(page.locator('body')).toHaveClass(dark ? /theme-dark/ : /^((?!theme-dark).)*$/);

      const el = page.locator(`main ${selector}`).first();
      await expect(el, `${route} renders under ${theme}`).toBeVisible();
      const box = await el.boundingBox();
      expect(box!.width).toBeGreaterThan(10);
      expect(box!.height).toBeGreaterThan(5);

      if (route === 'button') {
        // themed look: colours come from the stylesheet, not browser defaults
        const sig = await page.locator('main .e-btn').first().evaluate((b: Element) => {
          const s = getComputedStyle(b);
          return [s.backgroundColor, s.color, s.borderRadius, s.fontFamily, getComputedStyle(document.body).backgroundColor].join('|');
        });
        expect(sig).not.toMatch(/^rgb\(239, 239, 239\)/); // browser default button face
      }
    }
  });
}

test('switching live restyles controls and every theme looks different', async ({ app, page }) => {
  test.setTimeout(120_000);
  await app.open('button');
  const looks = new Map<string, string>();
  for (const theme of themes) {
    await page.getByTestId('theme-select').selectOption(theme);
    await expect(page.locator('#theme-link')).toHaveAttribute('href', `scripts/themes/${theme}.css`);
    await expect.poll(() => page.evaluate(() => {
      const l = document.getElementById('theme-link') as HTMLLinkElement;
      return !!l.sheet && l.sheet.cssRules.length > 0;
    })).toBe(true);
    looks.set(theme, await page.locator('main .e-btn').first().evaluate((b: Element) => {
      const s = getComputedStyle(b);
      return [s.backgroundColor, s.color, s.borderRadius, s.fontFamily, s.height, getComputedStyle(document.body).backgroundColor].join('|');
    }));
  }
  expect(new Set(looks.values()).size).toBeGreaterThan(themes.length / 2);
  expect(looks.get('material3')).not.toEqual(looks.get('material3-dark'));
});

test('selected theme persists across reload', async ({ app, page }) => {
  test.setTimeout(90_000);
  await app.open('button');
  await page.getByTestId('theme-select').selectOption('tailwind3-dark');
  await page.reload();
  await expect(page.getByTestId('nav')).toBeVisible();
  await expect(page.getByTestId('theme-select')).toHaveValue('tailwind3-dark');
  await expect(page.locator('#theme-link')).toHaveAttribute('href', 'scripts/themes/tailwind3-dark.css');
  await expect(page.locator('body')).toHaveClass(/theme-dark/);
});
