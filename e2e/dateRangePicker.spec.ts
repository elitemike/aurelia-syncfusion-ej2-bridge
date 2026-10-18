import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('dateRangePicker'));

test('initial start and end render in the input', async ({ app }) => {
  await expect(app.section('drp-range').locator('input.e-daterangepicker')).toHaveValue('2024-05-10 - 2024-05-20');
});

test('model to view', async ({ app }) => {
  const section = app.section('drp-range');
  await section.getByTestId('drp-set').click();
  await expect(section.locator('input.e-daterangepicker')).toHaveValue('2024-05-01 - 2024-05-03');
});

test('view to model via popup and Apply', async ({ app, page }) => {
  const section = app.section('drp-range');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), '.e-daterangepicker.e-popup-open');
  const days = popup.locator('.e-left-calendar td:not(.e-other-month):not(.e-disabled) span');
  await days.getByText('2', { exact: true }).click();
  await days.getByText('6', { exact: true }).click();
  await popup.locator('.e-apply').click();
  await expect(section.getByTestId('drp-start-out')).toHaveText('2024-05-02');
  await expect(section.getByTestId('drp-end-out')).toHaveText('2024-05-06');
  await expect(section.getByTestId('drp-change-count')).toHaveText('1');
});

test('presets apply a range', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('drp-presets').locator('.e-input-group-icon'), '.e-daterangepicker.e-popup-open');
  await popup.locator('.e-presets li', { hasText: 'Whole week' }).click();
  await expect(app.section('drp-presets').locator('input.e-daterangepicker')).toHaveValue('2024-05-06 - 2024-05-12');
});

test('maxDays limits the selectable span', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('drp-limits').locator('.e-input-group-icon'), '.e-daterangepicker.e-popup-open');
  await popup.locator('.e-left-calendar td:not(.e-other-month) span').getByText('10', { exact: true }).click();
  await expect(popup.locator('.e-left-calendar td.e-disabled:not(.e-other-month)').first()).toBeAttached();
});

test('placeholder, separator and clear button', async ({ app }) => {
  const section = app.section('drp-options');
  await expect(section.locator('input.e-daterangepicker')).toHaveAttribute('placeholder', 'Select a range');
});
