import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('radio'));

test('initial checked state', async ({ app }) => {
  const section = app.section('rdo-group');
  await expect(section.getByTestId('rdo-first').locator('input')).not.toBeChecked();
  await expect(section.getByTestId('rdo-second').locator('input')).toBeChecked();
});

test('selecting one unchecks the other and updates both bindings', async ({ app }) => {
  const section = app.section('rdo-group');
  await section.getByTestId('rdo-first').locator('label').click();
  await expect(section.getByTestId('rdo-first-out')).toHaveText('true');
  await expect(section.getByTestId('rdo-second-out')).toHaveText('false');
  await section.getByTestId('rdo-second').locator('label').click();
  await expect(section.getByTestId('rdo-first-out')).toHaveText('false');
  await expect(section.getByTestId('rdo-second-out')).toHaveText('true');
});

test('model to view', async ({ app }) => {
  const section = app.section('rdo-group');
  await section.getByTestId('rdo-select-first').click();
  await expect(section.getByTestId('rdo-first').locator('input')).toBeChecked();
  await expect(section.getByTestId('rdo-second').locator('input')).not.toBeChecked();
});

test('disabled binding', async ({ app }) => {
  const section = app.section('rdo-group');
  await section.getByTestId('rdo-disable').check();
  await expect(section.getByTestId('rdo-first').locator('input')).toBeDisabled();
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('rdo-lifecycle');
  await expect(section.locator('.e-radio-wrapper')).toHaveCount(1);
  await section.getByTestId('rdo-toggle').click();
  await expect(section.locator('.e-radio-wrapper')).toHaveCount(0);
  await section.getByTestId('rdo-toggle').click();
  await expect(section.locator('.e-radio-wrapper')).toHaveCount(1);
});

test('label position', async ({ app }) => {
  await expect(app.section('rdo-label').locator('label.e-right, label.e-left').first()).toBeAttached();
  await expect(app.section('rdo-label').locator('.e-label')).toHaveText('Before');
});
