import { test, expect } from './fixtures';
import { callWidget, evArg, expectEvent, expectWidget } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('column chooser: settings and events', async ({ app, page }) => {
  const grid = app.section('grid-chooser');
  await expectWidget(page, 'grid-chooser', 'w.columnChooserSettings.enableSearching', true);
  await grid.locator('.e-toolbar .e-tbar-btn').first().click();
  await expectEvent(page, 'chooser.toolbarClick');
  await expectEvent(page, 'chooser.beforeOpenColumnChooser');
  expect(await evArg(page, 'chooser.toolbarClick', 'item.id')).toContain('columnchooser');
  await expect(page.locator('.e-ccdlg .e-cc-searchdiv, .e-ccdlg .e-ccsearch, .e-ccdlg input[type="text"]').first()).toBeVisible();
});

test('reorder: column drag events', async ({ app, page }) => {
  const grid = app.section('grid-reorder');
  await grid.scrollIntoViewIfNeeded();
  const from = await grid.locator('.e-headercell', { hasText: 'Order ID' }).boundingBox();
  const to = await grid.locator('.e-headercell', { hasText: 'Freight' }).boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();
  await expectEvent(page, 'reorder.columnDragStart');
  await expectEvent(page, 'reorder.columnDrag');
  await expectEvent(page, 'reorder.columnDrop');
  await expectWidget(page, 'grid-reorder', 'w.getColumns()[3].field', 'OrderID');
  await expect(grid.locator('.e-headercell').nth(3)).toContainText('Order ID');
});

test('resize: resizeStart, resizing and resizeStop', async ({ app, page }) => {
  const grid = app.section('grid-reorder');
  await grid.scrollIntoViewIfNeeded();
  const handle = await grid.locator('.e-headercell', { hasText: 'Customer ID' }).locator('.e-rhandler').boundingBox();
  await expectWidget(page, 'grid-reorder', 'w.getColumns()[1].width', 140);
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + 60, handle.y + handle.height / 2, { steps: 8 });
  await page.mouse.up();
  await expectEvent(page, 'reorder.resizeStart');
  await expectEvent(page, 'reorder.resizing');
  await expectEvent(page, 'reorder.resizeStop');
  await expectWidget(page, 'grid-reorder', 'parseInt(w.getColumns()[1].width, 10) > 140', true);
  await expectWidget(page, 'grid-reorder', 'w.resizeSettings.mode', 'Normal');
});

test('column menu: items and events', async ({ app, page }) => {
  const grid = app.section('grid-menus');
  await grid.locator('.e-headercell', { hasText: 'Customer ID' }).locator('.e-columnmenu').click();
  await expectEvent(page, 'menus.columnMenuOpen');
  await expect(page.locator('.e-colmenu .e-menu-item', { hasText: 'Custom item' })).toBeVisible();
  await page.locator('.e-colmenu .e-menu-item', { hasText: 'Custom item' }).click();
  await expectEvent(page, 'menus.columnMenuClick');
  expect(await evArg(page, 'menus.columnMenuClick', 'item.id')).toBe('custom-col-item');
  await expectEvent(page, 'menus.columnMenuClose');
});

test('context menu: items and events', async ({ app, page }) => {
  const grid = app.section('grid-menus');
  await grid.locator('.e-content tr.e-row').nth(1).locator('td').nth(1).click({ button: 'right' });
  await expectEvent(page, 'menus.contextMenuOpen');
  await page.locator('.e-contextmenu-wrapper .e-menu-item', { hasText: 'Custom action' }).click();
  await expectEvent(page, 'menus.contextMenuClick');
  expect(await evArg(page, 'menus.contextMenuClick', 'item.id')).toBe('custom-ctx-item');
  await expectEvent(page, 'menus.contextMenuClose');
});

test('toolbar: toolbarClick and toolbarTemplate', async ({ app, page }) => {
  const grid = app.section('grid-toolbar');
  await grid.locator('[data-testid="grid-toolbar"] .e-toolbar-item', { hasText: 'Ping' }).click();
  await expectEvent(page, 'toolbar.toolbarClick');
  expect(await evArg(page, 'toolbar.toolbarClick', 'item.id')).toBe('ping-item');
  await expect(grid.locator('[data-testid="grid-toolbar-template"] .toolbar-tpl-text')).toHaveText('Custom toolbar');
});

test('excel filter: custom filter dialog raises beforeCustomFilterOpen', async ({ app, page }) => {
  const grid = app.section('grid-excel-filter');
  await grid.locator('.e-headercell', { hasText: 'Customer ID' }).locator('.e-filtermenudiv').click();
  const dialog = page.locator('.e-excelfilter');
  await expect(dialog).toBeVisible();
  await dialog.locator('.e-menu-item', { hasText: 'Text Filters' }).first().hover();
  await page.locator('.e-contextmenu-wrapper .e-menu-item', { hasText: 'Custom Filter' }).click();
  await expectEvent(page, 'excel.beforeCustomFilterOpen');
});

test('advanced filter: dialog open, apply and close events', async ({ app, page }) => {
  const grid = app.section('grid-advanced-filter');
  await expectWidget(page, 'grid-advanced-filter', 'w.allowAdvancedFiltering', true);
  await expectWidget(page, 'grid-advanced-filter', 'w.advancedFilterSettings.includeHiddenColumns', false);
  await grid.locator('.e-toolbar .e-toolbar-item[title="Filter"]').click();
  await expectEvent(page, 'advanced.open');
  const dialog = page.locator('.e-advanced-filter-dialog, .e-dialog:has(.e-query-builder)').first();
  await expect(dialog).toBeVisible();
  expect(await evArg(page, 'advanced.open', 'requestType')).toBe('advancedFilterOpen');

  // applying a rule while the dialog is open closes it, then raises begin and complete and filters the rows
  await callWidget(page, 'grid-advanced-filter', "w.advancedFilterModule.applyFilter({ condition: 'and', rules: [{ field: 'CustomerID', label: 'Customer ID', type: 'string', operator: 'equal', value: 'HANAR' }] })");
  await expectEvent(page, 'advanced.close');
  await expectEvent(page, 'advanced.begin');
  await expectEvent(page, 'advanced.complete');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(2);
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('HANAR');
});
