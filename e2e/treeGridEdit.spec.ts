import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evArg } = bridgeCtl('ej2-tree-grid', '__tgEvents');

test.describe('Tree Grid editing and export', () => {
  test.beforeEach(async ({ app }) => { await app.open('treeGrid'); });

  const rows = (app: any, id: string) => app.section(id).locator('.e-gridcontent .e-row');
  const toolbarItem = (app: any, id: string, icon: string) => app.section(id).locator(`.e-toolbar .e-toolbar-item:has(.e-${icon})`);

  test('normal editing: double click edits, Enter saves and raises the edit events', async ({ app }) => {
    const id = 'tg-edit-normal';
    await expectWidget(app.page, id, 'w.editSettings.mode', 'Normal');
    await expectWidget(app.page, id, 'w.editSettings.newRowPosition', 'Child');
    await rows(app, id).nth(1).scrollIntoViewIfNeeded();
    await rows(app, id).nth(1).locator('.e-rowcell').nth(1).dblclick();
    await expectEvent(app.page, 'beginEdit');
    const input = app.section(id).locator('.e-editedrow input[name="taskName"]');
    await input.fill('Plan timeline v2');
    await toolbarItem(app, id, 'update').click();
    await expectEvent(app.page, 'editActionBegin');
    await expect(app.page.getByTestId('tg-edit-last')).toHaveText('save');
    await expectWidget(app.page, id, 'w.getCurrentViewRecords()[1].taskName', 'Plan timeline v2');
  });

  test('toolbar Add inserts a child row, Delete removes the selected row, Cancel aborts', async ({ app }) => {
    const id = 'tg-edit-normal';
    await rows(app, id).first().scrollIntoViewIfNeeded();
    const before = await rows(app, id).count();
    await rows(app, id).first().locator('.e-rowcell').nth(1).click();
    await toolbarItem(app, id, 'add').click();
    await expect(app.section(id).locator('.e-addedrow')).toBeVisible();
    await app.section(id).locator('.e-addedrow input[name="taskID"]').fill('99');
    await app.section(id).locator('.e-addedrow input[name="taskName"]').fill('Added task');
    await toolbarItem(app, id, 'update').click();
    await expect(app.page.getByTestId('tg-edit-last')).toHaveText('save');
    await expect(rows(app, id)).toHaveCount(before + 1);
    await rows(app, id).nth(2).locator('.e-rowcell').nth(1).click();
    await toolbarItem(app, id, 'delete').click();
    await expect(app.page.getByTestId('tg-edit-last')).toHaveText('delete');
    await expect(rows(app, id)).toHaveCount(before);
    // cancel
    await rows(app, id).nth(2).locator('.e-rowcell').nth(1).dblclick();
    await expect(app.section(id).locator('.e-editedrow')).toBeVisible();
    await toolbarItem(app, id, 'cancel').click();
    await expect(app.section(id).locator('.e-editedrow')).toHaveCount(0);
    await expectEvent(app.page, 'editToolbarClick', 4);
  });

  test('cell editing raises cellEdit', async ({ app }) => {
    const id = 'tg-edit-cell';
    await rows(app, id).nth(1).scrollIntoViewIfNeeded();
    await rows(app, id).nth(1).locator('.e-rowcell').nth(1).dblclick();
    await expectEvent(app.page, 'cellEdit');
    await app.section(id).locator('input.e-field').first().fill('Cell edited');
    expect(await evArg(app.page, 'cellEdit', 'columnName')).toBe('taskName');
    await app.page.keyboard.press('Tab');
    await expectWidget(app.page, id, 'w.getCurrentViewRecords()[1].taskName', 'Cell edited');
    await expectWidget(app.page, id, 'w.editSettings.mode', 'Cell');
  });

  test('batch editing: add, delete, cancel and save events, plus copy and paste hooks', async ({ app }) => {
    const id = 'tg-edit-batch';
    await rows(app, id).first().scrollIntoViewIfNeeded();
    await rows(app, id).first().locator('.e-rowcell').nth(1).click();
    await toolbarItem(app, id, 'add').click();
    await expectEvent(app.page, 'beforeBatchAdd');
    await expectEvent(app.page, 'batchAdd');
    await rows(app, id).nth(3).locator('.e-rowcell').nth(1).click();
    await toolbarItem(app, id, 'delete').click();
    await expectEvent(app.page, 'beforeBatchDelete');
    await expectEvent(app.page, 'batchDelete');
    await toolbarItem(app, id, 'cancel').click();
    await app.page.locator('.e-dialog:visible button', { hasText: 'OK' }).click();
    await expectEvent(app.page, 'batchCancel');
    await rows(app, id).nth(1).locator('.e-rowcell').nth(1).dblclick();
    await app.section(id).locator('input.e-field').first().fill('Batch edit');
    await app.page.keyboard.press('Enter');
    await expectEvent(app.page, 'cellSave');
    await expectEvent(app.page, 'cellSaved');
    expect(await evArg(app.page, 'cellSave', 'value')).toBe('Batch edit');
    await toolbarItem(app, id, 'update').click();
    await app.page.locator('.e-dialog:visible button', { hasText: 'OK' }).click();
    await expectEvent(app.page, 'beforeBatchSave');
    await callCopyPaste(app, id);
    await expectEvent(app.page, 'beforeCopy');
    await expectEvent(app.page, 'beforePaste');
  });

  test('autoCheckHierarchy checks the children, checkboxChange is raised', async ({ app }) => {
    const id = 'tg-checkbox';
    // autoCheckHierarchy is a hidden property the tree grid derives from hierarchyCheckboxMode
    await expectWidget(app.page, id, 'w.autoCheckHierarchy', true);
    await expectWidget(app.page, id, 'w.hierarchyCheckboxMode', 'hierarchy');
    await rows(app, id).first().scrollIntoViewIfNeeded();
    await rows(app, id).first().locator('.e-treecheckbox, .e-checkbox-wrapper').first().click();
    await expectEvent(app.page, 'checkboxChange');
    await expect(rows(app, id).nth(1).locator('.e-check').first()).toBeVisible();
    await expectWidget(app.page, id, 'w.getCheckedRecords().length', 5);
  });
});

async function callCopyPaste(app: any, id: string) {
  await app.page.evaluate((testId: string) => {
    const w = (document.querySelector(`[data-testid="${testId}"]`) as any).au['ej2-tree-grid'].viewModel.widget;
    w.selectCell({ rowIndex: 0, cellIndex: 1 });
    w.copy();
    w.paste('Pasted', 0, 1);
  }, id);
}
