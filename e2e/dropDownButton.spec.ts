import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('dropDownButton'));

const btn = (section: any, id: string) => section.getByTestId(id).locator('button.e-dropdown-btn');
const pop = (page: any, cls: string) => page.locator(`.e-dropdown-popup.${cls}`);

test('basic: content, icon, css class and created', async ({ app }) => {
  const section = app.section('ddb-basic');
  await expect(section.getByTestId('ddb-created')).toHaveText('1');
  const b = btn(section, 'ddb-basic');
  await expect(b).toContainText('Menu');
  await expect(b.locator('.e-btn-icon:not(.e-caret)')).toHaveClass(/e-user/);
  await expect(b).toHaveClass(/ddb-basic-class/);
  expect(await widgetProp(b, 'popupWidth')).toBe('220px');
  expect(await widgetProp(b, 'enableHtmlSanitizer')).toBe(true);
});

test('basic: opening renders the items, raises beforeItemRender, beforeOpen, open and later beforeClose, close', async ({ app, page }) => {
  const section = app.section('ddb-basic');
  const b = btn(section, 'ddb-basic');
  await b.click();
  const p = pop(page, 'ddb-basic-class');
  await expect(p).toBeVisible();
  await expect(p.locator('li.e-item')).toHaveCount(4);
  await expect(p.locator('li.e-item .e-menu-item, li.e-item').first()).toContainText('Dashboard');
  await expect(p.locator('li.e-separator')).toHaveCount(1);
  await expect(p.locator('li.e-disabled')).toContainText('Log out');
  await expect(p).toHaveCSS('width', '220px');
  await expect(section.getByTestId('ddb-before-open')).toHaveText('1');
  await expect(section.getByTestId('ddb-opened')).toHaveText('1');
  expect(Number(await section.getByTestId('ddb-item-renders').textContent())).toBeGreaterThanOrEqual(3);
  await b.click();
  await expect(p).toBeHidden();
  await expect(section.getByTestId('ddb-before-close')).toHaveText('1');
  await expect(section.getByTestId('ddb-closed')).toHaveText('1');
});

test('basic: selecting an item raises select and closes the popup', async ({ app, page }) => {
  const section = app.section('ddb-basic');
  await btn(section, 'ddb-basic').click();
  const p = pop(page, 'ddb-basic-class');
  await p.getByText('Profile').click();
  await expect(section.getByTestId('ddb-selected')).toHaveText('Profile');
  await expect(p).toBeHidden();
});

test('basic: content, iconPosition and disabled follow the view-model', async ({ app }) => {
  const section = app.section('ddb-basic');
  const b = btn(section, 'ddb-basic');
  await section.getByTestId('ddb-content').click();
  await expect(b).toContainText('Account');
  await section.getByTestId('ddb-icon-position').selectOption('Top');
  await expect(b.locator('.e-btn-icon:not(.e-caret)')).toHaveClass(/e-icon-top/);
  await section.getByTestId('ddb-chk-disabled').check();
  await expect(b).toBeDisabled();
  await section.getByTestId('ddb-chk-disabled').uncheck();
  await expect(b).toBeEnabled();
});

test('element body is used as the button text', async ({ app }) => {
  await expect(btn(app.section('ddb-default-slot'), 'ddb-slot')).toContainText('Slot text');
});

test('target renders custom content in the popup, created on click, closeActionEvents is set', async ({ app, page }) => {
  const section = app.section('ddb-target');
  const b = btn(section, 'ddb-target');
  expect(await widgetProp(b, 'createPopupOnClick')).toBe(true);
  expect(await widgetProp(b, 'closeActionEvents')).toBe('click');
  expect(await widgetProp(b, 'target')).toBe('#ddb-target-content');
  await expect(pop(page, 'ddb-target-class')).toHaveCount(0);
  await b.click();
  await expect(pop(page, 'ddb-target-class').locator('.ddb-panel')).toBeVisible();
  await expect(pop(page, 'ddb-target-class')).toContainText('Custom panel content');
  await page.mouse.click(5, 5);
  await expect(pop(page, 'ddb-target-class')).toBeHidden();
});

test('itemTemplate and animationSettings', async ({ app, page }) => {
  const section = app.section('ddb-template');
  const b = btn(section, 'ddb-template');
  expect(await widgetProp(b, 'animationSettings')).toMatchObject({ effect: 'SlideDown', duration: 100 });
  await b.click();
  const tpl = pop(page, 'ddb-template-class').locator('.ddb-tpl');
  await expect(tpl.first()).toHaveText('tpl Dashboard');
  await expect(tpl.first()).toHaveAttribute('data-text', 'Dashboard');
});

test('html content is sanitized', async ({ app, page }) => {
  const b = btn(app.section('ddb-html'), 'ddb-html');
  await expect(b.locator('.ddb-bold')).toHaveText('Bold');
  expect(await page.evaluate(() => (window as any).__ddbXss)).toBeUndefined();
});
