import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('listView'));

const widget = (testId: string) =>
  `(document.querySelector('[data-testid="${testId}"]').au['ej2-list-view'].viewModel.widget)`;

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

test('actionBegin and actionComplete fire for local data', async ({ app }) => {
  const section = app.section('lv-default');
  await expect(section.getByTestId('lv-begin')).toHaveText('1');
  await expect(section.getByTestId('lv-complete')).toHaveText('1');
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

test('remote data source with query and action events', async ({ app }) => {
  const section = app.section('lv-remote');
  await expect(section.locator('li.e-list-item')).toHaveText(['Remote one', 'Remote two']);
  await expect(section.getByTestId('lv-remote-begin')).toHaveText('1');
  await expect(section.getByTestId('lv-remote-complete')).toHaveText('1');
  // three rows exist, the bound query (take 2) limits the result
  await expect(section.locator('li.e-list-item')).toHaveCount(2);
});

test('actionFailure fires when the remote request fails', async ({ app }) => {
  await expect(app.section('lv-fail').getByTestId('lv-failures')).not.toHaveText('0');
});

test('cssClass, width, height, htmlAttributes, showIcon and animation', async ({ app, page }) => {
  const section = app.section('lv-style');
  const list = section.locator('.e-listview').first();
  await expect(list).toHaveClass(/my-list/);
  await expect(list).toHaveAttribute('data-foo', 'bar');
  await expect.poll(async () => (await list.boundingBox()).width).toBeCloseTo(240, 0);
  await expect.poll(async () => (await list.boundingBox()).height).toBeCloseTo(120, 0);
  await expect(list.locator('.e-list-icon')).toHaveCount(2);
  await expect(list.locator('.e-list-icon').first()).toHaveClass(/e-star-filled/);
  expect(await page.evaluate(`${widget('lv-style')}.animation.effect`)).toBe('None');
});

test('checkBoxPosition puts the check boxes on the right', async ({ app }) => {
  const item = app.section('lv-style').getByTestId('lv-checkpos').locator('li.e-list-item').first();
  await expect(item.locator('.e-checkbox-wrapper')).toHaveCount(1);
  await expect(item.locator('.e-checkbox-right, .e-checkbox-wrapper.e-checkbox-right').first()).toBeAttached();
});

test('enabled and enable disable the list', async ({ app }) => {
  const section = app.section('lv-state');
  const enabled = section.getByTestId('lv-enabled').locator('.e-listview');
  const enable = section.getByTestId('lv-enable').locator('.e-listview');
  await expect(enabled).not.toHaveClass(/e-disabled/);
  await section.getByTestId('lv-enabled-toggle').uncheck();
  await expect(enabled).toHaveClass(/e-disabled/);
  await section.getByTestId('lv-enabled-toggle').check();
  await expect(enabled).not.toHaveClass(/e-disabled/);
  await expect(enable).not.toHaveClass(/e-disabled/);
  await section.getByTestId('lv-enable-toggle').uncheck();
  await expect(enable).toHaveClass(/e-disabled/);
});

test('virtualization renders a window of rows and scroll fires', async ({ app, page }) => {
  const section = app.section('lv-scroll');
  const list = section.locator('.e-listview');
  await expect(section.locator('li.e-list-item').first()).toHaveText('Row 0');
  expect(await section.locator('li.e-list-item').count()).toBeLessThan(100);
  await expect.poll(async () => (await list.boundingBox()).height).toBeCloseTo(150, 0);
  await list.evaluate(el => { el.scrollTop = 300; });
  await expect(section.getByTestId('lv-scrolls')).not.toHaveText('0');
  await expect(section.getByTestId('lv-direction')).toHaveText('Bottom');
  await list.evaluate(el => { el.scrollTop = 0; });
  await expect(section.getByTestId('lv-direction')).toHaveText('Top');
  expect(await page.evaluate(`${widget('lv-scroll')}.enableVirtualization`)).toBe(true);
});

test('template, groupTemplate and headerTemplate', async ({ app }) => {
  const section = app.section('lv-templates');
  await expect(section.locator('.tpl-header')).toHaveText('Custom header');
  await expect(section.locator('.tpl-group')).toHaveText(['Group Fruit', 'Group Vegetable']);
  await expect(section.locator('.tpl-item')).toHaveText(['Item Apple', 'Item Banana', 'Item Carrot']);
});

test('enableHtmlSanitizer strips event handlers, disableHtmlEncode true shows markup as text', async ({ app }) => {
  const section = app.section('lv-html');
  await expect(section.getByTestId('lv-sanitized').locator('.rich')).toHaveCount(1);
  await expect(section.getByTestId('lv-sanitized').locator('.rich')).not.toHaveAttribute('onclick', /.*/);
  await expect(section.getByTestId('lv-unsanitized').locator('.rich')).toHaveAttribute('onclick', 'void 0');
  await expect(section.getByTestId('lv-encoded').locator('.rich')).toHaveCount(0);
  await expect(section.getByTestId('lv-encoded').locator('li.e-list-item')).toContainText('<span class="rich"');
});
