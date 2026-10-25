import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('splitButton'));

const btn = (section: any, id: string) => section.getByTestId(id).locator('button.e-split-btn');
const toggle = (section: any, id: string) => section.getByTestId(id).locator('button.e-dropdown-btn');
const pop = (page: any, cls: string) => page.locator(`.e-dropdown-popup.${cls}`);

test('basic: content, icon, css class and created', async ({ app }) => {
  const section = app.section('sdb-basic');
  await expect(section.getByTestId('sdb-created')).toHaveText('1');
  const b = btn(section, 'sdb-basic');
  await expect(b).toContainText('Menu');
  await expect(b.locator('.e-btn-icon')).toHaveClass(/e-user/);
  await expect(b).toHaveClass(/sdb-basic-class/);
  expect(await widgetProp(b, 'popupWidth')).toBe('220px');
  expect(await widgetProp(b, 'enableHtmlSanitizer')).toBe(true);
});

test('basic: opening renders the items, raises beforeItemRender, beforeOpen, open and later beforeClose, close', async ({ app, page }) => {
  const section = app.section('sdb-basic');
  const b = btn(section, 'sdb-basic');
  await toggle(section, 'sdb-basic').click();
  const p = pop(page, 'sdb-basic-class');
  await expect(p).toBeVisible();
  await expect(p.locator('li.e-item')).toHaveCount(4);
  await expect(p.locator('li.e-item .e-menu-item, li.e-item').first()).toContainText('Dashboard');
  await expect(p.locator('li.e-separator')).toHaveCount(1);
  await expect(p.locator('li.e-disabled')).toContainText('Log out');
  // popupWidth is stored but the v35 SplitButton popup does not use it for its width
  expect(await widgetProp(btn(section, 'sdb-basic'), 'popupWidth')).toBe('220px');
  await expect(section.getByTestId('sdb-before-open')).toHaveText('1');
  await expect(section.getByTestId('sdb-opened')).toHaveText('1');
  expect(Number(await section.getByTestId('sdb-item-renders').textContent())).toBeGreaterThanOrEqual(3);
  await toggle(section, 'sdb-basic').click();
  await expect(p).toBeHidden();
  await expect(section.getByTestId('sdb-before-close')).toHaveText('1');
  await expect(section.getByTestId('sdb-closed')).toHaveText('1');
});

test('basic: selecting an item raises select and closes the popup', async ({ app, page }) => {
  const section = app.section('sdb-basic');
  await toggle(section, 'sdb-basic').click();
  const p = pop(page, 'sdb-basic-class');
  await p.getByText('Profile').click();
  await expect(section.getByTestId('sdb-selected')).toHaveText('Profile');
  await expect(p).toBeHidden();
});

test('basic: content, iconPosition and disabled follow the view-model', async ({ app }) => {
  const section = app.section('sdb-basic');
  const b = btn(section, 'sdb-basic');
  await section.getByTestId('sdb-content').click();
  await expect(b).toContainText('Account');
  await section.getByTestId('sdb-icon-position').selectOption('Top');
  await expect(b.locator('.e-btn-icon')).toHaveClass(/e-icon-top/);
  await section.getByTestId('sdb-chk-disabled').check();
  await expect(b).toBeDisabled();
  await section.getByTestId('sdb-chk-disabled').uncheck();
  await expect(b).toBeEnabled();
});

test('element body is used as the button text', async ({ app }) => {
  await expect(btn(app.section('sdb-default-slot'), 'sdb-slot')).toContainText('Slot text');
});

test('target renders custom content in the popup, created on click, closeActionEvents is set', async ({ app, page }) => {
  const section = app.section('sdb-target');
  const b = btn(section, 'sdb-target');
  expect(await widgetProp(b, 'createPopupOnClick')).toBe(true);
  expect(await widgetProp(b, 'closeActionEvents')).toBe('click');
  expect(await widgetProp(b, 'target')).toBe('#sdb-target-content');
  await expect(pop(page, 'sdb-target-class')).toHaveCount(0);
  await toggle(section, 'sdb-target').click();
  await expect(pop(page, 'sdb-target-class').locator('.sdb-panel')).toBeVisible();
  await expect(pop(page, 'sdb-target-class')).toContainText('Custom panel content');
  await page.mouse.click(5, 5);
  await expect(pop(page, 'sdb-target-class')).toBeHidden();
});

test('itemTemplate and animationSettings reach the widget', async ({ app, page }) => {
  const section = app.section('sdb-template');
  const b = btn(section, 'sdb-template');
  expect(await widgetProp(b, 'animationSettings')).toMatchObject({ effect: 'SlideDown', duration: 100 });
  // SplitButton does not declare itemTemplate (only DropDownButton renders it), so the property is only stored
  expect(await widgetProp(b, 'itemTemplate')).toContain('sdb-tpl');
  await toggle(section, 'sdb-template').click();
  await expect(pop(page, 'sdb-template-class').locator('li.e-item').first()).toContainText('Dashboard');
});

test('html content is sanitized', async ({ app, page }) => {
  const b = btn(app.section('sdb-html'), 'sdb-html');
  await expect(b.locator('.sdb-bold')).toHaveText('Bold');
  expect(await page.evaluate(() => (window as any).__sdbXss)).toBeUndefined();
});

test('primary button click raises click, the secondary button opens the popup', async ({ app, page }) => {
  const section = app.section('sdb-basic');
  await btn(section, 'sdb-basic').click();
  await expect(section.getByTestId('sdb-primary')).toHaveText('1');
  await expect(pop(page, 'sdb-basic-class')).toBeHidden();
  await section.getByTestId('sdb-basic').locator('button.e-dropdown-btn').click();
  await expect(pop(page, 'sdb-basic-class')).toBeVisible();
});
