import { test, expect } from './fixtures';
import { widgetProp } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('textArea'));

test('two-way value: view to model on every keystroke', async ({ app }) => {
  const section = app.section('ta-value');
  const area = section.locator('textarea');
  await expect(area).toHaveValue('initial');
  await area.fill('');
  await area.pressSequentially('abc');
  await expect(section.getByTestId('ta-value-out')).toHaveText('abc');
  await expect(section.getByTestId('ta-input-count')).not.toHaveText('0');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ta-value');
  await section.getByTestId('ta-set').click();
  await expect(section.locator('textarea')).toHaveValue('from view-model');
});

test('focus, blur and change events', async ({ app }) => {
  const section = app.section('ta-value');
  const area = section.locator('textarea');
  await area.focus();
  await expect(section.getByTestId('ta-focused')).toHaveText('true');
  await area.fill('changed text');
  await area.blur();
  await expect(section.getByTestId('ta-focused')).toHaveText('false');
  await expect(section.getByTestId('ta-change-count')).toHaveText('1');
  await expect(section.getByTestId('ta-change-value')).toHaveText('changed text');
});

test('placeholder, floating label and clear button', async ({ app }) => {
  await expect(app.section('ta-value').locator('textarea')).toHaveAttribute('placeholder', 'Enter your comments');
  const section = app.section('ta-float');
  await expect(section.locator('.e-float-text')).toHaveText('Comments');
  await section.locator('textarea').focus();
  await section.locator('.e-clear-icon').click();
  await expect(section.locator('textarea')).toHaveValue('');
});

test('readonly and enabled bindings', async ({ app }) => {
  const section = app.section('ta-states');
  await expect(section.getByTestId('ta-readonly').locator('textarea')).toHaveAttribute('readonly', '');
  await expect(section.getByTestId('ta-disabled').locator('textarea')).toBeDisabled();
  await section.getByTestId('ta-states-toggle').click();
  await expect(section.getByTestId('ta-readonly').locator('textarea')).not.toHaveAttribute('readonly', '');
  await expect(section.getByTestId('ta-disabled').locator('textarea')).toBeEnabled();
});

test('cols, rows, width, maxLength, resizeMode, cssClass and htmlAttributes reach the textarea', async ({ app }) => {
  const section = app.section('ta-size');
  const host = section.getByTestId('ta-size');
  const area = section.locator('textarea');
  await expect(area).toHaveAttribute('cols', '30');
  await expect(area).toHaveAttribute('rows', '2');
  await expect(area).toHaveAttribute('maxlength', '20');
  await expect(section.locator('.e-input-group')).toHaveClass(/ta-custom/);
  await expect(area).toHaveAttribute('data-foo', 'bar');
  expect(await widgetProp(host, 'resizeMode')).toBe('Vertical');
  expect(await widgetProp(host, 'width')).toBe('300px');
  await section.getByTestId('ta-size-change').click();
  await expect(area).toHaveAttribute('cols', '40');
  await expect(area).toHaveAttribute('rows', '5');
  await expect(area).toHaveAttribute('maxlength', '10');
  await expect(section.locator('.e-input-group')).toHaveClass(/ta-custom-two/);
  await expect(area).toHaveAttribute('data-foo', 'baz');
  await expect.poll(() => widgetProp(host, 'resizeMode')).toBe('Horizontal');
  expect(await widgetProp(host, 'width')).toBe('400px');
});

test('prepend and append templates with adornment flow and orientation', async ({ app }) => {
  const section = app.section('ta-adornments');
  await expect(section.locator('.ta-prepend')).toHaveText('pre');
  await expect(section.locator('.ta-append')).toHaveText('app');
  const host = section.getByTestId('ta-adornments');
  expect(await widgetProp(host, 'adornmentFlow')).toBe('Horizontal');
  await section.getByTestId('ta-adornments-change').click();
  await expect.poll(() => widgetProp(host, 'adornmentFlow')).toBe('Vertical');
  expect(await widgetProp(host, 'adornmentOrientation')).toBe('Vertical');
});

test('common bindables: enableRtl, enablePersistence and locale', async ({ app }) => {
  const host = app.section('ta-rtl').getByTestId('ta-rtl');
  await expect(app.section('ta-rtl').locator('.e-input-group')).toHaveClass(/e-rtl/);
  expect(await widgetProp(host, 'enablePersistence')).toBe(false);
  expect(await widgetProp(host, 'locale')).toBe('en-US');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('ta-life');
  await expect(section.getByTestId('ta-created')).toHaveText('1');
  await section.getByTestId('ta-toggle').click();
  await expect(section.getByTestId('ta-destroyed')).toHaveText('1');
  await expect(section.locator('textarea')).toHaveCount(0);
});
