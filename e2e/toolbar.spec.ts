import { test, expect } from './fixtures';
import { widgetProp } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('toolbar'));

test('default toolbar renders items, separator, disabled and right aligned items', async ({ app }) => {
  const section = app.section('tb-default');
  const bar = section.locator('.e-toolbar');
  await expect(bar.locator('.e-toolbar-item')).toHaveCount(8);
  await expect(bar.locator('.e-toolbar-item.e-separator')).toHaveCount(1);
  await expect(bar.locator('.e-toolbar-item.e-overlay')).toHaveText('Disabled');
  await expect(bar.locator('.e-toolbar-right .e-toolbar-item')).toHaveText('Right aligned');
  await expect(bar.locator('.e-toolbar-item', { hasText: 'Cut' })).toBeVisible();
});

test('created and beforeCreate events are raised once', async ({ app }) => {
  const section = app.section('tb-default');
  await expect(section.getByTestId('tb-created')).toHaveText('1');
  await expect(section.getByTestId('tb-before-create')).toHaveText('1');
});

test('clicked event reports the clicked item', async ({ app }) => {
  const section = app.section('tb-default');
  await section.locator('.e-toolbar-item', { hasText: 'Copy' }).click();
  await expect(section.getByTestId('tb-clicked')).toHaveText('Copy');
  await section.locator('.e-toolbar-item', { hasText: 'Bold' }).click();
  await expect(section.getByTestId('tb-clicked')).toHaveText('Bold');
  await expect(section.getByTestId('tb-clicked-count')).toHaveText('2');
});

test('keyDown event is raised for keyboard input on the toolbar', async ({ app }) => {
  const section = app.section('tb-default');
  await section.locator('.e-toolbar-item', { hasText: 'Cut' }).locator('button').focus();
  await section.page().keyboard.press('ArrowRight');
  await expect(section.getByTestId('tb-key')).toHaveText('ArrowRight');
  await expect(section.getByTestId('tb-keydown')).not.toHaveText('0');
});

test('popup overflow moves items into a popup', async ({ app }) => {
  const section = app.section('tb-popup');
  const bar = section.locator('.e-toolbar');
  await expect(bar).toHaveClass(/e-toolpop/);
  await expect(bar.locator('.e-hor-nav')).toBeVisible();
  await bar.locator('.e-hor-nav').click();
  const popup = app.page.locator('.e-toolbar-pop.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup.locator('.e-toolbar-item').first()).toContainText('Item');
});

test('width binding follows the view-model and narrows the toolbar', async ({ app }) => {
  const section = app.section('tb-popup');
  const bar = section.locator('.e-toolbar');
  await expect.poll(async () => (await bar.boundingBox()).width).toBeCloseTo(220, 0);
  await section.getByTestId('tb-narrow').click();
  await expect.poll(async () => (await bar.boundingBox()).width).toBeCloseTo(150, 0);
});

test('enableCollision follows the view-model', async ({ app }) => {
  const section = app.section('tb-popup');
  const bar = section.locator('.e-toolbar');
  await expect.poll(() => widgetProp(bar, 'enableCollision')).toBe(false);
  await section.getByTestId('tb-collide').click();
  await expect.poll(() => widgetProp(bar, 'enableCollision')).toBe(true);
});

test('scrollable overflow shows navigation arrows and scrollStep is bound', async ({ app }) => {
  const section = app.section('tb-scroll');
  const bar = section.locator('.e-toolbar');
  await expect(bar).toHaveClass(/e-scroll-nav|e-toolbar/);
  await expect(bar.locator('.e-scroll-nav.e-scroll-right-nav')).toBeVisible();
  await expect.poll(() => widgetProp(bar, 'scrollStep')).toBe(40);
  await section.getByTestId('tb-step').click();
  await expect.poll(() => widgetProp(bar, 'scrollStep')).toBe(100);
  const content = bar.locator('.e-hscroll-bar');
  const before = await content.evaluate((el) => el.scrollLeft);
  await bar.locator('.e-scroll-right-nav').click();
  await expect.poll(() => content.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
});

test('multi row and extended overflow modes', async ({ app }) => {
  const section = app.section('tb-multirow');
  await expect(section.getByTestId('tb-multirow').locator('.e-toolbar-items')).toHaveClass(/e-toolbar-multirow/);
  const extended = section.getByTestId('tb-extended').locator('.e-toolbar');
  await expect(extended).toHaveClass(/e-extended-toolbar/);
  await expect(extended.locator('.e-hor-nav')).toBeVisible();
  await extended.locator('.e-hor-nav').click();
  await expect(extended.locator('.e-toolbar-pop')).toBeVisible();
});

test('template items render custom markup', async ({ app }) => {
  const section = app.section('tb-template');
  await expect(section.getByTestId('tb-template').locator('.tb-custom-btn')).toHaveText('Template button');
  await expect(section.getByTestId('tb-template').locator('.e-toolbar-item.e-separator')).toHaveCount(1);
});

test('enableHtmlSanitizer strips inline handlers from templates', async ({ app }) => {
  const section = app.section('tb-template');
  await expect(section.getByTestId('tb-template').locator('.tb-safe')).not.toHaveAttribute('onmouseover', /.*/);
  await expect(section.getByTestId('tb-unsafe').locator('.tb-safe')).toHaveAttribute('onmouseover', /__tbxss/);
  await section.getByTestId('tb-unsanitize').click();
  await expect.poll(() => widgetProp(section.getByTestId('tb-template').locator('.e-toolbar'), 'enableHtmlSanitizer')).toBe(false);
});

test('items, width, height and cssClass follow the view-model', async ({ app }) => {
  const section = app.section('tb-dynamic');
  const bar = section.locator('.e-toolbar');
  await expect(bar.locator('.e-toolbar-item')).toHaveCount(2);
  await expect(bar).toHaveClass(/tb-one/);
  await section.getByTestId('tb-add').click();
  await expect(bar.locator('.e-toolbar-item')).toHaveCount(3);
  await section.getByTestId('tb-restyle').click();
  await expect(bar).toHaveClass(/tb-two/);
  await section.getByTestId('tb-resize').click();
  await expect.poll(async () => (await bar.boundingBox()).width).toBeCloseTo(320, 0);
  await expect.poll(async () => (await bar.boundingBox()).height).toBeCloseTo(80, 0);
});

test('allowKeyboard can be switched off from the view-model', async ({ app }) => {
  const section = app.section('tb-dynamic');
  const bar = section.locator('.e-toolbar');
  await expect.poll(() => widgetProp(bar, 'allowKeyboard')).toBe(true);
  await section.getByTestId('tb-nokeys').click();
  await expect.poll(() => widgetProp(bar, 'allowKeyboard')).toBe(false);
});

test('if.bind destroys and recreates the toolbar and raises destroyed', async ({ app }) => {
  const section = app.section('tb-lifecycle');
  await expect(section.locator('.e-toolbar')).toHaveCount(1);
  await section.getByTestId('tb-toggle').click();
  await expect(section.locator('.e-toolbar')).toHaveCount(0);
  await expect(section.getByTestId('tb-destroyed')).toHaveText('1');
  await section.getByTestId('tb-toggle').click();
  await expect(section.locator('.e-toolbar .e-toolbar-item')).toHaveCount(2);
});
