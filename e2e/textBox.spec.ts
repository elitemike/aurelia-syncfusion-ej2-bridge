import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('textBox'));

test('two-way value: view to model on every keystroke', async ({ app }) => {
  const section = app.section('tb-value');
  const input = section.locator('input.e-textbox');
  await expect(input).toHaveValue('initial');
  await input.fill('');
  await input.pressSequentially('abc');
  await expect(section.getByTestId('tb-value-out')).toHaveText('abc');
  await expect(section.getByTestId('tb-input-count')).not.toHaveText('0');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('tb-value');
  await section.getByTestId('tb-set').click();
  await expect(section.locator('input.e-textbox')).toHaveValue('from view-model');
});

test('focus and blur events', async ({ app }) => {
  const section = app.section('tb-value');
  await section.locator('input.e-textbox').focus();
  await expect(section.getByTestId('tb-focused')).toHaveText('true');
  await section.locator('input.e-textbox').blur();
  await expect(section.getByTestId('tb-focused')).toHaveText('false');
});

test('placeholder and floating label', async ({ app }) => {
  await expect(app.section('tb-value').locator('input.e-textbox')).toHaveAttribute('placeholder', 'Type here');
  await expect(app.section('tb-float').locator('.e-float-text')).toHaveText('Enter name');
});

test('clear button empties the box', async ({ app }) => {
  const section = app.section('tb-clear');
  const input = section.locator('input.e-textbox');
  await input.focus();
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});

test('readonly, disabled and multiline', async ({ app }) => {
  const section = app.section('tb-states');
  await expect(section.getByTestId('tb-readonly').locator('input')).toHaveAttribute('readonly', '');
  await expect(section.getByTestId('tb-disabled').locator('input')).toBeDisabled();
  await expect(section.getByTestId('tb-multiline').locator('textarea')).toBeVisible();
});

test('width and maxLength are bindable', async ({ app }) => {
  const section = app.section('tb-width');
  await expect.poll(async () => (await section.locator('.e-input-group').boundingBox()).width).toBeCloseTo(180, 0);
  const input = section.locator('input.e-textbox');
  await input.click();
  await input.pressSequentially('123456789');
  await expect(input).toHaveValue('abc12');
});
