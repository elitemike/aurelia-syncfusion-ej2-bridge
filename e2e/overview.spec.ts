import { test, expect } from './fixtures';
import { inst, eventCount } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('overview'));

const basic = (app) => app.section('overview-basic');
const rect = (scope) => scope.locator('[id$="_canvasoverviewrect"]');
const rectWidth = async (scope) => Number(await rect(scope).getAttribute('width'));

test('width and height size the overview and sourceID connects it to the diagram', async ({ app }) => {
  const o = basic(app).getByTestId('overview-view');
  await expect(o.locator('.e-overview')).toBeVisible();
  await expect(o.locator('.e-overview')).toHaveCSS('width', '240px');
  await expect(o.locator('.e-overview')).toHaveCSS('height', '150px');
  await expect(o.locator('[id$="_canvas_overviewsvg"]')).toBeAttached();
  const info = await inst(o, w => ({ w: w.width, h: w.height, src: w.sourceID, id: w.element.id }));
  expect(info).toEqual({ w: '240px', h: '150px', src: 'ov-diagram', id: 'ov-view' });
  // the diagram the id points to is the real widget host
  expect(await inst(basic(app).getByTestId('overview-diagram'), w => w.element.id)).toBe('ov-diagram');
});

test('created event reaches the template', async ({ app, page }) => {
  await expect(basic(app).getByTestId('overview-view').locator('.e-overview')).toBeVisible();
  await expect.poll(() => eventCount(page, 'ov:created')).toBeGreaterThan(0);
});

test('the overview follows the zoom of its diagram', async ({ app }) => {
  const s = basic(app);
  const o = s.getByTestId('overview-view');
  await expect(rect(o)).toBeAttached();
  const before = await rectWidth(o);
  await inst(s.getByTestId('overview-diagram'), w => { w.zoom(2); });
  await expect.poll(() => rectWidth(o)).toBeLessThan(before);
});

test('an overview declared before its diagram still connects', async ({ app }) => {
  const o = app.section('overview-before').getByTestId('overview-early');
  await expect(o.locator('[id$="_canvasoverviewrect"]')).toBeAttached();
  expect(await inst(o, w => w.sourceID)).toBe('ov-late');
});

test('changing sourceID switches the overview to another diagram', async ({ app }) => {
  const s = basic(app);
  const o = s.getByTestId('overview-view');
  await expect(rect(o)).toBeAttached();
  const before = await rectWidth(o);
  await s.getByTestId('overview-switch').click();
  await expect.poll(() => inst(o, w => w.sourceID)).toBe('ov-diagram-2');
  await expect.poll(() => rectWidth(o)).not.toBe(before);
});
