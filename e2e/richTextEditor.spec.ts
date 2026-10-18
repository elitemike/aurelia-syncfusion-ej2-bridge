import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('richTextEditor'));

test('renders toolbar and content', async ({ app }) => {
  const section = app.section('rte-value');
  await expect(section.locator('.e-toolbar')).toBeVisible();
  await expect(section.locator('.e-rte-content [contenteditable]').first()).toContainText('Some content');
  await expect(section.locator('.e-toolbar [title*="Bold"]').first()).toBeVisible();
});

test('two-way value: view to model on blur', async ({ app, page }) => {
  const section = app.section('rte-value');
  const editable = section.locator('.e-rte-content [contenteditable]').first();
  await editable.click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type(' typed');
  await page.locator('main h2').click();
  await expect(section.getByTestId('rte-value-out')).toContainText('typed');
  await expect(section.getByTestId('rte-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('rte-value');
  await section.getByTestId('rte-set').click();
  await expect(section.locator('.e-rte-content [contenteditable]').first()).toContainText('Set from the view-model');
});

test('toolbar bold formatting is written to the model', async ({ app, page }) => {
  const section = app.section('rte-value');
  const editable = section.locator('.e-rte-content [contenteditable]').first();
  await editable.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Control+B');
  await page.locator('main h2').click();
  await expect(section.getByTestId('rte-value-out')).toContainText(/<(strong|b)>/);
});

test('widget api is reachable through view-model.ref', async ({ app }) => {
  const section = app.section('rte-value');
  await section.getByTestId('rte-xhtml').click();
  await expect(section.getByTestId('rte-xhtml-out')).toContainText('Some content');
});

test('readonly editor is not editable', async ({ app }) => {
  const editable = app.section('rte-readonly').locator('.e-rte-content [contenteditable]').first();
  await expect(editable).toHaveAttribute('contenteditable', 'false');
});

test('character count', async ({ app }) => {
  await expect(app.section('rte-count').locator('.e-rte-character-count')).toContainText('5 / 20');
});
