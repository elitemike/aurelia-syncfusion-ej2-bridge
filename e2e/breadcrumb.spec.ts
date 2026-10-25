import { test, expect } from './fixtures';
import { wrapperProp } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('breadcrumb'));

const items = (root) => root.locator('li.e-breadcrumb-item:not(.e-breadcrumb-separator)');

test('renders items with icon, urls and the active item', async ({ app }) => {
  const host = app.section('bc-default').getByTestId('bc-default');
  await expect(items(host)).toHaveCount(4);
  await expect(items(host).nth(0).locator('.e-breadcrumb-icon')).toBeVisible();
  await expect(items(host).nth(1).locator('a')).toHaveAttribute('href', 'http://bc.example.test/components');
  await expect(host.locator('li[data-active-item]')).toContainText('Breadcrumb');
  await expect(host.locator('li.e-breadcrumb-separator').first()).toHaveText('/');
});

test('created and beforeItemRender events', async ({ app }) => {
  const section = app.section('bc-default');
  await expect(section.getByTestId('bc-created')).toHaveText('1');
  await expect(section.getByTestId('bc-render')).not.toHaveText('0');
});

test('itemClick reports the item and the clicked item becomes the active one (two-way activeItem)', async ({ app, page }) => {
  const section = app.section('bc-default');
  const host = section.getByTestId('bc-default');
  const before = page.url();
  await expect(section.getByTestId('bc-active')).toHaveText('http://bc.example.test/crumb');
  await items(host).nth(1).locator('a').click();
  await expect(section.getByTestId('bc-clicked')).toHaveText('Components');
  await expect(section.getByTestId('bc-click-count')).toHaveText('1');
  await expect(section.getByTestId('bc-active')).toHaveText('http://bc.example.test/components');
  await expect(items(host)).toHaveCount(2);
  expect(page.url()).toBe(before);
});

test('activeItem follows the view-model', async ({ app }) => {
  const section = app.section('bc-default');
  const host = section.getByTestId('bc-default');
  await section.getByTestId('bc-activate').click();
  await expect(host.locator('li[data-active-item]')).toContainText('Navigation');
  await expect(items(host)).toHaveCount(3);
});

test('enableActiveItemNavigation makes the active item a link', async ({ app }) => {
  const section = app.section('bc-default');
  const host = section.getByTestId('bc-default');
  await expect(host.locator('li[data-active-item] a')).toHaveCount(0);
  await section.getByTestId('bc-allow-active').click();
  await expect.poll(() => wrapperProp(host, 'enableActiveItemNavigation')).toBe(true);
});

test('maxItems and overflowMode collapse the middle items', async ({ app }) => {
  const section = app.section('bc-overflow');
  const host = section.getByTestId('bc-overflow');
  await expect(host.locator('.e-breadcrumb-collapsed')).toBeVisible();
  await expect(items(host)).toHaveCount(2);
  await host.locator('.e-breadcrumb-collapsed').click();
  await expect(items(host)).toHaveCount(8);
  await section.getByTestId('bc-collapse').click();
  await expect.poll(() => wrapperProp(host, 'overflowMode')).toBe('Default');
  await expect.poll(() => wrapperProp(host, 'maxItems')).toBe(4);
});

test('itemTemplate and separatorTemplate customize the markup', async ({ app }) => {
  const host = app.section('bc-template').getByTestId('bc-template');
  await expect(host.locator('.bc-tpl')).toHaveText(['Home', 'Components', 'Navigation', 'Breadcrumb']);
  await expect(host.locator('.bc-sep').first()).toHaveText('>');
});

test('url generates the items and follows the view-model', async ({ app }) => {
  const section = app.section('bc-url');
  const host = section.getByTestId('bc-url');
  await expect(host.locator('li.e-breadcrumb-item a, li.e-breadcrumb-item span.e-breadcrumb-text').filter({ hasText: 'gamma' })).toBeVisible();
  await section.getByTestId('bc-change-url').click();
  await expect(host.locator('.e-breadcrumb-text').filter({ hasText: 'two' })).toBeVisible();
  await expect(host.locator('.e-breadcrumb-text').filter({ hasText: 'gamma' })).toHaveCount(0);
});

test('enableNavigation lets an item follow its url', async ({ app, page }) => {
  await page.route('http://bc.example.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>target</body></html>' }));
  const section = app.section('bc-nav');
  const host = section.getByTestId('bc-nav');
  await expect(items(host).nth(0)).not.toHaveClass(/e-navigable-disabled/);
  await section.getByTestId('bc-navigate').click();
  await expect.poll(() => wrapperProp(host, 'enableNavigation')).toBe(true);
  await Promise.all([page.waitForURL('http://bc.example.test/nav-target'), items(host).nth(0).locator('a').click()]);
});

test('cssClass follows the view-model and disabled blocks the breadcrumb', async ({ app }) => {
  const section = app.section('bc-nav');
  const host = section.getByTestId('bc-nav');
  await expect(host.locator('.e-breadcrumb')).toHaveClass(/bc-one/);
  await section.getByTestId('bc-restyle').click();
  await expect(host.locator('.e-breadcrumb')).toHaveClass(/bc-two/);
  await section.getByTestId('bc-disable').click();
  await expect(host.locator('.e-breadcrumb')).toHaveClass(/e-disabled/);
});
