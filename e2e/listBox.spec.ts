import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app, page }) => {
  await page.route('**/api/lb-fail**', route => route.fulfill({ status: 500, body: 'nope' }));
  await app.open('listBox');
});

const items = (scope: Locator) => scope.locator('li.e-list-item');
const item = (scope: Locator, text: string) => scope.locator('li.e-list-item', { hasText: text });

async function drag(page: Page, from: Locator, to: Locator) {
  const a = await from.boundingBox();
  const b = await to.boundingBox();
  await from.hover();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(200);
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 3 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
  await page.mouse.move(b.x + b.width / 2 + 2, b.y + b.height / 2 + 2, { steps: 3 });
  await page.waitForTimeout(300);
  await page.mouse.up();
}

test('renders the data and the value is two-way: view to model', async ({ app }) => {
  const section = app.section('lb-basic');
  await expect(items(section)).toHaveCount(6);
  await expect(item(section, 'Football')).toHaveClass(/e-selected/);
  await item(section, 'Tennis').click({ modifiers: ['Control'] });
  await expect(section.getByTestId('lb-value-out')).toHaveText('Football,Tennis');
  await expect(section.getByTestId('lb-change-count')).toHaveText('1');
});

test('select is declared by the widget but never raised for item clicks, a raised select reaches the handler', async ({ app }) => {
  const section = app.section('lb-basic');
  await item(section, 'Golf').click();
  await expect(section.getByTestId('lb-select-count')).toHaveText('0');
  await section.getByTestId('lb-basic').evaluate((el: any) => el.au['ej2-list-box'].viewModel.widget.trigger('select', { item: null }));
  await expect(section.getByTestId('lb-select-count')).toHaveText('1');
});

test('value is two-way: model to view', async ({ app }) => {
  const section = app.section('lb-basic');
  await section.getByTestId('lb-set').click();
  await expect(item(section, 'Tennis')).toHaveClass(/e-selected/);
  await expect(item(section, 'Cricket')).toHaveClass(/e-selected/);
  await expect(item(section, 'Football')).not.toHaveClass(/e-selected/);
});

test('created, dataBound, beforeItemRender, actionBegin and actionComplete are raised', async ({ app }) => {
  const section = app.section('lb-basic');
  await expect(section.getByTestId('lb-created')).toHaveText('1');
  await expect(section.getByTestId('lb-data-bound')).not.toHaveText('0');
  expect(Number(await section.getByTestId('lb-item-render').textContent())).toBeGreaterThanOrEqual(6);
  await expect(section.getByTestId('lb-action-begin')).not.toHaveText('0');
  await expect(section.getByTestId('lb-action-complete')).not.toHaveText('0');
});

test('check boxes, select all, maximumSelectionLength, cssClass, zIndex and enabled', async ({ app }) => {
  const section = app.section('lb-checkbox');
  const host = section.getByTestId('lb-checkbox');
  await expect(section.locator('.e-selectall-parent')).toBeVisible();
  await expect(section.locator('li .e-checkbox-wrapper').first()).toBeVisible();
  await expect(section.locator('.e-listbox-wrapper')).toHaveClass(/lb-custom/);
  expect(await widgetProps(host, ['maximumSelectionLength', 'zIndex'])).toEqual({ maximumSelectionLength: 3, zIndex: 9000 });
  for (const t of ['Badminton', 'Basketball', 'Cricket', 'Football']) { await item(section, t).click(); }
  await expect(section.locator('li .e-frame.e-check')).toHaveCount(3);
  await section.getByTestId('lb-checkbox-change').click();
  await expect(section.locator('li .e-checkbox-wrapper')).toHaveCount(0);
  await expect(section.locator('.e-listbox-wrapper')).toHaveClass(/lb-custom-two/);
  expect(await widgetProp(host, 'maximumSelectionLength')).toBe(1);
  expect(await host.evaluate((el: any) => el.au['ej2-list-box'].viewModel.widget.selectionSettings.mode)).toBe('Single');
  await section.getByTestId('lb-checkbox-disable').click();
  await expect.poll(() => widgetProp(host, 'enabled')).toBe(false);
  await expect(section.locator('.e-listbox-wrapper')).toHaveClass(/e-disabled/);
});

test('filtering, sorting, filter options and the filtering event', async ({ app }) => {
  const section = app.section('lb-filter');
  const host = section.getByTestId('lb-filter');
  const input = section.locator('.e-filter-parent input');
  await expect(input).toHaveAttribute('placeholder', 'Search drinks');
  await expect(items(section).first()).toHaveText('Café');
  await input.click();
  await input.pressSequentially('cafe');
  await expect(section.getByTestId('lb-filter-count')).not.toHaveText('0');
  await expect(items(section)).toHaveCount(2);
  await section.getByTestId('lb-filter-change').click();
  await expect.poll(() => widgetProps(host, ['filterType', 'ignoreCase', 'ignoreAccent', 'sortOrder']))
    .toEqual({ filterType: 'Contains', ignoreCase: false, ignoreAccent: false, sortOrder: 'Descending' });
  await input.fill('');
  await input.pressSequentially('latte');
  await expect(items(section)).toHaveCount(1);
});

test('toolbar moves items between the list boxes', async ({ app }) => {
  const section = app.section('lb-dnd');
  const left = section.getByTestId('lb-left');
  const right = section.getByTestId('lb-right');
  await expect(items(left)).toHaveCount(4);
  await expect(items(right)).toHaveCount(2);
  await item(left, 'Banana').click();
  await section.locator('button[data-value="moveTo"]').click();
  await expect(items(left)).toHaveCount(3);
  await expect(items(right)).toHaveCount(3);
  await section.locator('button[data-value="moveAllTo"]').click();
  await expect(items(left)).toHaveCount(0);
  await expect(items(right)).toHaveCount(6);
  await section.locator('button[data-value="moveAllFrom"]').click();
  await expect(items(left)).toHaveCount(6);
  const before = (await items(left).allTextContents()).indexOf('Date');
  await item(left, 'Date').click();
  await section.locator('button[data-value="moveUp"]').click();
  await expect(items(left).nth(before - 1)).toHaveText('Date');
  await section.locator('button[data-value="moveDown"]').click();
  await expect(items(left).nth(before)).toHaveText('Date');
});

test('dragging an item raises dragStart, drag, beforeDrop and drop', async ({ app, page }) => {
  const section = app.section('lb-dnd');
  const left = section.getByTestId('lb-left');
  const right = section.getByTestId('lb-right');
  await expect(items(left)).toHaveCount(4);
  await section.getByTestId('lb-cancel-drop').click();
  await section.getByTestId('lb-cancel-drop').click();
  await drag(page, item(left, 'Apple'), items(right).first());
  await expect(section.getByTestId('lb-drag-start')).toHaveText('1');
  await expect(section.getByTestId('lb-drag')).not.toHaveText('0');
  await expect(section.getByTestId('lb-before-drop')).toHaveText('1');
  await expect(section.getByTestId('lb-drop')).toHaveText('1');
  await expect(items(right)).toHaveCount(3);
  await expect(items(left)).toHaveCount(3);
});

test('beforeDrop can cancel a drop', async ({ app, page }) => {
  const section = app.section('lb-dnd');
  const left = section.getByTestId('lb-left');
  const right = section.getByTestId('lb-right');
  await section.getByTestId('lb-cancel-drop').check();
  await drag(page, item(left, 'Apple'), items(right).first());
  await expect(section.getByTestId('lb-before-drop')).toHaveText('1');
  await expect(section.getByTestId('lb-drop')).toHaveText('0');
  await expect(items(right)).toHaveCount(2);
});

test('item, group and no records templates', async ({ app }) => {
  const section = app.section('lb-templates');
  await expect(section.locator('.lb-item-tpl')).toHaveCount(4);
  await expect(section.locator('.lb-item-tpl').first()).toContainText('Sport');
  await expect(section.locator('.lb-group-tpl')).toHaveCount(2);
  await expect(section.getByTestId('lb-empty').locator('.lb-none-tpl')).toHaveText('Nothing here');
});

test('data manager with a query', async ({ app }) => {
  const host = app.section('lb-remote').getByTestId('lb-query');
  await expect(items(host)).toHaveCount(3);
  await expect(items(host).last()).toHaveText('Three');
});

test('actionFailure and actionFailureTemplate when the data source fails, destroyed on removal', async ({ app }) => {
  const section = app.section('lb-remote');
  await section.getByTestId('lb-fail-load').click();
  await expect(section.getByTestId('lb-fail-count')).not.toHaveText('0');
  await expect(section.getByTestId('lb-fail').locator('.lb-fail-tpl')).toHaveText('Failed');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
  await section.getByTestId('lb-fail-toggle').click();
  await expect(section.getByTestId('lb-destroyed')).toHaveText('1');
});
