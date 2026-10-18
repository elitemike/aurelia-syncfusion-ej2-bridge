import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('dateTimePicker'));

test('initial value is formatted', async ({ app }) => {
  await expect(app.section('dtp-value').locator('input.e-datetimepicker')).toHaveValue('2024-05-15 09:30');
});

test('model to view', async ({ app }) => {
  const section = app.section('dtp-value');
  await section.getByTestId('dtp-set').click();
  await expect(section.locator('input.e-datetimepicker')).toHaveValue('2024-05-20 14:00');
});

test('typed value updates the model', async ({ app }) => {
  const section = app.section('dtp-value');
  const input = section.locator('input.e-datetimepicker');
  await input.fill('2024-06-02 08:15');
  await input.blur();
  await expect(section.getByTestId('dtp-value-out')).toHaveText('2024-06-02 08:15');
  await expect(section.getByTestId('dtp-change-count')).toHaveText('1');
});

test('date popup then time list', async ({ app, page }) => {
  const section = app.section('dtp-value');
  const popup = await openPopup(page, section.locator('.e-input-group-icon.e-date-icon'), '.e-popup-open:has(.e-calendar)');
  await popup.locator('td:not(.e-other-month) span').getByText('10', { exact: true }).click();
  await expect(section.getByTestId('dtp-value-out')).toContainText('2024-05-10');
});

test('time step shows a sparse list', async ({ app, page }) => {
  const section = app.section('dtp-step');
  await section.locator('.e-input-group-icon.e-time-icon').click();
  const list = page.locator('.e-datetimepicker.e-popup-open li.e-list-item');
  await expect(list.first()).toBeVisible();
  await expect(list).toHaveCount(12);
});

test('placeholder, floating label and readonly', async ({ app }) => {
  const section = app.section('dtp-options');
  await expect(section.locator('.e-float-text').first()).toHaveText('Pick date and time');
  await expect(section.getByTestId('dtp-readonly').locator('input')).toHaveAttribute('readonly', '');
});
