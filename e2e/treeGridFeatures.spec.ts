import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, widgetValue, callWidget, getVm, expectEvent, evCount, evArg } = bridgeCtl('ej2-tree-grid', '__tgEvents');

test.describe('Tree Grid features', () => {
  test.beforeEach(async ({ app }) => {
    await app.open('treeGrid');
  });

  const rows = (app: any, id: string) => app.section(id).locator('.e-gridcontent .e-row');

  test('paging: allowPaging and pageSettings page the root rows', async ({ app }) => {
    const id = 'tg-paging';
    await expect(app.section(id).locator('.e-pager')).toBeVisible();
    await expectWidget(app.page, id, 'w.allowPaging', true);
    await expectWidget(app.page, id, 'w.pageSettings.pageSize', 2);
    await expect(rows(app, id).first().locator('.e-treecell')).toContainText('1');
    const before = await rows(app, id).count();
    await app.section(id).locator('.e-pager .e-numericitem[data-index="2"], .e-pager .e-numericitem:has-text("2")').first().click();
    await expectWidget(app.page, id, 'w.pageSettings.currentPage', 2);
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().map(r => r.taskID)', [3, 4]);
    expect(before).toBeGreaterThan(0);
  });

  test('pagerTemplate replaces the pager', async ({ app }) => {
    await expect(app.section('tg-pager-template').locator('.tg-pager-template')).toHaveText('Custom pager');
    await expectWidget(app.page, 'tg-pager-template', "typeof w.pagerTemplate", 'string');
  });

  test('sorting: sortSettings applied, header click sorts, allowMultiSorting', async ({ app }) => {
    const id = 'tg-sorting';
    await expectWidget(app.page, id, 'w.allowSorting', true);
    await expectWidget(app.page, id, 'w.allowMultiSorting', true);
    await expectWidget(app.page, id, 'w.sortSettings.columns[0].direction', 'Descending');
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().filter(r => r.level === 0).map(r => r.taskName)', ['Planning', 'Implementation', 'Design']);
    const header = app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Task Name' });
    await header.click(); // descending -> unsorted
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().filter(r => r.level === 0).map(r => r.taskName)', ['Planning', 'Design', 'Implementation']);
    await header.click(); // ascending
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().filter(r => r.level === 0).map(r => r.taskName)', ['Design', 'Implementation', 'Planning']);
    await expectEvent(app.page, 'sortActionComplete');
  });

  test('filtering: filter bar narrows the rows, filterSettings reach the widget', async ({ app }) => {
    const id = 'tg-filtering';
    await expectWidget(app.page, id, 'w.allowFiltering', true);
    await expectWidget(app.page, id, 'w.filterSettings.hierarchyMode', 'Parent');
    await expect(app.section(id).locator('.e-filterbar')).toBeVisible();
    await app.section(id).locator('.e-filterbar input').nth(1).fill('Develop pro');
    await app.page.keyboard.press('Enter');
    await expectWidget(app.page, id, "w.getCurrentViewRecords().map(r => r.taskName).includes('Develop prototype')", true);
    await expectWidget(app.page, id, "w.getCurrentViewRecords().map(r => r.taskName).includes('Planning')", false);
  });

  test('searching: search toolbar with searchSettings', async ({ app }) => {
    const id = 'tg-search';
    await expectWidget(app.page, id, 'w.searchSettings.hierarchyMode', 'Parent');
    await expectWidget(app.page, id, 'w.toolbar', ['Search']);
    await app.section(id).locator('.e-toolbar .e-search input').fill('timeline');
    await app.page.keyboard.press('Enter');
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().map(r => r.taskName)', ['Planning', 'Plan timeline']);
  });

  test('column menu and context menu with their events', async ({ app }) => {
    const id = 'tg-menus';
    await expectWidget(app.page, id, 'w.showColumnMenu', true);
    await expectWidget(app.page, id, 'w.columnMenuItems', ['SortAscending', 'SortDescending', 'ColumnChooser', 'Filter']);
    const header = app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Task Name' });
    await header.locator('.e-columnmenu').click();
    await expectEvent(app.page, 'columnMenuOpen');
    await app.page.locator('.e-colmenu .e-menu-item', { hasText: 'Sort Descending' }).click();
    await expectEvent(app.page, 'columnMenuClick');
    await expectWidget(app.page, id, 'w.getCurrentViewRecords()[0].taskName', 'Planning');

    await expectWidget(app.page, id, 'w.contextMenuItems.length', 4);
    await header.click({ button: 'right' });
    await expectEvent(app.page, 'contextMenuOpen');
    await app.page.locator('.e-contextmenu-wrapper li.e-menu-item:not(.e-menu-hide)', { hasText: 'Sort Ascending' }).first().click();
    await expectEvent(app.page, 'contextMenuClick');
  });

  test('column chooser: showColumnChooser, columnChooserSettings and the toolbar item', async ({ app }) => {
    const id = 'tg-chooser';
    await expectWidget(app.page, id, 'w.showColumnChooser', true);
    await expectWidget(app.page, id, 'w.columnChooserSettings.enableSearching', true);
    await app.section(id).locator('.e-toolbar .e-toolbar-item', { hasText: 'Columns' }).click();
    await expect(app.page.locator('.e-ccdlg:visible')).toBeVisible();
  });

  test('aggregates render a Sum footer', async ({ app }) => {
    await expect(app.section('tg-aggregates').locator('.e-summaryrow').filter({ hasText: 'Sum: ' }).first()).toBeVisible();
    await expectWidget(app.page, 'tg-aggregates', 'w.aggregates.length', 1);
  });

  test('frozen rows and columns', async ({ app }) => {
    const id = 'tg-frozen';
    await expectWidget(app.page, id, 'w.frozenColumns', 2);
    await expectWidget(app.page, id, 'w.frozenRows', 1);
    await expect(app.section(id).locator('.e-treegrid')).toBeVisible();
    await expect(rows(app, id).first()).toBeVisible();
  });

  test('reordering and resizing raise their events', async ({ app }) => {
    const id = 'tg-reorder-resize';
    await expectWidget(app.page, id, 'w.allowReordering', true);
    await expectWidget(app.page, id, 'w.allowResizing', true);
    const headers = app.section(id).locator('.e-columnheader .e-headercell');
    await headers.first().scrollIntoViewIfNeeded();
    const from = (await headers.nth(1).boundingBox())!;
    const to = (await headers.nth(3).boundingBox())!;
    await app.page.mouse.move(from.x + 20, from.y + from.height / 2);
    await app.page.mouse.down();
    await app.page.mouse.move(from.x + 40, from.y + from.height / 2, { steps: 5 });
    await app.page.mouse.move(to.x + 30, to.y + to.height / 2, { steps: 10 });
    await app.page.mouse.up();
    await expectEvent(app.page, 'columnDragStart');
    await expectEvent(app.page, 'columnDrag');
    await expectEvent(app.page, 'columnDrop');

    const handle = (await app.section(id).locator('.e-columnheader .e-rhandler').first().boundingBox())!;
    await app.page.mouse.move(handle.x + 2, handle.y + 5);
    await app.page.mouse.down();
    await app.page.mouse.move(handle.x + 40, handle.y + 5, { steps: 5 });
    await app.page.mouse.up();
    await expectEvent(app.page, 'resizeStart');
    await expectEvent(app.page, 'resizing');
    await expectEvent(app.page, 'resizeStop');
  });

  test('row drag and drop raises its events and re-parents the row', async ({ app }) => {
    const id = 'tg-rowdd';
    await expectWidget(app.page, id, 'w.allowRowDragAndDrop', true);
    await expectWidget(app.page, id, 'typeof w.rowDropSettings', 'object');
    const src = rows(app, id).nth(1).locator('.e-rowdragdrop');
    await src.scrollIntoViewIfNeeded();
    const from = (await src.boundingBox())!;
    const to = (await rows(app, id).nth(6).locator('.e-rowcell').nth(2).boundingBox())!;
    await app.page.mouse.move(from.x + 5, from.y + 5);
    await app.page.mouse.down();
    await app.page.mouse.move(from.x + 20, from.y + 20, { steps: 5 });
    await app.page.mouse.move(to.x + 10, to.y + to.height / 2, { steps: 10 });
    await app.page.mouse.up();
    for (const name of ['rowDragStartHelper', 'rowDragStart', 'rowDrag', 'rowDrop']) { await expectEvent(app.page, name); }
  });

  test('virtualization: flags, query and cloneQuery reach the widget', async ({ app }) => {
    const id = 'tg-virtual';
    await expectWidget(app.page, id, 'w.enableVirtualization', true);
    await expectWidget(app.page, id, 'w.enableColumnVirtualization', true);
    await expectWidget(app.page, id, 'w.columnQueryMode', 'ExcludeHidden');
    await expectWidget(app.page, id, 'w.query.queries.length', 1);
    await expectWidget(app.page, id, 'w.cloneQuery.queries.length', 1);
    expect(await rows(app, id).count()).toBeLessThan(300);
    expect(await rows(app, id).count()).toBeGreaterThan(0);
  });

  test('DOM virtualization renders only a window of rows', async ({ app }) => {
    const id = 'tg-dom-virtual';
    await expectWidget(app.page, id, 'w.enableDomVirtualization', true);
    await expectWidget(app.page, id, 'w.domVirtualizationSettings.rowBuffer', 5);
    expect(await rows(app, id).count()).toBeLessThan(300);
    expect(await rows(app, id).count()).toBeGreaterThan(0);
  });

  test('infinite scrolling loads more rows on scroll', async ({ app }) => {
    const id = 'tg-infinite';
    await expectWidget(app.page, id, 'w.enableInfiniteScrolling', true);
    await expectWidget(app.page, id, 'w.infiniteScrollSettings.initialBlocks', 2);
    const before = await rows(app, id).count();
    await app.section(id).locator('.e-gridcontent .e-content').evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
    await expect.poll(() => rows(app, id).count()).toBeGreaterThan(before);
  });

  test('detailTemplate renders the detail row and raises detailDataBound', async ({ app }) => {
    const id = 'tg-detail';
    await expect(app.section(id).locator('.tg-detail-template').first()).toContainText('Detail of Planning');
    await expect(app.section(id).locator('.tg-detail-template')).toHaveCount(13);
    await expectEvent(app.page, 'detailDataBound');

  });

  test('toolbarTemplate renders custom toolbar content', async ({ app }) => {
    await expect(app.section('tg-toolbar-template').locator('.tg-toolbar-template')).toHaveText('Custom toolbar');
  });

  test('query filters the data manager rows', async ({ app }) => {
    const id = 'tg-query';
    await expectWidget(app.page, id, 'w.query.queries.length', 1);
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().filter(r => r.level === 0).length > 0', true);
    await expectWidget(app.page, id, 'w.getCurrentViewRecords().filter(r => r.level === 0).every(r => r.duration > 4)', true);
  });

  test('dataStateChange: the app supplies roots, children on expand and sorted data', async ({ app }) => {
    const id = 'tg-state';
    await expect(rows(app, id)).toHaveCount(3);
    await rows(app, id).first().locator('.e-treegridcollapse').click();
    await expect(app.page.getByTestId('tg-state-last')).toHaveText('expand');
    await expect(rows(app, id)).toHaveCount(6);
    await app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Task Name' }).click();
    await expect(app.page.getByTestId('tg-state-last')).toHaveText('sorting');
    await expectEvent(app.page, 'dataStateChange', 2);
    expect(await evArg(app.page, 'dataStateChange', 'action.requestType')).toBe('sorting');
  });

  test('dataSourceChanged: an edit is handed to the app, which stores it', async ({ app }) => {
    const id = 'tg-state';
    await rows(app, id).first().scrollIntoViewIfNeeded();
    await rows(app, id).first().locator('.e-rowcell').nth(1).dblclick();
    await app.section(id).locator('.e-editedrow input[name="taskName"]').fill('Renamed parent');
    await app.page.keyboard.press('Enter');
    await expectEvent(app.page, 'dataSourceChanged');
    await expect(app.page.getByTestId('tg-state-saved')).toHaveText('Renamed parent');
    await expect(rows(app, id).first().locator('.e-rowcell').nth(1)).toHaveText('Renamed parent');
  });

  test('actionFailure is raised when the data request cannot be read', async ({ app }) => {
    await app.page.route('**/tg-missing*', route => route.fulfill({ status: 500, contentType: 'text/plain', body: 'boom' }));
    await app.page.getByTestId('tg-failure-show').click();
    await expectEvent(app.page, 'actionFailure');
    expect(await evArg(app.page, 'actionFailure', 'error')).toBeTruthy();
    // the failed request is logged by the browser and by the tree grid, that is the point of this test
    expect(app.errors.some(e => e.includes('XMLHTTPREQUEST FAILED') || e.includes('500'))).toBe(true);
    app.errors.splice(0);
  });
});
