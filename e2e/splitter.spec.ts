import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('splitter'));

test('renders two panes with the configured size', async ({ app }) => {
  const section = app.section('sp-horizontal');
  await expect(section.locator('.e-pane')).toHaveCount(2);
  const total = (await section.locator('.e-splitter').boundingBox()).width;
  const left = (await section.locator('.e-pane').first().boundingBox()).width;
  expect(left / total).toBeGreaterThan(0.35);
  expect(left / total).toBeLessThan(0.45);
});

test('slotted content is placed in the panes', async ({ app }) => {
  const section = app.section('sp-horizontal');
  await expect(section.locator('.e-pane').first()).toContainText('Left pane');
  await expect(section.locator('.e-pane').last()).toContainText('Right pane');
});

test('dragging the separator resizes the panes', async ({ app, page }) => {
  const section = app.section('sp-horizontal');
  const bar = section.locator('.e-split-bar').first();
  const box = await bar.boundingBox();
  const before = (await section.locator('.e-pane').first().boundingBox()).width;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  const after = (await section.locator('.e-pane').first().boundingBox()).width;
  expect(after).toBeGreaterThan(before + 50);
  await expect(section.getByTestId('sp-resized')).toHaveText('1');
});

test('collapse and expand through the widget api raise events', async ({ app }) => {
  const section = app.section('sp-horizontal');
  await section.getByTestId('sp-collapse').click();
  await expect(section.getByTestId('sp-collapsed')).toHaveText('1');
  await expect(section.locator('.e-pane').first()).toHaveClass(/e-collapsed/);
  await section.getByTestId('sp-expand').click();
  await expect(section.getByTestId('sp-expanded')).toHaveText('1');
  await expect(section.locator('.e-pane').first()).not.toHaveClass(/e-collapsed/);
});

test('nested vertical splitter', async ({ app }) => {
  const nested = app.section('sp-nested').locator('.e-splitter.e-splitter-vertical');
  await expect(nested).toHaveCount(1);
  await expect(nested.locator('.e-pane')).toHaveCount(2);
});
