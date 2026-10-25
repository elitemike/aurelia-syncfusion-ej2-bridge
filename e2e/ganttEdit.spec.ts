import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evArg } = bridgeCtl('ej2-gantt', '__ganttEvents');

test.describe('Gantt editing', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  const chartRows = (app: any, id: string) => app.section(id).locator('.e-chart-row');
  const gridRows = (app: any, id: string) => app.section(id).locator('.e-gridcontent .e-row');
  const item = (app: any, id: string, icon: string) => app.section(id).locator(`.e-toolbar .e-toolbar-item:has(.e-${icon})`);

  test('edit settings, toolbar and dialog fields reach the widget', async ({ app }) => {
    const id = 'gantt-edit';
    await expectWidget(app.page, id, 'w.editSettings.allowAdding', true);
    await expectWidget(app.page, id, 'w.editSettings.mode', 'Auto');
    await expectWidget(app.page, id, 'w.toolbar.length', 9);
    await expectWidget(app.page, id, 'w.addDialogFields.length', 2);
    await expectWidget(app.page, id, 'w.editDialogFields.length', 3);
  });

  test('toolbar Edit opens the dialog, Save updates the task and raises the edit events', async ({ app }) => {
    const id = 'gantt-edit';
    await gridRows(app, id).nth(1).scrollIntoViewIfNeeded();
    await gridRows(app, id).nth(1).locator('.e-rowcell').nth(2).click();
    await item(app, id, 'edit').click();
    const dialog = app.page.locator('.e-gantt-dialog:visible, .e-dialog:visible').first();
    await expect(dialog).toBeVisible();
    await dialog.locator('input[id$="TaskName"]').first().fill('Renamed task');
    await dialog.locator('button', { hasText: 'Save' }).click();
    await expectEvent(app.page, 'editActionBegin');
    await expect(app.page.getByTestId('gantt-edit-last')).toHaveText('save');
    await expectWidget(app.page, id, 'w.flatData[1].ganttProperties.taskName', 'Renamed task');
    await expectEvent(app.page, 'editToolbarClick');
  });

  test('toolbar Delete removes the selected task', async ({ app }) => {
    const id = 'gantt-edit';
    await gridRows(app, id).nth(2).scrollIntoViewIfNeeded();
    await gridRows(app, id).nth(2).locator('.e-rowcell').nth(2).click();
    await item(app, id, 'delete').click();
    await expect(chartRows(app, id)).toHaveCount(7);
  });

  test('dragging a taskbar raises taskbarEditing and taskbarEdited', async ({ app }) => {
    const id = 'gantt-edit';
    const bar = app.section(id).locator('.e-gantt-child-taskbar-inner-div').first();
    await bar.scrollIntoViewIfNeeded();
    const box = (await bar.boundingBox())!;
    await app.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await app.page.mouse.down();
    await app.page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2, { steps: 5 });
    await app.page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 5 });
    await app.page.mouse.up();
    await expectEvent(app.page, 'taskbarEditing');
    await expectEvent(app.page, 'taskbarEdited');
    await expect(app.page.getByTestId('gantt-taskbar-last')).not.toHaveText('');
  });

  test('cell editing raises cellEdit and cellSave', async ({ app }) => {
    const id = 'gantt-cell-edit';
    await gridRows(app, id).nth(1).scrollIntoViewIfNeeded();
    await gridRows(app, id).nth(1).locator('.e-rowcell').nth(1).dblclick();
    await expectEvent(app.page, 'cellEdit');
    await app.section(id).locator('input.e-field').first().fill('Cell renamed');
    await app.page.keyboard.press('Enter');
    await expectEvent(app.page, 'cellSave');
    await expectEvent(app.page, 'endEdit');
    expect(await evArg(app.page, 'cellSave', 'columnName')).toBe('TaskName');
    await expectWidget(app.page, id, 'w.flatData[1].ganttProperties.taskName', 'Cell renamed');
  });

  test('dependency options and predecessor validation toggle', async ({ app }) => {
    const id = 'gantt-deps';
    await expectWidget(app.page, id, 'w.enablePredecessorValidation', false);
    await expectWidget(app.page, id, 'w.autoUpdatePredecessorOffset', true);
    await expectWidget(app.page, id, 'w.allowParentDependency', true);
    await expectWidget(app.page, id, 'w.updateOffsetOnTaskbarEdit', true);
    await expectWidget(app.page, id, 'w.autoCalculateDateScheduling', true);
    await expectWidget(app.page, id, 'w.validateManualTasksOnLinking', true);
    await expect(app.section(id).locator('.e-line, .e-connector-line-container').first()).toBeAttached();
    await app.page.getByTestId('gantt-deps-toggle').click();
    await expectWidget(app.page, id, 'w.enablePredecessorValidation', true);
  });

  test('undo and redo revert a cell edit', async ({ app }) => {
    const id = 'gantt-undo';
    await expectWidget(app.page, id, 'w.enableUndoRedo', true);
    await expectWidget(app.page, id, 'w.undoRedoStepsCount', 5);
    await expectWidget(app.page, id, 'w.undoRedoActions', ['Edit', 'Add', 'Delete', 'Indent', 'Outdent']);
    await app.page.evaluate(() => {
      const w = (document.querySelector('[data-testid="gantt-undo"]') as any).au['ej2-gantt'].viewModel.widget;
      w.updateRecordByID({ TaskID: 1, TaskName: 'Changed' });
    });
    await expectWidget(app.page, id, 'w.flatData[0].ganttProperties.taskName', 'Changed');
    await item(app, id, 'undo').scrollIntoViewIfNeeded();
    await item(app, id, 'undo').click();
    await expectWidget(app.page, id, 'w.flatData[0].ganttProperties.taskName', 'Foundation');
    await item(app, id, 'redo').click();
    await expectWidget(app.page, id, 'w.flatData[0].ganttProperties.taskName', 'Changed');
  });

  test('readOnly blocks editing', async ({ app }) => {
    const id = 'gantt-readonly';
    await expectWidget(app.page, id, 'w.readOnly', true);
    await gridRows(app, id).nth(1).scrollIntoViewIfNeeded();
    await gridRows(app, id).nth(1).locator('.e-rowcell').nth(1).dblclick();
    await expect(app.section(id).locator('input.e-field')).toHaveCount(0);
  });

  test('taskMode Custom with a manual field', async ({ app }) => {
    const id = 'gantt-manual';
    await expectWidget(app.page, id, 'w.taskMode', 'Custom');
    await expectWidget(app.page, id, 'w.taskFields.manual', 'isManual');
    await expect(app.section(id).locator('.e-manualtaskbar, .e-gantt-manualparenttaskbar, [class*=manual]').first()).toBeAttached();
  });

  test('custom data binding: dataStateChange on sorting, dataSourceChanged on taskbar edit', async ({ app }) => {
    const id = 'gantt-state';
    await app.section(id).locator('.e-columnheader .e-headercell', { hasText: 'Name' }).click();
    await expectEvent(app.page, 'dataStateChange');
    await expect(app.page.getByTestId('gantt-state-last')).toHaveText('sorting');
    const bar = app.section(id).locator('.e-gantt-child-taskbar-inner-div').first();
    await bar.scrollIntoViewIfNeeded();
    const box = (await bar.boundingBox())!;
    await app.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await app.page.mouse.down();
    await app.page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2, { steps: 6 });
    await app.page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 6 });
    await app.page.mouse.up();
    await expectEvent(app.page, 'dataSourceChanged');
    await expect(app.page.getByTestId('gantt-state-changed')).not.toHaveText('');
  });
});
