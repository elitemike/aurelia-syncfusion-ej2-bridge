import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('treeView'));

test('renders nodes and honours initial expansion', async ({ app }) => {
  const section = app.section('tv-select');
  await expect(section.locator('li[data-uid]', { hasText: 'Program Files' }).first()).toBeVisible();
  await expect(section.locator('li[data-uid]', { hasText: 'Personals' })).toBeHidden();
});

test('initial selectedNodes selects the node', async ({ app }) => {
  await expect(app.section('tv-select').locator('li.e-active')).toContainText('Users');
});

test('selectedNodes two-way: view to model and nodeSelected event', async ({ app }) => {
  const section = app.section('tv-select');
  await section.locator('.e-list-text', { hasText: 'Program Files' }).click({ force: true });
  await expect(section.getByTestId('tv-selected-out')).toHaveText('01-01');
  await expect(section.getByTestId('tv-last')).toHaveText('Program Files');
  await expect(section.getByTestId('tv-events')).not.toHaveText('0');
});

test('selectedNodes two-way: model to view', async ({ app }) => {
  const section = app.section('tv-select');
  await section.getByTestId('tv-select-program-files').click();
  await expect(section.locator('li.e-active').first()).toContainText('Program Files');
});

test('checkedNodes two-way', async ({ app }) => {
  const section = app.section('tv-check');
  await expect(section.getByTestId('tv-checked-out')).toHaveText('02-01');
  await section.locator('li[data-uid="01"] > .e-text-content .e-checkbox-wrapper').click();
  await expect(section.getByTestId('tv-checked-out')).toContainText('01-01,01-02'); // autoCheck cascades to the children
});

test('expandedNodes two-way follows expand and collapse', async ({ app }) => {
  const section = app.section('tv-expand');
  await expect(section.getByTestId('tv-expanded-out')).toHaveText('01');
  await section.locator('li[data-uid="02"] > .e-text-content .e-icons').first().click();
  await expect(section.getByTestId('tv-expanded-out')).toContainText('02');
  await section.locator('li[data-uid="01"] > .e-text-content .e-icons').first().click();
  await expect(section.getByTestId('tv-expanded-out')).not.toContainText('01');
});

test('descending sort', async ({ app }) => {
  await expect(app.section('tv-sort').locator('li[data-uid]').first()).toContainText('Local Disk (D:)');
});

test('multi-selection with ctrl', async ({ app, page }) => {
  const section = app.section('tv-sort');
  await section.locator('.e-list-text', { hasText: 'Local Disk (D:)' }).click({ force: true });
  await page.keyboard.down('Control');
  await section.locator('.e-list-text', { hasText: 'Local Disk (C:)' }).click({ force: true });
  await page.keyboard.up('Control');
  await expect(section.locator('li.e-active')).toHaveCount(2);
});
