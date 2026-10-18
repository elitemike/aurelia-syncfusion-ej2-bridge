import { test, expect } from './fixtures';
import { openPopup, typeInto } from './helpers';

test.beforeEach(async ({ app }) => app.open('combobox'));

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('cb-value');
  await expect(section.locator('input.e-combobox')).toHaveValue('Badminton');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'));
  await popup.locator('li', { hasText: 'Cricket' }).click();
  await expect(section.getByTestId('cb-value-out')).toHaveText('Game4');
  await expect(section.getByTestId('cb-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('cb-value');
  await section.getByTestId('cb-set').click();
  await expect(section.locator('input.e-combobox')).toHaveValue('Football');
});

test('enabled binding', async ({ app }) => {
  const section = app.section('cb-value');
  await section.getByTestId('cb-enabled').uncheck();
  await expect(section.locator('.e-combobox').first()).toBeDisabled();
});

test('allowCustom keeps typed text', async ({ app }) => {
  const section = app.section('cb-custom');
  const input = section.locator('input.e-combobox');
  await typeInto(input, 'Curling');
  await input.blur();
  await expect(input).toHaveValue('Curling');
});

test('filtering narrows the list', async ({ app, page }) => {
  await typeInto(app.section('cb-filter').locator('input.e-combobox'), 'ba');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Badminton', 'Basketball']);
});

test('sortOrder descending', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('cb-sorted').locator('.e-input-group-icon'));
  await expect(popup.locator('li.e-list-item').first()).toHaveText('Football');
});
