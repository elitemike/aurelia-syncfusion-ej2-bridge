import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('popup'));

const popupOf = (section: any, id: string) => section.getByTestId(id).locator('.e-popup');

test('basic: width, height, zIndex, content and relateTo are applied', async ({ app }) => {
  const section = app.section('popup-basic');
  const popup = popupOf(section, 'popup-basic');
  await expect(popup).toHaveClass(/e-popup-close/);
  await section.getByTestId('popup-basic-show').click();
  await expect(popup).toHaveClass(/e-popup-open/);
  await expect(popup).toHaveText('Hello from the popup');
  await expect(popup).toHaveCSS('width', '200px');
  await expect(popup).toHaveCSS('height', '80px');
  await expect(popup).toHaveCSS('z-index', '1500');
  expect(await widgetProp(popup, 'relateTo')).toBe('#popup-basic-anchor');
  // default position is the top left corner of the anchor
  const anchor = await section.getByTestId('popup-basic-anchor').boundingBox();
  const box = await popup.boundingBox();
  expect(Math.abs(box.x - anchor.x)).toBeLessThan(2);
  expect(Math.abs(box.y - anchor.y)).toBeLessThan(2);
});

test('basic: open and close events fire and content follows the view-model', async ({ app }) => {
  const section = app.section('popup-basic');
  // the demo hides the popup once on load, which already raised close
  await expect(popupOf(section, 'popup-basic')).toHaveClass(/e-popup-close/);
  const closedBefore = Number(await section.getByTestId('popup-closed').textContent());
  await expect(section.getByTestId('popup-opened')).toHaveText('0');
  await section.getByTestId('popup-basic-show').click();
  await expect(section.getByTestId('popup-opened')).toHaveText('1');
  await section.getByTestId('popup-basic-content').click();
  await expect(popupOf(section, 'popup-basic')).toHaveText('Updated content');
  await section.getByTestId('popup-basic-hide').click();
  await expect(section.getByTestId('popup-closed')).toHaveText(String(closedBefore + 1));
  await expect(popupOf(section, 'popup-basic')).toHaveClass(/e-popup-close/);
});

test('position and offsets place the popup relative to the anchor', async ({ app }) => {
  const section = app.section('popup-position');
  const popup = popupOf(section, 'popup-pos');
  expect(await widgetProp(popup, 'targetType')).toBe('relative');
  await section.getByTestId('popup-pos-show').click();
  await expect(popup).toHaveClass(/e-popup-open/);
  const anchor = await section.getByTestId('popup-pos-anchor').boundingBox();
  let box = await popup.boundingBox();
  // X right: popup starts at the anchor right edge, Y bottom with offsetY 10
  expect(Math.abs(box.x - (anchor.x + anchor.width))).toBeLessThan(2);
  expect(Math.abs(box.y - (anchor.y + anchor.height + 10))).toBeLessThan(2);
  await section.getByTestId('popup-pos-move').click();
  await expect.poll(async () => widgetProp(popup, 'offsetX')).toBe(40);
  await expect.poll(async () => Math.abs((await popup.boundingBox()).x - (anchor.x + anchor.width + 40))).toBeLessThan(2);
  await section.getByTestId('popup-pos-left').click();
  await expect.poll(async () => (await widgetProp(popup, 'position')).X).toBe('left');
  // left top aligns with the anchor corner, plus the offsets
  await expect.poll(async () => {
    box = await popup.boundingBox();
    return Math.abs(box.x - (anchor.x + 40)) + Math.abs(box.y - (anchor.y + 10));
  }).toBeLessThan(3);
});

test('collision flips a popup that would leave the viewport', async ({ app }) => {
  const section = app.section('popup-collision');
  const popup = popupOf(section, 'popup-col');
  expect(await widgetProp(popup, 'collision')).toEqual({ X: 'flip', Y: 'none' });
  await section.getByTestId('popup-col-show').click();
  await expect(popup).toHaveClass(/e-popup-open/);
  const anchor = await section.getByTestId('popup-col-anchor').boundingBox();
  const box = await popup.boundingBox();
  // flipped to the left of the right-aligned anchor
  expect(box.x + box.width).toBeLessThanOrEqual(anchor.x + 2);
});

test('showAnimation and hideAnimation are passed on and follow the view-model', async ({ app }) => {
  const section = app.section('popup-animation');
  const popup = popupOf(section, 'popup-anim');
  expect(await widgetProp(popup, 'showAnimation')).toMatchObject({ name: 'FadeIn', duration: 50 });
  expect(await widgetProp(popup, 'hideAnimation')).toMatchObject({ name: 'FadeOut', duration: 50 });
  await section.getByTestId('popup-anim-show').click();
  await expect(popup).toHaveClass(/e-popup-open/);
  await section.getByTestId('popup-anim-hide').click();
  await expect(popup).toHaveClass(/e-popup-close/);
  await section.getByTestId('popup-anim-change').click();
  await expect.poll(async () => (await widgetProp(popup, 'showAnimation')).name).toBe('ZoomIn');
});

test('container target type keeps the popup inside viewPortElement', async ({ app }) => {
  const section = app.section('popup-container');
  const popup = popupOf(section, 'popup-container');
  expect(await widgetProp(popup, 'targetType')).toBe('container');
  expect(await widgetProp(popup, 'viewPortElement')).toBe('#popup-container-box');
  await section.getByTestId('popup-container-show').click();
  await expect(popup).toHaveClass(/e-popup-open/);
  const container = await section.getByTestId('popup-container-box').boundingBox();
  const box = await popup.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(container.x - 1);
  expect(box.y).toBeGreaterThanOrEqual(container.y - 1);
  expect(box.x + box.width).toBeLessThanOrEqual(container.x + container.width + 1);
});

test('scrolling: actionOnScroll hides the popup and targetExitViewport is raised', async ({ app }) => {
  const section = app.section('popup-scroll');
  const popup = popupOf(section, 'popup-scroll');
  expect(await widgetProp(popup, 'actionOnScroll')).toBe('hide');
  // clicking a button would scroll the page, which itself hides a popup with actionOnScroll hide
  await section.getByTestId('popup-scroll-box').scrollIntoViewIfNeeded();
  await widgetCall(popup, 'show');
  await expect(popup).toHaveClass(/e-popup-open/);
  await section.getByTestId('popup-scroll-box').evaluate(el => { el.scrollTop = 300; el.dispatchEvent(new Event('scroll')); });
  await expect(section.getByTestId('popup-exited')).not.toHaveText('0');
  await expect(popup).toHaveClass(/e-popup-close/);
});
