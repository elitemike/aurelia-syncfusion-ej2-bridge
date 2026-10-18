import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('listView'));

test('renders items with header', async ({ app }) => {
  const section = app.section('lv-default');
  await expect(section.locator('.e-list-header')).toContainText('Folders');
  await expect(section.locator('li.e-list-item')).toHaveText(['Documents', 'Music', 'Pictures', 'Videos']);
});

test('select event carries the item', async ({ app }) => {
  const section = app.section('lv-default');
  await section.locator('li.e-list-item', { hasText: 'Pictures' }).click();
  await expect(section.getByTestId('lv-selected')).toHaveText('Pictures');
  await expect(section.getByTestId('lv-select-count')).toHaveText('1');
  await expect(section.locator('li.e-list-item.e-active')).toHaveText('Pictures');
});

test('checkboxes', async ({ app }) => {
  const section = app.section('lv-checkbox');
  await expect(section.locator('.e-checkbox-wrapper')).toHaveCount(4);
  await section.locator('li.e-list-item').first().click();
  await expect(section.locator('li.e-list-item').first().locator('.e-frame')).toHaveClass(/e-check/);
});

test('grouping renders group headers', async ({ app }) => {
  await expect(app.section('lv-grouped').locator('li.e-list-group-item')).toHaveText(['Fruit', 'Vegetable']);
});

test('descending sort order', async ({ app }) => {
  await expect(app.section('lv-sorted').locator('li.e-list-item').first()).toHaveText('Videos');
});
