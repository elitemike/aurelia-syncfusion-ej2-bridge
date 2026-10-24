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

test('resizeStart and resizing events fire while dragging', async ({ app, page }) => {
  const section = app.section('sp-horizontal');
  const box = await section.locator('.e-split-bar').first().boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 60, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(section.getByTestId('sp-resize-starts')).toHaveText('1');
  await expect(section.getByTestId('sp-resizings')).not.toHaveText('0');
});

test('beforeCollapse and beforeExpand events and created', async ({ app }) => {
  const section = app.section('sp-horizontal');
  await expect(section.getByTestId('sp-created')).toHaveText('1');
  await section.getByTestId('sp-collapse').click();
  await expect(section.getByTestId('sp-before-collapse')).not.toHaveText('0');
  await section.getByTestId('sp-expand').click();
  await expect(section.getByTestId('sp-before-expand')).not.toHaveText('0');
});

test('orientation, width, separatorSize, cssClass and paneSettings', async ({ app }) => {
  const splitter = app.section('sp-props').locator('.e-splitter');
  await expect(splitter).toHaveClass(/e-splitter-vertical/);
  await expect(splitter).toHaveClass(/my-splitter/);
  await expect.poll(async () => (await splitter.boundingBox()).width).toBeCloseTo(300, 0);
  await expect.poll(async () => (await splitter.locator('.e-split-bar').boundingBox()).height).toBeCloseTo(10, 0);
  // pane sizes come from paneSettings: first pane is 40% of the content area
  const panes = splitter.locator('.e-pane');
  await expect(panes.first()).toContainText('Pane A');
  const a = (await panes.first().boundingBox()).height;
  const b = (await panes.last().boundingBox()).height;
  expect(a / (a + b)).toBeGreaterThan(0.3);
  expect(a / (a + b)).toBeLessThan(0.45);
});

test('enableHtmlSanitizer raises beforeSanitizeHtml for pane content', async ({ app, page }) => {
  await expect(app.section('sp-props').getByTestId('sp-sanitized')).not.toHaveText('0');
  const flag = await page.evaluate(() => (document.querySelector('[data-testid="sp-props"]') as any).au['ej2-splitter'].viewModel.widget.enableHtmlSanitizer);
  expect(flag).toBe(true);
});

test('enableReversePanes and enabled follow the view-model', async ({ app }) => {
  const section = app.section('sp-props');
  const splitter = section.locator('.e-splitter');
  // reversing panes flips the splitter direction
  await expect(splitter).not.toHaveAttribute('dir', 'rtl');
  await section.getByTestId('sp-reverse').check();
  await expect(splitter).toHaveAttribute('dir', 'rtl');
  await expect(splitter).not.toHaveClass(/e-disabled/);
  await section.getByTestId('sp-enabled').uncheck();
  await expect(splitter).toHaveClass(/e-disabled/);
});

test('nested vertical splitter', async ({ app }) => {
  const nested = app.section('sp-nested').locator('.e-splitter.e-splitter-vertical');
  await expect(nested).toHaveCount(1);
  await expect(nested.locator('.e-pane')).toHaveCount(2);
});
