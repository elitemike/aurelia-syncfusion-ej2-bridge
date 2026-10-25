import { test, expect } from './fixtures';
import { inst, center, drag, hover, eventCount, eventLast } from './diagramHelpers';
import { pointOnPath } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const ev = (app) => app.section('diagram-events').getByTestId('diagram-events');
const fired = (page, name: string) => expect.poll(() => eventCount(page, 'ev:' + name), { message: name }).toBeGreaterThan(0);

async function ready(d) {
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await d.scrollIntoViewIfNeeded();
}

test('load, loaded, created, dataLoaded-free render and image load events', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  for (const name of ['load', 'created', 'onImageLoad']) { await fired(page, name); }
  expect(await eventLast(page, 'ev:onImageLoad')).toBeTruthy();
  // `loaded` is raised once a saved diagram was loaded back
  await inst(d, w => w.loadDiagram(w.saveDiagram()));
  await fired(page, 'loaded');
});

test('mouse events: enter, over, leave, click, double click, selection', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n1_content'));
  await hover(page, at);
  await fired(page, 'mouseEnter');
  await fired(page, 'mouseOver');
  await page.mouse.down();
  await page.mouse.up();
  await fired(page, 'click');
  await fired(page, 'selectionChange');
  expect(await inst(d, w => w.selectedItems.nodes[0].id)).toBe('n1');
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.dblclick(at.x, at.y);
  await fired(page, 'doubleClick');
  await page.keyboard.press('Escape');
  await page.mouse.move(at.x + 250, at.y + 100, { steps: 8 });
  await fired(page, 'mouseLeave');
});

test('dragging a node raises position, property and history events', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n3_content'));
  await drag(page, at, { x: at.x + 40, y: at.y + 30 });
  await fired(page, 'positionChange');
  await fired(page, 'propertyChange');
  await fired(page, 'historyChange');
  expect(await inst(d, w => w.getObject('n3').offsetX)).toBeGreaterThan(150);
});

test('resize and rotate handles raise sizeChange and rotateChange', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n4_content'));
  await page.mouse.click(at.x, at.y);
  const se = await center(d.locator('#resizeSouthEast'));
  await drag(page, se, { x: se.x + 30, y: se.y + 20 });
  await fired(page, 'sizeChange');
  expect(await inst(d, w => w.getObject('n4').width)).toBeGreaterThan(100);
  const rot = await center(d.locator('#rotateThumb'));
  await drag(page, rot, { x: rot.x + 60, y: rot.y + 40 });
  await fired(page, 'rotateChange');
  expect(await inst(d, w => w.getObject('n4').rotateAngle)).not.toBe(0);
});

test('connector end points: drag raises point and connection events', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const free = await center(d.locator('#free_path'));
  await page.mouse.click(free.x, free.y);
  const target = await center(d.locator('#connectorTargetThumb'));
  await drag(page, target, { x: target.x + 20, y: target.y + 40 });
  await fired(page, 'targetPointChange');
  const source = await center(d.locator('#connectorSourceThumb'));
  await drag(page, source, { x: source.x - 20, y: source.y + 20 });
  await fired(page, 'sourcePointChange');
  const target2 = await center(d.locator('#connectorTargetThumb'));
  const n4 = await center(d.locator('#n4_content'));
  await drag(page, target2, n4, 14);
  await fired(page, 'connectionChange');
  expect(await inst(d, w => w.getObject('free').targetID)).toBe('n4');
});

test('orthogonal segment thumb raises segmentChange and segmentCollectionChange', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const oc = await pointOnPath(d.locator('#oc_path'), 0.05);
  await page.mouse.click(oc.x, oc.y);
  const thumb = d.locator('#orthoThumb_2_1');
  await expect(thumb).toBeAttached();
  const t = await center(thumb);
  await drag(page, t, { x: t.x, y: t.y + 40 });
  await fired(page, 'segmentChange');
  const t2 = await center(d.locator('[id^="orthoThumb"]').first());
  await drag(page, t2, { x: t2.x - 20, y: t2.y + 90 });
  await fired(page, 'segmentCollectionChange');
});

test('keyboard and commands: keyDown, keyUp, commandExecute, collectionChange on delete', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n2_content'));
  await page.mouse.click(at.x, at.y);
  await page.keyboard.press('Control+c');
  await fired(page, 'keyDown');
  await fired(page, 'keyUp');
  const before = await inst(d, w => w.nodes.length);
  await page.keyboard.press('Delete');
  await fired(page, 'collectionChange');
  expect(await inst(d, w => w.nodes.length)).toBe(before - 1);
});

test('text edit event after editing a label', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n3_content'));
  await page.mouse.dblclick(at.x, at.y);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Edited');
  await page.mouse.click(5, 5);
  await fired(page, 'textEdit');
  expect(await inst(d, w => w.getObject('n3').annotations[0].content)).toBe('Edited');
});

test('mouse wheel zoom raises mouseWheel and scrollChange', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n1_content'));
  await page.mouse.move(at.x, at.y);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -200);
  await page.keyboard.up('Control');
  await fired(page, 'mouseWheel');
  await fired(page, 'scrollChange');
});

test('context menu events', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  const at = await center(d.locator('#n1_content'));
  await page.mouse.click(at.x, at.y);
  await page.mouse.click(at.x, at.y, { button: 'right' });
  await fired(page, 'contextMenuOpen');
  await fired(page, 'contextMenuBeforeItemRender');
  const hostId = await d.locator('.e-diagram').first().getAttribute('id');
  await page.locator(`#${hostId}_contextMenu_copy`).click();
  await fired(page, 'contextMenuClick');
});

test('export, import, ER entity change', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  await inst(d, w => { w.exportToVisio(); });
  await fired(page, 'diagramExporting');
  await inst(d, w => { w.importFromVisio(new Blob(['not a vsdx'])).catch(() => undefined); });
  await fired(page, 'diagramImporting');
  expect(await inst(d, w => w.addErField(w.getObject('er1'), { id: 'f3', name: 'Email', dataType: 'string' }))).toBe(true);
  await fired(page, 'erEntityChanged');
});

test('historyStateChange is raised when a custom history entry is undone and redone', async ({ app, page }) => {
  const d = ev(app);
  await ready(d);
  await inst(d, w => {
    w.historyManager.undo = () => undefined;
    w.historyManager.redo = () => undefined;
    w.addHistoryEntry({ type: 'Custom', category: 'Custom', undoObject: { note: 'before' }, redoObject: { note: 'after' } });
    w.undo();
  });
  await fired(page, 'historyStateChange');
  expect((await eventLast(page, 'ev:historyStateChange')).entryType).toBe('undo');
  await inst(d, w => { w.redo(); });
  await expect.poll(async () => (await eventLast(page, 'ev:historyStateChange')).entryType).toBe('redo');
});

test('commandExecute and beforeWebMcpToolExecute are delivered by the bridge', async ({ app, page }) => {
  // Diagram v35 declares these events but never raises them from its own code paths without WebMCP / the Blazor
  // wrapper, so raise them through the component's event system and assert the template handler receives the args.
  const d = ev(app);
  await ready(d);
  await inst(d, w => { w.trigger('commandExecute', { gesture: 'test', cancel: false }); });
  await fired(page, 'commandExecute');
  expect((await eventLast(page, 'ev:commandExecute')).gesture).toBe('test');
  await inst(d, w => { w.trigger('beforeWebMcpToolExecute', { toolName: 'x', cancel: false }); });
  await fired(page, 'beforeWebMcpToolExecute');
  expect((await eventLast(page, 'ev:beforeWebMcpToolExecute')).toolName).toBe('x');
});
