import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('numericTextBox'));

test('initial value and spin buttons', async ({ app }) => {
  const section = app.section('ntb-value');
  await expect(section.locator('input.e-numerictextbox')).toHaveValue('10.00');
  await section.locator('.e-spin-up').click();
  await expect(section.getByTestId('ntb-value-out')).toHaveText('15');
  await section.locator('.e-spin-down').click();
  await section.locator('.e-spin-down').click();
  await expect(section.getByTestId('ntb-value-out')).toHaveText('5');
  await expect(section.getByTestId('ntb-change-count')).toHaveText('3');
});

test('typed value commits on blur', async ({ app }) => {
  const section = app.section('ntb-value');
  const input = section.locator('input.e-numerictextbox');
  await input.fill('77');
  await input.blur();
  await expect(section.getByTestId('ntb-value-out')).toHaveText('77');
});

test('model to view', async ({ app }) => {
  const section = app.section('ntb-value');
  await section.getByTestId('ntb-set').click();
  await expect(section.locator('input.e-numerictextbox')).toHaveValue('42.00');
});

test('min and max stop the spin buttons', async ({ app }) => {
  const section = app.section('ntb-value');
  const input = section.locator('input.e-numerictextbox');
  await input.fill('100');
  await input.blur();
  await section.locator('.e-spin-up').click();
  await expect(section.getByTestId('ntb-value-out')).toHaveText('100');
});

test('currency format', async ({ app }) => {
  const section = app.section('ntb-format');
  await expect(section.locator('input.e-numerictextbox')).toHaveValue('$12.50');
  const input = section.locator('input.e-numerictextbox');
  await input.fill('$3.46');
  await input.blur();
  await expect(section.getByTestId('ntb-price-out')).toHaveText('3.46');
});

test('strict mode clamps to max', async ({ app }) => {
  const input = app.section('ntb-strict').locator('input.e-numerictextbox');
  await input.fill('50');
  await input.blur();
  await expect(input).toHaveValue('10.00');
  await expect(app.section('ntb-strict').locator('.e-spin-up')).toHaveCount(0);
});

test('placeholder, floating label and clear button', async ({ app }) => {
  const section = app.section('ntb-options');
  await expect(section.locator('.e-float-text')).toHaveText('Amount');
  const input = section.locator('input.e-numerictextbox');
  await input.fill('8');
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});
