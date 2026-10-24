import { test, expect } from './fixtures';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('otpInput'));

test('typing fills the boxes and the value is two-way: view to model', async ({ app }) => {
  const section = app.section('otp-basic');
  const boxes = section.locator('input.e-otp-input-field');
  await expect(boxes).toHaveCount(4);
  await boxes.first().click();
  await section.page().keyboard.type('1234');
  await expect(section.getByTestId('otp-value-out')).toHaveText('1234');
  await expect(boxes.nth(2)).toHaveValue('3');
});

test('partial value is bound while typing', async ({ app }) => {
  const section = app.section('otp-basic');
  await section.locator('input.e-otp-input-field').first().click();
  await section.page().keyboard.type('12');
  await expect(section.getByTestId('otp-value-out')).toHaveText('12');
  await expect(section.getByTestId('otp-change-count')).toHaveText('0');
});

test('value is two-way: model to view', async ({ app }) => {
  const section = app.section('otp-basic');
  await section.getByTestId('otp-set').click();
  const boxes = section.locator('input.e-otp-input-field');
  await expect(boxes.nth(0)).toHaveValue('4');
  await expect(boxes.nth(3)).toHaveValue('1');
});

test('valueChanged is raised once all boxes are filled', async ({ app }) => {
  const section = app.section('otp-basic');
  await section.locator('input.e-otp-input-field').first().click();
  await section.page().keyboard.type('5678');
  await expect(section.getByTestId('otp-change-count')).toHaveText('1');
  await expect(section.getByTestId('otp-change-value')).toHaveText('5678');
  await expect(section.getByTestId('otp-interacted')).toHaveText('true');
});

test('input, focus, blur and created events', async ({ app }) => {
  const section = app.section('otp-basic');
  await expect(section.getByTestId('otp-created')).toHaveText('1');
  const boxes = section.locator('input.e-otp-input-field');
  await boxes.nth(1).click();
  await expect(section.getByTestId('otp-focus-index')).toHaveText('1');
  await section.page().keyboard.type('9');
  await expect(section.getByTestId('otp-input-count')).toHaveText('1');
  await expect(section.getByTestId('otp-input-index')).toHaveText('1');
  // focus moved between boxes of the same control, blur is raised once the focus leaves the whole control
  await section.locator('.demo-output').click();
  await expect(section.getByTestId('otp-blur-index')).toHaveText('2');
});

test('length and separator', async ({ app }) => {
  const section = app.section('otp-length');
  await expect(section.locator('input.e-otp-input-field')).toHaveCount(4);
  await expect(section.locator('.e-otp-separator')).toHaveCount(0);
  await section.getByTestId('otp-separator-change').click();
  await expect(section.locator('.e-otp-separator')).toHaveCount(3);
  await expect(section.locator('.e-otp-separator').first()).toHaveText('-');
  await section.getByTestId('otp-length-change').click();
  await expect(section.locator('input.e-otp-input-field')).toHaveCount(6);
  expect(await widgetProp(section.getByTestId('otp-length'), 'length')).toBe(6);
});

test('type and textTransform', async ({ app }) => {
  const section = app.section('otp-type');
  const boxes = section.locator('input.e-otp-input-field');
  await expect(boxes.first()).toHaveAttribute('type', 'text');
  await expect(boxes.first()).toHaveValue('a');
  await section.getByTestId('otp-type-change').click();
  await expect(boxes.first()).toHaveAttribute('type', 'password');
  await expect.poll(() => widgetProps(section.getByTestId('otp-text'), ['type', 'textTransform'])).toEqual({ type: 'password', textTransform: 'uppercase' });
  await expect(boxes.first()).toHaveValue('A');
});

test('stylingMode, placeholder and cssClass', async ({ app }) => {
  const section = app.section('otp-style');
  const host = section.locator('.e-otp-input').first();
  await expect(section.locator('input.e-otp-input-field').first()).toHaveAttribute('placeholder', '*');
  await expect(section.locator('.otp-custom')).toHaveCount(1);
  expect(await widgetProp(section.getByTestId('otp-style'), 'stylingMode')).toBe('outlined');
  await section.getByTestId('otp-style-change').click();
  await expect(section.locator('input.e-otp-input-field').first()).toHaveAttribute('placeholder', '#');
  await expect(section.locator('.otp-custom-two')).toHaveCount(1);
  await expect(section.locator('.e-filled')).toHaveCount(1);
  expect(host).toBeDefined();
});

test('disabled, htmlAttributes, ariaLabels, autoFocus and rtl', async ({ app }) => {
  const section = app.section('otp-state');
  const disabled = section.getByTestId('otp-disabled').locator('input.e-otp-input-field');
  await expect(disabled.first()).toBeDisabled();
  const attrs = section.getByTestId('otp-attrs');
  await expect(attrs.locator('[data-foo="bar"]')).toHaveCount(1);
  await expect(attrs.locator('input.e-otp-input-field').nth(1)).toHaveAttribute('aria-label', 'Second digit');
  await expect(attrs.locator('input.e-otp-input-field').first()).toBeFocused();
  await expect(attrs.locator('.e-rtl')).toHaveCount(1);
  await section.getByTestId('otp-state-toggle').click();
  await expect(disabled.first()).toBeEnabled();
});
