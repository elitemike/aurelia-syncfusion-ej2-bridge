import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps, onWidget } from './pickerHelpers';

test.beforeEach(async ({ app, page }) => {
  await page.route('**/api/mc-fail**', route => route.fulfill({ status: 500, body: 'nope' }));
  await app.open('multiColumnComboBox');
});

const popup = (page: Page) => page.locator('.e-multicolumn-list.e-popup.e-popup-open').last();
const rows = (page: Page) => popup(page).locator('tr.e-row');

async function open(page: Page, host: Locator) {
  await host.locator('.e-multicolumn-list-icon').click();
  await expect(popup(page)).toBeVisible();
  await expect(popup(page).locator('.e-gridcontent tr').first()).toBeVisible();
  await page.waitForTimeout(250);
}

test('renders the bound value and raises created, open, actionBegin and actionComplete', async ({ app, page }) => {
  const section = app.section('mc-basic');
  const host = section.getByTestId('mc-basic');
  await expect(host.locator('input.e-multicolumncombobox')).toHaveValue('Anne Dodsworth');
  await expect(section.getByTestId('mc-created')).toHaveText('1');
  await open(page, host);
  await expect(section.getByTestId('mc-open')).toHaveText('1');
  await expect(rows(page)).toHaveCount(6);
  await expect(popup(page).locator('th .e-headertext')).toHaveText(['Name', 'Designation', 'Country']);
  await expect(section.getByTestId('mc-action-begin')).not.toHaveText('0');
  await expect(section.getByTestId('mc-action-complete')).not.toHaveText('0');
});

test('selecting a row raises select, change and close and updates value, text and index (view to model)', async ({ app, page }) => {
  const section = app.section('mc-basic');
  const host = section.getByTestId('mc-basic');
  await open(page, host);
  await rows(page).filter({ hasText: 'Margaret Peacock' }).locator('td').first().click();
  await expect(section.getByTestId('mc-value-out')).toHaveText('5');
  await expect(section.getByTestId('mc-text-out')).toHaveText('Margaret Peacock');
  await expect(section.getByTestId('mc-index-out')).toHaveText('4');
  await expect(section.getByTestId('mc-selected')).toHaveText('Margaret Peacock');
  await expect(section.getByTestId('mc-change-count')).toHaveText('1');
  await expect(section.getByTestId('mc-interacted')).toHaveText('true');
  await expect(section.getByTestId('mc-close')).toHaveText('1');
  await expect(host.locator('input.e-multicolumncombobox')).toHaveValue('Margaret Peacock');
});

test('value, text and index are two-way: model to view', async ({ app }) => {
  const section = app.section('mc-basic');
  const input = section.getByTestId('mc-basic').locator('input.e-multicolumncombobox');
  await section.getByTestId('mc-set-value').click();
  await expect(input).toHaveValue('Janet Leverling');
  await section.getByTestId('mc-set-index').click();
  await expect(input).toHaveValue('Andrew Fuller');
  await section.getByTestId('mc-set-text').click();
  await expect(input).toHaveValue('Tom Hardy');
});

test('select can cancel the selection', async ({ app, page }) => {
  const section = app.section('mc-basic');
  const host = section.getByTestId('mc-basic');
  await section.getByTestId('mc-cancel-select').check();
  await open(page, host);
  await rows(page).filter({ hasText: 'Laura Callahan' }).locator('td').first().click();
  await expect(section.getByTestId('mc-selected')).toHaveText('Laura Callahan');
  await expect(section.getByTestId('mc-value-out')).toHaveText('2');
  await expect(host.locator('input.e-multicolumncombobox')).toHaveValue('Anne Dodsworth');
});

test('filtering, filter type, sorting, clear button, float label, css class and sizes', async ({ app, page }) => {
  const section = app.section('mc-filter');
  const host = section.getByTestId('mc-filter');
  const input = host.locator('input.e-multicolumncombobox');
  expect(await widgetProps(host, ['allowFiltering', 'filterType', 'allowSorting', 'sortOrder', 'sortType', 'showClearButton', 'floatLabelType', 'width', 'popupWidth', 'popupHeight']))
    .toEqual({ allowFiltering: true, filterType: 'StartsWith', allowSorting: false, sortOrder: 'None', sortType: 'OneColumn', showClearButton: false, floatLabelType: 'Never', width: '300px', popupWidth: '400px', popupHeight: '200px' });
  await expect(host.locator('.e-multicolumn-list')).toHaveClass(/mc-custom/);
  await input.fill('');
  await input.pressSequentially('an');
  await expect(section.getByTestId('mc-filtering')).not.toHaveText('0');
  await expect(rows(page)).toHaveCount(2);
  await input.press('Escape');

  await section.getByTestId('mc-filter-change').click();
  await expect.poll(() => widgetProps(host, ['filterType', 'allowSorting', 'sortOrder', 'sortType', 'showClearButton', 'floatLabelType', 'width', 'popupWidth', 'popupHeight']))
    .toEqual({ filterType: 'Contains', allowSorting: true, sortOrder: 'Descending', sortType: 'MultipleColumns', showClearButton: true, floatLabelType: 'Always', width: '350px', popupWidth: '500px', popupHeight: '150px' });
  await expect(host.locator('.e-multicolumn-list')).toHaveClass(/mc-custom-two/);
  await expect(host.locator('.e-float-text')).toHaveText('Employee');
  await expect(host.locator('.e-clear-icon')).toHaveCount(1);
  await input.fill('');
  await input.pressSequentially('ar');
  await expect(rows(page).first()).toBeVisible();
  // Contains finds Margaret, Laura (Callahan has no ar) and Hardy, shown in descending order
  const names = await rows(page).locator('td:first-child').allTextContents();
  expect(names.length).toBeGreaterThan(1);
  expect(names).toEqual([...names].sort().reverse());
});

test('gridSettings reach the popup grid and virtualization renders only a window of rows', async ({ app, page }) => {
  const section = app.section('mc-grid');
  const host = section.getByTestId('mc-grid');
  await open(page, host);
  await expect(rows(page).nth(1)).toHaveClass(/e-altrow/);
  expect(await rows(page).first().evaluate(e => (e as HTMLElement).offsetHeight)).toBe(40);
  await host.locator('input').press('Escape');
  await section.getByTestId('mc-grid-change').click();
  expect(await onWidget(host, w => JSON.stringify([w.gridSettings.enableAltRow, w.gridSettings.rowHeight, w.gridSettings.gridLines, w.gridSettings.allowTextWrap, w.gridSettings.allowResizing])))
    .toBe(JSON.stringify([false, 30, 'None', true, true]));

  const virtual = section.getByTestId('mc-virtual');
  expect(await widgetProp(virtual, 'enableVirtualization')).toBe(true);
  await virtual.locator('input').press('Escape');
  await open(page, virtual);
  const count = await rows(page).count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(200);
});

test('item, footer, group, no records and action failure templates', async ({ app, page }) => {
  const section = app.section('mc-templates');
  const host = section.getByTestId('mc-templates');
  await open(page, host);
  await expect(popup(page).locator('.mc-footer-tpl')).toHaveText('Total rows');
  await expect(popup(page).locator('.mc-group-tpl')).toHaveCount(2);
  await host.locator('input').press('Escape');
  await host.locator('input').fill('');
  await host.locator('input').pressSequentially('zzz');
  await expect(popup(page).locator('.mc-none-tpl')).toHaveText('No employees');
  expect(await widgetProp(host, 'actionFailureTemplate')).toContain('mc-fail-tpl');
  // the item template is the row template of the popup grid
  const rowHost = section.getByTestId('mc-row-template');
  await open(page, rowHost);
  await expect(popup(page).locator('tr.mc-item-tpl')).toHaveCount(6);
  await expect(popup(page).locator('tr.mc-item-tpl').first().locator('td')).toHaveText(['Andrew Fuller', 'Team Lead', 'England']);
});

test('disabled, readonly, htmlAttributes, query, enablePersistence, enableRtl and locale', async ({ app, page }) => {
  const section = app.section('mc-state');
  const host = section.getByTestId('mc-state');
  const input = host.locator('input.e-multicolumncombobox');
  await expect(input).toBeDisabled();
  await expect(host.locator('[data-foo="bar"]')).toHaveCount(1);
  await expect(host.locator('.e-multicolumn-list')).toHaveClass(/e-rtl/);
  expect(await widgetProps(host, ['enablePersistence', 'locale'])).toEqual({ enablePersistence: false, locale: 'en-US' });
  await section.getByTestId('mc-state-change').click();
  await expect(input).toBeEnabled();
  await expect(host.locator('[data-foo="baz"]')).toHaveCount(1);
  expect(await widgetProp(host, 'readonly')).toBe(false);
  await open(page, host);
  await expect(rows(page)).toHaveCount(3);
});

test('readonly input', async ({ app }) => {
  const input = app.section('mc-state').getByTestId('mc-state').locator('input.e-multicolumncombobox');
  await expect(input).toHaveAttribute('readonly', '');
});

test('actionFailure and actionFailureTemplate when the data source fails', async ({ app, page }) => {
  const section = app.section('mc-fail');
  const host = section.getByTestId('mc-fail');
  await section.getByTestId('mc-fail-load').click();
  await host.locator('.e-multicolumn-list-icon').click();
  await expect(section.getByTestId('mc-failures')).not.toHaveText('0');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
});
