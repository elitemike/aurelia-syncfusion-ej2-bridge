import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('fab'));

const fabIn = (section: any, box: string) => section.getByTestId(box).locator('button.e-fab');

test('basic: the button is moved into the target and gets content, icon, css class and created', async ({ app }) => {
  const section = app.section('fab-basic');
  await expect(section.getByTestId('fab-created')).toHaveText('1');
  const fab = fabIn(section, 'fab-box');
  await expect(fab).toBeVisible();
  await expect(fab).toContainText('Add');
  await expect(fab.locator('.e-btn-icon')).toHaveClass(/e-plus/);
  await expect(fab).toHaveClass(/fab-basic-class/);
  await expect(fab).toHaveClass(/e-primary/);
  await expect(fab).toHaveClass(/e-fab-bottom/);
  await expect(fab).toHaveClass(/e-fab-right/);
  expect(await widgetProp(fab, 'target')).toBe('#fab-box');
});

test('basic: clicked is a repeat event, a plain click does not raise it', async ({ app }) => {
  const section = app.section('fab-basic');
  await fabIn(section, 'fab-box').click();
  await expect(section.getByTestId('fab-clicked')).toHaveText('0');
  await expect(fabIn(section, 'fab-box')).toBeEnabled();
});

test('basic: position places the fab inside the container', async ({ app }) => {
  const section = app.section('fab-basic');
  const fab = fabIn(section, 'fab-box');
  const container = await section.getByTestId('fab-box').boundingBox();
  let box = await fab.boundingBox();
  expect(box.x + box.width).toBeGreaterThan(container.x + container.width - 40);
  expect(box.y + box.height).toBeGreaterThan(container.y + container.height - 40);
  await section.getByTestId('fab-position').selectOption('TopLeft');
  await expect(fab).toHaveClass(/e-fab-top/);
  await expect(fab).toHaveClass(/e-fab-left/);
  box = await fab.boundingBox();
  expect(box.x).toBeLessThan(container.x + 40);
  expect(box.y).toBeLessThan(container.y + 40);
  await section.getByTestId('fab-position').selectOption('MiddleCenter');
  await expect(fab).toHaveClass(/e-fab-middle/);
  await expect(fab).toHaveClass(/e-fab-center/);
});

test('basic: iconPosition, isPrimary, disabled and visible follow the view-model', async ({ app }) => {
  const section = app.section('fab-basic');
  const fab = fabIn(section, 'fab-box');
  await section.getByTestId('fab-icon-position').selectOption('Top');
  await expect(fab).toHaveClass(/e-top/);
  await section.getByTestId('fab-chk-primary').uncheck();
  await expect(fab).not.toHaveClass(/e-primary/);
  await section.getByTestId('fab-chk-disabled').check();
  await expect(fab).toBeDisabled();
  await section.getByTestId('fab-chk-disabled').uncheck();
  await expect(fab).toBeEnabled();
  await section.getByTestId('fab-chk-visible').uncheck();
  await expect(fab).toHaveClass(/e-fab-hidden/);
  await expect(fab).toBeHidden();
  await section.getByTestId('fab-chk-visible').check();
  await expect(fab).toBeVisible();
});

test('content is sanitized and follows the view-model', async ({ app, page }) => {
  const section = app.section('fab-content');
  const fab = fabIn(section, 'fab-content-box');
  await expect(fab).toContainText('Create');
  await section.getByTestId('fab-content-change').click();
  await expect(fab.locator('b')).toHaveText('new');
  expect(await page.evaluate(() => (window as any).__fabXss)).toBeUndefined();
  expect(await widgetProp(fab, 'enableHtmlSanitizer')).toBe(true);
});

test('isToggle toggles the active state on click', async ({ app }) => {
  const section = app.section('fab-toggle');
  const fab = fabIn(section, 'fab-toggle-box');
  expect(await widgetProp(fab, 'isToggle')).toBe(true);
  await expect(fab).not.toHaveClass(/e-active/);
  await fab.click();
  await expect(fab).toHaveClass(/e-active/);
  await fab.click();
  await expect(fab).not.toHaveClass(/e-active/);
});

test('enableRepeat raises clicked repeatedly while pressed', async ({ app, page }) => {
  const section = app.section('fab-repeat');
  const fab = fabIn(section, 'fab-repeat-box');
  await fab.scrollIntoViewIfNeeded();
  const box = await fab.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => Number(await section.getByTestId('fab-repeat-count').textContent())).toBeGreaterThan(3);
  await page.mouse.up();
  expect(await widgetProp(fab, 'repeatDelay')).toBe(100);
  expect(await widgetProp(fab, 'repeatInterval')).toBe(50);
});

test('the fab button is removed from the target when the view is left', async ({ app, page }) => {
  await expect(page.locator('button.e-fab')).toHaveCount(4);
  // client side navigation, the wrappers are detached without a page reload
  await page.getByTestId('nav-button').click();
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible();
  await expect(page.locator('button.e-fab')).toHaveCount(0);
});
