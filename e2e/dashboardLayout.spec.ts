import { Locator } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('dashboardLayout'));

test('renders bound panels with their content', async ({ app }) => {
  const section = app.section('dl-panels');
  await expect(section.locator('.e-panel')).toHaveCount(3);
  await expect(section.locator('#p2')).toContainText('Panel 2');
  await expect(section.locator('#p3')).toContainText('Three');
});

test('panel geometry follows row, col and size', async ({ app }) => {
  const section = app.section('dl-panels');
  const p1 = await section.locator('#p1').boundingBox();
  const p2 = await section.locator('#p2').boundingBox();
  const p3 = await section.locator('#p3').boundingBox();
  expect(p2.x).toBeGreaterThan(p1.x + p1.width - 1);
  expect(p2.width).toBeGreaterThan(p1.width * 1.8);
  expect(p3.y).toBeGreaterThan(p1.y + p1.height - 1);
});

test('dragging a panel moves it and raises change', async ({ app, page }) => {
  const section = app.section('dl-panels');
  const panel = section.locator('#p1');
  const box = await panel.boundingBox();
  const handle = panel.locator('.e-panel-header');
  const hb = await handle.boundingBox();
  await page.mouse.move(hb.x + 10, hb.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width + 40, box.y + box.height + 120, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await panel.boundingBox()).y).toBeGreaterThan(box.y + 20);
  await expect(section.getByTestId('dl-changes')).not.toHaveText('0');
  await expect(section.getByTestId('dl-drag-start')).toHaveText('1');
  await expect(section.getByTestId('dl-drags')).not.toHaveText('0');
  await expect(section.getByTestId('dl-drag-stop')).toHaveText('1');
});

test('allowDragging binding disables panel dragging', async ({ app, page }) => {
  const section = app.section('dl-panels');
  await section.getByTestId('dl-drag').uncheck();
  const panel = section.locator('#p1');
  const box = await panel.boundingBox();
  const hb = await panel.locator('.e-panel-header').boundingBox();
  await page.mouse.move(hb.x + 10, hb.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width + 40, box.y + box.height + 120, { steps: 8 });
  await page.mouse.up();
  expect((await panel.boundingBox()).y).toBeCloseTo(box.y, 0);
  await expect(section.getByTestId('dl-changes')).toHaveText('0');
});

test('grid lines binding', async ({ app }) => {
  const section = app.section('dl-panels');
  await expect(section.locator('table.e-dashboard-gridline-table')).toHaveCount(1);
  await section.getByTestId('dl-grid').uncheck();
  await expect(section.locator('table.e-dashboard-gridline-table')).toHaveCount(0);
});

test('panels from markup', async ({ app }) => {
  const section = app.section('dl-markup');
  await expect(section.locator('.e-panel')).toHaveCount(2);
  await expect(section.locator('.e-panel').last()).toContainText('B');
});

/** Wait until the layout above the element stopped shifting it, so viewport coordinates can be used for mouse input. */
async function settled(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  let last = '';
  await expect.poll(async () => {
    const box = JSON.stringify(await locator.boundingBox());
    const same = box === last;
    last = box;
    return same;
  }, { intervals: [200] }).toBe(true);
}

const widgetOf = (testId: string) => `(document.querySelector('[data-testid="${testId}"]')).au['ej2-dashboard-layout'].viewModel.widget`;

test('allowResizing with resizableHandles raises resize events', async ({ app, page }) => {
  const section = app.section('dl-resize');
  const panel = section.locator('#r1');
  await expect(panel.locator('.e-resize.e-south-east')).toHaveCount(1);
  await expect(panel.locator('.e-resize')).toHaveCount(1);
  await settled(panel);
  await panel.hover();
  const before = await panel.boundingBox();
  const handle = panel.locator('.e-resize.e-south-east');
  await expect(handle).toBeVisible();
  const hb = await handle.boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
  await page.mouse.down();
  await page.mouse.move(hb.x + 160, hb.y + 120, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await panel.boundingBox()).width).toBeGreaterThan(before.width + 40);
  await expect(section.getByTestId('dl-resize-start')).toHaveText('1');
  await expect(section.getByTestId('dl-resizes')).not.toHaveText('0');
  await expect(section.getByTestId('dl-resize-stop')).toHaveText('1');
});

test('allowPushing is passed to the widget', async ({ page, app }) => {
  await expect(app.section('dl-resize').locator('.e-panel')).toHaveCount(1);
  expect(await page.evaluate(`${widgetOf('dl-resize')}.allowPushing`)).toBe(false);
});

test('draggableHandle: dragging the panel body does not move it', async ({ app, page }) => {
  const panel = app.section('dl-handle').locator('#h1');
  await settled(panel);
  const box = await panel.boundingBox();
  const body = await panel.locator('.body').boundingBox();
  await page.mouse.move(body.x + 5, body.y + 5);
  await page.mouse.down();
  await page.mouse.move(body.x + 5, body.y + 200, { steps: 8 });
  await page.mouse.up();
  expect((await panel.boundingBox()).y).toBeCloseTo(box.y, 0);
});

test('draggableHandle: dragging the handle moves the panel', async ({ app, page }) => {
  const panel = app.section('dl-handle').locator('#h1');
  await panel.scrollIntoViewIfNeeded();
  const box = await panel.boundingBox();
  await expect(panel.locator('.dh.e-drag')).toBeAttached();
  const dh = await panel.locator('.dh').boundingBox();
  await page.mouse.move(dh.x + 20, dh.y + dh.height / 2);
  await page.mouse.down();
  await page.mouse.move(dh.x + 20, dh.y + 200, { steps: 12 });
  await page.mouse.up();
  await expect.poll(async () => (await panel.boundingBox()).y).toBeGreaterThan(box.y + 20);
});

test('allowFloating false keeps panels where they are placed', async ({ app, page }) => {
  await expect(app.section('dl-options').locator('.e-panel')).toHaveCount(2);
  // o2 sits in row 2 with nothing above it, it must not float up to row 0
  const state = await page.evaluate(`(() => { const w = ${widgetOf('dl-options')}; return { floating: w.allowFloating, rows: w.panels.map(p => p.row) }; })()`);
  expect(state).toEqual({ floating: false, rows: [0, 2] });
});

test('cellAspectRatio shapes the grid cells', async ({ app }) => {
  const box = await app.section('dl-options').locator('#o1').boundingBox();
  // 1x1 cell without spacing: width / height equals the aspect ratio
  expect(box.width / box.height).toBeCloseTo(2, 0);
});

test('mediaQuery, enableHtmlSanitizer reach the widget and the layout reacts to the query', async ({ app, page }) => {
  const section = app.section('dl-options');
  const props = await page.evaluate(`(() => { const w = ${widgetOf('dl-options')}; return { mq: w.mediaQuery, san: w.enableHtmlSanitizer }; })()`);
  expect(props).toEqual({ mq: 'max-width:600px', san: true });
  await page.setViewportSize({ width: 500, height: 800 });
  // below the breakpoint the panels are stacked in a single column
  await expect.poll(async () => {
    const a = await section.locator('#o1').boundingBox();
    const b = await section.locator('#o2').boundingBox();
    return Math.abs(a.x - b.x) < 2;
  }).toBe(true);
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('dl-lifecycle');
  await expect(section.getByTestId('dl-created')).toHaveText('1');
  await section.getByTestId('dl-toggle').click();
  await expect(section.getByTestId('dl-destroyed')).toHaveText('1');
  await section.getByTestId('dl-toggle').click();
  await expect(section.getByTestId('dl-created')).toHaveText('2');
});
