import { test, expect } from './fixtures';
import { inst, center, drag, eventCount, eventLast } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('symbolPalette'));

const fn = (page, name: string) => page.evaluate((n) => ((window as any).__paletteFn || {})[n] || 0, name);
const fired = (page, name: string) => expect.poll(() => eventCount(page, 'pal:' + name), { message: name }).toBeGreaterThan(0);
const basic = (app) => app.section('palette-basic');
const palette = (app) => basic(app).getByTestId('palette-basic');
const target = (app) => basic(app).getByTestId('palette-target');

test('palettes render as accordion items, symbols use symbolWidth and symbolHeight', async ({ app }) => {
  const p = palette(app);
  await expect(p.locator('.e-acrdn-header')).toHaveCount(3);
  await expect(p.locator('.e-acrdn-header').nth(0)).toContainText('Flow shapes');
  await expect(p.locator('.e-acrdn-header').nth(1)).toContainText('Basic shapes');
  await expect(p.locator('#bTerminator_container')).toBeVisible();
  // symbolWidth 70 / symbolHeight 50 plus the 1px border
  await expect(p.locator('#bTerminator_container')).toHaveCSS('width', '71px');
  await expect(p.locator('#bTerminator_container')).toHaveCSS('height', '51px');
  await expect(p.locator('#bTerminator_container')).toHaveClass(/e-symbol-draggable/);
  const o = await inst(p, w => ({
    w: w.width, h: w.height, margin: w.symbolMargin.left, drag: w.allowDrag, search: w.enableSearch, anim: w.enableAnimation,
    mode: w.expandMode, key: w.accessKey, prev: w.symbolPreview.width + 'x' + w.symbolPreview.height,
    dragSize: w.symbolDragSize.width + 'x' + w.symbolDragSize.height
  }));
  expect(o).toEqual({ w: '220px', h: '380px', margin: 12, drag: true, search: false, anim: false, mode: 'Single', key: 'p', prev: '90x70', dragSize: '80x45' });
  await expect(p.locator('input.e-input')).toHaveCount(0);
});

test('expanding a palette raises paletteExpanding and, in Single mode, collapses the other', async ({ app, page }) => {
  const p = palette(app);
  await expect(p.locator('#bTerminator_container')).toBeVisible();
  await p.locator('.e-acrdn-header', { hasText: 'Basic shapes' }).click();
  await fired(page, 'paletteExpanding');
  expect(await eventLast(page, 'pal:paletteExpanding')).toMatchObject({ index: expect.any(Number), isExpanded: expect.any(Boolean) });
  await expect(p.locator('#bRectangle_container')).toBeVisible();
  await expect.poll(() => inst(p, w => w.palettes.map((x: any) => x.expanded).join())).toBe('false,true,false');
});

test('selecting a symbol raises paletteSelectionChange', async ({ app, page }) => {
  const p = palette(app);
  await p.locator('#bTerminator_container').click();
  await p.locator('#bProcess_container').click();
  await fired(page, 'paletteSelectionChange');
  expect(await eventLast(page, 'pal:paletteSelectionChange')).toMatchObject({ oldValue: 'bTerminator', newValue: 'bProcess' });
  expect(await inst(p, w => w.selectedSymbol.id)).toBe('bProcess');
});

test('dragging a symbol onto the diagram raises dragEnter, dragOver, drop and adds the node', async ({ app, page }) => {
  const p = palette(app);
  const d = target(app);
  await expect(p.locator('#bTerminator_container')).toBeVisible();
  const from = await center(p.locator('#bTerminator_container'));
  const to = await center(d.locator('[id$="_diagramLayer_svg"]'));
  await drag(page, from, { x: to.x, y: to.y }, 14);
  await fired(page, 'dragEnter');
  await fired(page, 'dragOver');
  await fired(page, 'drop');
  await expect.poll(() => inst(d, w => w.nodes.length)).toBe(1);
  expect(await inst(d, w => w.nodes[0].shape.shape)).toBe('Terminator');
  // symbolDragSize is the size the node is created with
  expect(await inst(d, w => w.nodes[0].width + 'x' + w.nodes[0].height)).toBe('80x45');
});

test('leaving the diagram while dragging raises dragLeave', async ({ app, page }) => {
  const p = palette(app);
  const d = target(app);
  await expect(p.locator('#bTerminator_container')).toBeVisible();
  const from = await center(p.locator('#bTerminator_container'));
  const to = await center(d.locator('[id$="_diagramLayer_svg"]'));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 12 });
  await page.mouse.move(to.x, to.y + 400, { steps: 12 });
  await page.mouse.up();
  await fired(page, 'dragLeave');
  expect(await inst(d, w => w.nodes.length)).toBe(0);
});

test('search: enableSearch, ignoreSymbolsOnSearch and filterSymbols', async ({ app, page }) => {
  const s = app.section('palette-search').getByTestId('palette-search');
  const input = s.locator('input.e-input');
  await expect(input).toBeVisible();
  await input.click();
  await input.pressSequentially('Proc');
  await expect(s.locator('[id$="SearchSymbol_container"]')).toHaveCount(1);
  await expect(s.locator('#sProcessSearchSymbol_container')).toBeVisible();
  expect(await fn(page, 'filterSymbols')).toBeGreaterThan(0);
  // Rectangle is listed in ignoreSymbolsOnSearch
  await input.fill('');
  await input.pressSequentially('Rect');
  await expect(s.locator('[id$="SearchSymbol_container"]')).toHaveCount(0);
  const o = await inst(s, w => ({ search: w.enableSearch, ignore: w.ignoreSymbolsOnSearch.join(), filter: typeof w.filterSymbols }));
  expect(o).toEqual({ search: true, ignore: 'sRectangle', filter: 'function' });
});

test('symbol info and defaults are applied to the symbols', async ({ app, page }) => {
  const s = app.section('palette-defaults').getByTestId('palette-defaults');
  await expect(s.locator('#dTerminator_container')).toBeVisible();
  expect(await fn(page, 'getNodeDefaults')).toBeGreaterThan(0);
  expect(await fn(page, 'getConnectorDefaults')).toBeGreaterThan(0);
  expect(await fn(page, 'getSymbolInfo')).toBeGreaterThan(0);
  const o = await inst(s, w => {
    const flow = w.palettes[0].symbols[0];
    const link = w.palettes[2].symbols[0];
    return { size: flow.width + 'x' + flow.height, fill: flow.style.fill, stroke: link.style.strokeColor, type: link.type, info: w.symbolInfo.width, hasFn: typeof w.getSymbolInfo };
  });
  expect(o).toEqual({ size: '60x40', fill: '#ffe08a', stroke: '#c0392b', type: 'Orthogonal', info: 40, hasFn: 'function' });
});

test('getSymbolTemplate and nodeTemplate render symbol content', async ({ app, page }) => {
  const f = app.section('palette-templates').getByTestId('palette-template-fn');
  await expect(f.locator('#tplA_container canvas')).toBeVisible();
  await expect(f.locator('#tplB_container canvas')).toBeVisible();
  expect(await fn(page, 'getSymbolTemplate')).toBeGreaterThan(0);
  const h = app.section('palette-templates').getByTestId('palette-template-html');
  await expect(h.locator('.palette-node-tpl').first()).toContainText('htmlA');
  expect(await inst(h, w => typeof w.nodeTemplate)).toBe('string');
});
