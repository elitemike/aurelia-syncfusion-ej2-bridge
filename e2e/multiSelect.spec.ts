import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('multiSelect'));

test('initial values render as chips', async ({ app }) => {
  await expect(app.section('ms-value').locator('.e-chips')).toHaveCount(2);
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ms-value');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await popup.locator('li', { hasText: 'Golf' }).click();
  await page.locator('main h2').click(); // change is raised on blur
  await expect(section.getByTestId('ms-value-out')).toHaveText('Game2,Game4,Game6');
});

test('removing a chip updates the model', async ({ app, page }) => {
  const section = app.section('ms-value');
  await section.locator('.e-chips', { hasText: 'Badminton' }).locator('.e-chips-close').dispatchEvent('mousedown');
  await page.locator('main h2').click(); // change is raised on blur
  await expect(section.getByTestId('ms-value-out')).toHaveText('Game4');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ms-value');
  await section.getByTestId('ms-set').click();
  await expect(section.locator('.e-chips')).toHaveCount(1);
  await expect(section.locator('.e-chips')).toContainText('American Football');
});

test('checkbox mode with select all', async ({ app, page }) => {
  const section = app.section('ms-checkbox');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await popup.locator('.e-selectall-parent').click();
  await expect(popup.locator('li.e-active')).toHaveCount(6);
});

test('maximumSelectionLength', async ({ app, page }) => {
  const section = app.section('ms-limit');
  const wrapper = section.locator('.e-multi-select-wrapper');
  const choose = async (text: string) => {
    const popup = page.locator('.e-popup-open li', { hasText: text });
    if (!(await popup.isVisible())) { await wrapper.click(); }
    await popup.click({ force: true });
    await page.waitForTimeout(200);
  };
  await choose('Cricket');
  await choose('Golf');
  await expect(section.locator('.e-chips')).toHaveCount(2);
  await choose('Basketball');
  await expect(section.locator('.e-chips')).toHaveCount(2);
});

test('select markup data source', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ms-select').locator('.e-multi-select-wrapper'));
  await expect(popup.locator('li.e-list-item')).toHaveText(['Golf', 'Hockey', 'Rugby']);
});
