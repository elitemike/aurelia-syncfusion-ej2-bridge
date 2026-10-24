import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('menu'));

const popup = (page: import('@playwright/test').Page) => page.locator('.e-menu-popup.e-popup-open');

test('renders top level items with carets and a submenu hint', async ({ app }) => {
  const section = app.section('m-default');
  const bar = section.locator('ul.e-menu');
  await expect(bar.locator('> li.e-menu-item')).toHaveText(['File', 'Edit', 'View', 'Help']);
  await expect(bar.locator('> li', { hasText: 'File' }).locator('.e-caret')).toBeVisible();
  await expect(bar.locator('> li', { hasText: 'Help' }).locator('.e-caret')).toHaveCount(0);
});

test('created and beforeItemRender events are raised', async ({ app }) => {
  const section = app.section('m-default');
  await expect(section.getByTestId('m-created')).toHaveText('1');
  await expect(section.getByTestId('m-bir')).not.toHaveText('0');
});

test('hovering an item opens its submenu and raises beforeOpen and onOpen', async ({ app, page }) => {
  const section = app.section('m-default');
  await section.locator('ul.e-menu > li', { hasText: 'File' }).hover();
  await expect(popup(page).locator('li.e-menu-item')).toHaveText(['New', 'Open', '', 'Save']);
  await expect(popup(page).locator('li.e-separator')).toHaveCount(1);
  await expect(section.getByTestId('m-before-open')).toHaveText('1');
  await expect(section.getByTestId('m-open')).toHaveText('1');
});

test('select, beforeClose and onClose events', async ({ app, page }) => {
  const section = app.section('m-default');
  await section.locator('ul.e-menu > li', { hasText: 'File' }).hover();
  await popup(page).locator('li', { hasText: 'Open' }).click();
  await expect(section.getByTestId('m-selected')).toHaveText('Open');
  await expect(section.getByTestId('m-select-count')).toHaveText('1');
  await expect(section.getByTestId('m-before-close')).not.toHaveText('0');
  await expect(section.getByTestId('m-close')).not.toHaveText('0');
  await expect(popup(page)).toHaveCount(0);
});

test('nested submenus are reachable and selectable', async ({ app, page }) => {
  const section = app.section('m-default');
  await section.locator('ul.e-menu > li', { hasText: 'View' }).hover();
  await popup(page).locator('li', { hasText: 'Zoom' }).hover();
  await expect(popup(page).locator('li', { hasText: 'Zoom in' })).toBeVisible();
  await popup(page).locator('li', { hasText: 'Zoom in' }).click();
  await expect(section.getByTestId('m-selected')).toHaveText('Zoom in');
});

test('beforeOpen can cancel a submenu', async ({ app, page }) => {
  const section = app.section('m-default');
  await section.getByTestId('m-block').click();
  await section.locator('ul.e-menu > li', { hasText: 'Edit' }).hover();
  await expect(section.getByTestId('m-before-open')).toHaveText('1');
  await expect(section.getByTestId('m-open')).toHaveText('0');
  await expect(popup(page)).toHaveCount(0);
  await section.locator('ul.e-menu > li', { hasText: 'File' }).hover();
  await expect(popup(page).locator('li', { hasText: 'Save' })).toBeVisible();
});

test('items follow the view-model', async ({ app }) => {
  const section = app.section('m-default');
  await section.getByTestId('m-add').click();
  await expect(section.locator('ul.e-menu > li.e-menu-item')).toHaveText(['File', 'Edit', 'View', 'Help', 'Extra']);
});

test('if.bind destroys and recreates the menu', async ({ app }) => {
  const section = app.section('m-default');
  await section.getByTestId('m-toggle').click();
  await expect(section.locator('ul.e-menu')).toHaveCount(0);
  await section.getByTestId('m-toggle').click();
  await expect(section.getByTestId('m-created')).toHaveText('2');
  await expect(section.locator('ul.e-menu > li.e-menu-item')).toHaveCount(4);
});

test('orientation Vertical stacks the items', async ({ app }) => {
  const list = app.section('m-vertical').locator('ul.e-menu');
  await expect(list).toHaveClass(/e-vertical/);
  const first = await list.locator('> li').nth(0).boundingBox();
  const second = await list.locator('> li').nth(1).boundingBox();
  expect(second.y).toBeGreaterThan(first.y + first.height - 2);
  await expect.poll(() => wrapperProp(app.section('m-vertical').getByTestId('m-vertical'), 'orientation')).toBe('Vertical');
});

test('hamburgerMode shows a titled header that toggles the menu, title follows the view-model', async ({ app, page }) => {
  const section = app.section('m-hamburger');
  const header = section.locator('.e-menu-header');
  await expect(header.locator('.e-menu-title')).toHaveText('Navigation');
  await expect(section.locator('ul.e-menu')).toBeHidden();
  await header.locator('.e-menu-icon').dispatchEvent('click'); // the glyph has no box
  await expect(section.locator('ul.e-menu')).toBeVisible();
  await section.getByTestId('m-retitle').click();
  await expect(header.locator('.e-menu-title')).toHaveText('Renamed');
});

test('target element toggles a hamburger menu', async ({ app, page }) => {
  const section = app.section('m-target');
  await expect.poll(() => wrapperProp(section.getByTestId('m-target'), 'target')).toBe('#m-ham-button');
  await expect(section.locator('ul.e-menu')).toBeHidden();
  await section.getByTestId('m-ham-button').click();
  await expect(section.locator('ul.e-menu')).toBeVisible();
});

test('enableHtmlSanitizer strips inline handlers from the title', async ({ app, page }) => {
  const section = app.section('m-sanitize');
  await expect(section.getByTestId('m-sanitize').locator('.e-menu-title .m-evil')).not.toHaveAttribute('onmouseover', /.*/);
  await expect(section.getByTestId('m-unsafe').locator('.e-menu-title .m-evil')).toHaveAttribute('onmouseover', /__mxss/);
  await section.getByTestId('m-unsanitize').click();
  await expect.poll(() => wrapperProp(section.getByTestId('m-sanitize'), 'enableHtmlSanitizer')).toBe(false);
});

test('template renders custom item markup', async ({ app, page }) => {
  const section = app.section('m-template');
  await expect(section.locator('ul.e-menu > li .m-tpl')).toHaveText(['File!', 'Edit!', 'View!', 'Help!']);
  await section.locator('ul.e-menu > li', { hasText: 'File' }).hover();
  await expect(popup(page).locator('.m-tpl', { hasText: 'Save!' })).toBeVisible();
});

test('showItemOnClick opens submenus on click only', async ({ app, page }) => {
  const section = app.section('m-submenu');
  const host = section.getByTestId('m-click');
  await expect.poll(() => wrapperProp(host, 'showItemOnClick')).toBe(true);
  const file = section.locator('ul.e-menu > li', { hasText: 'File' });
  await file.hover();
  await page.waitForTimeout(400);
  await expect(popup(page)).toHaveCount(0);
  await file.click();
  await expect(popup(page).locator('li', { hasText: 'Save' })).toBeVisible();
});

test('showItemOnClick can be switched to hover and hoverDelay is bound', async ({ app, page }) => {
  const section = app.section('m-submenu');
  const host = section.getByTestId('m-click');
  await section.getByTestId('m-hover-mode').click();
  await expect.poll(() => wrapperProp(host, 'showItemOnClick')).toBe(false);
  await section.getByTestId('m-slow').click();
  await expect.poll(() => wrapperProp(host, 'hoverDelay')).toBe(300);
  await section.locator('ul.e-menu > li', { hasText: 'File' }).hover();
  await expect(popup(page).locator('li', { hasText: 'Save' })).toBeVisible();
});

test('enableScrolling adds scroll buttons when the items overflow', async ({ app }) => {
  const section = app.section('m-scroll');
  await expect.poll(() => wrapperProp(section.getByTestId('m-scroll'), 'enableScrolling')).toBe(true);
  await expect(section.locator('.e-scroll-nav.e-scroll-right-nav')).toBeVisible();
  const bar = section.locator('.e-hscroll-bar');
  const before = await bar.evaluate((el) => el.scrollLeft);
  await section.locator('.e-scroll-right-nav').click();
  await expect.poll(() => bar.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
});

test('fields map flat data with parent links', async ({ app, page }) => {
  const section = app.section('m-data');
  await expect(section.locator('ul.e-menu > li.e-menu-item')).toHaveText(['Home', 'Products', 'About']);
  await section.locator('ul.e-menu > li', { hasText: 'Products' }).hover();
  await expect(popup(page).locator('li.e-menu-item')).toHaveText(['Phones', 'Tablets']);
});

test('cssClass, icons, urls, animationSettings and filter reach the widget', async ({ app, page }) => {
  const section = app.section('m-custom');
  const host = section.getByTestId('m-custom');
  await expect(section.locator('.e-menu-wrapper')).toHaveClass(/m-custom/);
  await expect(section.locator('ul.e-menu > li.e-separator')).toHaveCount(1);
  await expect.poll(() => wrapperProp(host, 'filter')).toBe('m-row');
  await expect.poll(() => wrapperPath(host, 'animationSettings.effect')).toBe('FadeIn');
  await section.getByTestId('m-refade').click();
  await expect.poll(() => wrapperPath(host, 'animationSettings.effect')).toBe('SlideDown');
  await section.getByTestId('m-restyle').click();
  await expect(section.locator('.e-menu-wrapper')).toHaveClass(/m-other/);
  await section.locator('ul.e-menu > li', { hasText: 'Docs' }).locator('.e-menu-icon').waitFor();
  await section.locator('ul.e-menu > li', { hasText: 'Docs' }).hover();
  await expect(popup(page).locator('li', { hasText: 'API' }).locator('a')).toHaveAttribute('href', '#m-api');
});
