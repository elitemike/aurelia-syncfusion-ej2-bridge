import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evCount } = bridgeCtl('ej2-gantt', '__ganttEvents');

test.describe('Gantt grid features', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  const gridRows = (app: any, id: string) => app.section(id).locator('.e-gridcontent .e-row');
  const names = "w.currentViewData.filter(r => r.level === 0).map(r => r.ganttProperties.taskName)";

  test('sorting: sortSettings applied and header click cycles the sort', async ({ app }) => {
    const id = 'gantt-sort';
    await expectWidget(app.page, id, 'w.allowSorting', true);
    await expectWidget(app.page, id, 'w.sortSettings.columns[0].direction', 'Descending');
    await expectWidget(app.page, id, names, ['Project Initiation', 'Project Estimation'].sort().reverse());
    const header = app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Name' });
    await header.click();
    await header.click();
    await expectWidget(app.page, id, names, ['Project Estimation', 'Project Initiation']);
  });

  test('filtering and searching narrow the rows', async ({ app }) => {
    const id = 'gantt-filter';
    await expectWidget(app.page, id, 'w.allowFiltering', true);
    await expectWidget(app.page, id, 'w.filterSettings.type', 'Menu');
    await expectWidget(app.page, id, 'w.searchSettings.operator', 'contains');
    await expectWidget(app.page, id, 'w.toolbar', ['Search']);
    await app.section(id).locator('.e-toolbar .e-search input').fill('floor');
    await app.page.keyboard.press('Enter');
    await expectWidget(app.page, id, "w.currentViewData.map(r => r.ganttProperties.taskName).includes('Develop floor plan for estimation')", true);
    await expectWidget(app.page, id, "w.currentViewData.map(r => r.ganttProperties.taskName).includes('Perform Soil test')", false);
  });

  test('column menu and context menu with their events', async ({ app }) => {
    const id = 'gantt-menus';
    await expectWidget(app.page, id, 'w.showColumnMenu', true);
    await expectWidget(app.page, id, 'w.columnMenuItems.length', 3);
    await expectWidget(app.page, id, 'w.enableContextMenu', true);
    await expectWidget(app.page, id, 'w.contextMenuItems.length', 6);
    const header = app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Name' });
    await header.locator('.e-columnmenu').click();
    await expectEvent(app.page, 'columnMenuOpen');
    await app.page.locator('.e-colmenu .e-menu-item', { hasText: 'Sort Descending' }).click();
    await expectEvent(app.page, 'columnMenuClick');
    await gridRows(app, id).nth(1).locator('.e-rowcell').nth(1).click({ button: 'right' });
    await expectEvent(app.page, 'contextMenuOpen');
    await app.page.locator('.e-contextmenu-wrapper li.e-menu-item:not(.e-menu-hide)').first().click();
    await expectEvent(app.page, 'contextMenuClick');
  });

  test('reorder, resize, freeze and the splitter raise their events', async ({ app }) => {
    test.setTimeout(90_000); // three real drags plus a dozen event waits take ~30s under load
    const id = 'gantt-columns';
    await expectWidget(app.page, id, 'w.allowReordering', true);
    await expectWidget(app.page, id, 'w.allowResizing', true);
    await expectWidget(app.page, id, 'w.frozenColumns', 1);
    await expectWidget(app.page, id, 'w.splitterSettings.minimum', '200px');
    const headers = app.section(id).locator('.e-columnheader .e-headercell');
    await headers.first().scrollIntoViewIfNeeded();
    const from = (await headers.nth(2).locator('.e-headercelldiv').boundingBox())!;
    // column 1, not 3: at the default viewport the splitter bar covers the right-hand headers
    const to = (await headers.nth(1).boundingBox())!;
    await app.page.mouse.move(from.x + 10, from.y + from.height / 2);
    await app.page.mouse.down();
    for (let i = 1; i <= 20; i++) { await app.page.mouse.move(from.x + 10 + ((to.x + 30 - from.x - 10) * i) / 20, from.y + from.height / 2 + (i % 2)); }
    await app.page.mouse.up();
    for (const name of ['columnDragStart', 'columnDrag', 'columnDrop']) { await expectEvent(app.page, name); }

    const handle = (await app.section(id).locator('.e-columnheader .e-rhandler').first().boundingBox())!;
    await app.page.mouse.move(handle.x + 2, handle.y + 5);
    await app.page.mouse.down();
    await app.page.mouse.move(handle.x + 40, handle.y + 5, { steps: 5 });
    await app.page.mouse.up();
    for (const name of ['resizeStart', 'resizing', 'resizeStop']) { await expectEvent(app.page, name); }

    await app.section(id).locator('.e-split-bar').first().scrollIntoViewIfNeeded();
    const bar = (await app.section(id).locator('.e-split-bar').first().boundingBox())!;
    await app.page.mouse.move(bar.x + bar.width / 2, bar.y + bar.height / 2);
    await app.page.mouse.down();
    await app.page.mouse.move(bar.x + 60, bar.y + bar.height / 2, { steps: 5 });
    await app.page.mouse.up();
    for (const name of ['splitterResizeStart', 'splitterResizing', 'splitterResized']) { await expectEvent(app.page, name); }
  });

  test('hierarchy checkboxes check the children', async ({ app }) => {
    const id = 'gantt-checkbox';
    await expectWidget(app.page, id, 'w.hierarchyCheckboxMode', 'hierarchy');
    await gridRows(app, id).first().scrollIntoViewIfNeeded();
    await gridRows(app, id).first().locator('.e-checkbox-wrapper').first().click();
    await expect(gridRows(app, id).nth(1).locator('.e-check')).toHaveCount(1);
  });

  test('row drag and drop raises its events', async ({ app }) => {
    const id = 'gantt-rowdd';
    await expectWidget(app.page, id, 'w.allowRowDragAndDrop', true);
    await expectWidget(app.page, id, 'w.allowTaskbarDragAndDrop', true);
    const src = gridRows(app, id).nth(1).locator('.e-rowdragdrop');
    await src.scrollIntoViewIfNeeded();
    const from = (await src.boundingBox())!;
    const to = (await gridRows(app, id).nth(6).locator('.e-rowcell').nth(1).boundingBox())!;
    await app.page.mouse.move(from.x + 5, from.y + 5);
    await app.page.mouse.down();
    await app.page.mouse.move(from.x + 20, from.y + 20, { steps: 5 });
    await app.page.mouse.move(to.x + 10, to.y + to.height / 2, { steps: 10 });
    await app.page.mouse.up();
    for (const name of ['rowDragStartHelper', 'rowDragStart', 'rowDrag', 'rowDrop']) { await expectEvent(app.page, name); }
    expect(await evCount(app.page, 'rowDrop')).toBeGreaterThan(0);
  });
});
