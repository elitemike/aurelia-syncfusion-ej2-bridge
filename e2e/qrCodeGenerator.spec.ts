import { test, expect } from './fixtures';
import { widgetProp, widgetCall } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('qrCodeGenerator'));

test('basic QR code renders modules and the value text', async ({ page }) => {
  const qr = page.getByTestId('qr-basic');
  await expect(qr.locator('svg')).toHaveAttribute('width', '200');
  await expect(qr.locator('svg')).toHaveAttribute('height', '200');
  expect(await qr.locator('svg rect').count()).toBeGreaterThan(100);
  await expect(qr.locator('svg text')).toHaveText('https://www.syncfusion.com');
  expect(await widgetProp(qr, 'value')).toBe('https://www.syncfusion.com');
  expect(await widgetProp(qr, 'mode')).toBe('SVG');
  expect(await widgetProp(qr, 'width')).toBe('200');
  expect(await widgetProp(qr, 'height')).toBe('200');
});

test('errorCorrectionLevel and version change the symbol size', async ({ page }) => {
  const low = page.getByTestId('qr-low');
  const high = page.getByTestId('qr-high');
  const version = page.getByTestId('qr-version');
  await expect(low.locator('svg rect').first()).toBeAttached();
  await expect(high.locator('svg rect').first()).toBeAttached();
  await expect(version.locator('svg rect').first()).toBeAttached();
  const lowCount = await low.locator('svg rect').count();
  const highCount = await high.locator('svg rect').count();
  const versionCount = await version.locator('svg rect').count();
  expect(highCount).toBeGreaterThan(lowCount);
  expect(versionCount).toBeGreaterThan(highCount);
  expect(await widgetProp(low, 'errorCorrectionLevel')).toBe(7);
  expect(await widgetProp(high, 'errorCorrectionLevel')).toBe(30);
  expect(await widgetProp(version, 'version')).toBe(10);
});

test('foreColor, backgroundColor, margin, displayText and xDimension', async ({ page }) => {
  const qr = page.getByTestId('qr-appearance');
  await expect(qr.locator('svg')).toHaveCSS('background-color', 'rgb(255, 255, 204)');
  await expect(qr.locator('svg rect').first()).toHaveAttribute('fill', '#0000ff');
  await expect(qr.locator('svg text')).toHaveText('Scan me');
  await expect(qr.locator('svg text')).toHaveCSS('font-size', '14px');
  expect(await widgetProp(qr, 'foreColor')).toBe('#0000ff');
  expect(await widgetProp(qr, 'backgroundColor')).toBe('#ffffcc');
  expect(await widgetProp(qr, 'xDimension')).toBe(2);
  expect(await widgetCall(qr, w => w.margin.left)).toBe(10);
  expect(await widgetCall(qr, w => w.displayText.text)).toBe('Scan me');
  // the margin keeps the first module away from the edge
  const x = Number(await qr.locator('svg rect').first().getAttribute('x'));
  expect(x).toBeGreaterThanOrEqual(10);
});

test('Canvas mode draws on a canvas', async ({ page }) => {
  const qr = page.getByTestId('qr-canvas');
  await expect(qr.locator('canvas')).toBeVisible();
  await expect(qr.locator('svg')).toHaveCount(0);
  expect(await widgetProp(qr, 'mode')).toBe('Canvas');
  const painted = await qr.locator('canvas').evaluate((c: HTMLCanvasElement) =>
    Array.from(c.getContext('2d').getImageData(0, 0, c.width, c.height).data).some((v, i) => i % 4 === 3 && v > 0));
  expect(painted).toBe(true);
});

test('logo is drawn over the symbol', async ({ page }) => {
  const qr = page.getByTestId('qr-logo');
  const image = qr.locator('svg image');
  await expect(image).toHaveCount(1);
  expect(await image.getAttribute('href') || await image.getAttribute('xlink:href')).toContain('data:image/png');
  expect(await widgetCall(qr, w => w.logo.width)).toBe(30);
});

test('properties follow the view-model', async ({ page }) => {
  const qr = page.getByTestId('qr-dynamic');
  await expect(qr.locator('svg text')).toHaveText('first');
  await page.getByTestId('qr-dyn-change').click();
  await expect(qr.locator('svg text')).toHaveText('second value');
  await expect(qr.locator('svg')).toHaveAttribute('width', '220');
  await expect(qr.locator('svg rect').first()).toHaveAttribute('fill', '#ff0000');
  await expect(qr.locator('svg')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
  expect(await widgetProp(qr, 'value')).toBe('second value');
  expect(await widgetProp(qr, 'width')).toBe(220);
});

test('invalid event is raised for a value that cannot be encoded', async ({ page, app }) => {
  const section = app.section('qr-invalid');
  await expect.poll(async () => Number(await section.getByTestId('qr-invalid-count').innerText())).toBeGreaterThan(0);
  await expect(section.getByTestId('qr-invalid-message')).toHaveText('Invalid Input');
  await expect(section.getByTestId('qr-invalid').locator('svg rect')).toHaveCount(0);
  await section.getByTestId('qr-fix').click();
  await expect(section.getByTestId('qr-invalid').locator('svg rect').first()).toBeAttached();
});
