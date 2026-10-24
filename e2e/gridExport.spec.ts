import { test, expect } from './fixtures';
import { callWidget, evArg, expectEvent, expectWidget } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('excel export raises the export events and downloads a file', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    callWidget(page, 'grid-export', 'w.excelExport()')
  ]);
  expect(download.suggestedFilename()).toBe('Export.xlsx');
  for (const name of ['beforeExcelExport', 'excelQueryCellInfo', 'excelHeaderQueryCellInfo', 'excelAggregateQueryCellInfo', 'exportGroupCaption', 'excelExportComplete']) {
    await expectEvent(page, `export.${name}`);
  }
  expect(await evArg(page, 'export.excelHeaderQueryCellInfo', 'gridCell.column.field')).toBeTruthy();
  expect(await evArg(page, 'export.exportGroupCaption', 'type')).toBe('Excel');
});

test('csv export from the toolbar', async ({ app, page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    app.section('grid-export').locator('.e-toolbar button[id$="_csvexport"]').click()
  ]);
  expect(download.suggestedFilename()).toBe('Export.csv');
  await expectEvent(page, 'export.excelExportComplete');
});

test('pdf export raises the export events and downloads a file', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    callWidget(page, 'grid-export', 'w.pdfExport()')
  ]);
  expect(download.suggestedFilename()).toBe('Export.pdf');
  for (const name of ['beforePdfExport', 'pdfQueryCellInfo', 'pdfHeaderQueryCellInfo', 'pdfAggregateQueryCellInfo', 'pdfExportComplete']) {
    await expectEvent(page, `export.${name}`);
  }
});

test('print raises beforePrint and printComplete', async ({ app, page }) => {
  await expectWidget(page, 'grid-export', 'w.printMode', 'CurrentPage');
  // window.open needs a user gesture, so print through the toolbar item
  const popup = page.waitForEvent('popup');
  await app.section('grid-export').locator('.e-toolbar button[id$="_print"]').click();
  await expectEvent(page, 'export.beforePrint');
  await expectEvent(page, 'export.printComplete');
  expect(await evArg(page, 'export.beforePrint', 'requestType')).toBe('print');
  await (await popup).close().catch(() => undefined);
});

test('hierarchy grid: detail events, child grid and hierarchy print mode', async ({ app, page }) => {
  const grid = app.section('grid-hierarchy');
  await expectWidget(page, 'grid-hierarchy', 'w.hierarchyPrintMode', 'All');
  await expectWidget(page, 'grid-hierarchy', 'w.childGrid.queryString', 'EmployeeID');
  await grid.locator('.e-detailrowcollapse').first().click();
  await expectEvent(page, 'hier.detailExpand');
  await expectEvent(page, 'hier.detailExpanded');
  await expectEvent(page, 'hier.detailDataBound');
  await expect(grid.locator('.e-childgrid .e-content tr.e-row')).toHaveCount(2);
  await grid.locator('.e-detailrowexpand').first().click();
  await expectEvent(page, 'hier.detailCollapse');
  await expectEvent(page, 'hier.detailCollapsed');

  await grid.locator('.e-detailrowcollapse').first().click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    callWidget(page, 'grid-hierarchy', 'w.pdfExport({ hierarchyExportMode: "All" })')
  ]);
  expect(download.suggestedFilename()).toBe('Export.pdf');
  await expectEvent(page, 'hier.exportDetailDataBound');
});

test('detail template: beforeDetailTemplateDetach on destroy', async ({ app, page }) => {
  const grid = app.section('grid-detail-template');
  await grid.locator('.e-detailrowcollapse').first().click();
  await expect(grid.locator('.detail-tpl')).toHaveText('Employee Nancy works in Seattle');
  // expanded detail rows are detached when the grid goes away
  await callWidget(page, 'grid-detail-template', 'w.destroy()');
  await expectEvent(page, 'detail.beforeDetailTemplateDetach');
});

test('detail template: render and export events', async ({ app, page }) => {
  const grid = app.section('grid-detail-template');
  await grid.locator('.e-detailrowcollapse').first().click();
  await expect(grid.locator('.detail-tpl')).toHaveText('Employee Nancy works in Seattle');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    callWidget(page, 'grid-detail-template', 'w.pdfExport({ hierarchyExportMode: "All" })')
  ]);
  expect(download.suggestedFilename()).toBe('Export.pdf');
  await expectEvent(page, 'detail.exportDetailTemplate');
});
