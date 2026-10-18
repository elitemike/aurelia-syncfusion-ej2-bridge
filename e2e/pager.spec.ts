import { test, expect } from './fixtures';

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
