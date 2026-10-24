import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('dataMatrixGenerator'));

test('basic Data Matrix renders modules and the value text', async ({ page }) => {
  const dm = page.getByTestId('dm-basic');
  await expect(dm.locator('svg')).toHaveAttribute('width', '200');
  await expect(dm.locator('svg')).toHaveAttribute('height', '200');
  expect(await dm.locator('svg rect').count()).toBeGreaterThan(50);
  await expect(dm.locator('svg text')).toHaveText('Syncfusion');
  expect(await widgetProp(dm, 'value')).toBe('Syncfusion');
  expect(await widgetProp(dm, 'mode')).toBe('SVG');
  expect(await widgetProp(dm, 'width')).toBe('200');
  expect(await widgetProp(dm, 'height')).toBe('200');
});

test('encoding is passed to the widget and changes the symbol', async ({ page }) => {
  const ascii = page.getByTestId('dm-ascii');
  const numeric = page.getByTestId('dm-numeric');
  const base256 = page.getByTestId('dm-base256');
  for (const el of [ascii, numeric, base256]) {
    await expect(el.locator('svg rect').first()).toBeAttached();
  }
  expect(await widgetProp(ascii, 'encoding')).toBe('ASCII');
  expect(await widgetProp(numeric, 'encoding')).toBe('ASCIINumeric');
  expect(await widgetProp(base256, 'encoding')).toBe('Base256');
  // Base256 spends more modules on the same text than ASCII
  expect(await base256.locator('svg rect').count()).not.toBe(await ascii.locator('svg rect').count());
});

test('size fixes the symbol dimensions', async ({ page }) => {
  const small = page.getByTestId('dm-size-small');
  const large = page.getByTestId('dm-size-large');
  await expect(small.locator('svg rect').first()).toBeAttached();
  await expect(large.locator('svg rect').first()).toBeAttached();
  expect(await large.locator('svg rect').count()).toBeGreaterThan(await small.locator('svg rect').count());
  expect(await widgetProp(small, 'size')).toBe(1);
  expect(await widgetProp(large, 'size')).toBe(6);
});

test('foreColor, backgroundColor, margin, displayText and xDimension', async ({ page }) => {
  const dm = page.getByTestId('dm-appearance');
  await expect(dm.locator('svg')).toHaveCSS('background-color', 'rgb(255, 255, 204)');
  await expect(dm.locator('svg rect').first()).toHaveAttribute('fill', '#0000ff');
  await expect(dm.locator('svg text')).toHaveText('Scan me');
  await expect(dm.locator('svg text')).toHaveCSS('font-size', '14px');
  expect(await widgetProp(dm, 'foreColor')).toBe('#0000ff');
  expect(await widgetProp(dm, 'backgroundColor')).toBe('#ffffcc');
  expect(await widgetProp(dm, 'xDimension')).toBe(2);
  expect(await widgetCall(dm, w => w.margin.left)).toBe(10);
  expect(await widgetCall(dm, w => w.displayText.text)).toBe('Scan me');
  const x = Number(await dm.locator('svg rect').first().getAttribute('x'));
  expect(x).toBeGreaterThanOrEqual(10);
});

test('Canvas mode draws on a canvas', async ({ page }) => {
  const dm = page.getByTestId('dm-canvas');
  await expect(dm.locator('canvas')).toBeVisible();
  await expect(dm.locator('svg')).toHaveCount(0);
  expect(await widgetProp(dm, 'mode')).toBe('Canvas');
  const painted = await dm.locator('canvas').evaluate((c: HTMLCanvasElement) =>
    Array.from(c.getContext('2d').getImageData(0, 0, c.width, c.height).data).some((v, i) => i % 4 === 3 && v > 0));
  expect(painted).toBe(true);
});

test('properties follow the view-model', async ({ page }) => {
  const dm = page.getByTestId('dm-dynamic');
  await expect(dm.locator('svg text')).toHaveText('first');
  await page.getByTestId('dm-dyn-change').click();
  await expect(dm.locator('svg text')).toHaveText('second value');
  await expect(dm.locator('svg')).toHaveAttribute('width', '220');
  await expect(dm.locator('svg rect').first()).toHaveAttribute('fill', '#ff0000');
  await expect(dm.locator('svg')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
  expect(await widgetProp(dm, 'value')).toBe('second value');
  expect(await widgetProp(dm, 'width')).toBe(220);
});

test('invalid event is raised for a value that does not suit the encoding', async ({ app }) => {
  const section = app.section('dm-invalid');
  await expect.poll(async () => Number(await section.getByTestId('dm-invalid-count').innerText())).toBeGreaterThan(0);
  await expect(section.getByTestId('dm-invalid-message')).not.toHaveText('');
  await expect(section.getByTestId('dm-invalid').locator('svg rect')).toHaveCount(0);
  await section.getByTestId('dm-fix').click();
  await expect(section.getByTestId('dm-invalid').locator('svg rect').first()).toBeAttached();
});
