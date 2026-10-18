import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('checkbox'));

test('two-way checked: view to model', async ({ app }) => {
  const section = app.section('chk-single');
  await section.locator('.e-checkbox-wrapper').click();
  await expect(section.getByTestId('chk-single-out')).toHaveText('true');
  await expect(section.locator('.e-checkbox-wrapper .e-frame')).toHaveClass(/e-check/);
  await section.locator('.e-checkbox-wrapper').click();
  await expect(section.getByTestId('chk-single-out')).toHaveText('false');
});

test('two-way checked: model to view', async ({ app }) => {
  const section = app.section('chk-single');
  await section.getByTestId('chk-set').click();
  await expect(section.locator('input.e-checkbox')).toBeChecked();
});

test('on-click is raised once per click', async ({ app }) => {
  const section = app.section('chk-single');
  await section.locator('.e-checkbox-wrapper').click();
  await expect(section.getByTestId('chk-click-count')).toHaveText('1');
});

test('disabled binding', async ({ app }) => {
  const section = app.section('chk-single');
  await section.getByTestId('chk-disable').check();
  await expect(section.locator('input.e-checkbox')).toBeDisabled();
});

test('label is rendered', async ({ app }) => {
  await expect(app.section('chk-single').locator('.e-label')).toHaveText('Accept terms');
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('chk-lifecycle');
  await expect(section.locator('.e-checkbox-wrapper')).toHaveCount(1);
  await section.getByTestId('chk-toggle').click();
  await expect(section.locator('.e-checkbox-wrapper')).toHaveCount(0);
  await section.getByTestId('chk-toggle').click();
  await expect(section.locator('.e-checkbox-wrapper')).toHaveCount(1);
});

test('list with objects', async ({ app }) => {
  const section = app.section('chk-objects');
  const boxes = section.locator('input.e-checkbox');
  await expect(boxes).toHaveCount(3);
  await expect(boxes.nth(1)).toBeChecked();
  await section.locator('.e-checkbox-wrapper').first().click();
  await expect(section.getByTestId('chk-objects-out')).toHaveText('2');
  await section.locator('.e-checkbox-wrapper').nth(1).click();
  await expect(section.getByTestId('chk-objects-out')).toHaveText('1');
});

test('list with strings', async ({ app }) => {
  const section = app.section('chk-strings');
  await section.locator('.e-checkbox-wrapper').nth(0).click();
  await section.locator('.e-checkbox-wrapper').nth(2).click();
  await expect(section.getByTestId('chk-strings-out')).toHaveText('A,C');
});

test('list with matcher resolves equal items', async ({ app }) => {
  const section = app.section('chk-matcher');
  await expect(section.locator('input.e-checkbox').nth(1)).toBeChecked();
  await section.locator('.e-checkbox-wrapper').nth(0).click();
  await expect(section.getByTestId('chk-matcher-out')).toHaveText('2');
  await section.locator('.e-checkbox-wrapper').nth(1).click();
  await expect(section.getByTestId('chk-matcher-out')).toHaveText('1');
});
