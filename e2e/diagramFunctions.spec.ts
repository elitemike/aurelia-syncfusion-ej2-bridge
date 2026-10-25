import { test, expect } from './fixtures';
import { inst, center, hover, eventCount } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const fn = (page, name: string) => page.evaluate((n) => ((window as any).__diagramFn || {})[n] || 0, name);
const fns = (app) => app.section('diagram-functions').getByTestId('diagram-functions');

test('getNodeDefaults and getConnectorDefaults style every object', async ({ app, page }) => {
  const d = fns(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await fn(page, 'getNodeDefaults')).toBeGreaterThan(0);
  expect(await fn(page, 'getConnectorDefaults')).toBeGreaterThan(0);
  expect(await inst(d, w => w.nodes.map((n: any) => n.width + 'x' + n.height).join())).toBe('110x50,110x50,110x50');
  await expect(d.locator('#plain_content')).toHaveAttribute('fill', '#ffe08a');
  expect(await inst(d, w => w.connectors[0].type + w.connectors[0].style.strokeWidth)).toBe('Straight3');
});

test('setNodeTemplate supplies the content of one node', async ({ app, page }) => {
  const d = fns(app);
  await expect(d.locator('#custom_text_text')).toHaveAttribute('aria-label', 'From setNodeTemplate');
  expect(await fn(page, 'setNodeTemplate')).toBeGreaterThan(0);
  await expect(d.locator('#plain_content')).toBeAttached();
});

test('getDescription is used while rendering', async ({ app, page }) => {
  const d = fns(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => typeof w.getDescription)).toBe('function');
  expect(await fn(page, 'getDescription')).toBeGreaterThan(0);
});

test('getCustomProperty adds custom members to the serialized diagram', async ({ app, page }) => {
  const d = fns(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await inst(d, w => { w.nodes[0].description = 'my note'; });
  const json = await inst(d, w => w.saveDiagram());
  expect(json).toContain('"description":"my note"');
  expect(await fn(page, 'getCustomProperty')).toBeGreaterThan(0);
});

test('getCustomCursor and customCursor decide the cursor', async ({ app, page }) => {
  const d = fns(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => w.getCursor('Drag', false))).toBe('copy');
  expect(await inst(d, w => w.getCursor('Rotate', false))).toBe('wait');
  await hover(page, await center(d.locator('#plain_content')));
  await expect.poll(() => fn(page, 'getCustomCursor')).toBeGreaterThan(0);
});

test('updateSelection runs after an undo and selects the restored object', async ({ app, page }) => {
  const d = fns(app);
  const at = await center(d.locator('#blank_content'));
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  await page.mouse.move(at.x + 50, at.y + 20, { steps: 6 });
  await page.mouse.up();
  await page.mouse.click(5, 5);
  await inst(d, w => w.undo());
  await expect.poll(() => fn(page, 'updateSelection')).toBeGreaterThan(0);
  await expect.poll(() => inst(d, w => w.selectedItems.nodes.map((n: any) => n.id).join())).toBe('blank');
});

test('user handle: custom tool and the four mouse events', async ({ app, page }) => {
  const d = fns(app);
  const at = await center(d.locator('#plain_content'));
  await page.mouse.click(at.x, at.y);
  const handle = d.locator('[id*="clone"]').first();
  await expect(handle).toBeAttached();
  const h = await center(handle);
  await hover(page, h);
  await expect.poll(() => eventCount(page, 'onUserHandleMouseEnter')).toBeGreaterThan(0);
  await page.mouse.down();
  await expect.poll(() => eventCount(page, 'onUserHandleMouseDown')).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(() => eventCount(page, 'onUserHandleMouseUp')).toBeGreaterThan(0);
  await expect.poll(() => fn(page, 'customToolMouseDown')).toBeGreaterThan(0);
  await page.mouse.move(h.x + 120, h.y + 120, { steps: 6 });
  await expect.poll(() => eventCount(page, 'onUserHandleMouseLeave')).toBeGreaterThan(0);
});
