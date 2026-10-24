import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('tooltip'));

const tip = (page: any, cls: string) => page.locator(`.e-tooltip-wrap.${cls}`);

test('basic: hover opens the tooltip with content, size, css class and html attributes, leaving closes it', async ({ app, page }) => {
  const section = app.section('tooltip-basic');
  await expect(section.getByTestId('tt-created')).toHaveText('1');
  const t = tip(page, 'tt-basic-class');
  await expect(t).toHaveCount(0);
  await section.getByTestId('tt-basic-target').hover();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-tip-content')).toHaveText('Hello from the tooltip');
  await expect(t).toHaveCSS('width', '220px');
  // Syncfusion v35 stores htmlAttributes on the widget but never applies them to the popup element
  expect(await widgetProp(section.getByTestId('tt-basic'), 'htmlAttributes')).toEqual({ 'data-tt': 'basic' });
  expect(await widgetProp(section.getByTestId('tt-basic'), 'height')).toBe('auto');
  await expect(section.getByTestId('tt-before-render')).toHaveText('1');
  await expect(section.getByTestId('tt-before-open')).toHaveText('1');
  await expect(section.getByTestId('tt-after-open')).toHaveText('1');
  await section.getByTestId('tt-basic-outside').hover();
  await expect(t).toHaveCount(0);
  await expect(section.getByTestId('tt-before-close')).toHaveText('1');
  await expect(section.getByTestId('tt-after-close')).toHaveText('1');
});

test('basic: position, offsetX, tip pointer and content follow the view-model', async ({ app, page }) => {
  const section = app.section('tooltip-basic');
  const target = section.getByTestId('tt-basic-target');
  const t = tip(page, 'tt-basic-class');
  await target.hover();
  await expect(t).toBeVisible();
  const targetBox = await target.boundingBox();
  let box = await t.boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(targetBox.y + 2);
  await expect(t.locator('.e-arrow-tip')).toBeVisible();
  const xBefore = box.x;
  await section.getByTestId('tt-basic-outside').hover();
  await expect(t).toHaveCount(0);
  await section.getByTestId('tt-offset').click();
  await expect.poll(() => widgetProp(section.getByTestId('tt-basic'), 'offsetX')).toBe(30);
  await section.getByTestId('tt-position-bottom').click();
  await section.getByTestId('tt-content-change').click();
  await section.getByTestId('tt-chk-tip').uncheck();
  await expect.poll(() => widgetProp(section.getByTestId('tt-basic'), 'showTipPointer')).toBe(false);
  await target.hover();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-tip-content')).toHaveText('Updated tooltip content');
  await expect(t.locator('.e-arrow-tip')).toHaveCount(0);
  box = await t.boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(targetBox.y + targetBox.height - 2);
  expect(Math.abs(box.x - xBefore - 30)).toBeLessThan(40);
  expect(await widgetProp(section.getByTestId('tt-basic'), 'tipPointerPosition')).toBe('Middle');
  expect(await widgetProp(section.getByTestId('tt-basic'), 'windowCollision')).toBe(false);
});

test('title attribute is the default content', async ({ app, page }) => {
  const section = app.section('tooltip-title');
  await section.getByTestId('tt-title-target').hover();
  await expect(tip(page, 'tt-title-class').locator('.e-tip-content')).toHaveText('Title from the attribute');
});

test('opensOn Click opens on click and not on hover', async ({ app, page }) => {
  const section = app.section('tooltip-opens');
  const t = tip(page, 'tt-opens-class');
  await section.getByTestId('tt-opens-target').hover();
  await expect(t).toHaveCount(0);
  await section.getByTestId('tt-opens-target').click();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-tip-content')).toHaveText('Opened by click');
  expect(await widgetProp(section.getByTestId('tt-opens'), 'opensOn')).toBe('Click');
});

test('isSticky keeps the tooltip open with a close icon', async ({ app, page }) => {
  const section = app.section('tooltip-sticky');
  const t = tip(page, 'tt-sticky-class');
  await section.getByTestId('tt-sticky-target').hover();
  await expect(t).toBeVisible();
  await expect(t.locator('.e-tooltip-close')).toBeVisible();
  await page.mouse.move(5, 5);
  await expect(t).toBeVisible();
  await t.locator('.e-tooltip-close').click();
  await expect(t).toHaveCount(0);
});

test('mouseTrail makes the tooltip follow the pointer', async ({ app, page }) => {
  const section = app.section('tooltip-trail');
  await section.getByTestId('tt-trail-area').scrollIntoViewIfNeeded();
  const area = await section.getByTestId('tt-trail-area').boundingBox();
  const t = tip(page, 'tt-trail-class');
  await page.mouse.move(area.x + 30, area.y + 30);
  await page.mouse.move(area.x + 40, area.y + 40);
  await expect(t).toBeVisible();
  const first = await t.boundingBox();
  await page.mouse.move(area.x + 200, area.y + 40, { steps: 8 });
  await expect.poll(async () => (await t.boundingBox()).x).toBeGreaterThan(first.x + 80);
  expect(await widgetProp(section.getByTestId('tt-trail'), 'mouseTrail')).toBe(true);
  expect(await widgetProp(section.getByTestId('tt-trail'), 'openDelay')).toBe(0);
});

test('openDelay and closeDelay postpone opening and closing', async ({ app, page }) => {
  const section = app.section('tooltip-delay');
  const t = tip(page, 'tt-delay-class');
  const target = section.getByTestId('tt-delay-target');
  // a scroll closes open tooltips, so scroll before hovering
  await target.scrollIntoViewIfNeeded();
  await target.hover();
  await page.waitForTimeout(150);
  await expect(t).toBeHidden();
  await expect(t).toBeVisible();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(150);
  await expect(t).toBeVisible();
  await expect(t).toBeHidden();
  expect(await widgetProp(section.getByTestId('tt-delay'), 'closeDelay')).toBe(700);
});

test('html content is parsed and sanitized, enableHtmlParse follows the view-model, container hosts the tooltip', async ({ app, page }) => {
  const section = app.section('tooltip-html');
  const target = section.getByTestId('tt-html-target');
  const t = tip(page, 'tt-html-class');
  await target.hover();
  await expect(t.getByTestId('tt-bold')).toHaveText('Bold');
  expect(await page.evaluate(() => (window as any).__ttXss)).toBeUndefined();
  await expect(section.getByTestId('tt-container').locator('.e-tooltip-wrap')).toHaveCount(1);
  expect(await widgetProp(section.getByTestId('tt-html'), 'enableHtmlSanitizer')).toBe(true);
  expect(await widgetProp(section.getByTestId('tt-html'), 'container')).toBe('#tt-container');
  await page.mouse.move(5, 5);
  await expect(t).toHaveCount(0);
  await section.getByTestId('tt-chk-parse').uncheck();
  await expect.poll(() => widgetProp(section.getByTestId('tt-html'), 'enableHtmlParse')).toBe(false);
  await target.hover();
  await expect(t.locator('.e-tip-content')).toContainText('<b data-testid="tt-bold">Bold</b>');
});

test('animation is passed to the tooltip', async ({ app, page }) => {
  const section = app.section('tooltip-animation');
  const animation = await widgetProp(section.getByTestId('tt-anim'), 'animation');
  expect(animation.open).toMatchObject({ effect: 'ZoomIn', duration: 100 });
  expect(animation.close).toMatchObject({ effect: 'ZoomOut', duration: 100 });
  await section.getByTestId('tt-anim-target').hover();
  await expect(tip(page, 'tt-anim-class')).toBeVisible();
});

test('beforeCollision is raised when the tooltip does not fit into the window', async ({ app, page }) => {
  const section = app.section('tooltip-collision');
  await expect(section.getByTestId('tt-collisions')).toHaveText('0');
  await section.getByTestId('tt-collision-target').hover();
  await expect(tip(page, 'tt-collision-class')).toBeVisible();
  await expect.poll(async () => Number(await section.getByTestId('tt-collisions').textContent())).toBeGreaterThan(0);
  expect(await widgetProp(section.getByTestId('tt-collision'), 'windowCollision')).toBe(true);
  const box = await tip(page, 'tt-collision-class').boundingBox();
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
});

test('destroyed is raised when the tooltip is removed', async ({ app }) => {
  const section = app.section('tooltip-destroy');
  await expect(section.getByTestId('tt-destroyed')).toHaveText('0');
  await section.getByTestId('tt-chk-exists').uncheck();
  await expect(section.getByTestId('tt-destroyed')).toHaveText('1');
});
