import { Page, Locator } from '@playwright/test';
import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('contextMenu'));

/** All menu lists (root and submenus) of the menu that carries the cssClass. */
function menus(page: Page, cssClass: string) {
  return page.locator(`.e-contextmenu-wrapper.${cssClass} ul`);
}

/** Right-click a target and return the opened menu, identified by the cssClass the demo gave it. */
async function openMenu(page: Page, target: Locator, cssClass: string) {
  await target.click({ button: 'right' });
  const menu = menus(page, cssClass).first();
  await expect(menu).toBeVisible();
  return menu;
}

test('right-click opens the menu with items, icons and separator', async ({ app, page }) => {
  const menu = await openMenu(page, app.section('cm-default').getByTestId('cm-target'), 'cm-default');
  await expect(menu.locator('> li.e-menu-item')).toHaveCount(6);
  await expect(menu.locator('> li.e-separator')).toHaveCount(1);
  await expect(menu.locator('> li', { hasText: 'Cut' }).locator('.e-menu-icon')).toBeVisible();
  await expect(menu.locator('> li', { hasText: 'Find' }).locator('.e-caret')).toBeVisible();
});

test('created, beforeItemRender, beforeOpen and onOpen events', async ({ app, page }) => {
  const section = app.section('cm-default');
  await expect(section.getByTestId('cm-created')).toHaveText('1');
  await openMenu(page, section.getByTestId('cm-target'), 'cm-default');
  await expect(section.getByTestId('cm-before-open')).toHaveText('1');
  await expect(section.getByTestId('cm-open')).toHaveText('1');
  await expect(section.getByTestId('cm-bir')).not.toHaveText('0');
});

test('select, beforeClose and onClose events', async ({ app, page }) => {
  const section = app.section('cm-default');
  const menu = await openMenu(page, section.getByTestId('cm-target'), 'cm-default');
  await menu.locator('> li', { hasText: 'Copy' }).click();
  await expect(section.getByTestId('cm-selected')).toHaveText('Copy');
  await expect(section.getByTestId('cm-select-count')).toHaveText('1');
  await expect(section.getByTestId('cm-before-close')).toHaveText('1');
  await expect(section.getByTestId('cm-close')).toHaveText('1');
  await expect(menu).toBeHidden();
});

test('submenu items are selectable', async ({ app, page }) => {
  const section = app.section('cm-default');
  const menu = await openMenu(page, section.getByTestId('cm-target'), 'cm-default');
  await menu.locator('> li', { hasText: 'Find' }).hover();
  const sub = menus(page, 'cm-default').nth(1);
  await expect(sub.locator('li', { hasText: 'Find next' })).toBeVisible();
  await sub.locator('li', { hasText: 'Find next' }).click();
  await expect(section.getByTestId('cm-selected')).toHaveText('Find next');
});

test('beforeOpen can cancel the menu', async ({ app, page }) => {
  const section = app.section('cm-default');
  await section.getByTestId('cm-block').click();
  await section.getByTestId('cm-target').click({ button: 'right' });
  await expect(section.getByTestId('cm-before-open')).toHaveText('1');
  await expect(section.getByTestId('cm-open')).toHaveText('0');
  await expect(menus(page, 'cm-default').first()).toBeHidden();
});

test('items follow the view-model', async ({ app, page }) => {
  const section = app.section('cm-default');
  await section.getByTestId('cm-add').click();
  const menu = await openMenu(page, section.getByTestId('cm-target'), 'cm-default');
  await expect(menu.locator('> li.e-menu-item')).toHaveCount(7);
  await expect(menu.locator('> li', { hasText: 'Added item' })).toBeVisible();
});

test('if.bind destroys and recreates the menu', async ({ app, page }) => {
  const section = app.section('cm-default');
  await section.getByTestId('cm-toggle').click();
  await expect(menus(page, 'cm-default')).toHaveCount(0);
  await section.getByTestId('cm-toggle').click();
  await expect(section.getByTestId('cm-created')).toHaveText('2');
  const menu = await openMenu(page, section.getByTestId('cm-target'), 'cm-default');
  await expect(menu.locator('> li.e-menu-item')).toHaveCount(6);
});

test('filter limits the menu to matching elements', async ({ app, page }) => {
  const section = app.section('cm-filter');
  await section.getByTestId('cm-row-no').click({ button: 'right' });
  await expect(menus(page, 'cm-filter').first()).toBeHidden();
  const menu = await openMenu(page, section.getByTestId('cm-row-yes'), 'cm-filter');
  await menu.locator('> li', { hasText: 'Paste' }).click();
  await expect(section.getByTestId('cm-filter-selected')).toHaveText('Paste');
  await expect.poll(() => wrapperProp(section.getByTestId('cm-filter'), 'filter')).toBe('cm-row');
});

test('itemTemplate renders custom markup', async ({ app, page }) => {
  const menu = await openMenu(page, app.section('cm-template').getByTestId('cm-template-target'), 'cm-template');
  await expect(menu.locator('.cm-tpl').first()).toHaveText('Cut!');
  await expect(menu.locator('.cm-tpl')).toHaveCount(6);
});

test('showItemOnClick opens submenus on click and hoverDelay is bound', async ({ app, page }) => {
  const section = app.section('cm-submenu');
  await expect.poll(() => wrapperProp(section.getByTestId('cm-click'), 'showItemOnClick')).toBe(true);
  const menu = await openMenu(page, section.getByTestId('cm-click-target'), 'cm-click');
  const find = menu.locator('> li', { hasText: 'Find' });
  await find.hover();
  await page.waitForTimeout(400);
  await expect(menus(page, 'cm-click')).toHaveCount(1);
  await find.click();
  await expect(menus(page, 'cm-click').nth(1).locator('li', { hasText: 'Find next' })).toBeVisible();
  await page.keyboard.press('Escape');
  await section.getByTestId('cm-slow').click();
  await expect.poll(() => wrapperProp(section.getByTestId('cm-click'), 'hoverDelay')).toBe(300);
});

test('showItemOnClick can be switched to hover from the view-model', async ({ app, page }) => {
  const section = app.section('cm-submenu');
  await section.getByTestId('cm-hover-mode').click();
  await expect.poll(() => wrapperProp(section.getByTestId('cm-click'), 'showItemOnClick')).toBe(false);
  const menu = await openMenu(page, section.getByTestId('cm-click-target'), 'cm-click');
  await menu.locator('> li', { hasText: 'Find' }).hover();
  await expect(menus(page, 'cm-click').nth(1).locator('li', { hasText: 'Find next' })).toBeVisible();
});

test('enableScrolling adds a vertical scroller to tall menus', async ({ app, page }) => {
  const section = app.section('cm-scroll');
  await expect.poll(() => wrapperProp(section.getByTestId('cm-scroll'), 'enableScrolling')).toBe(true);
  await openMenu(page, section.getByTestId('cm-scroll-target'), 'cm-scroll');
  await expect(page.locator('.e-contextmenu-wrapper.cm-scroll .e-menu-vscroll')).toBeAttached();
  await expect(page.locator('.e-contextmenu-wrapper.cm-scroll .e-scroll-down-nav')).toBeVisible();
});

test('fields map custom data names', async ({ app, page }) => {
  const section = app.section('cm-fields');
  const menu = await openMenu(page, section.getByTestId('cm-fields-target'), 'cm-fields');
  await expect(menu.locator('> li')).toHaveText(['Alpha', 'Beta']);
  await menu.locator('> li', { hasText: 'Alpha' }).hover();
  const sub = menus(page, 'cm-fields').nth(1);
  await sub.locator('li', { hasText: 'Alpha two' }).click();
  await expect(section.getByTestId('cm-field-selected')).toHaveText('Alpha two');
});

test('cssClass, animationSettings, enableHtmlSanitizer and template reach the widget', async ({ app, page }) => {
  const section = app.section('cm-custom');
  const host = section.getByTestId('cm-custom');
  const menu = await openMenu(page, section.getByTestId('cm-custom-target'), 'cm-custom');
  await expect(menu.locator('> li')).toHaveText(['Plain item', 'Another item']);
  await expect(menus(page, 'cm-custom').first().locator('xpath=..')).toHaveClass(/cm-custom/);
  await page.keyboard.press('Escape');
  await expect.poll(() => wrapperPath(host, 'animationSettings.effect')).toBe('ZoomIn');
  await section.getByTestId('cm-fade').click();
  await expect.poll(() => wrapperPath(host, 'animationSettings.effect')).toBe('FadeIn');
  await section.getByTestId('cm-restyle').click();
  await expect.poll(() => wrapperProp(host, 'cssClass')).toBe('cm-other');
  await expect(page.locator('.e-contextmenu-wrapper.cm-other')).toBeAttached();
  await section.getByTestId('cm-unsanitize').click();
  await expect.poll(() => wrapperProp(host, 'enableHtmlSanitizer')).toBe(false);
  await expect.poll(() => wrapperProp(host, 'template')).not.toBe(undefined);
});
