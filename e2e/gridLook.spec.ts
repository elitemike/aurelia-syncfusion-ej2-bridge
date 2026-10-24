import { test, expect } from './fixtures';
import { expectWidget, setVm, widgetValue } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('look: cssClass, gridLines, alt rows, hover, heights and width', async ({ app, page }) => {
  const section = app.section('grid-look');
  const grid = section.locator('.e-grid');
  await expect(grid).toHaveClass(/my-grid/);
  await expect(grid).toHaveClass(/e-bothlines/);
  await expect(grid).toHaveClass(/e-gridhover/);
  await expect(section.locator('tr.e-altrow')).toHaveCount(0);
  await expect(section.locator('.e-content tr.e-row').first()).toHaveCSS('height', '60px');
  await expect(section.locator('.e-columnheader').first()).toHaveCSS('height', '50px');
  await expect(grid).toHaveCSS('width', '600px');
  await expect(section.locator('.e-gridcontent')).toBeVisible();
  await expectWidget(page, 'grid-look', 'w.height', 250);
  await expectWidget(page, 'grid-look', 'w.enableStickyHeader', true);
});

test('look: model changes reach the widget', async ({ app, page }) => {
  const section = app.section('grid-look');
  await setVm(page, 'grid-look', 'cssClass', 'other-grid');
  await expect(section.locator('.e-grid')).toHaveClass(/other-grid/);
  await setVm(page, 'grid-look', 'enableAltRow', true);
  await expect(section.locator('tr.e-altrow').first()).toBeAttached();
  await setVm(page, 'grid-look', 'gridLines', 'None');
  await expect(section.locator('.e-grid')).toHaveClass(/e-hidelines/);
  await setVm(page, 'grid-look', 'enableHover', false);
  await expect(section.locator('.e-grid')).not.toHaveClass(/e-gridhover/);
  await setVm(page, 'grid-look', 'width', 500);
  await expect(section.locator('.e-grid')).toHaveCSS('width', '500px');
  await setVm(page, 'grid-look', 'rowHeight', 40);
  await expectWidget(page, 'grid-look', 'w.rowHeight', 40);
  await setVm(page, 'grid-look', 'headerRowHeight', 30);
  await expectWidget(page, 'grid-look', 'w.headerRowHeight', 30);
  await setVm(page, 'grid-look', 'height', 200);
  await expectWidget(page, 'grid-look', 'w.height', 200);
});

test('text wrap: allowTextWrap and textWrapSettings', async ({ app, page }) => {
  const grid = app.section('grid-wrap').locator('.e-grid');
  // wrapMode Header wraps the header rows only
  await expectWidget(page, 'grid-wrap', 'w.textWrapSettings.wrapMode', 'Header');
  await expect(grid.locator('.e-columnheader')).toHaveClass(/e-wrap/);
  await expect(grid.locator('.e-gridcontent')).not.toHaveClass(/e-wrap/);
  await setVm(page, 'grid-wrap', 'textWrapSettings', { wrapMode: 'Content' });
  await expect(grid.locator('.e-gridcontent')).toHaveClass(/e-wrap/);
  await expect(grid.locator('.e-columnheader')).not.toHaveClass(/e-wrap/);
  await setVm(page, 'grid-wrap', 'allowTextWrap', false);
  await expect(grid.locator('.e-gridcontent')).not.toHaveClass(/e-wrap/);
  await expectWidget(page, 'grid-wrap', 'w.allowTextWrap', false);
});

test('clip mode, loading indicator, auto fit and row rendering direction', async ({ app, page }) => {
  const grid = app.section('grid-clip');
  await expectWidget(page, 'grid-clip', 'w.clipMode', 'EllipsisWithTooltip');
  await expectWidget(page, 'grid-clip', 'w.loadingIndicator.indicatorType', 'Shimmer');
  await expectWidget(page, 'grid-clip', 'w.autoFit', true);
  await expectWidget(page, 'grid-clip', 'w.rowRenderingMode', 'Vertical');
  await expect(grid.locator('.e-grid')).toHaveClass(/e-row-responsive|e-vertical/);
  await expect(grid.locator('.e-content td.e-ellipsistooltip').first()).toBeAttached();
  await setVm(page, 'grid-clip', 'clipMode', 'Clip');
  await expectWidget(page, 'grid-clip', 'w.clipMode', 'Clip');
  await setVm(page, 'grid-clip', 'rowRenderingMode', 'Horizontal');
  await expectWidget(page, 'grid-clip', 'w.rowRenderingMode', 'Horizontal');
});

test('sortSettings, searchSettings, query and immutable mode', async ({ app, page }) => {
  const grid = app.section('grid-query').locator('[data-testid="grid-query"]');
  // search key "hanar" over CustomerID leaves two rows, sorted by Freight descending
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(2);
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('$65.83');
  await expect(grid.locator('.e-headercell', { hasText: 'Freight' })).toHaveAttribute('aria-sort', 'descending');
  await expectWidget(page, 'grid-query', 'w.enableImmutableMode', true);
  await setVm(page, 'grid-query', 'searchSettings', { key: 'vinet', fields: ['CustomerID'], ignoreCase: true });
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(1);
  await setVm(page, 'grid-query', 'sortSettings', { columns: [{ field: 'Freight', direction: 'Ascending' }] });
  await expectWidget(page, 'grid-query', 'w.sortSettings.columns[0].direction', 'Ascending');
  // the query takes the first 3 rows and the column query mode is passed through
  await expect(app.section('grid-query').locator('[data-testid="grid-take"] .e-content tr.e-row')).toHaveCount(3);
  await expectWidget(page, 'grid-take', 'w.columnQueryMode', 'Schema');
});

test('emptyRecordTemplate and emptyRecordMode', async ({ app, page }) => {
  const grid = app.section('grid-empty');
  await expect(grid.locator('.no-orders')).toHaveText('No orders yet');
  await expectWidget(page, 'grid-empty', 'w.emptyRecordMode', 'Normal');
  await setVm(page, 'grid-empty', 'emptyRecordMode', 'Sticky');
  await expectWidget(page, 'grid-empty', 'w.emptyRecordMode', 'Sticky');
  await setVm(page, 'grid-empty', 'emptyTemplate', '<span class="none-here">Nothing here</span>');
  await expect(grid.locator('.none-here')).toHaveText('Nothing here');
});

test('flags without a visual footprint are applied to the widget', async ({ page }) => {
  const expected: Record<string, unknown> = {
    'w.enableHtmlSanitizer': true,
    'w.currencyCode': 'EUR',
    'w.ej2StatePersistenceVersion': 'v2',
    'w.enableAdaptiveUI': true,
    'w.adaptiveUIMode': 'Desktop',
    'w.queryString': 'CustomerID',
    'w.enableVirtualMaskRow': true,
    'w.footerRowHeight': 40,
    'w.currentAction.requestType': 'paging',
    'w.parentDetails.parentKeyFieldValue': 'VINET',
    'w.exportGrids.join()': 'grid-look,grid-wrap'
  };
  for (const [expr, value] of Object.entries(expected)) {
    await expectWidget(page, 'grid-misc', expr, value);
  }
  // showHider is a module instance owned by the grid, an undefined binding must leave it intact
  expect(await widgetValue(page, 'grid-misc', 'typeof w.showHider')).toBe('object');
});
