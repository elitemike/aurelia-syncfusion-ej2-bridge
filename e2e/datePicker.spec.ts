import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('datePicker'));

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('dp-value');
  await expect(section.locator('input.e-datepicker')).toHaveValue('2024-05-15');
  await section.getByTestId('dp-set').click();
  await expect(section.locator('input.e-datepicker')).toHaveValue('2024-05-20');
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-20');
});

test('two-way value: view to model via popup', async ({ app, page }) => {
  const section = app.section('dp-value');
  await section.locator('.e-input-group-icon.e-date-icon').click();
  await page.locator('.e-calendar td:not(.e-other-month) span', { hasText: /^10$/ }).click();
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-10');
  await expect(section.getByTestId('dp-change-count')).toHaveText('1');
});

test('typed value updates model', async ({ app }) => {
  const section = app.section('dp-value');
  const input = section.locator('input.e-datepicker');
  await input.fill('2024-05-02');
  await input.blur();
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-02');
});

test('min/max disables out-of-range dates', async ({ app, page }) => {
  await app.section('dp-range').locator('.e-date-icon').click();
  await expect(page.locator('.e-datepicker.e-popup-open .e-calendar')).toBeVisible();
  await expect(page.locator('.e-calendar td.e-disabled').first()).toBeAttached();
  await expect(page.locator('.e-calendar td.e-selected')).toHaveCount(1);
});

test('readonly input', async ({ app }) => {
  await expect(app.section('dp-options').getByTestId('dp-readonly').locator('input.e-datepicker')).toHaveAttribute('readonly', '');
});
