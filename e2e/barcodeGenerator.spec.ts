import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('barcodeGenerator'));

test('basic barcode renders the value as SVG bars and text', async ({ app, page }) => {
  const bc = page.getByTestId('bc-basic');
  const svg = bc.locator('svg');
  await expect(svg).toHaveAttribute('width', '300');
  await expect(svg).toHaveAttribute('height', '100');
  expect(await svg.locator('rect').count()).toBeGreaterThan(10);
  await expect(svg.locator('text')).toHaveText('Syncfusion');
  expect(await widgetProp(bc, 'type')).toBe('Code128');
  expect(await widgetProp(bc, 'value')).toBe('Syncfusion');
  expect(await widgetProp(bc, 'width')).toBe('300');
  expect(await widgetProp(bc, 'height')).toBe('100');
  expect(await widgetProp(bc, 'mode')).toBe('SVG');
});

test('every barcode type renders bars for its sample value', async ({ app, page }) => {
  const types = ['Code39', 'Code128', 'Code128A', 'Code128B', 'Code128C', 'Codabar', 'Ean8', 'Ean13', 'UpcA', 'UpcE', 'Code11', 'Code93', 'Code32'];
  for (const type of types) {
    const sample = page.getByTestId(`bc-type-${type}`);
    await expect(sample.locator('svg rect').first(), type).toBeAttached();
    expect(await widgetProp(sample, 'type'), type).toBe(type);
  }
});

test('foreColor, backgroundColor, margin and displayText', async ({ app, page }) => {
  const bc = page.getByTestId('bc-appearance');
  const svg = bc.locator('svg');
  await expect(svg).toHaveCSS('background-color', 'rgb(255, 255, 204)');
  await expect(svg.locator('rect').first()).toHaveAttribute('fill', '#ff0000');
  // margin left 10 / top 5 offsets the first bar
  await expect(svg.locator('rect').first()).toHaveAttribute('x', '10');
  await expect(svg.locator('rect').first()).toHaveAttribute('y', '5');
  const text = svg.locator('text');
  await expect(text).toHaveText('Shown below');
  await expect(text).toHaveAttribute('fill', '#ff0000');
  await expect(text).toHaveCSS('font-size', '14px');
  expect(await widgetProp(bc, 'foreColor')).toBe('#ff0000');
  expect(await widgetProp(bc, 'backgroundColor')).toBe('#ffffcc');
  expect(await widgetCall(bc, w => w.margin.left)).toBe(10);
  expect(await widgetCall(bc, w => w.displayText.text)).toBe('Shown below');
});

test('Canvas mode renders a canvas instead of an SVG', async ({ app, page }) => {
  const bc = page.getByTestId('bc-canvas');
  await expect(bc.locator('canvas')).toBeVisible();
  await expect(bc.locator('svg')).toHaveCount(0);
  expect(await widgetProp(bc, 'mode')).toBe('Canvas');
  const painted = await bc.locator('canvas').evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    return Array.from(data).some((v, i) => i % 4 === 3 && v > 0);
  });
  expect(painted).toBe(true);
});

test('enableCheckSum adds a check bar sequence', async ({ app, page }) => {
  const off = page.getByTestId('bc-checksum-off');
  const on = page.getByTestId('bc-checksum-on');
  await expect(off.locator('svg rect').first()).toBeAttached();
  await expect(on.locator('svg rect').first()).toBeAttached();
  const offCount = await off.locator('svg rect').count();
  const onCount = await on.locator('svg rect').count();
  expect(onCount).toBeGreaterThan(offCount);
  expect(await widgetProp(on, 'enableCheckSum')).toBe(true);
  expect(await widgetProp(off, 'enableCheckSum')).toBe(false);
});

test('properties follow the view-model', async ({ app, page }) => {
  const bc = page.getByTestId('bc-dynamic');
  await expect(bc.locator('svg text')).toHaveText('FIRST');
  await page.getByTestId('bc-dyn-change').click();
  await expect(bc.locator('svg text')).toHaveText('Second');
  await expect(bc.locator('svg')).toHaveAttribute('width', '320');
  await expect(bc.locator('svg')).toHaveAttribute('height', '120');
  await expect(bc.locator('svg rect').first()).toHaveAttribute('fill', '#0000ff');
  await expect(bc.locator('svg')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
  expect(await widgetProp(bc, 'type')).toBe('Code128');
  expect(await widgetProp(bc, 'value')).toBe('Second');
  expect(await widgetProp(bc, 'foreColor')).toBe('#0000ff');
  expect(await widgetProp(bc, 'backgroundColor')).toBe('#eeeeee');
});

test('invalid event reports why the value cannot be encoded', async ({ app, page }) => {
  const section = app.section('bc-invalid');
  await expect.poll(async () => Number(await section.getByTestId('bc-invalid-count').innerText())).toBeGreaterThan(0);
  await expect(section.getByTestId('bc-invalid-message')).not.toHaveText('');
  await expect(section.getByTestId('bc-invalid').locator('svg rect')).toHaveCount(0);
  await section.getByTestId('bc-fix').click();
  await expect(section.getByTestId('bc-invalid').locator('svg rect').first()).toBeAttached();
});
