import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('fileManager'));

test('loads the root folder through the service', async ({ app }) => {
  const section = app.section('fm-details');
  await expect(section.locator('.e-filemanager .e-toolbar')).toBeVisible();
  await expect(section.locator('.e-grid .e-row')).toHaveCount(2);
  await expect(section.locator('.e-grid .e-row', { hasText: 'Documents' })).toBeVisible();
  await expect(section.locator('.e-grid .e-row', { hasText: 'readme.txt' })).toBeVisible();
});

test('navigation pane shows the root', async ({ app }) => {
  await expect(app.section('fm-details').locator('.e-treeview .e-list-text', { hasText: 'Files' })).toBeVisible();
});

test('view binding switches to large icons', async ({ app }) => {
  const section = app.section('fm-details');
  await section.getByTestId('fm-icons-btn').click();
  await expect(section.locator('.e-large-icons')).toBeVisible();
  await expect(section.locator('.e-large-icons li.e-list-item')).toHaveCount(2);
  await section.getByTestId('fm-details-btn').click();
  await expect(section.locator('.e-grid .e-row')).toHaveCount(2);
});

test('fileOpen event is raised when opening a file', async ({ app }) => {
  const section = app.section('fm-details');
  await section.locator('.e-grid .e-row', { hasText: 'readme.txt' }).dblclick();
  await expect(section.getByTestId('fm-opened')).toHaveText('readme.txt');
  await expect(section.getByTestId('fm-open-count')).toHaveText('1');
});

test('navigation pane and toolbar can be customised', async ({ app }) => {
  const section = app.section('fm-minimal');
  await expect(section.locator('.e-navigation')).toBeHidden();
  await expect(section.locator('.e-toolbar .e-toolbar-item:visible')).toHaveCount(2);
});
