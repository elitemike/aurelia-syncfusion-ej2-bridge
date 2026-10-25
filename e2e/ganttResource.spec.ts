import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evCount } = bridgeCtl('ej2-gantt', '__ganttEvents');

test.describe('Gantt resources, segments, destroy and export', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  test('resources in the project view', async ({ app }) => {
    const id = 'gantt-resources';
    await expectWidget(app.page, id, 'w.resources.length', 3);
    await expectWidget(app.page, id, 'w.resourceFields.name', 'resourceName');
    await expectWidget(app.page, id, 'w.workUnit', 'Hour');
    await expectWidget(app.page, id, 'w.taskType', 'FixedWork');
    await expectWidget(app.page, id, 'w.showOverAllocation', true);
    await expectWidget(app.page, id, 'w.allowTaskbarOverlap', true);
    await expectWidget(app.page, id, 'w.viewType', 'ProjectView');
    await expect(app.section(id).locator('.e-gridcontent .e-row').nth(1).locator('.e-rowcell').nth(2)).toContainText('Martin Tamer');
  });

  test('resource view groups the tasks by resource', async ({ app }) => {
    const id = 'gantt-resource-view';
    await expectWidget(app.page, id, 'w.viewType', 'ResourceView');
    await expectWidget(app.page, id, 'w.enableMultiTaskbar', true);
    await expectWidget(app.page, id, 'w.resourceIDMapping', 'resourceId');
    await expectWidget(app.page, id, 'w.resourceNameMapping', 'resourceName');
    await expect(app.section(id).locator('.e-gridcontent .e-row').filter({ hasText: 'Rose Fuller' }).first()).toBeVisible();
    await expect(app.section(id).locator('.e-gridcontent .e-row').filter({ hasText: 'Margaret Buchanan' }).first()).toBeVisible();
  });

  test('segments split the task into pieces', async ({ app }) => {
    const id = 'gantt-segments';
    await expectWidget(app.page, id, 'w.taskFields.segments', 'Segments');
    await expectWidget(app.page, id, 'w.segmentData.length', 1);
    await expect(app.section(id).locator('.e-segmented-taskbar, .e-segment-first, [class*=segment]').first()).toBeAttached();
  });

  test('removing the gantt raises destroyed', async ({ app }) => {
    await expect(app.section('gantt-destroy').locator('.e-gantt')).toBeVisible();
    await app.page.getByTestId('gantt-destroy-hide').click();
    await expectEvent(app.page, 'destroyed');
    await expect(app.section('gantt-destroy').locator('.e-gantt')).toHaveCount(0);
    expect(await evCount(app.page, 'destroyed')).toBe(1);
  });

  test('export raises the Excel and PDF events and downloads files', async ({ app }) => {
    const id = 'gantt-export';
    await expectWidget(app.page, id, 'w.allowExcelExport', true);
    await expectWidget(app.page, id, 'w.allowPdfExport', true);
    const item = (icon: string) => app.section(id).locator(`.e-toolbar .e-toolbar-item:has(.e-${icon})`);
    await item('excelexport').scrollIntoViewIfNeeded();
    let [download] = await Promise.all([app.page.waitForEvent('download'), item('excelexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    for (const name of ['beforeExcelExport', 'excelQueryCellInfo', 'excelHeaderQueryCellInfo', 'excelExportComplete', 'toolbarClick']) {
      await expectEvent(app.page, name);
    }
    [download] = await Promise.all([app.page.waitForEvent('download'), item('csvexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
    [download] = await Promise.all([app.page.waitForEvent('download'), item('pdfexport').click()]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    for (const name of ['beforePdfExport', 'pdfQueryCellInfo', 'pdfQueryTaskbarInfo', 'pdfQueryTimelineCellInfo', 'pdfColumnHeaderQueryCellInfo', 'pdfExportComplete']) {
      await expectEvent(app.page, name);
    }
  });

  test('beforeWebMcpToolExecute is bound while WebMCP stays off', async ({ app }) => {
    await expectWidget(app.page, 'gantt-wbs', 'w.enableWebMcp', false);
    expect(await evCount(app.page, 'beforeWebMcpToolExecute')).toBe(0);
  });

  test('actionFailure is raised when the data request fails', async ({ app }) => {
    await app.page.route('**/gantt-missing*', route => route.fulfill({ status: 500, contentType: 'text/plain', body: 'boom' }));
    await app.page.getByTestId('gantt-failure-show').click();
    await expectEvent(app.page, 'actionFailure');
    // the failed request is logged by the browser, that is the point of this test
    expect(app.errors.length).toBeGreaterThan(0);
    app.errors.splice(0);
  });
});
