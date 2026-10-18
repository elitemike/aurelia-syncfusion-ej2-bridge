import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

/** Open the popup and wait until it has finished animating in, clicking mid-animation races the popup's own blur handling. */
async function openPopup(page: Page, section: Locator) {
  await section.locator('.e-ddl').click();
  const popup = page.locator('.e-ddl.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup.locator('li.e-list-item').first()).toBeVisible();
  await page.waitForTimeout(250);
  return popup;
}

test.beforeEach(async ({ app }) => app.open('dropDownList'));

test('model binding renders placeholder and data', async ({ app, page }) => {
  const section = app.section('ddl-model');
  await expect(section.locator('input.e-dropdownlist')).toHaveAttribute('placeholder', 'Select a sport');
  const popup = await openPopup(page, section);
  await expect(popup.locator('li.e-list-item')).toHaveCount(6);
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ddl-value');
  await expect(section.getByTestId('ddl-value-out')).toHaveText('Game3');
  const popup = await openPopup(page, section);
  await popup.locator('li', { hasText: 'Tennis' }).click();
  await expect(section.getByTestId('ddl-value-out')).toHaveText('Game6');
  await expect(section.getByTestId('ddl-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ddl-value');
  await section.getByTestId('ddl-set-game1').click();
  await expect(section.locator('input.e-dropdownlist')).toHaveValue('American Football');
});

test('enabled binding', async ({ app }) => {
  const section = app.section('ddl-value');
  await section.getByTestId('ddl-enabled').uncheck();
  await expect(section.locator('.e-ddl')).toHaveClass(/e-disabled/);
});

test('filtering narrows the list', async ({ app, page }) => {
  const section = app.section('ddl-filter');
  const popup = await openPopup(page, section);
  await popup.locator('input.e-input-filter').pressSequentially('ba');
  await expect(popup.locator('li.e-list-item')).toHaveText(['Badminton', 'Basketball']); // default filterType is StartsWith
});

test('markup (select) data source', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ddl-select'));
  await expect(popup.locator('li.e-list-item')).toHaveText(['Golf', 'Hockey', 'Rugby']);
});
