import { Page } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('imageEditor'));

/** Evaluate an expression against the Syncfusion widget behind a demo element. */
const widget = (page: Page, testId: string, expr: string) => page.evaluate(([id, e]) => {
  const el: any = document.querySelector(`[data-testid="${id}"]`);
  const w = el.au['ej2-image-editor'].viewModel.widget;
  return new Function('w', `return ${e}`)(w);
}, [testId, expr]);

const main = (page: Page, expr: string) => widget(page, 'ie-main', expr);
const counts = async (page: Page) => JSON.parse(await page.getByTestId('ie-counts').innerText());
const expectCount = (page: Page, name: string) =>
  expect.poll(async () => (await counts(page))[name] || 0).toBeGreaterThan(0);

test.describe('properties', () => {
  test('renders the default toolbar and a canvas', async ({ app }) => {
    const section = app.section('ie-main');
    await expect(section.locator('.e-image-editor')).toBeVisible();
    await expect(section.locator('.e-ie-toolbar, .e-toolbar').first()).toBeVisible();
    await expect(section.locator('canvas').first()).toBeAttached();
  });

  test('width, height, theme, cssClass reach the widget and DOM', async ({ app, page }) => {
    const root = app.section('ie-main').locator('.e-image-editor');
    expect(await main(page, 'w.width')).toBe('640px');
    expect(await main(page, 'w.height')).toBe('440px');
    expect(await main(page, 'w.theme')).toBe('Material3');
    await expect(root).toHaveClass(/my-image-editor/);
    await expect.poll(() => root.evaluate(e => (e as HTMLElement).style.width)).toBe('640px');

    await app.section('ie-main').getByTestId('ie-set-size').click();
    await expect.poll(() => main(page, 'w.width')).toBe('500px');
    expect(await main(page, 'w.height')).toBe('380px');
    await app.section('ie-main').getByTestId('ie-set-theme').click();
    await expect.poll(() => main(page, 'w.theme')).toBe('Fluent2');
    await app.section('ie-main').getByTestId('ie-set-css').click();
    await expect(root).toHaveClass(/other-class/);
    await expect(root).not.toHaveClass(/my-image-editor/);
  });

  test('boolean flags reflect on the widget and update from the model', async ({ app, page }) => {
    const section = app.section('ie-main');
    expect(await main(page, 'w.allowUndoRedo')).toBe(true);
    expect(await main(page, 'w.showQuickAccessToolbar')).toBe(true);
    expect(await main(page, 'w.imageSmoothingEnabled')).toBe(true);
    expect(await main(page, 'w.disabled')).toBe(false);
    expect(await main(page, 'w.isReadOnly')).toBe(false);
    await section.getByTestId('ie-toggle-undo').click();
    await expect.poll(() => main(page, 'w.allowUndoRedo')).toBe(false);
    await section.getByTestId('ie-toggle-qat').click();
    await expect.poll(() => main(page, 'w.showQuickAccessToolbar')).toBe(false);
    await section.getByTestId('ie-toggle-smooth').click();
    await expect.poll(() => main(page, 'w.imageSmoothingEnabled')).toBe(false);
    await section.getByTestId('ie-toggle-readonly').click();
    await expect.poll(() => main(page, 'w.isReadOnly')).toBe(true);
    await section.getByTestId('ie-toggle-disabled').click();
    await expect.poll(() => main(page, 'w.disabled')).toBe(true);
    await expect(section.locator('.e-image-editor')).toHaveClass(/e-disabled/);
  });

  test('settings objects reach the widget', async ({ page }) => {
    expect(await main(page, 'w.fontFamily.default')).toBe('Arial');
    expect(await main(page, 'w.fontFamily.items.length')).toBe(2);
    expect(await main(page, 'w.finetuneSettings.brightness.min')).toBe(-50);
    expect(await main(page, 'w.finetuneSettings.contrast.max')).toBe(50);
    expect(await main(page, 'w.zoomSettings.maxZoomFactor')).toBe(5);
    expect(await main(page, 'w.zoomSettings.minZoomFactor')).toBe(0.5);
    expect(await main(page, 'w.selectionSettings.strokeColor')).toBe('#ff0000');
    expect(await main(page, 'w.selectionSettings.showCircle')).toBe(true);
    expect(await main(page, 'w.uploadSettings.allowedExtensions')).toBe('.png, .jpg');
    expect(await main(page, 'w.uploadSettings.maxFileSize')).toBe(5000000);
  });

  test('toolbar items are rendered', async ({ app }) => {
    await app.section('ie-main').getByTestId('ie-open').click();
    const bar = app.section('ie-main').locator('.e-image-editor .e-toolbar').first();
    await expect(bar.locator('.e-toolbar-item').first()).toBeAttached();
    for (const title of ['Undo', 'Redo', 'Crop and Transform', 'Finetune', 'Filter', 'Frame', 'Resize', 'Reset', 'Save']) {
      await expect(bar.locator(`.e-toolbar-item[title="${title}"]`), title).toBeAttached();
    }
  });

  test('custom toolbar items are rendered and clicks raise toolbarItemClicked', async ({ app }) => {
    const section = app.section('ie-custom-toolbar');
    await section.getByTestId('ie-custom-open').click();
    const custom = section.locator('.e-toolbar-item', { hasText: 'Custom' }).first();
    await expect(custom).toBeVisible();
    await custom.click();
    await expect(section.getByTestId('ie-custom-count')).toHaveText('1');
  });

  test('toolbarTemplate and quickAccessToolbarTemplate', async ({ app, page }) => {
    const section = app.section('ie-templates');
    await expect(section.locator('.e-image-editor .ie-tpl-button')).toBeVisible();
    expect(await widget(page, 'ie-templates', 'w.toolbarTemplate')).toBe('#ie-toolbar-template');
    expect(await widget(page, 'ie-templates', 'w.quickAccessToolbarTemplate')).toBe('#ie-qat-template');
  });
});

test.describe('events', () => {
  test('created and toolbarCreated fire on render', async ({ page }) => {
    await expectCount(page, 'created');
    await expectCount(page, 'toolbarCreated');
  });

  test('open() raises fileOpened and the image is loaded', async ({ app, page }) => {
    await app.section('ie-main').getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await expect.poll(() => main(page, 'w.getImageDimension().width')).toBeGreaterThan(0);
  });

  test('zoom, pan, rotate, flip raise their events', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.getByTestId('ie-zoom').click();
    await expectCount(page, 'zooming');
    expect(await main(page, 'w.zoomSettings.zoomFactor')).toBeGreaterThan(1);
    await section.getByTestId('ie-pan').click();
    const canvas = section.locator('.e-image-editor canvas').last();
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 30, { steps: 5 });
    await page.mouse.up();
    await expectCount(page, 'panning');
    await section.getByTestId('ie-rotate').click();
    await expectCount(page, 'rotating');
    await section.getByTestId('ie-flip').click();
    await expectCount(page, 'flipping');
    await expectCount(page, 'editComplete');
  });

  test('select and crop raise selectionChanging and cropping', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.getByTestId('ie-crop').click();
    await expectCount(page, 'selectionChanging');
    await expectCount(page, 'cropping');
  });

  test('shapes raise shapeChanging, shapeChange and the quick access toolbar events', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.getByTestId('ie-rect').click();
    await expect.poll(() => main(page, 'w.getShapeSettings().length')).toBe(1);
    await expectCount(page, 'shapeChanging');
    await expectCount(page, 'quickAccessToolbarOpen');
    await section.getByTestId('ie-update-shape').click();
    await expectCount(page, 'shapeChange');
    expect(await main(page, 'w.getShapeSettings()[0].strokeColor')).toBe('#00ff00');
    await main(page, 'w.selectShape(w.getShapeSettings()[0].id)');
    await section.locator('.e-quick-access-toolbar-area .e-toolbar-item[title="Duplicate"]').click({ force: true });
    await expectCount(page, 'quickAccessToolbarItemClick');
    await expect.poll(() => main(page, 'w.getShapeSettings().length')).toBe(2);
    await section.getByTestId('ie-text').click();
    await expect.poll(() => main(page, 'w.getShapeSettings().length')).toBe(3);
  });

  test('frame and resize raise their events', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.getByTestId('ie-frame').click();
    await expectCount(page, 'frameChange');
    await section.getByTestId('ie-resize').click();
    await expectCount(page, 'resizing');
  });

  test('filter and finetune from the toolbar raise imageFiltering and finetuneValueChanging', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.locator('.e-toolbar-item[title="Filter"]').click();
    await expect(section.locator('.filter-wrapper').nth(2)).toBeVisible();
    await section.locator('.filter-wrapper').nth(2).click();
    await expectCount(page, 'imageFiltering');
    await section.locator('.e-toolbar-item[title="Finetune"]').click();
    await section.locator('.e-toolbar-item[title="Brightness"]').click();
    const handle = section.locator('.e-slider-container .e-handle').first();
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expectCount(page, 'finetuneValueChanging');
  });

  test('toolbar clicks raise toolbarItemClicked and toolbarUpdating', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.locator('.e-toolbar-item[title="Crop and Transform"]').click();
    await expectCount(page, 'toolbarItemClicked');
    await expectCount(page, 'toolbarUpdating');
  });

  test('clicking the canvas raises click', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    await section.locator('.e-image-editor canvas').last().click({ position: { x: 100, y: 100 }, force: true });
    await expectCount(page, 'click');
  });

  test('export raises beforeSave and saved', async ({ app, page }) => {
    const section = app.section('ie-main');
    await section.getByTestId('ie-open').click();
    await expectCount(page, 'fileOpened');
    const download = page.waitForEvent('download').catch(() => null);
    await section.getByTestId('ie-save').click();
    await expectCount(page, 'beforeSave');
    await expectCount(page, 'saved');
    await download;
  });

  test('destroyed is raised when the control is detached', async ({ app, page }) => {
    const section = app.section('ie-destroy');
    await expect(section.locator('.e-image-editor')).toBeVisible();
    await section.getByTestId('ie-destroy-toggle').click();
    await expect(section.locator('.e-image-editor')).toHaveCount(0);
    await expect(section.getByTestId('ie-destroy-count')).toHaveText('1');
  });
});
