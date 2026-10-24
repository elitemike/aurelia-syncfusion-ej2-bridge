import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('maskedTextBox'));

test('mask is displayed', async ({ app }) => {
  await app.section('mtb-value').locator('input.e-maskedtextbox').focus();
  await expect(app.section('mtb-value').locator('input.e-maskedtextbox')).toHaveValue('___-___-____');
});

test('two-way value: view to model holds the raw value', async ({ app, page }) => {
  const section = app.section('mtb-value');
  const input = section.locator('input.e-maskedtextbox');
  await input.focus();
  await page.waitForTimeout(150); // the mask moves the caret to the first slot after focus
  await page.keyboard.type('5551234567');
  await expect(input).toHaveValue('555-123-4567');
  await expect(section.getByTestId('mtb-value-out')).toHaveText('5551234567');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('mtb-value');
  await section.getByTestId('mtb-set').click();
  await expect(section.locator('input.e-maskedtextbox')).toHaveValue('555-123-4567');
});

test('change event is raised on blur', async ({ app, page }) => {
  const section = app.section('mtb-value');
  const input = section.locator('input.e-maskedtextbox');
  await input.focus();
  await page.waitForTimeout(150);
  await page.keyboard.type('1');
  await input.blur();
  await expect(section.getByTestId('mtb-change-count')).toHaveText('1');
});

test('promptChar', async ({ app }) => {
  const input = app.section('mtb-prompt').locator('input.e-maskedtextbox');
  await input.focus();
  await expect(input).toHaveValue('##/##/####');
});

test('floating label and clear button', async ({ app, page }) => {
  const section = app.section('mtb-float');
  await expect(section.locator('.e-float-text')).toHaveText('Code');
  const input = section.locator('input.e-maskedtextbox');
  await input.focus();
  await page.waitForTimeout(150);
  await page.keyboard.type('ab');
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('____');
});

test('customCharacters restrict what can be typed', async ({ app, page }) => {
  const input = app.section('mtb-more').locator('input.e-maskedtextbox');
  await input.focus();
  await page.waitForTimeout(150);
  await page.keyboard.type('xq');
  await expect(input).toHaveValue('_-_');
  await page.keyboard.type('p');
  await expect(input).toHaveValue('p-_');
});

test('cssClass, htmlAttributes, width and templates', async ({ app }) => {
  const section = app.section('mtb-more');
  await expect(section.locator('.e-input-group')).toHaveClass(/mtb-custom/);
  await expect(section.locator('input.e-maskedtextbox')).toHaveAttribute('data-foo', 'bar');
  await expect.poll(async () => (await section.locator('.e-input-group').boundingBox()).width).toBeCloseTo(220, 0);
  await expect(section.locator('.mtb-prepend')).toHaveText('pre');
  await expect(section.locator('.mtb-append')).toHaveText('app');
  await section.getByTestId('mtb-css').click();
  await expect(section.locator('.e-input-group')).toHaveClass(/mtb-custom-two/);
});

test('enabled follows the view-model', async ({ app }) => {
  const section = app.section('mtb-more');
  await expect(section.locator('input.e-maskedtextbox')).toBeEnabled();
  await section.getByTestId('mtb-enable').uncheck();
  await expect(section.locator('input.e-maskedtextbox')).toBeDisabled();
});

test('focus and blur events', async ({ app }) => {
  const section = app.section('mtb-more');
  const input = section.locator('input.e-maskedtextbox');
  await input.focus();
  await expect(section.getByTestId('mtb-focus')).toHaveText('1');
  await input.blur();
  await expect(section.getByTestId('mtb-blur')).toHaveText('1');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('mtb-life');
  await expect(section.locator('input.e-maskedtextbox')).toBeVisible();
  await expect(section.getByTestId('mtb-created')).toHaveText('1');
  await expect(section.getByTestId('mtb-destroyed')).toHaveText('0');
  await section.getByTestId('mtb-toggle').click();
  await expect(section.locator('input.e-maskedtextbox')).toHaveCount(0);
  await expect(section.getByTestId('mtb-destroyed')).toHaveText('1');
  await section.getByTestId('mtb-toggle').click();
  await expect(section.getByTestId('mtb-created')).toHaveText('2');
});

test('readonly is bindable', async ({ app }) => {
  await expect(app.section('mtb-readonly').locator('input.e-maskedtextbox')).toHaveAttribute('readonly', '');
});
