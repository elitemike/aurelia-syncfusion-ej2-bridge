import { test, expect } from './fixtures';
import { inst, center, drag, hover, eventCount } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const basic = (app) => app.section('diagram-basic').getByTestId('diagram-basic');
const props = (app) => app.section('diagram-props').getByTestId('diagram-props');

test('flowchart renders nodes and connectors with the defaults applied', async ({ app }) => {
  const d = basic(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => w.nodes.length)).toBe(4);
  expect(await inst(d, w => w.connectors.length)).toBe(3);
  // nodeDefaults and connectorDefaults reach every object
  expect(await inst(d, w => w.nodes.map((n: any) => n.width + 'x' + n.height + ':' + n.style.fill).join())).toBe(Array(4).fill('100x50:#6ba5d7').join());
  expect(await inst(d, w => w.connectors.every((c: any) => c.type === 'Orthogonal' && c.style.strokeWidth === 2))).toBe(true);
  await expect(d.locator('#start_content')).toHaveAttribute('fill', '#6ba5d7');
  await expect(d.locator('g[id^="start_"] text').first()).toHaveText('Start');
  expect(await inst(d, w => w.addInfo.owner)).toBe('demo');
  expect(await inst(d, w => w.backgroundColor)).toBe('#f6f8fa');
  expect(await inst(d, w => w.mode)).toBe('SVG');
});

test('width, height, mode, flags and options reach the diagram', async ({ app }) => {
  const d = props(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect(d.locator('.e-diagram').first()).toHaveCSS('width', '640px');
  await expect(d.locator('.e-diagram').first()).toHaveCSS('height', '360px');
  const o = await inst(d, w => ({
    w: w.width, h: w.height, split: w.enableConnectorSplit, collab: w.enableCollaborativeEditing, mcp: w.enableWebMcp,
    mcpName: w.webMcpSettings.name, mode: w.mode, shape: w.segmentThumbShape, size: w.segmentThumbSize, bridge: w.bridgeDirection,
    bg: w.backgroundColor, add: w.addInfo.owner, inv: w.diagramSettings.inversedAlignment, limit: w.scrollSettings.scrollLimit,
    auto: w.scrollSettings.canAutoScroll, prevent: w.serializationSettings.preventDefaults
  }));
  expect(o).toEqual({
    w: '640px', h: '360px', split: true, collab: false, mcp: false, mcpName: 'demo-diagram', mode: 'SVG', shape: 'Square', size: 12,
    bridge: 'Left', bg: '#eef4ff', add: 'demo', inv: true, limit: 'Infinity', auto: false, prevent: true
  });
});

test('rulerSettings draws the rulers, snapSettings the grid, pageSettings the page', async ({ app }) => {
  const d = props(app);
  await expect(d.locator('[id$="_hRuler"]')).toBeVisible();
  await expect(d.locator('[id$="_vRuler"]')).toBeVisible();
  // the diagram rulers are Syncfusion rulers: interval 10 ticks per segment
  await expect(d.locator('[id$="_hRuler"] .e-ruler-segment').first().locator('.e-ruler-tick')).toHaveCount(10);
  await expect(d.locator('[id$="_gridline"]')).toBeAttached();
  await expect(d.locator('[id$="_pattern"]')).toBeAttached();
  const page = d.locator('[id$="_backgroundLayerrect"]');
  await expect(page).toHaveAttribute('width', '500');
  await expect(page).toHaveAttribute('height', '320');
  await expect(page).toHaveAttribute('fill', '#ffffff');
  expect(await inst(d, w => w.pageSettings.showPageBreaks)).toBe(true);
  expect(await inst(d, w => w.snapSettings.horizontalGridlines.lineColor)).toBe('#d0d0d0');
  expect(await inst(d, w => w.rulerSettings.showRulers)).toBe(true);
});

test('basicElements are drawn on the canvas', async ({ app }) => {
  const d = props(app);
  await expect(d.locator('#basicText_text')).toHaveText('Basic element');
  expect(await inst(d, w => w.basicElements.length)).toBe(1);
});

test('constraints and tool flags, selector constraints, layers and the command manager', async ({ app, page }) => {
  const d = props(app);
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  // Default | Bridging | Tooltip
  expect(await inst(d, w => w.constraints)).toBe(502 | 8);
  expect(await inst(d, w => w.tool)).toBe(3);
  expect(await inst(d, w => w.layers.map((l: any) => l.id + ':' + l.objects.join('+')).join())).toBe('default_layer:decision+end+c1+c2+c3,layer1:start+process');
  // the rotate handle is removed from the selector
  const pc = await center(d.locator('#process'));
  await page.mouse.click(pc.x, pc.y);
  expect(await inst(d, w => w.selectedItems.nodes.length)).toBe(1);
  expect(await inst(d, w => !!(w.selectedItems.constraints & 2048))).toBe(false);
  // a registered keyboard gesture runs the custom command
  await page.keyboard.press('Control+Shift+Q');
  await expect.poll(() => page.evaluate(() => (window as any).__customCommand || 0)).toBeGreaterThan(0);
});

test('tooltip content shows while hovering a node', async ({ app, page }) => {
  const d = props(app);
  await hover(page, await center(d.locator('#decision')));
  await expect(page.locator('.e-diagram-tooltip')).toHaveText('Diagram tooltip');
  expect(await inst(d, w => w.tooltip.position)).toBe('BottomRight');
});

test('contextMenuSettings adds a custom item to the context menu', async ({ app, page }) => {
  const d = props(app);
  const at = await center(d.locator('#process'));
  await page.mouse.move(at.x, at.y);
  await page.mouse.click(at.x, at.y, { button: 'right' });
  await expect(page.locator('.e-contextmenu li', { hasText: 'Say hello' })).toBeVisible();
});

test('historyManager.stackLimit caps the undo stack and constraints UndoRedo drives undo', async ({ app, page }) => {
  const d = props(app);
  expect(await inst(d, w => w.historyManager.stackLimit)).toBe(4);
  const at = await center(d.locator('#end'));
  for (let i = 0; i < 6; i++) {
    await drag(page, { x: at.x + (i % 2 ? -40 : 0), y: at.y }, { x: at.x + (i % 2 ? 0 : -40), y: at.y });
  }
  await expect.poll(() => inst(d, w => w.historyManager.undoStack.length)).toBeGreaterThan(0);
  expect(await inst(d, w => w.historyManager.undoStack.length)).toBeLessThanOrEqual(4);
  const before = await inst(d, w => w.nodes.find((n: any) => n.id === 'end').offsetX);
  await page.keyboard.press('Control+z');
  await expect.poll(() => inst(d, w => w.nodes.find((n: any) => n.id === 'end').offsetX)).not.toBe(before);
});

test('tool and drawingObject: a rectangle is drawn with the mouse', async ({ app, page }) => {
  const d = props(app);
  const section = app.section('diagram-props');
  await section.getByTestId('props-draw').click();
  await expect.poll(() => inst(d, w => w.tool)).toBe(8);
  expect(await inst(d, w => w.drawingObject.shape.shape)).toBe('Rectangle');
  const before = await inst(d, w => w.nodes.length);
  const at = await center(d.locator('#end'));
  await drag(page, { x: at.x - 150, y: at.y + 50 }, { x: at.x - 70, y: at.y + 90 });
  await expect.poll(() => inst(d, w => w.nodes.length)).toBe(before + 1);
  expect(await inst(d, w => w.nodes[w.nodes.length - 1].shape.shape)).toBe('Rectangle');
  await expect.poll(() => eventCount(page, 'elementDraw')).toBeGreaterThan(0);
  await expect.poll(() => inst(d, w => w.tool & 8)).toBe(0);
});

test('created event reaches the template', async ({ page }) => {
  await expect.poll(() => eventCount(page, 'created')).toBeGreaterThan(0);
});
