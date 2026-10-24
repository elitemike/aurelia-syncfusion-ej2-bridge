import { test, expect } from './fixtures';
import { callWidget, evArg, expectEvent, expectWidget } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('normal edit: beginEdit and actionBegin', async ({ app, page }) => {
  const grid = app.section('grid-edit');
  await grid.locator('.e-content tr.e-row').first().click();
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Edit' }).click();
  await expectEvent(page, 'edit.beginEdit');
  expect(await evArg(page, 'edit.beginEdit', 'rowData.OrderID')).toBe(10248);
  await expectEvent(page, 'edit.actionBegin');
  expect(await evArg(page, 'edit.actionBegin', 'requestType')).toBe('beginEdit');
});

test('batch editing: cell events', async ({ app, page }) => {
  const grid = app.section('grid-batch');
  const cell = grid.locator('.e-content tr.e-row').nth(1).locator('td').nth(1);
  await cell.dblclick();
  await expectEvent(page, 'batch.cellEdit');
  expect(await evArg(page, 'batch.cellEdit', 'columnName')).toBe('CustomerID');
  await grid.locator('.e-content tr.e-row').nth(1).locator('input[name="CustomerID"]').fill('BATCH');
  await grid.locator('.e-content tr.e-row').nth(3).locator('td').nth(2).click(); // leaving the cell saves it
  await expectEvent(page, 'batch.cellSave');
  await expectEvent(page, 'batch.cellSaved');
  expect(await evArg(page, 'batch.cellSaved', 'value')).toBe('BATCH');
});

test('batch editing: add, delete, update and cancel events', async ({ app, page }) => {
  const grid = app.section('grid-batch');
  const toolbar = (name: string) => grid.locator('.e-toolbar .e-toolbar-item', { hasText: name });

  await toolbar('Add').click();
  await expectEvent(page, 'batch.beforeBatchAdd');
  await expectEvent(page, 'batch.batchAdd');
  await expect(grid.locator('tr.e-insertedrow')).toHaveCount(1);

  await grid.locator('.e-content tr.e-row').nth(1).locator('td').nth(1).click();
  await toolbar('Delete').click();
  await expectEvent(page, 'batch.beforeBatchDelete');
  await expectEvent(page, 'batch.batchDelete');
  await expect(grid.locator('.e-hiddenrow, .e-row.e-hiddenrow')).toHaveCount(1);

  await toolbar('Cancel').click();
  await expectEvent(page, 'batch.batchCancel');
  await expect(grid.locator('tr.e-insertedrow')).toHaveCount(0);
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(5);

  await toolbar('Add').click();
  await toolbar('Update').click();
  await expectEvent(page, 'batch.beforeBatchSave');
  await expect(grid.locator('tr.e-insertedrow')).toHaveCount(0);
});

test('actionFailure handler receives widget failures', async ({ page }) => {
  await callWidget(page, 'grid-batch', "w.trigger('actionFailure', { error: 'boom' })");
  await expectEvent(page, 'batch.actionFailure');
  expect(await evArg(page, 'batch.actionFailure', 'error')).toBe('boom');
  await expectWidget(page, 'grid-batch', 'w.editSettings.mode', 'Batch');
});

test('command column raises commandClick', async ({ app, page }) => {
  const grid = app.section('grid-command');
  await grid.locator('.e-content tr.e-row').nth(2).locator('.details-command').click();
  await expectEvent(page, 'command.commandClick');
  expect(await evArg(page, 'command.commandClick', 'rowData.OrderID')).toBe(10250);
});
