import { test, expect } from './fixtures';
import { expectEvent, expectWidget, widgetValue, evArg, getVm, evCount } from './bridgeHelpers';

const TAG = 'ej2-pivot-view';
const ew = (page, id: string, expr: string, expected: unknown) => expectWidget(page, TAG, id, expr, expected);
const wv = (page, id: string, expr: string) => widgetValue(page, TAG, id, expr);
const reset = (page) => page.evaluate(() => { (window as any).__bridgeEvents = {}; });
const axes = (page, id: string, key: string) => page.evaluate(([i, k]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  const d = el.au['ej2-pivot-view'].viewModel.bindingContext[k];
  return { rows: d.rows.map((r: any) => r.name), columns: d.columns.map((r: any) => r.name), values: d.values.map((r: any) => r.name) };
}, [id, key]);

/** Drag with the mouse from the centre of `from` to the centre of `to` in small steps (Syncfusion draggables need real moves). */
async function drag(page, from, to, offset = { x: 10, y: 5 }) {
  await from.scrollIntoViewIfNeeded();
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  await page.mouse.move(a.x + offset.x, a.y + offset.y);
  await page.mouse.down();
  await page.mouse.move(a.x + offset.x + 10, a.y + offset.y + 5, { steps: 3 });
  await page.mouse.move(b.x + 20, b.y + 10, { steps: 10 });
  await page.mouse.up();
}

test.beforeEach(async ({ app }) => app.open('pivotView'));

test('renders the pivot table with grouping bar and raises the load events', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await expect(pv.locator('.e-pivotview')).toBeVisible();
  await expect(pv.locator('.e-grouping-bar')).toBeVisible();
  await expect(pv.locator('.e-toggle-field-list')).toBeVisible();
  await expect(pv.locator('.e-group-rows .e-pivot-button')).toHaveCount(2);
  await expect(pv.locator('.e-headercontent th', { hasText: 'FY 2022' })).toBeVisible();
  for (const name of ['load', 'enginePopulating', 'enginePopulated', 'dataBound', 'created', 'queryCellInfo', 'headerCellInfo',
    'beforeColumnsRender']) {
    await expectEvent(page, `pv.${name}`);
  }
  // only raised because the wrapper assigns property handlers for them
  await expectEvent(page, 'pv.aggregateCellInfo');
  await expectEvent(page, 'pv.onHeadersSort');
});

test('property bindings reach the widget', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await ew(page, 'pv-core', 'w.height', 420);
  await ew(page, 'pv-core', 'w.width', '100%');
  await ew(page, 'pv-core', 'w.cssClass', 'pv-class');
  await expect(pv.locator('.e-pivotview')).toHaveClass(/pv-class/);
  await ew(page, 'pv-core', 'w.showGroupingBar', true);
  await ew(page, 'pv-core', 'w.showFieldList', true);
  await ew(page, 'pv-core', 'w.gridSettings.columnWidth', 140);
  await ew(page, 'pv-core', 'w.gridSettings.allowResizing', true);
  await ew(page, 'pv-core', 'w.groupingBarSettings.showSortIcon', true);
  await ew(page, 'pv-core', 'w.showTooltip', true);
  await ew(page, 'pv-core', 'w.showValuesButton', true);
  await ew(page, 'pv-core', 'w.enableValueSorting', true);
  await ew(page, 'pv-core', 'w.allowCalculatedField', true);
  await ew(page, 'pv-core', 'w.enableFieldSearching', true);
  await ew(page, 'pv-core', 'w.currencyCode', 'USD');
  await ew(page, 'pv-core', 'w.aggregateTypes', ['Sum', 'Count', 'Avg', 'Max']);
  await ew(page, 'pv-core', 'w.maxNodeLimitInMemberEditor', 40);
  await ew(page, 'pv-core', 'w.loadOnDemandInMemberEditor', true);
  await ew(page, 'pv-core', 'w.enableHtmlSanitizer', true);
  await ew(page, 'pv-core', 'w.allowDeferLayoutUpdate', false);
  await ew(page, 'pv-core', 'w.allowDataCompression', false);
  // the Values button sits next to the column fields (showValuesButton)
  await expect(pv.locator('.e-group-columns .e-pivot-button')).toHaveCount(2);
});

test('pivotValues is reported to the view-model (from-view)', async ({ page }) => {
  await expect.poll(() => getVm(page, TAG, 'pv-core', 'pivotValues').then((v) => Array.isArray(v) && v.length)).toBeGreaterThan(3);
  const same = await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pv-core"]');
    const vm = el.au['ej2-pivot-view'].viewModel;
    return vm.bindingContext.pivotValues === vm.widget.pivotValues;
  });
  expect(same).toBe(true);
});

test('selection raises the cell and row selection events', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  await pv.locator('td.e-valuescontent').first().click();
  for (const name of ['cellSelecting', 'selecting', 'selected', 'cellSelected', 'rowSelected', 'cellClick']) {
    await expectEvent(page, `pv.${name}`);
  }
  await expect(pv.locator('td.e-valuescontent.e-cellselectionbackground, td.e-valuescontent.e-selectionbackground').first()).toBeAttached();
  await reset(page);
  await pv.locator('td.e-valuescontent').nth(5).click();
  await expectEvent(page, 'pv.rowDeselected');
  await reset(page);
  await pv.locator('td.e-rowsheader').first().click();
  await expectEvent(page, 'pv.cellDeselected');
});

test('resizing a column raises resizing and resizeStop', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  const rh = pv.locator('.e-headercontent .e-rhandler').first();
  await rh.scrollIntoViewIfNeeded();
  const r = (await rh.boundingBox())!;
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  await page.mouse.down();
  await page.mouse.move(r.x + 40, r.y + r.height / 2, { steps: 6 });
  await page.mouse.up();
  await expectEvent(page, 'pv.resizing');
  await expectEvent(page, 'pv.resizeStop');
});

test('reordering value columns raises the column drag events', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  const heads = pv.locator('.e-headercontent th.e-headercell', { hasText: 'Units Sold' });
  await drag(page, heads.nth(0), heads.nth(1), { x: 20, y: 10 });
  await expectEvent(page, 'pv.columnDragStart');
  await expectEvent(page, 'pv.columnDrag');
  await expectEvent(page, 'pv.columnDrop');
});

test('drilling raises drill and actionBegin / actionComplete', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  await pv.locator('.e-expand').first().click();
  await expectEvent(page, 'pv.actionBegin');
  await expectEvent(page, 'pv.drill');
  await expectEvent(page, 'pv.actionComplete');
  expect(await evArg(page, 'pv.drill', 'drillInfo.fieldName')).toBe('Country');
  await expect(pv.locator('.e-collapse').first()).toBeVisible();
});

test('grouping bar sort, filter and remove', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  await pv.locator('.e-group-rows .e-sort').first().click();
  await expectEvent(page, 'pv.actionBegin');
  await expectEvent(page, 'pv.actionComplete');
  await reset(page);
  await pv.locator('.e-group-rows .e-pv-filter').first().click();
  await expectEvent(page, 'pv.memberEditorOpen');
  await page.locator('.e-member-editor-dialog .e-ok-btn').click();
  await expectEvent(page, 'pv.memberFiltering');
  await reset(page);
  await pv.locator('.e-group-rows .e-pivot-button', { hasText: 'Products' }).locator('.e-remove').click();
  await expectEvent(page, 'pv.fieldRemove');
  await expect.poll(async () => (await axes(page, 'pv-core', 'dsr')).rows).toEqual(['Country']);
});

test('dragging in the grouping bar updates the vm (widget -> vm)', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  const src = pv.locator('.e-group-rows .e-pivot-button', { hasText: 'Products' }).locator('.e-draggable').first();
  await drag(page, src, pv.locator('.e-group-columns').first());
  await expectEvent(page, 'pv.fieldDragStart');
  await expectEvent(page, 'pv.fieldDrop');
  await expectEvent(page, 'pv.onFieldDropped');
  expect(await evArg(page, 'pv.onFieldDropped', 'fieldName')).toBe('Products');
  await expect.poll(async () => (await axes(page, 'pv-core', 'dsr')).columns).toContain('Products');
  await ew(page, 'pv-core', 'w.dataSourceSettings.columns.map(c => c.name).indexOf("Products") > -1', true);
});

test('aggregate menu raises aggregateMenuOpen', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await reset(page);
  await pv.locator('.e-group-values .e-pivot-button').first().locator('.e-dropdown-icon').click();
  await expectEvent(page, 'pv.aggregateMenuOpen');
});

test('field list dialog adds a field and raises fieldListRefreshed', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await pv.locator('.e-toggle-field-list').click();
  const dlg = page.locator('.e-pivotfieldlist-container.e-popup-open');
  await expect(dlg).toBeVisible();
  await reset(page);
  await dlg.locator('.e-field-list-tree .e-list-item', { hasText: 'Quarter' }).locator('.e-checkbox-wrapper').click();
  await expectEvent(page, 'pv.fieldDrop');
  await expectEvent(page, 'pv.fieldListRefreshed');
  await expect.poll(async () => (await axes(page, 'pv-core', 'dsr')).rows).toContain('Quarter');
});

test('calculated field dialog raises calculatedFieldCreate', async ({ app, page }) => {
  const pv = app.section('pv-core');
  await pv.locator('.e-toggle-field-list').click();
  await page.locator('.e-pivotfieldlist-container.e-popup-open .e-calculated-field').click();
  const dlg = page.locator('.e-pivot-calc-dialog-div.e-popup-open');
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-pivot-calc-input').pressSequentially('Double');
  await dlg.locator('.e-pivot-formula').pressSequentially('"Sum(Sold)" * 2');
  await dlg.locator('.e-footer-content .e-primary').click();
  await expectEvent(page, 'pv.calculatedFieldCreate');
});

test('actionFailure reaches the host element', async ({ page }) => {
  // there is no stable user gesture that makes the engine fail, raise it the way the widget does
  await reset(page);
  await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pv-core"]');
    el.au['ej2-pivot-view'].viewModel.widget.actionFailureMethod(new Error('boom'));
  });
  await expectEvent(page, 'pv.actionFailure');
  expect(await evArg(page, 'pv.actionFailure', 'errorInfo.message')).toBe('boom');
});

test('vm dataSourceSettings change updates the widget (vm -> widget)', async ({ app, page }) => {
  await page.getByTestId('pv-replace').click();
  await ew(page, 'pv-core', 'w.dataSourceSettings.rows.length', 1);
  await ew(page, 'pv-core', 'w.dataSourceSettings.columns.length', 0);
  await expect(app.section('pv-core').locator('.e-group-rows .e-pivot-button')).toHaveCount(1);
});

test('destroyed is raised when the control is removed', async ({ page }) => {
  await page.getByTestId('pv-toggle').click();
  await expect(page.getByTestId('pv-destroyed')).toHaveText('1');
});

// ---------------------------------------------------------------------------------------------------------------
// Toolbar, reports, export and formatting

const toolbarItem = (app, title: string) => app.section('pvt-toolbar').locator(`.e-toolbar-item[title="${title}"]`);
const templateItem = (app, index: number) => app.section('pvt-toolbar').locator('.e-toolbar-item.e-template').nth(index);

async function reportDialog(page, app, title: string, name: string) {
  await toolbarItem(app, title).click();
  const dlg = page.locator('.e-pivotview-report-dialog.e-popup-open');
  await expect(dlg).toBeVisible();
  await dlg.locator('input').fill(name);
  await dlg.locator('.e-footer-content .e-primary').click();
  await expect(dlg).toHaveCount(0);
}

test('toolbar renders the configured items and raises toolbarRender', async ({ app, page }) => {
  const tb = app.section('pvt-toolbar').locator('.e-toolbar');
  await expect(tb).toBeVisible();
  await expect(tb.locator('.e-toolbar-item')).toHaveCount(14);
  await expectEvent(page, 'pvt.toolbarRender');
  await ew(page, 'pvt-toolbar', 'w.showToolbar', true);
  await ew(page, 'pvt-toolbar', 'w.toolbar.length', 14);
  await ew(page, 'pvt-toolbar', 'w.showFieldList', true);
  await ew(page, 'pvt-toolbar', 'w.allowExcelExport', true);
  await ew(page, 'pvt-toolbar', 'w.allowPdfExport', true);
  await ew(page, 'pvt-toolbar', 'w.exportAllPages', true);
  await ew(page, 'pvt-toolbar', 'w.allowConditionalFormatting', true);
  await ew(page, 'pvt-toolbar', 'w.allowNumberFormatting', true);
  await ew(page, 'pvt-toolbar', 'w.allowCalculatedField', true);
});

test('toolbar clicks raise toolbarClick', async ({ app, page }) => {
  await reset(page);
  await toolbarItem(app, 'Rename a current report').click();
  await expectEvent(page, 'pvt.toolbarClick');
  expect(await evArg(page, 'pvt.toolbarClick', 'item.id')).toContain('rename');
});

test('report management: new, save as, save, rename, load and remove', async ({ app, page }) => {
  await reset(page);
  await reportDialog(page, app, 'Create a new report', 'Report A');
  await expectEvent(page, 'pvt.fetchReport');
  await expectEvent(page, 'pvt.newReport');
  await expectEvent(page, 'pvt.saveReport');
  expect(await evArg(page, 'pvt.saveReport', 'reportName')).toBe('Report A');
  await expect(page.getByTestId('pvt-reports')).toHaveText('2');

  await reset(page);
  await reportDialog(page, app, 'Save as current report', 'Report B');
  await expectEvent(page, 'pvt.saveReport');
  expect(await evArg(page, 'pvt.saveReport', 'reportName')).toBe('Report B');
  expect(await evArg(page, 'pvt.saveReport', 'report')).toContain('dataSourceSettings');
  await expect(page.getByTestId('pvt-reports')).toHaveText('3');

  await reset(page);
  await toolbarItem(app, 'Save a report').click();
  await expectEvent(page, 'pvt.saveReport');

  await reset(page);
  await reportDialog(page, app, 'Rename a current report', 'Report C');
  await expectEvent(page, 'pvt.renameReport');
  expect(await evArg(page, 'pvt.renameReport', 'reportName')).toBe('Report B');
  expect(await evArg(page, 'pvt.renameReport', 'rename')).toBe('Report C');

  await reset(page);
  await templateItem(app, 0).click();
  await page.locator('.e-popup-open li', { hasText: 'Report A' }).first().click();
  await expectEvent(page, 'pvt.loadReport');
  expect(await evArg(page, 'pvt.loadReport', 'reportName')).toBe('Report A');

  await reset(page);
  await toolbarItem(app, 'Delete a current report').click();
  await page.locator('.e-pivot-error-dialog.e-popup-open .e-ok-btn').click();
  await expectEvent(page, 'pvt.removeReport');
  await expect(page.getByTestId('pvt-reports')).toHaveText('2');
});

test('exports to Excel, CSV and PDF raise the export events', async ({ app, page }) => {
  await reset(page);
  for (const [label, file] of [['Excel', /\.xlsx$/], ['CSV', /\.csv$/], ['PDF', /\.pdf$/]] as const) {
    await templateItem(app, 2).click();
    const download = page.waitForEvent('download');
    await page.locator('.e-popup-open li', { hasText: label }).first().click();
    expect((await download).suggestedFilename()).toMatch(file);
  }
  for (const name of ['beforeExport', 'beforeExcelExport', 'excelQueryCellInfo', 'excelHeaderQueryCellInfo', 'pdfHeaderQueryCellInfo',
    'pdfQueryCellInfo', 'onPdfCellRender', 'exportComplete']) {
    await expectEvent(page, `pvt.${name}`);
  }
});

test('beforePdfExport reaches the host element', async ({ page }) => {
  // the pivot table has its own PDF writer, the inner grid event is never raised by a user gesture
  await reset(page);
  await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pvt-toolbar"]');
    el.au['ej2-pivot-view'].viewModel.widget.trigger('beforePdfExport', { cancel: false });
  });
  await expectEvent(page, 'pvt.beforePdfExport');
});

test('conditional formatting dialog applies a format and raises conditionalFormatting', async ({ app, page }) => {
  await reset(page);
  await toolbarItem(app, 'Conditional formatting').click();
  const dlg = page.locator('.e-pivot-formatting-dialog.e-popup-open');
  await dlg.locator('.e-format-condition-button').click();
  await expect(dlg.locator('.e-format-outer-div')).toBeVisible();
  await dlg.locator('.e-format-apply-button').click();
  await expectEvent(page, 'pvt.conditionalFormatting');
  await ew(page, 'pvt-toolbar', 'w.dataSourceSettings.conditionalFormatSettings.length', 1);
});

test('number formatting dialog applies a format and raises numberFormatting', async ({ app, page }) => {
  await reset(page);
  await toolbarItem(app, 'Number Formatting').click();
  const dlg = page.locator('.e-dialog.e-popup-open', { hasText: 'Number Formatting' });
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-footer-content .e-primary').click();
  await expectEvent(page, 'pvt.numberFormatting');
});

test('sub totals menu hides the row sub totals', async ({ app, page }) => {
  await templateItem(app, 3).click();
  await page.locator('.e-popup-open li', { hasText: 'Show subtotals columns only' }).first().click();
  await ew(page, 'pvt-toolbar', 'w.dataSourceSettings.showRowSubTotals', false);
});

// ---------------------------------------------------------------------------------------------------------------
// Pivot chart

test('chart renders next to the table and raises the render events', async ({ app, page }) => {
  const pv = app.section('pvc-main');
  await expect(pv.locator('.e-pivotchart svg').first()).toBeVisible();
  await expect(pv.locator('[id*="_Series_0_Point_"]')).toHaveCount(8);
  await ew(page, 'pvc-main', 'w.displayOption.view', 'Both');
  await ew(page, 'pvc-main', 'w.displayOption.primary', 'Chart');
  await ew(page, 'pvc-main', 'w.chartSettings.title', 'Sales analysis');
  await ew(page, 'pvc-main', 'w.chartSettings.chartSeries.type', 'Column');
  await ew(page, 'pvc-main', 'w.chartTypes', ['Column', 'Bar', 'Line', 'Area']);
  for (const name of ['chartSeriesCreated', 'chartLoad', 'chartLoaded', 'animationComplete', 'seriesRender', 'legendRender',
    'chartAxisLabelRender', 'multiLevelLabelRender', 'pointRender', 'textRender']) {
    await expectEvent(page, `pvc.${name}`);
  }
});

test('chart toolbar offers the configured chart types', async ({ app, page }) => {
  const pv = app.section('pvc-main');
  await pv.locator('.e-toolbar-item.e-template').nth(0).click();
  const items = page.locator('.e-popup-open li');
  await expect(items.filter({ hasText: /^(Column|Bar|Line|Area)$/ })).toHaveCount(4);
  await items.filter({ hasText: /^Line$/ }).click();
  await expect.poll(() => wv(page, 'pvc-main', 'w.chartSettings.chartSeries.type')).toBe('Line');
});

test('hovering and clicking a point raises the pointer events', async ({ app, page }) => {
  const pv = app.section('pvc-main');
  const point = pv.locator('[id*="_Series_0_Point_"]').first();
  await reset(page);
  await point.hover();
  for (const name of ['chartMouseMove', 'pointMove', 'chartTooltipRender']) { await expectEvent(page, `pvc.${name}`); }
  await reset(page);
  await point.click();
  for (const name of ['chartMouseDown', 'chartMouseUp', 'chartMouseClick', 'chartPointClick']) { await expectEvent(page, `pvc.${name}`); }
  await reset(page);
  await page.mouse.move(2, 2);
  await expectEvent(page, 'pvc.chartMouseLeave');
});

test('legend click raises chartLegendClick', async ({ app, page }) => {
  await reset(page);
  await app.section('pvc-main').locator('[id*="legend_text_0"]').first().click();
  await expectEvent(page, 'pvc.chartLegendClick');
});

test('multi level label click raises multiLevelLabelClick', async ({ app, page }) => {
  await reset(page);
  await app.section('pvc-main').locator('[id*="MultiLevelLabel_Level_0_Text_0"]').first().click({ force: true });
  await expectEvent(page, 'pvc.multiLevelLabelClick');
});

test('drag zooming and scrolling raise zoomComplete and the scroll events', async ({ app, page }) => {
  const pv = app.section('pvc-main');
  await reset(page);
  await pv.locator('.e-pivotchart svg').first().scrollIntoViewIfNeeded();
  const b = (await pv.locator('.e-pivotchart svg').first().boundingBox())!;
  await page.mouse.move(b.x + 100, b.y + 100);
  await page.mouse.down();
  await page.mouse.move(b.x + 250, b.y + 200, { steps: 8 });
  await page.mouse.up();
  await expectEvent(page, 'pvc.zoomComplete');
  const thumb = pv.locator('[id$="scrollBarThumb_primaryXAxis"]').first();
  await expect(thumb).toBeAttached();
  const t = (await thumb.boundingBox())!;
  await reset(page);
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2);
  await page.mouse.down();
  await page.mouse.move(t.x + t.width / 2 + 40, t.y + t.height / 2, { steps: 6 });
  await page.mouse.up();
  for (const name of ['scrollStart', 'scrollChanged', 'scrollEnd']) { await expectEvent(page, `pvc.${name}`); }
});

test('resizing the window raises chartResized', async ({ page }) => {
  await reset(page);
  await page.setViewportSize({ width: 800, height: 700 });
  await expectEvent(page, 'pvc.chartResized');
});

test('printing the chart raises beforePrint', async ({ page }) => {
  // the print window is not interesting here, close it as soon as it opens
  page.on('popup', (popup) => { popup.close().catch(() => { }); });
  await reset(page);
  await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pvc-main"]');
    el.au['ej2-pivot-view'].viewModel.widget.chart.print();
  });
  await expectEvent(page, 'pvc.beforePrint');
});

test('dragComplete reaches the host element and the selection mode is applied', async ({ page }) => {
  await ew(page, 'pvc-drag', 'w.displayOption.view', 'Chart');
  await ew(page, 'pvc-drag', 'w.chartSettings.selectionMode', 'DragXY');
  await ew(page, 'pvc-drag', 'w.chart.selectionMode', 'DragXY');
  // the Syncfusion drag selection did not start from synthetic mouse input in headless Chromium, so the event is
  // raised the way the inner chart raises it
  await reset(page);
  await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pvc-drag"]');
    el.au['ej2-pivot-view'].viewModel.widget.chart.trigger('dragComplete', { name: 'dragComplete', selectedDataValues: [], cancel: false });
  });
  await expectEvent(page, 'pvd.dragComplete');
});

// ---------------------------------------------------------------------------------------------------------------
// Virtual scrolling and paging

test('virtual scrolling renders only the rows in view and loads more while scrolling', async ({ app, page }) => {
  const pv = app.section('pvl-virtual');
  await pv.scrollIntoViewIfNeeded();
  await ew(page, 'pvl-virtual', 'w.enableVirtualization', true);
  await ew(page, 'pvl-virtual', 'w.virtualScrollSettings.allowSinglePage', false);
  await ew(page, 'pvl-virtual', 'w.engineModule.rowCount > 700', true);
  const rows = pv.locator('.e-content tr.e-row');
  await expect.poll(() => rows.count()).toBeLessThan(80);
  const first = async () => (await rows.first().locator('td').first().textContent()) ?? '';
  const before = await first();
  expect(before).toContain('Region 01');
  await pv.locator('.e-content').first().evaluate((el) => { el.scrollTop = 12000; });
  await expect.poll(first).not.toBe(before);
  expect(await first()).not.toContain('Region 01');
});

test('paging shows one page of rows and columns and the pager navigates', async ({ app, page }) => {
  const pv = app.section('pvl-paging');
  await pv.scrollIntoViewIfNeeded();
  await ew(page, 'pvl-paging', 'w.enablePaging', true);
  await ew(page, 'pvl-paging', 'w.pageSettings.rowPageSize', 20);
  await ew(page, 'pvl-paging', 'w.pageSettings.columnPageSize', 4);
  await ew(page, 'pvl-paging', 'w.pagerSettings.position', 'Bottom');
  await expect(pv.locator('.e-pivot-pager')).toBeVisible();
  await expect(pv.locator('.e-pivot-pager-bottom')).toBeVisible();
  await expect(pv.locator('.e-pivot-pager-row-maindiv')).toContainText('of 37');
  await expect(pv.locator('.e-pivot-pager-column-maindiv')).toContainText('of 4');
  const firstCell = pv.locator('.e-content tr.e-row').first().locator('td').first();
  await expect(firstCell).toContainText('Region 01');
  const firstRow = pv.locator('.e-content tr.e-row').first();
  const before = await firstRow.textContent();
  await pv.locator('.e-pivot-pager-column-maindiv .e-nextpage').click();
  await ew(page, 'pvl-paging', 'w.pageSettings.currentColumnPage', 2);
  await pv.locator('.e-pivot-pager-row-maindiv .e-nextpage').click();
  await ew(page, 'pvl-paging', 'w.pageSettings.currentRowPage', 2);
  await expect.poll(() => firstRow.textContent()).not.toBe(before);
});

// ---------------------------------------------------------------------------------------------------------------
// Drill through and editing

test('drill through lists the records behind a value cell', async ({ app, page }) => {
  const pv = app.section('pve-drill');
  await pv.scrollIntoViewIfNeeded();
  await ew(page, 'pve-drill', 'w.allowDrillThrough', true);
  await ew(page, 'pve-drill', 'w.maxRowsInDrillThrough', 5);
  await reset(page);
  await pv.locator('td.e-valuescontent').first().dblclick();
  const dlg = page.locator('.e-drillthrough-dialog.e-popup-open');
  await expect(dlg).toBeVisible();
  await expect(dlg.locator('.e-drillthrough-body-header-value').first()).toHaveText('Canada');
  await expect(dlg.locator('.e-content tr.e-row')).toHaveCount(6);
  await expectEvent(page, 'pve.drillThrough');
  await expectEvent(page, 'pve.beginDrillThrough');
});

test('editing a record in the drill through dialog raises editCompleted and updates the table', async ({ app, page }) => {
  const pv = app.section('pve-edit');
  await pv.scrollIntoViewIfNeeded();
  await ew(page, 'pve-edit', 'w.editSettings.allowEditing', true);
  await ew(page, 'pve-edit', 'w.editSettings.allowAdding', true);
  await ew(page, 'pve-edit', 'w.editSettings.allowDeleting', true);
  await ew(page, 'pve-edit', 'w.editSettings.allowCommandColumns', true);
  const cell = pv.locator('td.e-valuescontent').first();
  const before = Number(await cell.textContent());
  await cell.dblclick();
  const dlg = page.locator('.e-drillthrough-dialog.e-popup-open');
  await expect(dlg.locator('.e-toolbar-item[title="Add"]')).toBeVisible();
  const row = dlg.locator('.e-content tr.e-row').first();
  await row.locator('.e-editbutton').click();
  const sold = dlg.locator('.e-editedrow .e-numerictextbox').first();
  await sold.fill('77');
  await sold.press('Tab');
  await reset(page);
  await row.locator('.e-savebutton').click();
  await expect(row).toContainText('77');
  await dlg.locator('.e-dlg-closeicon-btn').first().click();
  await expectEvent(page, 'pve.editCompleted');
  await expect(dlg).toHaveCount(0);
  await expect.poll(async () => Number(await cell.textContent())).not.toBe(before);
});

test('deleting a record in the drill through dialog removes it from the table', async ({ app, page }) => {
  const pv = app.section('pve-edit');
  await pv.scrollIntoViewIfNeeded();
  const cell = pv.locator('td.e-valuescontent').first();
  const before = Number(await cell.textContent());
  await cell.dblclick();
  const dlg = page.locator('.e-drillthrough-dialog.e-popup-open');
  await reset(page);
  await dlg.locator('.e-content tr.e-row').first().locator('.e-deletebutton').click();
  await dlg.locator('.e-dlg-closeicon-btn').first().click();
  await expectEvent(page, 'pve.editCompleted');
  await expect.poll(async () => Number(await cell.textContent())).toBeLessThan(before);
});

test('inline editing raises editCompleted', async ({ app, page }) => {
  const pv = app.section('pve-inline');
  await pv.scrollIntoViewIfNeeded();
  await ew(page, 'pve-inline', 'w.editSettings.allowInlineEditing', true);
  await reset(page);
  await pv.locator('td.e-valuescontent').filter({ hasText: /^[0-9]+$/ }).first().dblclick();
  await expectEvent(page, 'pve.inline.editCompleted');
});
