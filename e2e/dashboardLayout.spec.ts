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
