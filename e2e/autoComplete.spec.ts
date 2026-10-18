import { test, expect } from './fixtures';
import { Page } from '@playwright/test';
import { typeInto } from './helpers';

/** Suggestions re-render while typing, clicking a stale item closes the popup instead of selecting it. */
async function pickSuggestion(page: Page, text: string) {
  const items = page.locator('.e-popup-open li.e-list-item');
  await expect(items).toHaveCount(1);
  await page.waitForTimeout(250);
  await items.filter({ hasText: text }).click();
}

test.beforeEach(async ({ app }) => app.open('autoComplete'));

test('suggests matches while typing', async ({ app, page }) => {
  await typeInto(app.section('ac-default').locator('input.e-autocomplete'), 'ba');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Badminton', 'Basketball', 'Football']) // default filterType is Contains;
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ac-value');
  await typeInto(section.locator('input.e-autocomplete'), 'cr');
  await pickSuggestion(page, 'Cricket');
  await expect(section.getByTestId('ac-value-out')).toHaveText('Cricket');
  await expect(section.getByTestId('ac-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ac-value');
  await section.getByTestId('ac-set').click();
  await expect(section.locator('input.e-autocomplete')).toHaveValue('Hockey');
});

test('object data source uses fields', async ({ app, page }) => {
  await typeInto(app.section('ac-fields').locator('input.e-autocomplete'), 'c');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Cricket']);
});

test('suggestionCount limits the list, clear button empties input', async ({ app, page }) => {
  const section = app.section('ac-options');
  const input = section.locator('input.e-autocomplete');
  await typeInto(input, 'o');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(3);
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});
