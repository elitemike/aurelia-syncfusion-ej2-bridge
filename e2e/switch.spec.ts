import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('switch'));

test('two-way checked: view to model', async ({ app }) => {
  const section = app.section('sw-checked');
  await expect(section.locator('input.e-switch')).toBeChecked();
  await section.locator('.e-switch-wrapper').click();
  await expect(section.getByTestId('sw-out')).toHaveText('false');
  await expect(section.getByTestId('sw-change-count')).toHaveText('1');
});

test('two-way checked: model to view', async ({ app }) => {
  const section = app.section('sw-checked');
  await section.getByTestId('sw-off').click();
  await expect(section.locator('input.e-switch')).not.toBeChecked();
});

test('disabled binding', async ({ app }) => {
  const section = app.section('sw-checked');
  await section.getByTestId('sw-disable').check();
  await expect(section.locator('input.e-switch')).toBeDisabled();
});

test('on/off labels', async ({ app }) => {
  const section = app.section('sw-labels');
  await expect(section.locator('.e-switch-on')).toHaveText('ON');
  await expect(section.locator('.e-switch-off')).toHaveText('OFF');
});

test('name, value, cssClass and htmlAttributes reach the input', async ({ app }) => {
  const section = app.section('sw-more');
  const input = section.locator('input.e-switch');
  await expect(input).toHaveAttribute('name', 'wifi');
  await expect(input).toHaveAttribute('value', 'on');
  await expect(section.locator('.e-switch-wrapper')).toHaveAttribute('data-foo', 'bar');
  await expect(section.locator('.e-switch-wrapper')).toHaveClass(/sw-custom/);
  await section.getByTestId('sw-value').click();
  await expect(input).toHaveAttribute('value', 'changed');
  await section.getByTestId('sw-css').click();
  await expect(section.locator('.e-switch-wrapper')).toHaveClass(/sw-custom-two/);
});

test('created is raised once and beforeChange fires before each toggle', async ({ app }) => {
  const section = app.section('sw-more');
  await expect(section.getByTestId('sw-created')).toHaveText('1');
  await section.locator('.e-switch-wrapper').click();
  await expect(section.getByTestId('sw-before-count')).toHaveText('1');
  await expect(section.getByTestId('sw-more-out')).toHaveText('true');
  await expect(section.locator('input.e-switch')).toBeChecked();
});

test('beforeChange can cancel the change', async ({ app }) => {
  const section = app.section('sw-more');
  await section.getByTestId('sw-block').check();
  await section.locator('.e-switch-wrapper').click();
  await expect(section.getByTestId('sw-before-count')).toHaveText('1');
  await expect(section.locator('input.e-switch')).not.toBeChecked();
  await expect(section.getByTestId('sw-more-out')).toHaveText('false');
});

test('host id moves to the input so a slotted label targets the switch', async ({ app }) => {
  const section = app.section('sw-label');
  await expect(section.locator('input.e-switch')).toHaveAttribute('id', 'usb');
  const before = await section.locator('input.e-switch').isChecked();
  await section.getByTestId('sw-usb-label').click();
  expect(await section.locator('input.e-switch').isChecked()).toBe(!before);
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('sw-label');
  await section.getByTestId('sw-toggle').click();
  await expect(section.locator('.e-switch-wrapper')).toHaveCount(0);
  await section.getByTestId('sw-toggle').click();
  await expect(section.locator('.e-switch-wrapper')).toHaveCount(1);
});
