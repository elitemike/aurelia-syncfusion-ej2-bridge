import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('grid'));

test('renders columns and a page of rows', async ({ app }) => {
  const grid = app.section('grid-default');
  await expect(grid.locator('.e-headercell')).toHaveCount(4);
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(5);
});

test('paging', async ({ app }) => {
  const grid = app.section('grid-default');
  await grid.locator('.e-pager .e-numericitem', { hasText: '2' }).click();
  await expect(grid.locator('.e-content tr.e-row').first().locator('td').first()).toHaveText('10253');
});

test('sorting by header click', async ({ app }) => {
  const grid = app.section('grid-default');
  await grid.locator('.e-headercell', { hasText: 'Freight' }).click();
  await expect(grid.locator('.e-headercell', { hasText: 'Freight' })).toHaveAttribute('aria-sort', 'ascending');
});

test('row selection raises rowSelected', async ({ app }) => {
  const grid = app.section('grid-default');
  await grid.locator('.e-content tr.e-row').nth(1).click();
  await expect(grid.locator('.e-content tr.e-row').nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(app.section('grid-default').getByTestId('grid-selected')).toHaveText('10249');
});

test('column chooser toolbar', async ({ app, page }) => {
  const grid = app.section('grid-chooser');
  await expect(grid.locator('.e-toolbar')).toBeVisible();
  await grid.locator('.e-toolbar .e-tbar-btn').first().click();
  await expect(page.locator('.e-ccdlg')).toBeVisible();
});

test('filter bar narrows the rows', async ({ app }) => {
  const grid = app.section('grid-filter');
  await expect(grid.locator('.e-filterbar')).toBeVisible();
  const input = grid.locator('.e-filterbar input').nth(1); // Customer ID
  await input.fill('HANAR');
  await input.press('Enter');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(2);
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('HANAR');
});

test('grouping renders group rows and drag-to-group area', async ({ app }) => {
  const grid = app.section('grid-group');
  await expect(grid.locator('.e-groupdroparea')).toBeVisible();
  await expect(grid.locator('.e-groupcaption').first()).toContainText('Ship Country: Austria');
  await expect(grid.locator('.e-grouped-chips, .e-grid-icon.e-groupheadercell').first()).toBeAttached();
});

test('editing: add a row through the toolbar', async ({ app }) => {
  const grid = app.section('grid-edit');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Add' }).click();
  await expect(grid.locator('.e-addedrow')).toBeVisible();
  await grid.locator('.e-addedrow input[name="OrderID"]').fill('20000');
  await grid.locator('.e-addedrow input[name="CustomerID"]').fill('NEWCO');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Update' }).click();
  await expect(grid.getByTestId('grid-last-action')).toHaveText('save');
  await expect(grid.locator('.e-content tr.e-row', { hasText: 'NEWCO' })).toHaveCount(1);
});

test('editing: validation blocks an empty required field', async ({ app }) => {
  const grid = app.section('grid-edit');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Add' }).click();
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Update' }).click();
  await expect(grid.locator('.e-griderror').first()).toBeVisible();
});

test('editing: edit and delete the selected row', async ({ app }) => {
  const grid = app.section('grid-edit');
  await grid.locator('.e-content tr.e-row').first().click();
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Edit' }).click();
  const field = grid.locator('.e-editedrow input[name="CustomerID"]');
  await field.fill('EDITED');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Update' }).click();
  await expect(grid.locator('.e-content tr.e-row').first()).toContainText('EDITED');
  await expect(grid.locator('.e-editedrow')).toHaveCount(0);
  await grid.locator('.e-content tr.e-row').nth(1).click(); // pick another row so the click always changes the selection
  await expect(grid.locator('.e-content tr.e-row').nth(1)).toHaveAttribute('aria-selected', 'true');
  await grid.locator('.e-toolbar .e-toolbar-item', { hasText: 'Delete' }).click();
  await expect(grid.getByTestId('grid-last-action')).toHaveText('delete');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(14);
  await expect(grid.locator('.e-content tr.e-row', { hasText: 'EDITED' })).toHaveCount(1);
});

test('search toolbar filters rows', async ({ app }) => {
  const grid = app.section('grid-search');
  await grid.locator('.e-search input').fill('SUPRD');
  await grid.locator('.e-search input').press('Enter');
  await expect(grid.locator('.e-content tr.e-row')).toHaveCount(1);
});

test('footer aggregate', async ({ app }) => {
  await expect(app.section('grid-aggregate').locator('.e-summarycell.e-templatecell')).toContainText('Sum: $');
});

test('selectedRowIndex two-way', async ({ app }) => {
  const grid = app.section('grid-selected-index');
  await expect(grid.locator('.e-content tr.e-row').nth(2)).toHaveAttribute('aria-selected', 'true');
  await grid.locator('.e-content tr.e-row').nth(3).click();
  await expect(grid.getByTestId('grid-index-out')).toHaveText('3');
  await grid.getByTestId('grid-index-4').click();
  await expect(grid.locator('.e-content tr.e-row').nth(4)).toHaveAttribute('aria-selected', 'true');
});
