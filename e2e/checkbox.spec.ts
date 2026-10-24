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

test('name, value, cssClass, htmlAttributes and labelPosition', async ({ app }) => {
  const section = app.section('chk-more');
  const input = section.locator('input.e-checkbox');
  await expect(input).toHaveAttribute('name', 'opts');
  await expect(input).toHaveAttribute('value', 'v1');
  await expect(section.locator('.e-checkbox-wrapper')).toHaveClass(/chk-custom/);
  await expect(section.locator('.e-checkbox-wrapper')).toHaveAttribute('data-foo', 'bar');
  await expect(section.locator('.e-checkbox-wrapper .e-label')).toHaveClass(/e-label/);
  // labelPosition Before renders the label ahead of the frame
  expect(await section.locator('.e-checkbox-wrapper').evaluate(el => !!(el.querySelector('.e-label').compareDocumentPosition(el.querySelector('.e-frame')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await section.getByTestId('chk-css').click();
  await expect(section.locator('.e-checkbox-wrapper')).toHaveClass(/chk-custom-two/);
});

test('indeterminate follows the view-model', async ({ app }) => {
  const section = app.section('chk-more');
  await expect(section.locator('.e-checkbox-wrapper .e-frame')).toHaveClass(/e-stop/);
  await section.getByTestId('chk-clear-indeterminate').click();
  await expect(section.locator('.e-checkbox-wrapper .e-frame')).not.toHaveClass(/e-stop/);
});

test('enableHtmlSanitizer reaches the widget and html labels render', async ({ app, page }) => {
  const section = app.section('chk-more');
  await expect(section.locator('.e-label .chk-bold')).toHaveText('options');
  const sanitize = await page.evaluate(
    () => (document.querySelector('[data-testid="chk-more"]') as any).au['ej2-checkbox'].viewModel.widget.enableHtmlSanitizer);
  expect(sanitize).toBe(false);
});

test('change and created events', async ({ app }) => {
  const section = app.section('chk-more');
  await expect(section.getByTestId('chk-created')).toHaveText('1');
  await section.getByTestId('chk-clear-indeterminate').click();
  await section.locator('.e-checkbox-wrapper').click();
  await expect(section.getByTestId('chk-change-count')).toHaveText('1');
  await expect(section.getByTestId('chk-change-checked')).toHaveText('true');
  await expect(section.getByTestId('chk-more-out')).toHaveText('true');
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
