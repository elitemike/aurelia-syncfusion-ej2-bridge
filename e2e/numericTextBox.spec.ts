import { Locator } from '@playwright/test';
import { test, expect } from './fixtures';

/** Focusing swaps the formatted text for the raw number, so replace the text only after the focus handling ran. */
async function enterNumber(input: Locator, text: string) {
  await input.click();
  await input.press('Control+A');
  await input.pressSequentially(text);
  await input.blur();
}

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
  await enterNumber(input, '77');
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
  await enterNumber(input, '100');
  await section.locator('.e-spin-up').click();
  await expect(section.getByTestId('ntb-value-out')).toHaveText('100');
});

test('currency format', async ({ app }) => {
  const section = app.section('ntb-format');
  await expect(section.locator('input.e-numerictextbox')).toHaveValue('$12.50');
  const input = section.locator('input.e-numerictextbox');
  await enterNumber(input, '3.456');
  await expect(section.getByTestId('ntb-price-out')).toHaveText('3.46');
});

test('strict mode clamps to max', async ({ app }) => {
  const input = app.section('ntb-strict').locator('input.e-numerictextbox');
  await enterNumber(input, '50');
  await expect(input).toHaveValue('10.00');
  await expect(app.section('ntb-strict').locator('.e-spin-up')).toHaveCount(0);
});

test('currency and currencyCode pick the currency symbol', async ({ app }) => {
  await expect(app.section('ntb-currency').getByTestId('ntb-currency').locator('input.e-numerictextbox')).toHaveValue(/€\s?12\.50/);
  const byCode = app.section('ntb-currency').getByTestId('ntb-currency-code').locator('input.e-numerictextbox');
  await expect(byCode).toHaveValue('$12.50');
  // the widget applies currencyCode on property changes, not on creation
  await app.section('ntb-currency').getByTestId('ntb-gbp').click();
  await expect(byCode).toHaveValue(/£\s?12\.50/);
});

test('validateDecimalOnType blocks extra decimals', async ({ app }) => {
  const input = app.section('ntb-decimals').locator('input.e-numerictextbox');
  await input.click();
  await input.pressSequentially('1.234');
  await expect(input).toHaveValue('1.23');
});

test('allowMouseWheel changes the value on wheel only when enabled', async ({ app, page }) => {
  const section = app.section('ntb-wheel');
  const input = section.locator('input.e-numerictextbox');
  await expect(input).toHaveValue(/^10/);
  await input.focus();
  await input.hover();
  await page.mouse.wheel(0, -100);
  await expect(input).toHaveValue(/^11/);
  await section.getByTestId('ntb-allow-wheel').uncheck();
  await input.hover();
  await page.mouse.wheel(0, -100);
  await page.mouse.wheel(0, -100);
  await expect(input).toHaveValue(/^11/);
});

test('readonly and enabled follow the view-model', async ({ app }) => {
  const section = app.section('ntb-wheel');
  const input = section.locator('input.e-numerictextbox');
  await expect(input).not.toHaveAttribute('readonly', '');
  await section.getByTestId('ntb-readonly').check();
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toBeEnabled();
  await section.getByTestId('ntb-enabled').uncheck();
  await expect(input).toBeDisabled();
});

test('focus and blur events', async ({ app }) => {
  const section = app.section('ntb-wheel');
  const input = section.locator('input.e-numerictextbox');
  await input.focus();
  await expect(section.getByTestId('ntb-focus')).toHaveText('1');
  await input.blur();
  await expect(section.getByTestId('ntb-blur')).toHaveText('1');
});

test('cssClass, htmlAttributes, width and templates', async ({ app }) => {
  const section = app.section('ntb-more');
  await expect(section.locator('.e-input-group')).toHaveClass(/ntb-custom/);
  await expect(section.locator('input.e-numerictextbox')).toHaveAttribute('data-foo', 'bar');
  await expect.poll(async () => (await section.locator('.e-input-group').boundingBox()).width).toBeCloseTo(220, 0);
  await expect(section.locator('.ntb-prepend')).toHaveText('pre');
  await expect(section.locator('.ntb-append')).toHaveText('app');
  await section.getByTestId('ntb-css').click();
  await expect(section.locator('.e-input-group')).toHaveClass(/ntb-custom-two/);
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('ntb-life');
  await expect(section.locator('input.e-numerictextbox')).toBeVisible();
  await expect(section.getByTestId('ntb-created')).toHaveText('1');
  await expect(section.getByTestId('ntb-destroyed')).toHaveText('0');
  await section.getByTestId('ntb-toggle').click();
  await expect(section.locator('input.e-numerictextbox')).toHaveCount(0);
  await expect(section.getByTestId('ntb-destroyed')).toHaveText('1');
  await section.getByTestId('ntb-toggle').click();
  await expect(section.getByTestId('ntb-created')).toHaveText('2');
});

test('placeholder, floating label and clear button', async ({ app }) => {
  const section = app.section('ntb-options');
  await expect(section.locator('.e-float-text')).toHaveText('Amount');
  const input = section.locator('input.e-numerictextbox');
  await input.fill('8');
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});
