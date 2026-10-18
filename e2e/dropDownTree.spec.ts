import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('dropDownTree'));

test('initial value is selected', async ({ app }) => {
  const section = app.section('ddt-value');
  await expect(section.locator('.e-ddt .e-chips, .e-ddt input.e-dropdowntree')).not.toHaveCount(0);
  await expect(section.locator('.e-ddt')).toContainText('Warming.ppt');
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ddt-value');
  const popup = await openPopup(page, section.locator('.e-ddt'), '.e-ddt.e-popup-open');
  await popup.getByText('Naturals.mp4', { exact: true }).click({ force: true });
  await page.locator('main h2').click(); // change is raised on blur (changeOnBlur)
  await expect(section.getByTestId('ddt-value-out')).toHaveText('02-01');
  await expect(section.getByTestId('ddt-text-out')).toHaveText('Naturals.mp4');
  await expect(section.getByTestId('ddt-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ddt-value');
  await section.getByTestId('ddt-set').click();
  await expect(section.locator('.e-ddt')).toContainText('Naturals.mp4');
});

test('checkbox mode selects several nodes', async ({ app, page }) => {
  const section = app.section('ddt-checkbox');
  const popup = await openPopup(page, section.locator('.e-ddt'), '.e-ddt.e-popup-open');
  await popup.locator('li[data-uid]', { has: page.getByText('Wild.mpeg', { exact: true }) }).last().locator('.e-checkbox-wrapper').first().click({ force: true });
  await popup.locator('li[data-uid]', { has: page.getByText('Naturals.mp4', { exact: true }) }).last().locator('.e-checkbox-wrapper').first().click({ force: true });
  await expect(section.locator('.e-ddt')).toContainText('Wild.mpeg');
  await expect(section.locator('.e-ddt')).toContainText('Naturals.mp4');
});

test('filtering narrows the tree', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ddt-filter').locator('.e-ddt'), '.e-ddt.e-popup-open');
  await popup.locator('.e-filter-wrap input').pressSequentially('wild');
  await expect(popup.locator('li.e-list-item:visible')).toHaveCount(2); // parent Videos + match
});
