import { test, expect } from './fixtures';
import { evArg, evCount, expectEvent, expectWidget, widgetValue, callWidget, getVm, setVm } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('lifecycle and data events fire for the main grid', async ({ app, page }) => {
  const grid = app.section('grid-default');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(5);
  for (const name of ['load', 'beforeDataBound', 'dataBound', 'actionBegin', 'actionComplete']) {
    if (name.startsWith('action')) { continue; } // raised by actions only, see below
    await expectEvent(page, `main.${name}`);
  }
  // one raise per rendered row / cell / header cell
  await expect.poll(() => evCount(page, 'main.rowDataBound')).toBe(5);
  await expect.poll(() => evCount(page, 'main.queryCellInfo')).toBe(20);
  await expect.poll(() => evCount(page, 'main.headerCellInfo')).toBe(4);
  expect(await evArg(page, 'main.rowDataBound', 'data.OrderID')).toBe(10252);

  // paging is an action: actionBegin then actionComplete with the request type
  await grid.locator('.e-pager .e-numericitem', { hasText: '2' }).click();
  await expectEvent(page, 'main.actionBegin');
  await expectEvent(page, 'main.actionComplete');
  expect(await evArg(page, 'main.actionComplete', 'requestType')).toBe('paging');
});

test('selection and click events', async ({ app, page }) => {
  const grid = app.section('grid-default');
  const rows = grid.locator('.e-content tr.e-row');
  await rows.nth(0).click();
  await expectEvent(page, 'main.rowSelecting');
  await expect.poll(() => evCount(page, 'main.recordClick')).toBe(1);
  await rows.nth(1).click(); // single selection: the previous row is deselected
  await expectEvent(page, 'main.rowDeselecting');
  await expectEvent(page, 'main.rowDeselected');
  expect(await evArg(page, 'main.rowDeselected', 'data.OrderID')).toBe(10248);
  await rows.nth(2).dblclick();
  await expectEvent(page, 'main.recordDoubleClick');
  expect(await evArg(page, 'main.recordDoubleClick', 'rowData.OrderID')).toBe(10250);
});

test('keyboard events: cellFocus and keyPressed', async ({ app, page }) => {
  const grid = app.section('grid-default');
  await grid.locator('.e-content tr.e-row').nth(0).locator('td').nth(1).click();
  await expectEvent(page, 'main.cellFocus');
  const focused = await evCount(page, 'main.cellFocus');
  await page.keyboard.press('ArrowRight');
  await expectEvent(page, 'main.keyPressed');
  await expect.poll(() => evCount(page, 'main.cellFocus')).toBeGreaterThan(focused);
});

test('allowKeyboard, allowMultiSorting, enableHeaderFocus reach the widget', async ({ app, page }) => {
  await expectWidget(page, 'grid-main', 'w.allowKeyboard', true);
  await expectWidget(page, 'grid-main', 'w.enableHeaderFocus', true);
  const grid = app.section('grid-default');
  await grid.locator('.e-headercell', { hasText: 'Customer ID' }).click();
  await grid.locator('.e-headercell', { hasText: 'Freight' }).click({ modifiers: ['Control'] });
  await expectWidget(page, 'grid-main', 'w.sortSettings.columns.map(c => c.field).join()', 'CustomerID,Freight');
});

test('currentViewData is reported back (fromView)', async ({ app, page }) => {
  await expect.poll(() => widgetValue(page, 'grid-main', 'w.currentViewData.length')).toBe(5);
  await expect.poll(() => page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="grid-main"]');
    const vd = el.au['ej2-grid'].viewModel.bindingContext.viewData;
    return vd && vd.map((r: any) => r.OrderID).join();
  })).toBe('10248,10249,10250,10251,10252');
  await app.section('grid-default').locator('.e-pager .e-numericitem', { hasText: '2' }).click();
  await expect.poll(() => page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="grid-main"]');
    return el.au['ej2-grid'].viewModel.bindingContext.viewData[0].OrderID;
  })).toBe(10253);
});

test('destroyed event fires when the widget is destroyed', async ({ page }) => {
  // the wrapper destroys the widget on detach; destroying it directly while attached lets the DOM event reach the handler
  await callWidget(page, 'grid-main', 'w.destroy()');
  await expect.poll(() => evCount(page, 'main.destroyed')).toBe(1);
});

test('created event reaches the handler', async ({ page }) => {
  await expect.poll(() => getVm(page, 'grid-main', 'created')).toBe(true);
});

test('model changes: dataSource, pageSettings and columns', async ({ app, page }) => {
  const grid = app.section('grid-default');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(5);
  await setVm(page, 'grid-main', 'pageSettings', { pageSize: 3 });
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(3);
  await setVm(page, 'grid-main', 'gridDataSource', [
    { OrderID: 1, CustomerID: 'AAA', Freight: 1, OrderDate: '2020-01-01' },
    { OrderID: 2, CustomerID: 'BBB', Freight: 2, OrderDate: '2020-01-02' }
  ]);
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(2);
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('AAA');
  await setVm(page, 'grid-main', 'gridColumns', [{ field: 'OrderID', headerText: 'Order ID' }, { field: 'CustomerID', headerText: 'Customer' }]);
  await expect(grid.locator('.e-headercell')).toHaveCount(2);
  await setVm(page, 'grid-main', 'selectionSettings', { type: 'Multiple' });
  await expectWidget(page, 'grid-main', 'w.selectionSettings.type', 'Multiple');
});

test('model changes: groupSettings, filterSettings and toolbar', async ({ app, page }) => {
  const group = app.section('grid-group');
  await expect(group.locator('.e-groupcaption').first()).toContainText('Ship Country');
  await setVm(page, 'grid-group', 'groupSettings', { columns: ['CustomerID'] });
  await expect(group.locator('.e-groupcaption').first()).toContainText('Customer ID');

  const filter = app.section('grid-filter');
  await setVm(page, 'grid-filter', 'filterSettings', {
    type: 'FilterBar',
    columns: [{ field: 'CustomerID', matchCase: false, operator: 'equal', predicate: 'and', value: 'HANAR' }]
  });
  await expect(filter.locator('.e-content tr.e-row')).toHaveCount(2);

  const toolbar = app.section('grid-toolbar').locator('[data-testid="grid-toolbar"]');
  await setVm(page, 'grid-toolbar', 'toolbar', [{ text: 'Pong', id: 'pong-item' }]);
  await expect(toolbar.locator('.e-toolbar-item', { hasText: 'Pong' })).toBeVisible();
});
