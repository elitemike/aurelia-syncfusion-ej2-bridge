import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('ruler'));

const ruler = (app, section: string, testId: string) => app.section(section).getByTestId(testId);

test('horizontal ruler renders segments, ticks and labels from the bound properties', async ({ app }) => {
  const r = ruler(app, 'ruler-horizontal', 'ruler-horizontal');
  const svg = r.locator('svg[id$="_Ruler_svg"]');
  await expect(svg).toHaveAttribute('height', '25');
  // (length 400 + one segment) / segmentWidth 100 = 5 segments of `interval` ticks each
  await expect(r.locator('.e-ruler-segment')).toHaveCount(5);
  await expect(r.locator('.e-ruler-tick')).toHaveCount(25);
  await expect(r.locator('.e-ruler-tick-label').nth(0)).toHaveText('0');
  await expect(r.locator('.e-ruler-tick-label').nth(1)).toHaveText('100');
  expect(await widgetProp(r, 'orientation')).toBe('Horizontal');
  expect(await widgetProp(r, 'length')).toBe(400);
  expect(await widgetProp(r, 'interval')).toBe(5);
  expect(await widgetProp(r, 'segmentWidth')).toBe(100);
  expect(await widgetProp(r, 'thickness')).toBe(25);
  expect(await widgetProp(r, 'tickAlignment')).toBe('RightOrBottom');
  expect(await widgetProp(r, 'markerColor')).toBe('red');
  // ticks hang from the bottom: the major tick (the first one) reaches the top
  await expect(r.locator('.e-ruler-tick').first()).toHaveAttribute('y1', '25');
  await expect(r.locator('.e-ruler-tick').first()).toHaveAttribute('y2', '0');
});

test('vertical ruler with the ticks on the left', async ({ app }) => {
  const r = ruler(app, 'ruler-vertical', 'ruler-vertical');
  await expect(r.locator('svg[id$="_Ruler_svg"]')).toHaveAttribute('width', '30px');
  // (200 + 50) / 50 = 5 segments with 4 ticks
  await expect(r.locator('.e-ruler-segment')).toHaveCount(5);
  await expect(r.locator('.e-ruler-tick')).toHaveCount(20);
  expect(await widgetProp(r, 'orientation')).toBe('Vertical');
  expect(await widgetProp(r, 'tickAlignment')).toBe('LeftOrTop');
  // LeftOrTop ticks start at the left edge of the ruler
  await expect(r.locator('.e-ruler-tick').first()).toHaveAttribute('x1', '0');
  await expect(r.locator('.e-ruler-tick-label').nth(1)).toHaveText('50');
});

test('arrangeTick shortens the minor ticks and is called for every tick', async ({ app }) => {
  const section = app.section('ruler-bound');
  const r = section.getByTestId('ruler-bound');
  await expect(section.getByTestId('ruler-arrange-count')).not.toHaveText('0');
  // the first tick of a segment is the major one, the second a minor tick of length 6 (y2 = 25 - 6)
  await expect(r.locator('.e-ruler-tick').nth(0)).toHaveAttribute('y2', '0');
  await expect(r.locator('.e-ruler-tick').nth(1)).toHaveAttribute('y2', '19');
});

test('interval, segmentWidth and length update the rendered ticks', async ({ app }) => {
  const section = app.section('ruler-bound');
  const r = section.getByTestId('ruler-bound');
  await expect(r.locator('.e-ruler-tick')).toHaveCount(25);
  await section.getByTestId('ruler-more-ticks').click();
  await expect.poll(() => widgetProp(r, 'interval')).toBe(10);
  await expect(r.locator('.e-ruler-tick')).toHaveCount(50);
  await section.getByTestId('ruler-narrow').click();
  await expect.poll(() => widgetProp(r, 'segmentWidth')).toBe(50);
  // (400 + 50) / 50 = 9 segments
  await expect(r.locator('.e-ruler-segment')).toHaveCount(9);
  await section.getByTestId('ruler-long').click();
  await expect.poll(() => widgetProp(r, 'length')).toBe(800);
  await expect(r.locator('.e-ruler-segment')).toHaveCount(17);
});

test('thickness and tickAlignment update the ruler', async ({ app }) => {
  const section = app.section('ruler-bound');
  const r = section.getByTestId('ruler-bound');
  await section.getByTestId('ruler-thick').click();
  await expect.poll(() => widgetProp(r, 'thickness')).toBe(40);
  await expect(r.locator('svg[id$="_Ruler_svg"]')).toHaveAttribute('height', '40');
  await section.getByTestId('ruler-flip').click();
  await expect.poll(() => widgetProp(r, 'tickAlignment')).toBe('LeftOrTop');
  // LeftOrTop: ticks start at the top edge (y2 = 0 for horizontal rulers)
  await expect(r.locator('.e-ruler-tick').first()).toHaveAttribute('y1', '40');
  await expect(r.locator('.e-ruler-tick').first()).toHaveAttribute('y2', '0');
});

test('markerColor is used by the marker line', async ({ app }) => {
  const section = app.section('ruler-bound');
  const r = section.getByTestId('ruler-bound');
  await section.getByTestId('ruler-marker').click();
  await expect.poll(() => widgetProp(r, 'markerColor')).toBe('blue');
  await widgetCall(r, (w) => w.drawRulerMarker(w.element, { x: 10, y: 0 }, 0));
  await expect(r.locator('line.e-d-ruler-marker')).toHaveAttribute('stroke', 'blue');
});

test('orientation switches the ruler to vertical', async ({ app }) => {
  const section = app.section('ruler-bound');
  const r = section.getByTestId('ruler-bound');
  await section.getByTestId('ruler-vertical-btn').click();
  await expect.poll(() => widgetProp(r, 'orientation')).toBe('Vertical');
  await expect(r.locator('svg[id$="_Ruler_svg"]')).toHaveAttribute('width', '25px');
});
