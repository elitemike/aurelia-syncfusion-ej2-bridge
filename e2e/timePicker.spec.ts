import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('timePicker'));

test('initial value is formatted', async ({ app }) => {
  await expect(app.section('tp-value').locator('input.e-timepicker')).toHaveValue('09:30');
});

test('two-way value: popup selection to model', async ({ app, page }) => {
  const section = app.section('tp-value');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), '.e-timepicker.e-popup-open');
  await popup.locator('li', { hasText: '10:30' }).click();
  await expect(section.getByTestId('tp-value-out')).toHaveText('10:30');
  await expect(section.getByTestId('tp-change-count')).toHaveText('1');
});

test('model to view', async ({ app }) => {
  const section = app.section('tp-value');
  await section.getByTestId('tp-set').click();
  await expect(section.locator('input.e-timepicker')).toHaveValue('11:00');
});

test('typed value updates the model', async ({ app }) => {
  const section = app.section('tp-value');
  const input = section.locator('input.e-timepicker');
  await input.fill('14:45');
  await input.blur();
  await expect(section.getByTestId('tp-value-out')).toHaveText('14:45');
});

test('step controls the list', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('tp-value').locator('.e-input-group-icon'), '.e-timepicker.e-popup-open');
  await expect(popup.locator('li.e-list-item').nth(1)).toHaveText('00:30');
});

test('min and max limit the list', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('tp-limits').locator('.e-input-group-icon'), '.e-timepicker.e-popup-open');
  await expect(popup.locator('li.e-list-item')).toHaveText(['08:00', '09:00', '10:00', '11:00', '12:00']);
});

test('placeholder, clear button and readonly', async ({ app }) => {
  const section = app.section('tp-options');
  await expect(section.locator('input.e-timepicker').first()).toHaveAttribute('placeholder', 'Pick a time');
  await expect(section.getByTestId('tp-readonly').locator('input')).toHaveAttribute('readonly', '');
});
