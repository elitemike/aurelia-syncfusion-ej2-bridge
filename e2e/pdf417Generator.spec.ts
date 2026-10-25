import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('pdf417Generator'));

const rects = async (el: import('@playwright/test').Locator) => {
  await expect(el.locator('svg rect').first()).toBeAttached();
  return el.locator('svg rect').count();
};

test('basic PDF417 renders bars, text and an aria label', async ({ page }) => {
  const pdf = page.getByTestId('pdf-basic');
  await expect(pdf.locator('svg')).toHaveAttribute('width', '400');
  await expect(pdf.locator('svg')).toHaveAttribute('height', '150');
  expect(await rects(pdf)).toBeGreaterThan(50);
  await expect(pdf.locator('svg text')).toHaveText('Syncfusion PDF417');
  await expect(pdf.locator('.e-control').first()).toHaveAttribute('aria-label', 'PDF417 barcode: Syncfusion PDF417');
  expect(await widgetProp(pdf, 'value')).toBe('Syncfusion PDF417');
  expect(await widgetProp(pdf, 'mode')).toBe('SVG');
  expect(await widgetProp(pdf, 'width')).toBe('400');
  expect(await widgetProp(pdf, 'height')).toBe('150');
});

test('compactionMode packs the same value differently', async ({ page }) => {
  const text = page.getByTestId('pdf-text');
  const numeric = page.getByTestId('pdf-numeric');
  const byte = page.getByTestId('pdf-byte');
  const [t, n, b] = [await rects(text), await rects(numeric), await rects(byte)];
  expect(n).toBeLessThan(t);
  expect(b).toBeGreaterThan(t);
  expect(await widgetProp(text, 'compactionMode')).toBe('Text');
  expect(await widgetProp(numeric, 'compactionMode')).toBe('Numeric');
  expect(await widgetProp(byte, 'compactionMode')).toBe('Byte');
});

test('errorCorrectionLevel adds error correction codewords', async ({ page }) => {
  const low = page.getByTestId('pdf-ecc0');
  const high = page.getByTestId('pdf-ecc5');
  expect(await rects(high)).toBeGreaterThan(await rects(low));
  expect(await widgetProp(low, 'errorCorrectionLevel')).toBe(0);
  expect(await widgetProp(high, 'errorCorrectionLevel')).toBe(5);
});

test('columns and rows constrain the symbol layout', async ({ page }) => {
  const columns = page.getByTestId('pdf-columns');
  const rows = page.getByTestId('pdf-rows');
  await rects(columns);
  await rects(rows);
  expect(await widgetProp(columns, 'columns')).toBe(3);
  expect(await widgetProp(rows, 'rows')).toBe(20);
  // more rows and fewer columns give a taller layout: the bar columns differ between the two
  const distinctX = (el: import('@playwright/test').Locator) => el.locator('svg rect').evaluateAll(
    (nodes) => new Set(nodes.map((n) => n.getAttribute('x'))).size);
  expect(await distinctX(columns)).not.toBe(await distinctX(rows));
});

test('isCompact truncates the right side of the symbol', async ({ page }) => {
  const full = page.getByTestId('pdf-full');
  const compact = page.getByTestId('pdf-compact');
  expect(await rects(compact)).toBeLessThan(await rects(full));
  expect(await widgetProp(full, 'isCompact')).toBe(false);
  expect(await widgetProp(compact, 'isCompact')).toBe(true);
});

test('rowHeightRatio is passed to the widget and a symbol is drawn', async ({ page }) => {
  const ratio = page.getByTestId('pdf-ratio');
  await rects(ratio);
  expect(await widgetProp(ratio, 'rowHeightRatio')).toBe(5);
  expect(await widgetProp(page.getByTestId('pdf-basic'), 'rowHeightRatio')).toBe(3);
});

test('foreColor, backgroundColor, margin and displayText', async ({ page }) => {
  const pdf = page.getByTestId('pdf-appearance');
  await rects(pdf);
  await expect(pdf.locator('svg')).toHaveCSS('background-color', 'rgb(255, 255, 204)');
  await expect(pdf.locator('svg rect').first()).toHaveAttribute('fill', '#0000ff');
  await expect(pdf.locator('svg text')).toHaveText('Scan me');
  await expect(pdf.locator('svg text')).toHaveCSS('font-size', '14px');
  expect(await widgetProp(pdf, 'foreColor')).toBe('#0000ff');
  expect(await widgetProp(pdf, 'backgroundColor')).toBe('#ffffcc');
  expect(await widgetCall(pdf, w => w.margin.left)).toBe(10);
  expect(await widgetCall(pdf, w => w.displayText.text)).toBe('Scan me');
  expect(Number(await pdf.locator('svg rect').first().getAttribute('x'))).toBeGreaterThanOrEqual(10);
});

test('Canvas mode draws on a canvas', async ({ page }) => {
  const pdf = page.getByTestId('pdf-canvas');
  await expect(pdf.locator('canvas')).toBeVisible();
  await expect(pdf.locator('svg')).toHaveCount(0);
  expect(await widgetProp(pdf, 'mode')).toBe('Canvas');
  const painted = await pdf.locator('canvas').evaluate((c: HTMLCanvasElement) =>
    Array.from(c.getContext('2d').getImageData(0, 0, c.width, c.height).data).some((v, i) => i % 4 === 3 && v > 0));
  expect(painted).toBe(true);
});

test('properties follow the view-model', async ({ page }) => {
  const pdf = page.getByTestId('pdf-dynamic');
  await expect(pdf.locator('svg text')).toHaveText('first');
  await page.getByTestId('pdf-dyn-change').click();
  await expect(pdf.locator('svg text')).toHaveText('second value');
  await expect(pdf.locator('svg')).toHaveAttribute('width', '420');
  await expect(pdf.locator('svg')).toHaveAttribute('height', '160');
  await expect(pdf.locator('svg rect').first()).toHaveAttribute('fill', '#ff0000');
  await expect(pdf.locator('svg')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
  expect(await widgetProp(pdf, 'value')).toBe('second value');
  expect(await widgetProp(pdf, 'width')).toBe(420);
});

test('invalid event is raised when the value cannot use the compaction mode', async ({ app }) => {
  const section = app.section('pdf-invalid');
  await expect.poll(async () => Number(await section.getByTestId('pdf-invalid-count').innerText())).toBeGreaterThan(0);
  await expect(section.getByTestId('pdf-invalid-message')).not.toHaveText('');
  await expect(section.getByTestId('pdf-invalid').locator('svg rect')).toHaveCount(0);
  await section.getByTestId('pdf-fix').click();
  await expect(section.getByTestId('pdf-invalid').locator('svg rect').first()).toBeAttached();
});
