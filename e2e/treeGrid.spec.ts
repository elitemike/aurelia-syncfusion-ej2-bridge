import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, setVm, getVm, expectEvent, evCount, evArg } = bridgeCtl('ej2-tree-grid', '__tgEvents');

test.describe('Tree Grid basics', () => {
  test.beforeEach(async ({ app }) => { await app.open('treeGrid'); });

  test('hierarchical data renders every row with the tree column and mapped children', async ({ app }) => {
    const grid = app.section('tg-basic');
    await expect(grid.locator('.e-treegrid')).toBeVisible();
    await expect(grid.locator('.e-gridcontent .e-row')).toHaveCount(13);
    await expect(grid.locator('.e-gridcontent .e-row').first().locator('.e-treecell')).toContainText('Planning');
    await expectWidget(app.page, 'tg-basic', 'w.childMapping', 'subtasks');
    await expectWidget(app.page, 'tg-basic', 'w.treeColumnIndex', 1);
    await expectWidget(app.page, 'tg-basic', 'w.columns.length', 5);
    await expectWidget(app.page, 'tg-basic', 'w.height', 300);
    await expectWidget(app.page, 'tg-basic', 'w.enableCollapseAll', false);
  });

  test('lifecycle events: created, load, beforeDataBound, dataBound, row and cell render events', async ({ app }) => {
    for (const name of ['created', 'load', 'beforeDataBound', 'dataBound', 'rowDataBound', 'queryCellInfo', 'headerCellInfo']) {
      await expectEvent(app.page, name);
    }
    expect(await evCount(app.page, 'rowDataBound')).toBeGreaterThanOrEqual(13);
    expect(await evArg(app.page, 'headerCellInfo', 'cell.column.field')).toBeTruthy();
  });

  test('selectedRowIndex is two-way: the widget updates the view model and the view model the widget', async ({ app }) => {
    const grid = app.section('tg-basic');
    await grid.locator('.e-gridcontent .e-row').nth(1).locator('.e-rowcell').nth(2).click();
    await expect(app.page.getByTestId('tg-selected-index')).toHaveText('1');
    expect(await getVm(app.page, 'tg-basic', 'selectedRowIndex')).toBe(1);
    await expect(app.page.getByTestId('tg-selected-name')).toHaveText('Plan timeline');
    // view model -> widget
    await app.page.getByTestId('tg-select-3').click();
    await expectWidget(app.page, 'tg-basic', 'w.selectedRowIndex', 3);
    await expect(grid.locator('.e-gridcontent .e-row').nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(app.page.getByTestId('tg-selected-index')).toHaveText('3');
    await setVm(app.page, 'tg-basic', 'selectedRowIndex', 5);
    await expectWidget(app.page, 'tg-basic', 'w.selectedRowIndex', 5);
    await expect(app.page.getByTestId('tg-selected-index')).toHaveText('5');
  });

  test('selection events: row and cell selecting/selected/deselecting/deselected', async ({ app }) => {
    const rows = app.section('tg-basic').locator('.e-gridcontent .e-row');
    await rows.nth(1).locator('.e-rowcell').nth(2).click();
    await rows.nth(2).locator('.e-rowcell').nth(2).click();
    for (const name of ['rowSelecting', 'rowSelected', 'rowDeselecting', 'rowDeselected', 'cellSelecting', 'cellSelected', 'cellDeselecting', 'cellDeselected']) {
      await expectEvent(app.page, name);
    }
    expect(await evArg(app.page, 'rowSelected', 'data.taskName')).toBe('Plan budget');
  });

  test('collapsing and expanding raise their events and hide / show the children', async ({ app }) => {
    const grid = app.section('tg-basic');
    await grid.locator('.e-gridcontent .e-row').first().locator('.e-treegridexpand').click();
    await expectEvent(app.page, 'collapsing');
    await expectEvent(app.page, 'collapsed');
    await expect(grid.locator('.e-gridcontent .e-row.e-childrow-hidden')).toHaveCount(4);
    expect(await evArg(app.page, 'collapsed', 'data.taskName')).toBe('Planning');
    await grid.locator('.e-gridcontent .e-row').first().locator('.e-treegridcollapse').click();
    await expectEvent(app.page, 'expanding');
    await expectEvent(app.page, 'expanded');
    await expect(grid.locator('.e-gridcontent .e-childrow-hidden')).toHaveCount(0);
  });

  test('actionBegin and actionComplete fire for tree grid actions', async ({ app }) => {
    await app.page.evaluate(() => {
      const w = (document.querySelector('[data-testid="tg-basic"]') as any).au['ej2-tree-grid'].viewModel.widget;
      w.sortByColumn('taskName', 'Descending');
    });
    await expectEvent(app.page, 'actionBegin');
    await expectEvent(app.page, 'actionComplete');
    expect(await evArg(app.page, 'actionBegin', 'requestType')).toBe('sorting');
  });

  test('recordDoubleClick', async ({ app }) => {
    await app.section('tg-basic').locator('.e-gridcontent .e-row').nth(1).locator('.e-rowcell').nth(1).dblclick();
    await expectEvent(app.page, 'recordDoubleClick');
    expect(await evArg(app.page, 'recordDoubleClick', 'rowData.taskName')).toBe('Plan timeline');
  });
});

test.describe('Tree Grid data mapping', () => {
  test.beforeEach(async ({ app }) => { await app.open('treeGrid'); });

  test('idMapping / parentIdMapping build the hierarchy, expandStateMapping collapses Parent Task 2', async ({ app }) => {
    const grid = app.section('tg-self');
    await expect(grid.locator('.e-gridcontent .e-row')).toHaveCount(8);
    await expect(grid.locator('.e-gridcontent .e-childrow-hidden')).toHaveCount(2);
    await expectWidget(app.page, 'tg-self', 'w.idMapping', 'taskID');
    await expectWidget(app.page, 'tg-self', 'w.parentIdMapping', 'parentID');
    await expectWidget(app.page, 'tg-self', 'w.hasChildMapping', 'isParent');
    await expectWidget(app.page, 'tg-self', 'w.expandStateMapping', 'isExpanded');
    await expectWidget(app.page, 'tg-self', 'w.loadChildOnDemand', false);
    await expectWidget(app.page, 'tg-self', 'w.treeColumnIndex', 0);
    await expect(grid.locator('.e-gridcontent .e-row').first().locator('.e-treecell')).toContainText('1');
    await expect(grid.locator('.e-gridcontent .e-row').nth(1).locator('.e-treecell')).toContainText('2');
  });
});

test.describe('Tree Grid look', () => {
  test.beforeEach(async ({ app }) => { await app.open('treeGrid'); });

  test('look properties reach the widget and follow view model changes', async ({ app }) => {
    const p = app.page;
    const id = 'tg-look';
    await expectWidget(p, id, 'w.rowHeight', 40);
    await expectWidget(p, id, 'w.gridLines', 'Both');
    await expectWidget(p, id, 'w.height', 300);
    await expectWidget(p, id, 'w.width', '100%');
    await expectWidget(p, id, 'w.clipMode', 'Clip');
    await expectWidget(p, id, 'w.currencyCode', 'USD');
    await expectWidget(p, id, 'w.allowKeyboard', true);
    await expectWidget(p, id, 'w.textWrapSettings.wrapMode', 'Content');
    await expectWidget(p, id, 'w.loadingIndicator.indicatorType', 'Spinner');
    await expectWidget(p, id, 'w.enableAdaptiveUI', false);
    await expectWidget(p, id, 'w.enableImmutableMode', false);
    await expectWidget(p, id, 'w.enableStickyHeader', false);
    await expectWidget(p, id, 'w.enableHtmlSanitizer', true);
    await expectWidget(p, id, 'w.enableAutoFill', false);
    await expectWidget(p, id, 'w.enableVirtualMaskRow', true);
    await expectWidget(p, id, 'w.copyHierarchyMode', 'Parent');
    await expectWidget(p, id, 'w.enableHover', false);
    await expectWidget(p, id, 'w.enableAltRow', false);
    await expectWidget(p, id, 'w.allowTextWrap', false);
    await expect(app.section('tg-look').locator('.e-gridcontent .e-row').first()).toHaveCSS('height', '40px');

    await p.getByTestId('tg-look-toggle').click();
    await expectWidget(p, id, 'w.enableHover', true);
    await expectWidget(p, id, 'w.enableAltRow', true);
    await expectWidget(p, id, 'w.allowTextWrap', true);
    await expectWidget(p, id, 'w.grid.allowTextWrap', true);

    await p.getByTestId('tg-look-lines').click();
    await expectWidget(p, id, 'w.gridLines', 'None');
    await expectWidget(p, id, 'w.rowHeight', 60);
    await expectWidget(p, id, 'w.clipMode', 'Ellipsis');
    await expectWidget(p, id, 'w.height', 240);
    await expectWidget(p, id, 'w.grid.enableHover', true);
  });

  test('emptyRecordTemplate shows when there is no data', async ({ app }) => {
    await expect(app.section('tg-empty').locator('.tg-empty')).toHaveText('Nothing to show here');
  });

  test('rowTemplate replaces the rows', async ({ app }) => {
    const rows = app.section('tg-rowtemplate').locator('.tg-row-template');
    await expect(rows.first()).toContainText('Planning');
    await expect(rows).toHaveCount(13);
  });

  test('isRowSelectable blocks Task 3, column and row span are on', async ({ app }) => {
    const grid = app.section('tg-selectable');
    await grid.locator('.e-gridcontent .e-row').nth(2).locator('.e-rowcell').nth(1).click();
    await expect(grid.locator('.e-gridcontent .e-row[aria-selected="true"]')).toHaveCount(0);
    await grid.locator('.e-gridcontent .e-row').nth(1).locator('.e-rowcell').nth(1).click();
    await expect(grid.locator('.e-gridcontent .e-row[aria-selected="true"]')).toHaveCount(1);
    await expectWidget(app.page, 'tg-selectable', 'w.enableColumnSpan', true);
    await expectWidget(app.page, 'tg-selectable', 'w.enableRowSpan', true);
    await expectWidget(app.page, 'tg-selectable', 'typeof w.isRowSelectable', 'function');
  });
});
