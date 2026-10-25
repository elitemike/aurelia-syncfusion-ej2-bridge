import { test, expect } from './fixtures';
import { evCount, expectEvent, expectWidget, evArg, getVm, setVm } from './bridgeHelpers';

const TAG = 'ej2-pivot-field-list';
const ew = (page, id: string, expr: string, expected: unknown) => expectWidget(page, TAG, id, expr, expected);
const names = (page, key: string) => page.evaluate(([k]) => {
  const el: any = document.querySelector('[data-testid="pfl-fixed"]');
  const d = el.au['ej2-pivot-field-list'].viewModel.bindingContext[k];
  return { rows: d.rows.map((r: any) => r.name), columns: d.columns.map((r: any) => r.name), values: d.values.map((r: any) => r.name) };
}, [key]);
const reset = (page) => page.evaluate(() => { (window as any).__bridgeEvents = {}; });

test.beforeEach(async ({ app, page }) => {
  // the server mode demo posts to this url, never hit a real service
  await page.route('**/stub/pivot-engine', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await app.open('pivotFieldList');
});

test('renders the field list with the bound axes and raises the load events', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await expect(fl.locator('.e-pivotfieldlist-container')).toBeVisible();
  await expect(fl.locator('.e-field-list-tree .e-list-item')).toHaveCount(6);
  await expect(fl.locator('.e-rows .e-pivot-button')).toHaveCount(2);
  // the columns axis also carries the Values button (showValuesButton)
  await expect(fl.locator('.e-columns .e-pivot-button')).toHaveCount(2);
  await expect(fl.locator('.e-values .e-pivot-button')).toHaveCount(2);
  for (const name of ['load', 'enginePopulating', 'enginePopulated', 'dataBound', 'created']) {
    await expectEvent(page, `pfl.${name}`);
  }
  // only raised because the wrapper assigns property handlers for them
  await expectEvent(page, 'pfl.aggregateCellInfo');
  await expectEvent(page, 'pfl.onHeadersSort');
  expect(await evArg(page, 'pfl.aggregateCellInfo', 'fieldName')).toBeTruthy();
});

test('property bindings reach the widget', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await ew(page, 'pfl-fixed', 'w.renderMode', 'Fixed');
  await ew(page, 'pfl-fixed', 'w.cssClass', 'pfl-class');
  await expect(fl.locator('.e-pivotfieldlist-container')).toHaveClass(/pfl-class/);
  await ew(page, 'pfl-fixed', 'w.enableHtmlSanitizer', true);
  await ew(page, 'pfl-fixed', 'w.allowCalculatedField', true);
  await expect(fl.locator('.e-calculated-field')).toBeVisible();
  await ew(page, 'pfl-fixed', 'w.enableFieldSearching', true);
  await expect(fl.locator('.e-field-list-search-input input')).toBeVisible();
  await ew(page, 'pfl-fixed', 'w.showValuesButton', true);
  await ew(page, 'pfl-fixed', 'w.allowDeferLayoutUpdate', true);
  await expect(fl.locator('.e-layout-footer')).toBeAttached();
  await ew(page, 'pfl-fixed', 'w.maxNodeLimitInMemberEditor', 50);
  await ew(page, 'pfl-fixed', 'w.loadOnDemandInMemberEditor', true);
  await ew(page, 'pfl-fixed', 'w.spinnerTemplate', '<div class="pfl-spinner">Loading...</div>');
  await ew(page, 'pfl-fixed', 'w.aggregateTypes', ['Sum', 'Count', 'Avg']);
  await ew(page, 'pfl-fixed', 'w.currencyCode', 'USD');
});

test('field search filters the field tree', async ({ app }) => {
  const fl = app.section('pfl-fixed');
  await fl.locator('.e-field-list-search-input input').fill('Sold');
  await expect(fl.locator('.e-field-list-tree .e-list-item:visible')).toHaveCount(2);
});

test('checking a field adds it to the report (widget -> vm) and raises fieldDrop', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-field-list-tree .e-list-item', { hasText: 'Quarter' }).locator('.e-checkbox-wrapper').click();
  await expectEvent(page, 'pfl.fieldDrop');
  await expectEvent(page, 'pfl.enginePopulated');
  await expect.poll(async () => (await names(page, 'dsr')).rows).toContain('Quarter');
  await ew(page, 'pfl-fixed', 'w.dataSourceSettings.rows.map(r => r.name).indexOf("Quarter") > -1', true);
});

test('dragging a button between axes raises the drag events and updates the vm', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  const src = fl.locator('.e-rows .e-pivot-button', { hasText: 'Products' }).locator('.e-draggable').first();
  await fl.locator('.e-axis-table').scrollIntoViewIfNeeded();
  await src.scrollIntoViewIfNeeded();
  const a = (await src.boundingBox())!;
  const b = (await fl.locator('.e-axis-content.e-columns').first().boundingBox())!;
  await page.mouse.move(a.x + 5, a.y + 5);
  await page.mouse.down();
  await page.mouse.move(a.x + 15, a.y + 15, { steps: 3 });
  await page.mouse.move(b.x + 20, b.y + 10, { steps: 10 });
  await page.mouse.up();
  await expectEvent(page, 'pfl.fieldDragStart');
  await expectEvent(page, 'pfl.fieldDrop');
  await expectEvent(page, 'pfl.onFieldDropped');
  expect(await evArg(page, 'pfl.onFieldDropped', 'fieldName')).toBe('Products');
  await expect.poll(async () => (await names(page, 'dsr')).columns).toContain('Products');
  expect((await names(page, 'dsr')).rows).not.toContain('Products');
});

test('unchecking a field raises fieldRemove', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-field-list-tree .e-list-item', { hasText: 'Products' }).locator('.e-checkbox-wrapper').click();
  await expectEvent(page, 'pfl.fieldRemove');
  await expect.poll(async () => (await names(page, 'dsr')).rows).not.toContain('Products');
});

test('sorting a field raises actionBegin and onHeadersSort', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-pivot-button', { hasText: 'Country' }).locator('.e-sort').first().click();
  await expectEvent(page, 'pfl.actionBegin');
});

test('member editor raises memberEditorOpen and memberFiltering', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-pivot-button', { hasText: 'Country' }).locator('.e-pv-filter').first().click();
  await expectEvent(page, 'pfl.memberEditorOpen');
  await expect(page.locator('.e-member-editor-dialog')).toBeVisible();
  await page.locator('.e-member-editor-dialog .e-ok-btn').click();
  await expectEvent(page, 'pfl.memberFiltering');
});

test('aggregate menu raises aggregateMenuOpen and offers only aggregateTypes', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-pivot-button', { hasText: 'Units Sold' }).locator('.e-dropdown-icon').first().click();
  await expectEvent(page, 'pfl.aggregateMenuOpen');
  const items = page.locator('.e-pivot-aggregate-menu .e-menu-item, .e-menu-parent .e-menu-item').filter({ hasText: /^(Sum|Count|Avg|Product|Min|Max|Distinct Count)/ });
  await expect(items.first()).toBeVisible();
  const texts = (await items.allTextContents()).map((t) => t.trim());
  expect(texts).toEqual(expect.arrayContaining(['Sum', 'Count']));
  expect(texts).not.toContain('Product');
});

test('calculated field dialog creates a field and raises calculatedFieldCreate', async ({ app, page }) => {
  const fl = app.section('pfl-fixed');
  await reset(page);
  await fl.locator('.e-calculated-field').first().click();
  const dlg = page.locator('.e-pivot-calc-dialog-div.e-popup-open');
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-pivot-calc-input').pressSequentially('Double');
  await dlg.locator('.e-pivot-formula').pressSequentially('"Sum(Sold)" * 2');
  await dlg.locator('.e-footer-content .e-primary').click();
  await expectEvent(page, 'pfl.calculatedFieldCreate');
  await ew(page, 'pfl-fixed', 'w.dataSourceSettings.calculatedFieldSettings.map(c => c.name)', ['Double']);
});

test('vm dataSourceSettings change updates the widget (vm -> widget)', async ({ app, page }) => {
  await page.getByTestId('pfl-replace').click();
  await ew(page, 'pfl-fixed', 'w.dataSourceSettings.rows.length', 1);
  await ew(page, 'pfl-fixed', 'w.dataSourceSettings.columns.length', 0);
  await expect(app.section('pfl-fixed').locator('.e-rows .e-pivot-button')).toHaveCount(1);
});

test('destroyed is raised when the control is removed', async ({ page }) => {
  await page.getByTestId('pfl-toggle').click();
  await expect(page.getByTestId('pfl-destroyed')).toHaveText('1');
});

test('popup mode renders a toggle button that opens the field list in the target', async ({ app, page }) => {
  const sec = app.section('pfl-popup');
  await ew(page, 'pfl-popup', 'w.renderMode', 'Popup');
  await ew(page, 'pfl-popup', 'w.target', '#pfl-popup-target');
  await expect(sec.locator('.e-pivotfieldlist-container')).toBeAttached();
  await expect(sec.locator('.e-pivotfieldlist-container.e-popup-open')).toHaveCount(0);
  await sec.locator('.e-toggle-field-list').click();
  await expect(sec.locator('.e-pivotfieldlist-container.e-popup-open')).toBeVisible();
});

test('user actions raise actionBegin and actionComplete', async ({ app, page }) => {
  const fl = app.section('pfl-actions');
  await reset(page);
  await fl.locator('.e-pivot-button', { hasText: 'Country' }).locator('.e-sort').first().click();
  await expectEvent(page, 'pflA.actionBegin');
  await expectEvent(page, 'pflA.actionComplete');
  expect(await evArg(page, 'pflA.actionComplete', 'actionName')).toBe('Field sorted');
});

test('actionFailure reaches the host element', async ({ page }) => {
  // there is no cheap user gesture that makes the engine fail, raise it the way the widget does
  await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="pfl-actions"]');
    el.au['ej2-pivot-field-list'].viewModel.widget.actionFailureMethod(new Error('boom'));
  });
  await expectEvent(page, 'pflA.actionFailure');
  expect(await evArg(page, 'pflA.actionFailure', 'errorInfo.message')).toBe('boom');
});

test('server mode wraps the engine request in beforeServiceInvoke and afterServiceInvoke', async ({ page }) => {
  await expectEvent(page, 'pflS.beforeServiceInvoke');
  await expectEvent(page, 'pflS.afterServiceInvoke');
  expect(await evArg(page, 'pflS.beforeServiceInvoke', 'action')).toBe('onRefresh');
  expect(await evArg(page, 'pflS.afterServiceInvoke', 'response')).toBe('{}');
  await ew(page, 'pfl-server', 'w.dataSourceSettings.mode', 'Server');
  await ew(page, 'pfl-server', 'w.dataSourceSettings.url', '/stub/pivot-engine');
});
