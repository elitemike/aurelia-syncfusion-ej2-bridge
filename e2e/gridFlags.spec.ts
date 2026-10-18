import { test, expect } from './fixtures';

test('allowFiltering and allowGrouping bring their own modules', async ({ app }) => {
  await app.open('gridFlags');
  const grid = app.section('gf-filter-group');
  await expect(grid.locator('.e-filterbar')).toBeVisible();
  await expect(grid.locator('.e-groupdroparea')).toBeVisible();
});
