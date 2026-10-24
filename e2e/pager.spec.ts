import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('pager'));

test('renders pages and message', async ({ app }) => {
  const section = app.section('pg-current');
  await expect(section.locator('.e-currentitem')).toHaveText('1');
  await expect(section.locator('.e-parentmsgbar')).toContainText('1 of 10 pages (100 items)');
});

test('two-way current page: view to model', async ({ app }) => {
  const section = app.section('pg-current');
  await section.locator('.e-numericitem', { hasText: '3' }).click();
  await expect(section.getByTestId('pg-current-out')).toHaveText('3');
  await expect(section.getByTestId('pg-click-count')).toHaveText('1');
  await section.locator('.e-next').first().click();
  await expect(section.getByTestId('pg-current-out')).toHaveText('4');
});

test('two-way current page: model to view', async ({ app }) => {
  const section = app.section('pg-current');
  await section.getByTestId('pg-goto-5').click();
  await expect(section.locator('.e-currentitem')).toHaveText('5');
});

test('page size dropdown and page count', async ({ app }) => {
  const section = app.section('pg-size');
  await expect(section.locator('.e-numericitem')).toHaveCount(4); // pageCount 3 plus the current page link
  await expect(section.locator('.e-pagerdropdown')).toBeVisible();
});

test('external message', async ({ app }) => {
  await expect(app.section('pg-message').locator('.e-pagerexternalmsg')).toContainText('Custom pager message');
});

test('totalRecordsCount and pageSize follow the view-model', async ({ app }) => {
  const section = app.section('pg-current');
  await section.getByTestId('pg-size-20').click();
  await expect(section.locator('.e-parentmsgbar')).toContainText('1 of 5 pages (100 items)');
  await section.getByTestId('pg-total-50').click();
  await expect(section.locator('.e-parentmsgbar')).toContainText('1 of 3 pages (50 items)');
});

test('pageCount follows the view-model', async ({ app }) => {
  const section = app.section('pg-size');
  await section.getByTestId('pg-count-5').click();
  await expect(section.locator('.e-numericitem')).toHaveCount(6);
});

test('created and dropDownChanged events fire', async ({ app, page }) => {
  const section = app.section('pg-size');
  await expect(section.getByTestId('pg-created')).not.toHaveText('0'); // Pager raises created more than once
  // the pager also raises dropDownChanged while rendering the dropdown
  await expect(section.getByTestId('pg-dd-count')).toHaveText('1');
  await expect(section.getByTestId('pg-dd-size')).toHaveText('10');
  const popup = await openPopup(page, section.locator('.e-pagerdropdown .e-ddl'));
  await popup.locator('.e-list-item', { hasText: '20' }).click();
  await expect(section.getByTestId('pg-dd-count')).toHaveText('2');
  await expect(section.getByTestId('pg-dd-size')).toHaveText('20');
  await expect(section.locator('.e-parentmsgbar')).toContainText('of 5 pages');
});

test('cssClass, customText, enablePagerMessage and enableQueryString', async ({ app, page }) => {
  const section = app.section('pg-look');
  await expect(section.locator('.e-pager')).toHaveClass(/my-pager/);
  await expect(section.locator('.e-parentmsgbar')).toHaveCount(1);
  await expect(section.locator('.e-numericitem').first()).toContainText('Pg 1');
  const q = await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="pg-look"]') as any).au['ej2-pager'].viewModel.widget;
    return [w.enableQueryString, w.enablePagerMessage];
  });
  // enablePagerMessage=false makes Syncfusion's own resize handler throw, so only the enabled state is covered
  expect(q).toEqual([false, true]);
});

test('template replaces the default elements', async ({ app }) => {
  const section = app.section('pg-template');
  await expect(section.locator('.my-pager-tpl')).toHaveText('Template pager');
  await expect(section.locator('.e-numericitem')).toHaveCount(0);
});
