import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

// the toast host element is moved into the target (body by default) and carries the css class too
const hostEl = (page: any, cls: string) => page.locator(`.e-toast-container.${cls}`);

test.beforeEach(async ({ app }) => app.open('toast'));

const toastEl = (page: any, cls: string) => page.locator(`.e-toast[role="alert"].${cls}`);

test('basic: show renders title, content, icon, size and css class, hide removes it', async ({ app, page }) => {
  const section = app.section('toast-basic');
  await expect(section.getByTestId('ts-created')).toHaveText('1');
  const t = toastEl(page, 'ts-basic-class');
  await expect(t).toHaveCount(0);
  await section.getByTestId('ts-show').click();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-toast-title')).toHaveText('Saved');
  await expect(t.locator('.e-toast-content')).toHaveText('Your changes were saved');
  await expect(t.locator('.e-toast-icon')).toHaveClass(/e-check/);
  await expect(t).toHaveClass(/e-toast-success/);
  await expect(t).toHaveCSS('width', '320px');
  expect(await widgetProp(hostEl(page, 'ts-basic-class'), 'height')).toBe('auto');
  expect(await widgetProp(hostEl(page, 'ts-basic-class'), 'enableHtmlSanitizer')).toBe(true);
  await expect(section.getByTestId('ts-before-open')).toHaveText('1');
  await expect(section.getByTestId('ts-opened')).toHaveText('1');
  await section.getByTestId('ts-hide').click();
  await expect(t).toHaveCount(0);
  await expect(section.getByTestId('ts-before-close')).toHaveText('1');
  await expect(section.getByTestId('ts-closed')).toHaveText('1');
});

test('basic: the close button closes the toast, clicking the toast raises click', async ({ app, page }) => {
  const section = app.section('toast-basic');
  const t = toastEl(page, 'ts-basic-class');
  await section.getByTestId('ts-show').click();
  await expect(t).toBeVisible();
  await t.locator('.e-toast-content').click();
  await expect(section.getByTestId('ts-clicks')).toHaveText('1');
  await t.locator('.e-toast-close-icon').click();
  await expect(t).toHaveCount(0);
  await expect(section.getByTestId('ts-closed')).toHaveText('1');
});

test('content and showCloseButton follow the view-model', async ({ app, page }) => {
  const section = app.section('toast-basic');
  const t = toastEl(page, 'ts-basic-class');
  await section.getByTestId('ts-content').click();
  await section.getByTestId('ts-chk-close').uncheck();
  await section.getByTestId('ts-show').click();
  await expect(t.locator('.e-toast-content')).toHaveText('Updated content');
  await expect.poll(() => widgetProp(hostEl(page, 'ts-basic-class'), 'showCloseButton')).toBe(false);
  await expect(t.locator('.e-toast-close-icon')).toHaveCount(0);
});

test('timeOut closes the toast automatically and the progress bar is shown', async ({ app, page }) => {
  const section = app.section('toast-timeout');
  const t = toastEl(page, 'ts-timeout-class');
  await section.getByTestId('ts-timeout-show').click();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-toast-progress')).toHaveCount(1);
  const widget = hostEl(page, 'ts-timeout-class');
  expect(await widgetProp(widget, 'timeOut')).toBe(900);
  expect(await widgetProp(widget, 'extendedTimeout')).toBe(3000);
  expect(await widgetProp(widget, 'progressDirection')).toBe('Ltr');
  expect(await widgetProp(widget, 'showProgressBar')).toBe(true);
  await expect(t).toHaveCount(0, { timeout: 10_000 });
});

test('extendedTimeout keeps a hovered toast open longer than timeOut', async ({ app, page }) => {
  const section = app.section('toast-timeout');
  const t = toastEl(page, 'ts-timeout-class');
  await section.getByTestId('ts-timeout-show').click();
  await expect(t).toBeVisible();
  await t.hover();
  await page.mouse.move(0, 0);
  // mouse leave restarts the timer with extendedTimeout (3s) instead of timeOut (0.9s)
  await page.waitForTimeout(1500);
  await expect(t).toBeVisible();
  await expect(t).toHaveCount(0, { timeout: 10_000 });
});

test('position and target place the toast inside the container', async ({ app, page }) => {
  const section = app.section('toast-position');
  await section.getByTestId('ts-position-show').click();
  const t = toastEl(page, 'ts-position-class');
  await expect(t).toBeVisible();
  await expect(section.getByTestId('ts-target-box').locator('.e-toast-container .e-toast')).toHaveCount(1);
  const box = await t.boundingBox();
  const container = await section.getByTestId('ts-target-box').boundingBox();
  expect(box.x).toBeLessThan(container.x + 40);
  expect(box.y + box.height).toBeGreaterThan(container.y + container.height - 40);
  expect(await widgetProp(hostEl(page, 'ts-position-class'), 'target')).toBe('#ts-target-box');
  expect(await widgetProp(hostEl(page, 'ts-position-class'), 'position')).toEqual({ X: 'Left', Y: 'Bottom' });
});

test('animation settings are passed to the toast', async ({ app, page }) => {
  const section = app.section('toast-animation');
  await section.getByTestId('ts-anim-show').click();
  await expect(toastEl(page, 'ts-anim-class')).toBeVisible();
  const animation = await widgetProp(hostEl(page, 'ts-anim-class'), 'animation');
  expect(animation.show).toMatchObject({ effect: 'FadeZoomIn', duration: 100 });
  expect(animation.hide).toMatchObject({ effect: 'FadeZoomOut', duration: 100 });
});

test('buttons render in the toast and raise their click handlers', async ({ app, page }) => {
  const section = app.section('toast-buttons');
  const t = toastEl(page, 'ts-buttons-class');
  await section.getByTestId('ts-buttons-show').click();
  await expect(t.locator('.e-toast-actions button')).toHaveText(['Retry', 'Dismiss']);
  await t.getByRole('button', { name: 'Retry' }).click();
  await expect(section.getByTestId('ts-action')).toHaveText('retry');
  await t.getByRole('button', { name: 'Dismiss' }).click();
  await expect(section.getByTestId('ts-action')).toHaveText('dismiss');
  await expect(t).toHaveCount(0);
});

test('template replaces the default layout', async ({ app, page }) => {
  const section = app.section('toast-template');
  await section.getByTestId('ts-template-show').click();
  const t = toastEl(page, 'ts-template-class');
  await expect(t.locator('.ts-template-content')).toHaveText('Custom template toast');
  await expect(t.locator('.e-toast-message')).toHaveCount(0);
});

test('newestOnTop stacks the newest toast first', async ({ app, page }) => {
  const section = app.section('toast-order');
  await section.getByTestId('ts-order-first').click();
  await expect(section.getByTestId('ts-order-box').locator('.e-toast[role=alert]')).toHaveCount(1);
  await section.getByTestId('ts-order-second').click();
  const toasts = section.getByTestId('ts-order-box').locator('.e-toast[role=alert] .e-toast-content');
  await expect(toasts).toHaveText(['Second', 'First']);
  expect(await widgetProp(hostEl(page, 'ts-order-class'), 'newestOnTop')).toBe(true);
});

test('content is sanitized and beforeSanitizeHtml is raised', async ({ app, page }) => {
  const section = app.section('toast-sanitize');
  await section.getByTestId('ts-sanitize-show').click();
  const t = toastEl(page, 'ts-sanitize-class');
  await expect(t.getByTestId('ts-html')).toHaveText('Bold');
  await expect(t.locator('script')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__tsScript)).toBeUndefined();
  expect(await page.evaluate(() => (window as any).__tsXss)).toBeUndefined();
  expect(Number(await section.getByTestId('ts-sanitized').textContent())).toBeGreaterThan(0);
});

test('destroyed is raised when the toast is removed', async ({ app }) => {
  const section = app.section('toast-destroy');
  await expect(section.getByTestId('ts-destroyed')).toHaveText('0');
  await section.getByTestId('ts-chk-exists').uncheck();
  await expect(section.getByTestId('ts-destroyed')).toHaveText('1');
});
