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
