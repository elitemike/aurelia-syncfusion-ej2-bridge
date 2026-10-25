import { test, expect } from './fixtures';
import { inst, center, drag, hover } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const section = (app) => app.section('diagram-dynamic');
const dyn = (app) => section(app).getByTestId('diagram-dynamic');
const click = (app, id: string) => section(app).getByTestId(id).click();

test('width and height follow the view model', async ({ app }) => {
  const d = dyn(app);
  await expect(d.locator('.e-diagram').first()).toHaveCSS('width', '500px');
  await click(app, 'dyn-size');
  await expect.poll(() => inst(d, w => w.width + ',' + w.height)).toBe('420px,260px');
  await expect(d.locator('.e-diagram').first()).toHaveCSS('width', '420px');
  await expect(d.locator('.e-diagram').first()).toHaveCSS('height', '260px');
});

test('backgroundColor and pageSettings update the page background', async ({ app }) => {
  const d = dyn(app);
  await click(app, 'dyn-bg');
  await expect.poll(() => inst(d, w => w.backgroundColor)).toBe('#ffe9e9');
  await click(app, 'dyn-page');
  await expect.poll(() => inst(d, w => w.pageSettings.width)).toBe(450);
  await expect(d.locator('[id$="_backgroundLayerrect"]')).toHaveAttribute('width', '450');
});

test('snapSettings and rulerSettings add the grid and the rulers', async ({ app }) => {
  const d = dyn(app);
  await expect(d.locator('[id$="_hRuler"]')).toHaveCount(0);
  await click(app, 'dyn-snap');
  await expect.poll(() => inst(d, w => w.snapSettings.constraints)).toBe(3);
  await expect(d.locator('[id$="_gridline"]')).toBeAttached();
  await click(app, 'dyn-ruler');
  await expect(d.locator('[id$="_hRuler"]')).toBeVisible();
  await expect(d.locator('[id$="_vRuler"]')).toBeVisible();
});

test('scrollSettings zoom the diagram', async ({ app }) => {
  const d = dyn(app);
  await click(app, 'dyn-scroll');
  await expect.poll(() => inst(d, w => w.scrollSettings.currentZoom)).toBe(0.5);
  await expect.poll(() => inst(d, w => w.scroller.currentZoom)).toBe(0.5);
});

test('tool switches the diagram to pan mode and the mouse then scrolls the canvas', async ({ app, page }) => {
  const d = dyn(app);
  await click(app, 'dyn-tool');
  await expect.poll(() => inst(d, w => w.tool)).toBe(4);
  const start = await center(d.locator('[id$="_diagramLayer_svg"]'));
  const before = await inst(d, w => w.scroller.horizontalOffset + ',' + w.scroller.verticalOffset);
  await drag(page, start, { x: start.x - 60, y: start.y - 40 });
  await expect.poll(() => inst(d, w => w.scroller.horizontalOffset + ',' + w.scroller.verticalOffset)).not.toBe(before);
});

test('constraints without UserInteraction block dragging, tooltip text and context menu follow', async ({ app, page }) => {
  const d = dyn(app);
  const at = await center(d.locator('#a'));
  await click(app, 'dyn-constraints');
  await expect.poll(() => inst(d, w => !!(w.constraints & 16))).toBe(false);
  await drag(page, at, { x: at.x + 40, y: at.y + 40 });
  expect(await inst(d, w => w.nodes[0].offsetX)).toBe(100);
  expect(await inst(d, w => w.selectedItems.nodes.length)).toBe(0);
});

test('tooltip content changes', async ({ app, page }) => {
  const d = dyn(app);
  await hover(page, await center(d.locator('#b')));
  await expect(page.locator('.e-diagram-tooltip')).toHaveText('first tooltip');
  await click(app, 'dyn-tooltip');
  await expect.poll(() => inst(d, w => w.tooltip.content)).toBe('second tooltip');
  await page.mouse.move(5, 5);
  await expect(page.locator('.e-diagram-tooltip')).toHaveCount(0);
  await hover(page, await center(d.locator('#b')));
  await expect(page.locator('.e-diagram-tooltip')).toHaveText('second tooltip');
});

test('contextMenuSettings.show turns the context menu off', async ({ app, page }) => {
  const d = dyn(app);
  await click(app, 'dyn-menu');
  await expect.poll(() => inst(d, w => w.contextMenuSettings.show)).toBe(false);
  const at = await center(d.locator('#a'));
  await page.mouse.move(at.x, at.y);
  await page.mouse.click(at.x, at.y, { button: 'right' });
  await expect(page.locator('.e-contextmenu-wrapper .e-menu-parent:visible')).toHaveCount(0);
});

test('nodes: a new array moves the nodes', async ({ app }) => {
  const d = dyn(app);
  expect(await inst(d, w => w.nodes[0].offsetY)).toBe(60);
  await click(app, 'dyn-nodes');
  await expect.poll(() => inst(d, w => w.nodes[0].offsetY)).toBe(160);
  expect(await inst(d, w => w.getObject('a').wrapper.offsetY)).toBe(160);
});

test('bridgeDirection, segment thumbs, addInfo and enableRtl', async ({ app }) => {
  const d = dyn(app);
  await click(app, 'dyn-bridge');
  await expect.poll(() => inst(d, w => w.bridgeDirection)).toBe('Right');
  await click(app, 'dyn-thumb');
  await expect.poll(() => inst(d, w => w.segmentThumbShape + w.segmentThumbSize)).toBe('Circle20');
  await click(app, 'dyn-info');
  await expect.poll(() => inst(d, w => w.addInfo.owner)).toBe('changed');
  await click(app, 'dyn-rtl');
  await expect.poll(() => inst(d, w => w.enableRtl)).toBe(true);
});
