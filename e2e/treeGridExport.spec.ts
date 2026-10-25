import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evArg } = bridgeCtl('ej2-tree-grid', '__tgEvents');

test.describe('Tree Grid export and print', () => {
  test.beforeEach(async ({ app }) => { await app.open('treeGrid'); });

  const item = (app: any, icon: string) => app.section('tg-export').locator(`.e-toolbar .e-toolbar-item:has(.e-${icon})`);

  test('flags and print mode reach the widget', async ({ app }) => {
    await expectWidget(app.page, 'tg-export', 'w.allowExcelExport', true);
    await expectWidget(app.page, 'tg-export', 'w.allowPdfExport', true);
    await expectWidget(app.page, 'tg-export', 'w.printMode', 'AllPages');
    await expectWidget(app.page, 'tg-export', 'w.toolbar.length', 4);
  });

  test('Excel export downloads a file and raises the Excel events', async ({ app }) => {
    await item(app, 'excelexport').scrollIntoViewIfNeeded();
    const [download] = await Promise.all([app.page.waitForEvent('download'), item(app, 'excelexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    for (const name of ['beforeExcelExport', 'excelQueryCellInfo', 'excelHeaderQueryCellInfo', 'excelAggregateQueryCellInfo', 'excelExportComplete']) {
      await expectEvent(app.page, name);
    }
    expect(await evArg(app.page, 'excelQueryCellInfo', 'column.field')).toBeTruthy();
  });

  test('CSV export downloads a file', async ({ app }) => {
    await item(app, 'csvexport').scrollIntoViewIfNeeded();
    const [download] = await Promise.all([app.page.waitForEvent('download'), item(app, 'csvexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
    await expectEvent(app.page, 'toolbarClick');
  });

  test('PDF export downloads a file and raises the PDF events', async ({ app }) => {
    await item(app, 'pdfexport').scrollIntoViewIfNeeded();
    const [download] = await Promise.all([app.page.waitForEvent('download'), item(app, 'pdfexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    for (const name of ['beforePdfExport', 'pdfQueryCellInfo', 'pdfHeaderQueryCellInfo', 'pdfAggregateQueryCellInfo', 'pdfExportComplete']) {
      await expectEvent(app.page, name);
    }
  });

  test('print raises beforePrint and printComplete', async ({ app }) => {
    await item(app, 'print').scrollIntoViewIfNeeded();
    const popup = app.page.waitForEvent('popup');
    await item(app, 'print').click();
    await expectEvent(app.page, 'beforePrint');
    await expectEvent(app.page, 'printComplete');
    await (await popup).close().catch(() => undefined);
  });
});
