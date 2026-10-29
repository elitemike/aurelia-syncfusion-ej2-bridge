import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, setVm, getVm, expectEvent, evCount, evArg } = bridgeCtl('ej2-gantt', '__ganttEvents');

test.describe('Gantt basics', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  const chartRows = (app: any, id: string) => app.section(id).locator('.e-chart-row');
  const gridRows = (app: any, id: string) => app.section(id).locator('.e-gridcontent .e-row');

  test('renders the project with parent and child taskbars and the mapped task fields', async ({ app }) => {
    const id = 'gantt-basic';
    await expect(chartRows(app, id)).toHaveCount(8);
    await expect(app.section(id).locator('.e-gantt-parent-taskbar-inner-div').first()).toBeVisible();
    await expect(app.section(id).locator('.e-gantt-child-taskbar-inner-div').first()).toBeVisible();
    await expect(gridRows(app, id).first().locator('.e-rowcell').nth(1)).toHaveText('Project Initiation');
    await expectWidget(app.page, id, 'w.taskFields.id', 'TaskID');
    await expectWidget(app.page, id, 'w.taskFields.child', 'subtasks');
    await expectWidget(app.page, id, 'w.dataSource.length', 2);
    await expectWidget(app.page, id, 'w.height', 320);
    await expectWidget(app.page, id, 'w.treeColumnIndex', 1);
    await expectWidget(app.page, id, 'w.columns.length', 5);
    await expectWidget(app.page, id, 'w.allowSelection', true);
    await expectWidget(app.page, id, 'w.allowSorting', true);
    await expectWidget(app.page, id, 'w.selectionSettings.mode', 'Both');
    await expectWidget(app.page, id, 'String(w.projectStartDate)', '2025-03-31');
    await expectWidget(app.page, id, 'String(w.projectEndDate)', '2025-05-05');
  });

  test('lifecycle and render events: created, load, beforeDataBound, dataBound, row, cell, header and taskbar info', async ({ app }) => {
    for (const name of ['created', 'load', 'beforeDataBound', 'dataBound', 'rowDataBound', 'headerCellInfo', 'queryCellInfo', 'queryTaskbarInfo']) {
      await expectEvent(app.page, name);
    }
    expect(await evCount(app.page, 'rowDataBound')).toBeGreaterThanOrEqual(8);
    expect(await evArg(app.page, 'queryTaskbarInfo', 'taskbarElement')).toBeTruthy();
  });

  test('selectedRowIndex is two-way: the widget updates the view model and the view model the widget', async ({ app }) => {
    const id = 'gantt-basic';
    await gridRows(app, id).nth(1).locator('.e-rowcell').nth(2).click();
    await expect(app.page.getByTestId('gantt-selected-index')).toHaveText('1');
    expect(await getVm(app.page, id, 'selectedRowIndex')).toBe(1);
    await expect(app.page.getByTestId('gantt-selected-name')).toHaveText('Identify Site location');
    await app.page.getByTestId('gantt-select-3').click();
    await expectWidget(app.page, id, 'w.selectedRowIndex', 3);
    await expect(app.page.getByTestId('gantt-selected-index')).toHaveText('3');
    await setVm(app.page, id, 'selectedRowIndex', 5);
    await expectWidget(app.page, id, 'w.selectedRowIndex', 5);
    await expect(gridRows(app, id).nth(5)).toHaveAttribute('aria-selected', 'true');
  });

  test('selection events: row and cell selecting/selected/deselecting/deselected', async ({ app }) => {
    const rows = gridRows(app, 'gantt-basic');
    await rows.nth(1).locator('.e-rowcell').nth(2).click();
    await rows.nth(2).locator('.e-rowcell').nth(2).click();
    for (const name of ['rowSelecting', 'rowSelected', 'rowDeselecting', 'rowDeselected', 'cellSelecting', 'cellSelected', 'cellDeselecting', 'cellDeselected']) {
      await expectEvent(app.page, name);
    }
  });

  test('collapsing and expanding raise their events', async ({ app }) => {
    const id = 'gantt-basic';
    await gridRows(app, id).first().locator('.e-treegridexpand').click();
    await expectEvent(app.page, 'collapsing');
    await expectEvent(app.page, 'collapsed');
    await expectWidget(app.page, id, 'w.flatData[0].expanded', false);
    await gridRows(app, id).first().locator('.e-treegridcollapse').click();
    await expectEvent(app.page, 'expanding');
    await expectEvent(app.page, 'expanded');
    await expectWidget(app.page, id, 'w.flatData[0].expanded', true);
  });

  test('actionBegin and actionComplete fire for gantt actions', async ({ app }) => {
    await app.page.evaluate(() => {
      const w = (document.querySelector('[data-testid="gantt-basic"]') as any).au['ej2-gantt'].viewModel.widget;
      w.sortColumn('TaskName', 'Descending');
    });
    await expectEvent(app.page, 'actionBegin');
    expect(await evArg(app.page, 'actionBegin', 'requestType')).toBe('sorting');
    await expectEvent(app.page, 'actionComplete', 3);
  });

  test('taskbar click, mouse move, double click and the tooltip', async ({ app }) => {
    const id = 'gantt-basic';
    const bar = app.section(id).locator('.e-gantt-child-taskbar-inner-div').first();
    await bar.scrollIntoViewIfNeeded();
    await bar.hover();
    await expectEvent(app.page, 'onMouseMove');
    await expectEvent(app.page, 'beforeTooltipRender');
    await bar.click();
    await expectEvent(app.page, 'onTaskbarClick');
    expect(await evArg(app.page, 'onTaskbarClick', 'data.TaskName')).toBeTruthy();
    await chartRows(app, id).nth(2).locator('.e-gantt-child-taskbar-inner-div').first().dblclick();
    await expectEvent(app.page, 'recordDoubleClick');
  });
});

test.describe('Gantt project settings', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  const chartRows = (app: any, id: string) => app.section(id).locator('.e-chart-row');

  test('work time units, work week, dates and timezone reach the widget', async ({ app }) => {
    const id = 'gantt-units';
    await expectWidget(app.page, id, 'w.durationUnit', 'Hour');
    await expectWidget(app.page, id, 'w.hoursPerDay', 6);
    await expectWidget(app.page, id, 'w.daysPerWeek', 4);
    await expectWidget(app.page, id, 'w.daysPerMonth', 20);
    await expectWidget(app.page, id, 'w.workWeek.length', 6);
    await expectWidget(app.page, id, 'w.includeWeekend', true);
    await expectWidget(app.page, id, 'w.dateFormat', 'yyyy-MM-dd');
    await expectWidget(app.page, id, 'w.timezone', 'UTC');
    await expect(app.section(id).locator('.e-gridcontent .e-row').nth(1).locator('.e-rowcell').nth(3)).toContainText('hour');
  });

  test('look and feel properties and their updates', async ({ app }) => {
    test.setTimeout(90_000); // ~25 widget reads on a slow-rendering gantt, close to the 30s default under load
    const id = 'gantt-look';
    await expectWidget(app.page, id, 'w.rowHeight', 40);
    await expectWidget(app.page, id, 'w.taskbarHeight', 24);
    await expectWidget(app.page, id, 'w.height', 320);
    await expectWidget(app.page, id, 'w.width', '100%');
    await expectWidget(app.page, id, 'w.gridLines', 'Both');
    await expectWidget(app.page, id, 'w.enableHover', false);
    await expectWidget(app.page, id, 'w.labelSettings.leftLabel', 'TaskName');
    await expectWidget(app.page, id, 'w.connectorLineBackground', '#ff0000');
    await expectWidget(app.page, id, 'w.connectorLineWidth', 3);
    await expectWidget(app.page, id, 'w.baselineColor', '#00aa00');
    await expectWidget(app.page, id, 'w.loadingIndicator.indicatorType', 'Shimmer');
    await expectWidget(app.page, id, 'w.tooltipSettings.showTooltip', true);
    await expectWidget(app.page, id, 'w.splitterSettings.position', '40%');
    await expectWidget(app.page, id, 'w.enableAdaptiveUI', false);
    await expectWidget(app.page, id, 'w.enableImmutableMode', false);
    await expectWidget(app.page, id, 'w.enableHtmlSanitizer', true);
    await expectWidget(app.page, id, 'w.disableHtmlEncode', true);
    await expectWidget(app.page, id, 'w.allowKeyboard', true);
    await expectWidget(app.page, id, 'w.enableVirtualMaskRow', true);
    await expectWidget(app.page, id, 'w.treeColumnIndex', 1);
    await expectWidget(app.page, id, 'w.collapseAllParentTasks', false);
    await expectWidget(app.page, id, 'w.allowedDependencyTypes', ['FS', 'SS']);
    await expect(app.section(id).locator('.e-chart-row').first()).toHaveCSS('height', '40px');
    await expect(app.section(id).locator('.e-gantt-child-taskbar-inner-div').first()).toHaveCSS('height', '24px');
    await app.page.getByTestId('gantt-look-change').click();
    await expectWidget(app.page, id, 'w.rowHeight', 50);
    await expectWidget(app.page, id, 'w.taskbarHeight', 30);
    await expectWidget(app.page, id, 'w.height', 260);
    await expectWidget(app.page, id, 'w.gridLines', 'None');
    await expectWidget(app.page, id, 'w.enableHover', true);
  });

  test('WBS, serial numbers, auto focus and query', async ({ app }) => {
    const id = 'gantt-wbs';
    await expectWidget(app.page, id, 'w.enableWBS', true);
    await expectWidget(app.page, id, 'w.enableAutoWbsUpdate', true);
    await expectWidget(app.page, id, 'w.enableSerialNumber', true);
    await expectWidget(app.page, id, 'w.autoFocusTasks', true);
    await expectWidget(app.page, id, 'w.query.queries.length', 1);
    await expectWidget(app.page, id, 'w.enableWebMcp', false);
    await expectWidget(app.page, id, 'w.webMcpSettings.name', 'ganttDemo');
    await expect(chartRows(app, id)).toHaveCount(8);
  });

  test('emptyRecordTemplate is shown when there are no tasks', async ({ app }) => {
    await expect(app.section('gantt-empty').locator('.gantt-empty')).toHaveText('No tasks yet');
  });

  test('loadChildOnDemand with a parent id mapping', async ({ app }) => {
    const id = 'gantt-demand';
    await expectWidget(app.page, id, 'w.loadChildOnDemand', true);
    await expectWidget(app.page, id, 'w.taskFields.parentID', 'ParentID');
    await expect(chartRows(app, id)).toHaveCount(4);
  });
});
