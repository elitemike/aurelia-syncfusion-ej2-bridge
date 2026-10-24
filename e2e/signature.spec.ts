import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps, onWidget } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('signature'));

/** Draw a horizontal-ish stroke across the middle of the canvas with the mouse. */
async function draw(page: Page, canvas: Locator) {
  const box = await canvas.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + 30, y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) {
    await page.mouse.move(box.x + 30 + i * 20, y + (i % 2 ? 6 : -6), { steps: 3 });
  }
  await page.mouse.up();
}

/** Number of drawn (non transparent) pixels on the canvas and the colour of the first one. */
function ink(canvas: Locator) {
  return canvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let count = 0;
    let first: number[] = null;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) { count++; if (!first) { first = [d[i], d[i + 1], d[i + 2]]; } }
    }
    return { count, first };
  });
}

test('drawing raises change and created, the canvas fills its host', async ({ app, page }) => {
  const section = app.section('sg-basic');
  const canvas = section.locator('canvas');
  await expect(section.getByTestId('sg-created')).toHaveText('1');
  expect(await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height])).toEqual([398, 158]);
  expect((await ink(canvas)).count).toBe(0);
  await draw(page, canvas);
  await expect(section.getByTestId('sg-change-count')).toHaveText('1');
  await expect(section.getByTestId('sg-action')).toHaveText('strokeUpdate');
  expect((await ink(canvas)).count).toBeGreaterThan(50);
});

test('undo, redo and clear raise change', async ({ app, page }) => {
  const section = app.section('sg-basic');
  const canvas = section.locator('canvas');
  await draw(page, canvas);
  await section.getByTestId('sg-undo').click();
  await expect(section.getByTestId('sg-action')).toHaveText('undo');
  expect((await ink(canvas)).count).toBe(0);
  await section.getByTestId('sg-redo').click();
  await expect(section.getByTestId('sg-action')).toHaveText('redo');
  await expect.poll(async () => (await ink(canvas)).count).toBeGreaterThan(50);
  await section.getByTestId('sg-clear').click();
  await expect(section.getByTestId('sg-action')).toHaveText('clear');
  expect((await ink(canvas)).count).toBe(0);
});

test('strokeColor, widths, velocity and backgroundColor', async ({ app, page }) => {
  const section = app.section('sg-look');
  const host = section.getByTestId('sg-look');
  const canvas = section.locator('canvas');
  expect(await widgetProps(host, ['strokeColor', 'minStrokeWidth', 'maxStrokeWidth', 'velocity', 'backgroundColor']))
    .toEqual({ strokeColor: '#ff0000', minStrokeWidth: 1, maxStrokeWidth: 4, velocity: 0.7, backgroundColor: '#ffffe0' });
  await expect(canvas).toHaveCSS('background-color', 'rgb(255, 255, 224)');
  await draw(page, canvas);
  const thin = await ink(canvas);
  expect(thin.first).toEqual([255, 0, 0]);
  await onWidget(host, w => w.clear());
  await section.getByTestId('sg-look-change').click();
  await expect.poll(() => widgetProp(host, 'strokeColor')).toBe('#0000ff');
  expect(await widgetProps(host, ['minStrokeWidth', 'maxStrokeWidth', 'velocity'])).toEqual({ minStrokeWidth: 5, maxStrokeWidth: 10, velocity: 0.2 });
  await expect(canvas).toHaveCSS('background-color', 'rgb(224, 255, 224)');
  await draw(page, canvas);
  const thick = await ink(canvas);
  expect(thick.first).toEqual([0, 0, 255]);
  expect(thick.count).toBeGreaterThan(thin.count);
});

test('backgroundImage and saveWithBackground', async ({ app }) => {
  const section = app.section('sg-image');
  const host = section.getByTestId('sg-image');
  const canvas = host.locator('canvas');
  expect(String(await canvas.evaluate((c: HTMLCanvasElement) => c.style.backgroundImage))).toContain('data:image/svg+xml');
  // the saved image contains the background, the live canvas itself stays transparent
  const savedPixel = (target: Locator) => onWidget(target, async w => {
    const img = new Image();
    img.src = w.getSignature('Png');
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(5, 5, 1, 1).data;
    return [px[0], px[1], px[2], px[3]];
  });
  await expect.poll(() => savedPixel(host)).toEqual([0, 0, 255, 255]);
  // without saveWithBackground the saved image is transparent
  await expect.poll(() => savedPixel(section.getByTestId('sg-image-plain'))).toEqual([0, 0, 0, 0]);
  await section.getByTestId('sg-image-no-bg').click();
  await expect.poll(() => widgetProp(host, 'saveWithBackground')).toBe(false);
});

test('disabled and isReadOnly block drawing', async ({ app, page }) => {
  const section = app.section('sg-state');
  const disabled = section.getByTestId('sg-disabled').locator('canvas');
  const readonly = section.getByTestId('sg-readonly').locator('canvas');
  expect(await widgetProp(section.getByTestId('sg-disabled'), 'disabled')).toBe(true);
  expect(await widgetProp(section.getByTestId('sg-readonly'), 'isReadOnly')).toBe(true);
  await expect(disabled).toHaveCSS('filter', 'opacity(0.5)');
  await draw(page, disabled);
  await draw(page, readonly);
  expect((await ink(disabled)).count).toBe(0);
  expect((await ink(readonly)).count).toBe(0);
  await expect(section.getByTestId('sg-disabled-changes')).toHaveText('0');
  await expect(section.getByTestId('sg-readonly-changes')).toHaveText('0');
  await section.getByTestId('sg-state-toggle').click();
  await expect(disabled).not.toHaveCSS('filter', 'opacity(0.5)');
  await draw(page, disabled);
  await draw(page, readonly);
  await expect(section.getByTestId('sg-disabled-changes')).toHaveText('1');
  await expect(section.getByTestId('sg-readonly-changes')).toHaveText('1');
});

test('beforeSave is raised on Ctrl+S with type and file name and can cancel the download', async ({ app, page }) => {
  const section = app.section('sg-save');
  const canvas = section.locator('canvas');
  await draw(page, canvas);
  const download = page.waitForEvent('download');
  await canvas.press('Control+s');
  expect((await download).suggestedFilename()).toBe('Signature.png');
  await expect(section.getByTestId('sg-before-save')).toHaveText('Png:Signature');
  await section.getByTestId('sg-cancel-save').check();
  let downloaded = false;
  page.on('download', () => { downloaded = true; });
  await canvas.press('Control+s');
  await expect.poll(() => section.getByTestId('sg-before-save').textContent()).toContain('Png');
  await page.waitForTimeout(500);
  expect(downloaded).toBe(false);
});
