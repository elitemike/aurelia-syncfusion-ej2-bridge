import { test, expect } from './fixtures';
import { callWidget, evArg, expectEvent, expectWidget, getVm, widgetValue } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

/** Scroll the content area of a grid by script and let the widget react to the scroll event. */
const scrollContent = (page: any, testId: string, top: number, left = 0) =>
  page.evaluate(([id, t, l]: [string, number, number]) => {
    const content = document.querySelector(`[data-testid="${id}"] .e-content`) as HTMLElement;
    content.scrollTop = t;
    content.scrollLeft = l;
  }, [testId, top, left]);

test('row virtualization renders only the visible rows', async ({ app, page }) => {
  const grid = app.section('grid-virtual');
  await expectWidget(page, 'grid-virtual', 'w.enableVirtualization', true);
  await expectWidget(page, 'grid-virtual', 'w.rowHeight', 36);
  const rendered = await grid.locator('.e-content tr.e-row').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(100);
  await scrollContent(page, 'grid-virtual', 36 * 300);
  await expect.poll(async () => Number(await grid.locator('.e-content tr.e-row').first().getAttribute('aria-rowindex'))).toBeGreaterThan(100);
});

test('column virtualization renders only the visible columns', async ({ app, page }) => {
  const grid = app.section('grid-column-virtual');
  await expectWidget(page, 'grid-column-virtual', 'w.enableColumnVirtualization', true);
  expect(await grid.locator('.e-headercell').count()).toBeLessThan(31);
  await expect(grid.locator('.e-headercell', { hasText: 'Field 25' })).toHaveCount(0);
  await scrollContent(page, 'grid-column-virtual', 0, 2500);
  await expect(grid.locator('.e-headercell', { hasText: 'Field 25' })).toBeAttached();
});

test('infinite scrolling appends blocks of rows', async ({ app, page }) => {
  const grid = app.section('grid-infinite');
  await expectWidget(page, 'grid-infinite', 'w.enableInfiniteScrolling', true);
  await expectWidget(page, 'grid-infinite', 'w.infiniteScrollSettings.initialBlocks', 2);
  await expectWidget(page, 'grid-infinite', 'w.infiniteScrollSettings.maxBlocks', 4);
  const initial = await grid.locator('.e-content tr.e-row').count(); // at least the 2 initial blocks of 10 rows
  expect(initial).toBeGreaterThanOrEqual(20);
  expect(initial).toBeLessThan(100);
  await scrollContent(page, 'grid-infinite', 100000);
  await expect.poll(() => grid.locator('.e-content tr.e-row').count()).toBeGreaterThan(initial);
});

test('DOM virtualization with setRowHeight and detailTemplateHeight', async ({ app, page }) => {
  const grid = app.section('grid-dom-virtual');
  await expectWidget(page, 'grid-dom-virtual', 'w.enableDomVirtualization', true);
  await expectWidget(page, 'grid-dom-virtual', 'w.domVirtualizationSettings.rowBuffer', 3);
  await expectWidget(page, 'grid-dom-virtual', 'w.detailTemplateHeight', 60);
  await expectWidget(page, 'grid-dom-virtual', 'typeof w.setRowHeight', 'function');
  const rendered = await grid.locator('.e-content tr.e-row').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(100);
  await expect.poll(() => getVm(page, 'grid-dom-virtual', 'rowHeightCalls')).toBeGreaterThan(0);
});

test('frozen rows and columns', async ({ app, page }) => {
  const grid = app.section('grid-frozen');
  await expectWidget(page, 'grid-frozen', 'w.getFrozenColumns()', 1);
  await expectWidget(page, 'grid-frozen', 'w.frozenRows', 1);
  await expect(grid.locator('.e-gridheader.e-frozenhdr')).toBeAttached();
  await expect(grid.locator('.e-frozenrow-border')).toBeAttached();
});

test('rowTemplate and pagerTemplate', async ({ app, page }) => {
  const grid = app.section('grid-templates');
  await expect(grid.locator('tr.tpl-row')).toHaveCount(4);
  await expect(grid.locator('tr.tpl-row').first()).toContainText('Order 10248');
  await expect(grid.locator('.pager-tpl')).toHaveText('Page 1 of 3');
  await expectWidget(page, 'grid-templates', 'typeof w.rowTemplate', 'string');
});

test('row drag and drop between grids', async ({ app, page }) => {
  const section = app.section('grid-dnd');
  await section.scrollIntoViewIfNeeded();
  // the drop target is the element id of the second grid, known only once it is rendered
  const targetId = await section.locator('[data-testid="grid-dnd-target"] .e-grid').getAttribute('id');
  await page.evaluate((id) => {
    const el: any = document.querySelector('[data-testid="grid-dnd-source"]');
    el.au['ej2-grid'].viewModel.bindingContext.dropSettings = { targetID: id };
  }, targetId);
  await expectWidget(page, 'grid-dnd-source', 'w.rowDropSettings.targetID', targetId);
  await expectWidget(page, 'grid-dnd-source', 'w.allowRowDragAndDrop', true);

  const source = section.locator('[data-testid="grid-dnd-source"] .e-content tr.e-row').nth(1).locator('td').nth(1);
  const target = section.locator('[data-testid="grid-dnd-target"] .e-gridcontent');
  await source.click();
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 5, from.y + from.height / 2 + 5, { steps: 3 });
  await page.mouse.move(to.x + to.width / 2, to.y + 20, { steps: 12 });
  await page.mouse.up();
  for (const name of ['rowDragStartHelper', 'rowDragStart', 'rowDrag', 'rowDrop']) {
    await expectEvent(page, `dnd.${name}`);
  }
  await expect(section.locator('[data-testid="grid-dnd-target"] .e-content tr.e-row')).toHaveCount(1);
  expect(await evArg(page, 'dnd.rowDrop', 'data.0.OrderID')).toBe(10249);
});

test('row and column spans merge equal neighbours', async ({ app, page }) => {
  const grid = app.section('grid-spans');
  await expectWidget(page, 'grid-spans', 'w.enableRowSpan', true);
  await expectWidget(page, 'grid-spans', 'w.enableColumnSpan', true);
  await expect(grid.locator('.e-content td[rowspan="2"]')).toHaveCount(1); // Team Alpha spans two rows
  await expect(grid.locator('.e-content td[colspan="2"]')).toHaveCount(1); // Role and Lead are both Dev
});

test('formulas with a custom function', async ({ app, page }) => {
  const grid = app.section('grid-formula');
  await expectWidget(page, 'grid-formula', 'w.formulaSettings.calculationMode', 'Automatic');
  await expectWidget(page, 'grid-formula', 'w.formulaSettings.allowBuiltInFunctions', true);
  const rows = grid.locator('.e-content tr.e-row');
  await expect(rows.nth(0).locator('td').nth(3)).toHaveText('5');
  await expect(rows.nth(1).locator('td').nth(3)).toHaveText('12');
  await expect(rows.nth(0).locator('td').nth(4)).toHaveText('4');
  await expect(rows.nth(1).locator('td').nth(4)).toHaveText('10');
});

test.describe('WebMCP', () => {
  test.beforeEach(async ({ page }) => {
    // a minimal WebMCP host: tools registered through document.modelContext are collected on window.__mcpTools
    await page.addInitScript(() => {
      (window as any).__mcpTools = [];
      (document as any).modelContext = { registerTool: (tool: any) => (window as any).__mcpTools.push(tool) };
    });
  });

  test('tools are registered and beforeWebMcpToolExecute is raised', async ({ app, page }) => {
    await app.open('grid');
    await expectWidget(page, 'grid-webmcp', 'w.enableWebMcp', true);
    await expectWidget(page, 'grid-webmcp', 'w.webMcpSettings.name', 'orders');
    await expect.poll(() => page.evaluate(() => (window as any).__mcpTools.map((t: any) => t.name).join())).toContain('orders_getSelectedRecords');
    await page.evaluate(() => (window as any).__mcpTools.find((t: any) => /getCurrentViewRecords$/.test(t.name)).execute({}));
    await expectEvent(page, 'mcp.beforeWebMcpToolExecute');
    expect(await evArg(page, 'mcp.beforeWebMcpToolExecute', 'toolName')).toBe('orders_getCurrentViewRecords');
  });
});

test('custom data binding: dataStateChange, columnDataStateChange and dataSourceChanged', async ({ app, page }) => {
  const grid = app.section('grid-custom');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(5);
  // the foreign key column is fed by the application too
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('Nancy');

  // adding a record is handed to the application, which completes the edit
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Add' }).click();
  await grid.locator('.e-addedrow input[name="OrderID"]').fill('99999');
  await grid.locator('.e-addedrow input[name="CustomerID"]').fill('NEWCO');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Update' }).click();
  await expectEvent(page, 'custom.dataSourceChanged');
  expect(await evArg(page, 'custom.dataSourceChanged', 'action')).toBe('add');
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('NEWCO');

  // paging asks the application for the next slice of data
  await grid.locator('.e-pager .e-numericitem', { hasText: '2' }).click();
  await expectEvent(page, 'custom.dataStateChange');
  expect(await evArg(page, 'custom.dataStateChange', 'skip')).toBe(5);
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('20004');
  // the foreign key column data is requested again for every data action
  await expectEvent(page, 'custom.columnDataStateChange');
  expect(await evArg(page, 'custom.columnDataStateChange', 'action.requestType')).toBe('paging');
});

test('lazy load grouping raises expand and collapse', async ({ app, page }) => {
  const grid = app.section('grid-lazy');
  await expectWidget(page, 'grid-lazy', 'w.groupSettings.enableLazyLoading', true);
  await grid.locator('.e-recordpluscollapse').first().click();
  await expectEvent(page, 'lazy.expand');
  await expect(grid.locator('.e-content tr.e-row').first()).toBeVisible();
  await grid.locator('.e-recordplusexpand').first().click();
  await expectEvent(page, 'lazy.collapse');
});

test('adaptive UI raises beforeOpenAdaptiveDialog', async ({ app, page }) => {
  const grid = app.section('grid-adaptive');
  await expectWidget(page, 'grid-adaptive', 'w.enableAdaptiveUI', true);
  await expectWidget(page, 'grid-adaptive', 'w.adaptiveUIMode', 'Mobile');
  await expectWidget(page, 'grid-adaptive', 'w.rowRenderingMode', 'Vertical');
  await grid.locator('.e-toolbar .e-responsive-toolbar-items .e-btn, .e-toolbar .e-tbar-btn').first().click();
  await expectEvent(page, 'adaptive.beforeOpenAdaptiveDialog');
  expect(await widgetValue(page, 'grid-adaptive', 'w.enableAdaptiveUI')).toBe(true);
  await callWidget(page, 'grid-adaptive', 'Promise.resolve()');
});
