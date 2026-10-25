import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('ribbon'));

const tabHeaders = (root) => root.locator('.e-ribbon-tab > .e-tab-header .e-toolbar-item');

test('renders tabs, groups and items of every type', async ({ app }) => {
  const host = app.section('rb-default').getByTestId('rb-default');
  await expect(tabHeaders(host)).toHaveCount(3);
  await expect(tabHeaders(host).nth(0)).toHaveClass(/e-active/);
  await expect(host.locator('.e-ribbon-group-header')).toHaveText(['Clipboard', 'Font']);
  await expect(host.locator('#d-paste_container button')).toContainText('Paste');
  await expect(host.locator('#d-size_container input.e-combobox')).toHaveValue('12');
  await expect(host.locator('#d-bold_container .e-checkbox-wrapper')).toBeVisible();
  await tabHeaders(host).nth(1).click();
  await expect(host.locator('#d-shapes_container')).toBeVisible();
  await expect(host.locator('#d-split_container .e-split-btn-wrapper')).toBeVisible();
  await tabHeaders(host).nth(2).click();
  await expect(host.locator('#d-color_container .e-colorpicker-wrapper')).toBeVisible();
  await expect(host.locator('#d-align_container .e-btn-group button')).toHaveCount(3);
});

test('created event', async ({ app }) => {
  await expect(app.section('rb-default').getByTestId('rb-created')).toHaveText('1');
});

test('two-way selectedTab: view to model with tabSelecting and tabSelected', async ({ app }) => {
  const section = app.section('rb-default');
  const host = section.getByTestId('rb-default');
  await expect(section.getByTestId('rb-tab')).toHaveText('0');
  await tabHeaders(host).nth(1).click();
  await expect(section.getByTestId('rb-tab')).toHaveText('1');
  await expect(section.getByTestId('rb-selecting')).toHaveText('1');
  await expect(section.getByTestId('rb-last-selecting')).toHaveText('1');
  await expect(section.getByTestId('rb-selected')).toHaveText('1');
  await expect(host.locator('#d-table_container')).toBeVisible();
});

test('two-way selectedTab: model to view', async ({ app }) => {
  const section = app.section('rb-default');
  const host = section.getByTestId('rb-default');
  await section.getByTestId('rb-go-view').click();
  await expect(tabHeaders(host).nth(2)).toHaveClass(/e-active/);
  await expect(host.locator('#d-color_container')).toBeVisible();
  await expect(section.getByTestId('rb-tab')).toHaveText('2');
});

test('button, check box and combo box item settings raise their own events', async ({ app, page }) => {
  const section = app.section('rb-default');
  const host = section.getByTestId('rb-default');
  await host.locator('#d-paste_container button').click();
  await expect(section.getByTestId('rb-paste')).toHaveText('1');
  await host.locator('#d-bold_container .e-checkbox-wrapper').click();
  await expect(section.getByTestId('rb-bold')).toHaveText('true');
  await host.locator('#d-size_container .e-input-group-icon').click();
  await expect(page.locator('.e-popup-open li', { hasText: '18' })).toBeVisible();
  await page.waitForTimeout(250); // let the popup finish animating in
  await page.locator('.e-popup-open li', { hasText: '18' }).click();
  await expect(section.getByTestId('rb-size')).toHaveText('18');
});

test('drop down and split button items open their menus', async ({ app, page }) => {
  const host = app.section('rb-default').getByTestId('rb-default');
  await tabHeaders(host).nth(1).click();
  await host.locator('#d-shapes_container button').first().click();
  await expect(page.locator('.e-dropdown-popup.e-popup-open li', { hasText: 'Circle' })).toBeVisible();
  await page.keyboard.press('Escape');
  await host.locator('#d-split_container .e-dropdown-btn').click();
  await expect(page.locator('.e-dropdown-popup.e-popup-open li', { hasText: 'Line' })).toBeVisible();
});

test('double-clicking the active tab toggles isMinimized (two-way) and raises collapsing and expanding', async ({ app }) => {
  const section = app.section('rb-default');
  const host = section.getByTestId('rb-default');
  await expect(section.getByTestId('rb-minimized')).toHaveText('false');
  await tabHeaders(host).nth(0).dblclick();
  await expect(section.getByTestId('rb-minimized')).toHaveText('true');
  await expect(section.getByTestId('rb-collapsing')).toHaveText('1');
  await tabHeaders(host).nth(0).click();
  await expect(section.getByTestId('rb-minimized')).toHaveText('false');
  await expect(section.getByTestId('rb-expanding')).toHaveText('1');
});

test('isMinimized: model to view', async ({ app }) => {
  const section = app.section('rb-default');
  await section.getByTestId('rb-minimize').click();
  await expect(section.getByTestId('rb-default').locator('.e-ribbon')).toHaveClass(/e-ribbon-minimize/);
  await expect.poll(() => wrapperProp(section.getByTestId('rb-default'), 'isMinimized')).toBe(true);
});

test('simplified layout renders one row and an overflow popup raises overflowPopupOpen and Close', async ({ app, page }) => {
  const section = app.section('rb-simplified');
  const host = section.getByTestId('rb-simplified');
  await expect(host.locator('.e-ribbon')).toHaveClass(/e-ribbon-simplified-mode/);
  await expect.poll(() => wrapperProp(host, 'activeLayout')).toBe('Simplified');
  const overflow = host.locator('.e-ribbon-overall-of-btn');
  await overflow.click();
  await expect(section.getByTestId('rb-overflow-open')).toHaveText('1');
  await page.keyboard.press('Escape');
  await page.mouse.click(5, 5);
  await expect(section.getByTestId('rb-overflow-close')).not.toHaveText('0');
});

test('layout switcher raises ribbonLayoutSwitched and follows activeLayout', async ({ app }) => {
  const section = app.section('rb-simplified');
  const host = section.getByTestId('rb-simplified');
  await host.locator('.e-ribbon-collapse-btn').click();
  await expect(section.getByTestId('rb-switched')).toHaveText('1');
  await expect(section.getByTestId('rb-layout')).toHaveText('Classic');
  await expect(host.locator('.e-ribbon')).not.toHaveClass(/e-ribbon-simplified-mode/);
});

test('activeLayout and hideLayoutSwitcher follow the view-model', async ({ app }) => {
  const section = app.section('rb-simplified');
  const host = section.getByTestId('rb-simplified');
  await expect(host.locator('.e-ribbon-collapse-btn')).toBeVisible();
  await section.getByTestId('rb-classic').click();
  await expect(host.locator('.e-ribbon')).not.toHaveClass(/e-ribbon-simplified-mode/);
  await section.getByTestId('rb-hide-switcher').click();
  await expect(host.locator('.e-ribbon-collapse-btn')).toHaveCount(0);
  await expect.poll(() => wrapperProp(host, 'hideLayoutSwitcher')).toBe(true);
});

test('fileMenu opens a menu and reports the selected item', async ({ app, page }) => {
  const section = app.section('rb-file');
  const host = section.getByTestId('rb-file');
  await host.locator('.e-ribbon-file-menu').click();
  await page.locator('.e-ribbon-file-menu-wrapper li, .e-menu-popup li, .e-dropdown-popup li', { hasText: 'Open' }).first().click();
  await expect(section.getByTestId('rb-file-selected')).toHaveText('Open');
});

test('backStageMenu opens a backstage with item content', async ({ app, page }) => {
  const host = app.section('rb-backstage').getByTestId('rb-backstage');
  await host.locator('.e-ribbon-backstage').first().click();
  await expect(page.locator('.rb-info')).toBeVisible();
  await page.locator('#bs-print').click();
  await expect(page.locator('.rb-print')).toBeVisible();
});

test('contextualTabs add a contextual tab that isSelected can select', async ({ app }) => {
  const section = app.section('rb-contextual');
  const host = section.getByTestId('rb-contextual');
  await expect(tabHeaders(host).filter({ hasText: 'Picture Format' })).toBeVisible();
  await expect(tabHeaders(host).filter({ hasText: 'Picture Format' })).not.toHaveClass(/e-active/);
  await section.getByTestId('rb-show-context').click();
  await expect(tabHeaders(host).filter({ hasText: 'Picture Format' })).toHaveClass(/e-active/);
});

test('enableKeyTips shows key tips on Alt and layoutSwitcherKeyTip is bound', async ({ app, page }) => {
  const section = app.section('rb-keytips');
  const host = section.getByTestId('rb-keytips');
  await expect.poll(() => wrapperProp(host, 'layoutSwitcherKeyTip')).toBe('LS');
  await expect(page.locator('.e-ribbon-keytip')).toHaveCount(0);
  await page.keyboard.press('Alt+Meta');
  await expect(page.locator('.e-ribbon-keytip').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await section.getByTestId('rb-no-keytips').click();
  await expect.poll(() => wrapperProp(host, 'enableKeyTips')).toBe(false);
});

test('launcher icon uses launcherIconCss and raises launcherIconClick', async ({ app }) => {
  const section = app.section('rb-launcher');
  const host = section.getByTestId('rb-launcher');
  await expect(host.locator('.e-ribbon-launcher-icon.e-save')).toBeVisible();
  await host.locator('.e-ribbon-launcher-icon').click();
  await expect(section.getByTestId('rb-launcher-count')).toHaveText('1');
});

test('helpPaneTemplate, cssClass, tabAnimation and width reach the widget', async ({ app }) => {
  const section = app.section('rb-misc');
  const host = section.getByTestId('rb-misc');
  await expect(host.locator('.rb-help')).toHaveText('Need help?');
  await expect(host.locator('.e-ribbon')).toHaveClass(/rb-one/);
  await expect.poll(() => wrapperPath(host, 'tabAnimation.next.effect')).toBe('None');
  expect((await host.locator('.e-ribbon').boundingBox()).width).toBeCloseTo(700, 0);
  await section.getByTestId('rb-restyle').click();
  await expect(host.locator('.e-ribbon')).toHaveClass(/rb-two/);
  await section.getByTestId('rb-resize').click();
  await expect.poll(async () => (await host.locator('.e-ribbon').boundingBox()).width).toBeCloseTo(520, 0);
});
