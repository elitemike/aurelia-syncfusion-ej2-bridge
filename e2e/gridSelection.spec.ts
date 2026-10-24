import { test, expect } from './fixtures';
import { callWidget, evArg, evCount, expectEvent, expectWidget } from './gridHelpers';

test.beforeEach(async ({ app }) => app.open('grid'));

test('row and cell selection events', async ({ app, page }) => {
  const grid = app.section('grid-sel');
  const rows = grid.locator('.e-content tr.e-row');
  await rows.nth(0).locator('td').nth(2).click();
  for (const name of ['rowSelecting', 'rowSelected', 'cellSelecting', 'cellSelected']) {
    await expectEvent(page, `sel.${name}`);
  }
  expect(await evArg(page, 'sel.rowSelected', 'data.OrderID')).toBe(10248);
  expect(await evArg(page, 'sel.cellSelected', 'data.CustomerID')).toBe('VINET');

  // clicking the selected row again toggles it off
  await rows.nth(0).locator('td').nth(2).click();
  for (const name of ['rowDeselecting', 'rowDeselected', 'cellDeselecting', 'cellDeselected']) {
    await expectEvent(page, `sel.${name}`);
  }
  expect(await evArg(page, 'sel.rowDeselected', 'data.OrderID')).toBe(10248);
  await expect(rows.nth(0)).not.toHaveAttribute('aria-selected', 'true');
});

test('column selection events', async ({ app, page }) => {
  const grid = app.section('grid-sel');
  // the column selection handler listens for clicks on the header cell itself, not on its content
  await grid.locator('.e-headercell', { hasText: 'Customer ID' }).click({ position: { x: 3, y: 3 } });
  await expectEvent(page, 'sel.columnSelecting');
  await expectEvent(page, 'sel.columnSelected');
  expect(await evArg(page, 'sel.columnSelected', 'columnIndex')).toBe(2);
  await expectWidget(page, 'grid-sel', 'w.getSelectedColumnsUid().length', 1);
  await grid.locator('.e-headercell', { hasText: 'Ship Country' }).click({ position: { x: 3, y: 3 } });
  await expectEvent(page, 'sel.columnDeselecting');
  await expectEvent(page, 'sel.columnDeselected');
});

test('checkbox column raises checkBoxChange', async ({ app, page }) => {
  const grid = app.section('grid-sel');
  await grid.locator('.e-content tr.e-row').nth(2).locator('.e-checkbox-wrapper').click();
  await expectEvent(page, 'sel.checkBoxChange');
  expect(await evArg(page, 'sel.checkBoxChange', 'checked')).toBe(true);
  await expectWidget(page, 'grid-sel', 'w.getSelectedRecords().length', 1);
  await grid.locator('.e-content tr.e-row').nth(2).locator('.e-checkbox-wrapper').click();
  await expect.poll(() => evArg(page, 'sel.checkBoxChange', 'checked')).toBe(false);
});

test('auto fill, copy and paste events', async ({ app, page }) => {
  const grid = app.section('grid-fill');
  await expectWidget(page, 'grid-fill', 'w.enableAutoFill', true);
  const rows = grid.locator('.e-content tr.e-row');
  await rows.nth(0).locator('td').nth(2).click();
  const handle = grid.locator('.e-autofill');
  await expect(handle).toBeVisible();
  const from = await handle.boundingBox();
  const to = await rows.nth(2).locator('td').nth(2).boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 8 });
  await page.mouse.up();
  await expectEvent(page, 'fill.beforeAutoFill');

  await callWidget(page, 'grid-fill', 'w.copy()');
  await expectEvent(page, 'fill.beforeCopy');
  await callWidget(page, 'grid-fill', "w.clipboardModule.paste('Paris', 1, 2)");
  await expectEvent(page, 'fill.beforePaste');
  expect(await evCount(page, 'fill.beforePaste')).toBeGreaterThanOrEqual(1);
});

test('isRowSelectable blocks selection of a row', async ({ app, page }) => {
  const grid = app.section('grid-selectable').locator('[data-testid="grid-selectable"]');
  const rows = grid.locator('.e-content tr.e-row');
  await rows.nth(0).locator('td').first().click(); // 10248 is not selectable
  await expectWidget(page, 'grid-selectable', 'w.getSelectedRecords().length', 0);
  await rows.nth(1).locator('td').first().click();
  await expectWidget(page, 'grid-selectable', 'w.getSelectedRecords().length', 1);
  await expectWidget(page, 'grid-selectable', 'w.getSelectedRecords()[0].OrderID', 10249);
});

test('isRowPinned keeps a row on top across pages', async ({ app }) => {
  const grid = app.section('grid-selectable').locator('[data-testid="grid-pinned"]');
  // the pinned row is rendered above the content and stays when paging
  await expect(grid.locator('.e-gridheader tr.e-grid-pin-row')).toContainText('10252');
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('10248');
  await grid.locator('.e-pager .e-numericitem', { hasText: '2' }).click();
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('10252');
  await expect(grid.locator('.e-gridheader tr.e-grid-pin-row')).toContainText('10252');
});
