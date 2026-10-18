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
