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

test('type, autocomplete, cssClass and htmlAttributes reach the input', async ({ app }) => {
  const section = app.section('tb-more');
  const input = section.locator('input.e-textbox');
  await expect(input).toHaveAttribute('type', 'password');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await expect(input).toHaveAttribute('data-foo', 'bar');
  await expect(input).toHaveAttribute('data-baz', 'qux');
  await expect(section.locator('.e-input-group')).toHaveClass(/tb-custom/);
});

test('cssClass follows the view-model', async ({ app }) => {
  const section = app.section('tb-more');
  await section.getByTestId('tb-css').click();
  await expect(section.locator('.e-input-group')).toHaveClass(/tb-custom-two/);
});

test('prependTemplate and appendTemplate render next to the input', async ({ app }) => {
  const section = app.section('tb-more');
  await expect(section.locator('.tb-prepend')).toHaveText('pre');
  await expect(section.locator('.tb-append')).toHaveText('app');
});

test('change event is raised with the new value on blur', async ({ app }) => {
  const section = app.section('tb-more');
  const input = section.locator('input.e-textbox');
  await input.click();
  await input.pressSequentially('secret');
  await expect(section.getByTestId('tb-change-count')).toHaveText('0');
  await input.blur();
  await expect(section.getByTestId('tb-change-count')).toHaveText('1');
  await expect(section.getByTestId('tb-change-value')).toHaveText('secret');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('tb-life');
  await expect(section.locator('input.e-textbox')).toBeVisible();
  await expect(section.getByTestId('tb-created')).toHaveText('1');
  await expect(section.getByTestId('tb-destroyed')).toHaveText('0');
  await section.getByTestId('tb-toggle').click();
  await expect(section.locator('input.e-textbox')).toHaveCount(0);
  await expect(section.getByTestId('tb-destroyed')).toHaveText('1');
  await section.getByTestId('tb-toggle').click();
  await expect(section.getByTestId('tb-created')).toHaveText('2');
});
