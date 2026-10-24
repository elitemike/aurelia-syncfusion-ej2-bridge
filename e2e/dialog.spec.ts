import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('dialog'));

const dlg = (page: any, cls: string) => page.locator(`.e-dialog.${cls}`);
/** wait for the open animation and the focus handling of the dialog to finish */
const settle = async (d: any) => { await expect(d).toHaveClass(/e-popup-open/); await expect(d).not.toHaveAttribute('e-animate', 'true'); };

test('closed until visible becomes true, the created event was raised', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  await expect(section.getByTestId('dlg-created')).toHaveText('1');
  await expect(dlg(page, 'dlg-basic-class')).toBeHidden();
  await expect(section.getByTestId('dlg-visible')).toHaveText('false');
  await section.getByTestId('dlg-open').click();
  await expect(dlg(page, 'dlg-basic-class')).toBeVisible();
});

test('basic: header, element content, size, zIndex and css class', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  await section.getByTestId('dlg-open').click();
  const d = dlg(page, 'dlg-basic-class');
  await expect(d.locator('.e-dlg-header')).toHaveText('Basic dialog');
  await expect(d.getByTestId('dlg-body')).toHaveText('Dialog body from the element content.');
  await expect(d).toHaveCSS('width', '360px');
  expect(await widgetProp(d, 'minHeight')).toBe('120px');
  expect(await widgetProp(d, 'height')).toBe('auto');
  expect(await widgetProp(d, 'zIndex')).toBe(2000);
  expect(await widgetProp(d, 'enableHtmlSanitizer')).toBe(true);
  await expect(d.locator('.e-dlg-closeicon-btn')).toBeVisible();
});

test('visible is two-way: model to view and view to model, with the lifecycle events', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  const d = dlg(page, 'dlg-basic-class');
  await section.getByTestId('dlg-open').click();
  await expect(section.getByTestId('dlg-visible')).toHaveText('true');
  await expect(section.getByTestId('dlg-before-open')).toHaveText('1');
  await expect(section.getByTestId('dlg-open-count')).toHaveText('1');
  // view to model: the close icon
  await d.locator('.e-dlg-closeicon-btn').click();
  await expect(d).toBeHidden();
  await expect(section.getByTestId('dlg-visible')).toHaveText('false');
  await expect(section.getByTestId('dlg-before-close')).toHaveText('1');
  await expect(section.getByTestId('dlg-close-count')).toHaveText('1');
  // model to view
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await section.getByTestId('dlg-close-vm').dispatchEvent('click');
  await expect(d).toBeHidden();
  await expect(section.getByTestId('dlg-close-count')).toHaveText('2');
});

test('closeOnEscape follows the view-model', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  const d = dlg(page, 'dlg-basic-class');
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await settle(d);
  await d.press('Escape');
  await expect(d).toBeHidden();
  await expect(section.getByTestId('dlg-visible')).toHaveText('false');
  await section.getByTestId('dlg-chk-escape').uncheck();
  await expect.poll(() => widgetProp(d, 'closeOnEscape')).toBe(false);
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await settle(d);
  await d.press('Escape');
  await expect(d).toBeVisible();
  await expect(section.getByTestId('dlg-visible')).toHaveText('true');
});

test('showCloseIcon follows the view-model', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  const d = dlg(page, 'dlg-basic-class');
  await section.getByTestId('dlg-chk-close').uncheck();
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await expect(d.locator('.e-dlg-closeicon-btn')).toHaveCount(0);
  expect(await widgetProp(d, 'showCloseIcon')).toBe(false);
});

test('isModal shows an overlay and overlayClick is raised', async ({ app, page }) => {
  const section = app.section('dialog-basic');
  const d = dlg(page, 'dlg-basic-class');
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await expect(d).toHaveClass(/e-dlg-modal/);
  await page.locator('.e-dlg-container.dlg-basic-class .e-dlg-overlay').click({ position: { x: 5, y: 5 }, force: true });
  await expect(section.getByTestId('dlg-overlay')).toHaveText('1');
  await section.getByTestId('dlg-close-vm').dispatchEvent('click');
  await expect(d).toBeHidden();
  await section.getByTestId('dlg-chk-modal').uncheck();
  await expect.poll(() => widgetProp(d, 'isModal')).toBe(false);
  await section.getByTestId('dlg-open').click();
  await expect(d).toBeVisible();
  await expect(d).not.toHaveClass(/e-dlg-modal/);
});

test('content string is sanitized, beforeSanitizeHtml is raised and content follows the view-model', async ({ app, page }) => {
  const section = app.section('dialog-content');
  await section.getByTestId('dlg-content-open').click();
  const d = dlg(page, 'dlg-content-class');
  await expect(d.getByTestId('dlg-html')).toHaveText('Bold');
  await expect(d.locator('.e-dlg-content script')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__dlgScript)).toBeUndefined();
  expect(await page.evaluate(() => (window as any).__dlgXss)).toBeUndefined();
  expect(Number(await section.getByTestId('dlg-sanitized').textContent())).toBeGreaterThan(0);
  expect(await widgetProp(d, 'enableHtmlSanitizer')).toBe(true);
  await section.getByTestId('dlg-content-change').click();
  await expect(d.getByTestId('dlg-new-content')).toHaveText('Changed content');
});

test('target renders the dialog inside a container at the given position', async ({ app, page }) => {
  const section = app.section('dialog-target');
  await section.getByTestId('dlg-target-open').click();
  const d = page.locator('.e-dialog.dlg-target-class');
  await expect(d).toBeVisible();
  await expect(d.locator('xpath=ancestor::*[@id="dlg-target-box"]')).toHaveCount(1);
  await expect(d).toContainText('Inside the container');
  expect(await widgetProp(d, 'target')).toBe('#dlg-target-box');
  const box = await d.boundingBox();
  const container = await section.getByTestId('dlg-target-box').boundingBox();
  expect(box.x + box.width).toBeGreaterThan(container.x + container.width - 10);
  expect(box.y).toBeLessThan(container.y + 30);
});

test('allowDragging moves the dialog and raises the drag events', async ({ app, page }) => {
  const section = app.section('dialog-drag');
  await section.getByTestId('dlg-drag-open').click();
  const d = page.locator('.e-dialog.dlg-drag-class');
  await expect(d).toBeVisible();
  expect(await widgetProp(d, 'allowDragging')).toBe(true);
  const before = await d.boundingBox();
  const header = await d.locator('.e-dlg-header-content').boundingBox();
  await page.mouse.move(header.x + 40, header.y + header.height / 2);
  await page.mouse.down();
  await page.mouse.move(header.x + 80, header.y + header.height / 2 + 30, { steps: 5 });
  await page.mouse.move(header.x + 120, header.y + header.height / 2 + 60, { steps: 5 });
  await page.mouse.up();
  await expect(section.getByTestId('dlg-drag-start')).toHaveText('1');
  await expect(section.getByTestId('dlg-drag-stop')).toHaveText('1');
  expect(Number(await section.getByTestId('dlg-drag-move').textContent())).toBeGreaterThan(0);
  const after = await d.boundingBox();
  expect(after.x - before.x).toBeGreaterThan(40);
  expect(after.y - before.y).toBeGreaterThan(30);
});

test.describe('resizing', () => {
// a tall viewport keeps the whole dialog, which Syncfusion centers in the page, inside the first screen
test.use({ viewport: { width: 1280, height: 1600 } });
test('enableResize and resizeHandles resize the dialog and raise the resize events', async ({ app, page }) => {
  const section = app.section('dialog-drag');
  // no scrolling: Syncfusion compares the page coordinate of the pointer with the viewport height when resizing south,
  // and a dialog opened on a scrolled page sits below the first viewport
  await section.getByTestId('dlg-drag-open').dispatchEvent('click');
  const d = page.locator('.e-dialog.dlg-drag-class');
  await expect(d).toBeVisible();
  expect(await widgetProp(d, 'enableResize')).toBe(true);
  expect(await widgetProp(d, 'resizeHandles')).toEqual(['All']);
  const before = await d.boundingBox();
  const handle = await d.locator('.e-south-east').boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + 60, handle.y + 40, { steps: 5 });
  await page.mouse.move(handle.x + 100, handle.y + 70, { steps: 5 });
  await page.mouse.up();
  await expect(section.getByTestId('dlg-resize-start')).toHaveText('1');
  await expect(section.getByTestId('dlg-resize-stop')).toHaveText('1');
  expect(Number(await section.getByTestId('dlg-resizing').textContent())).toBeGreaterThan(0);
  const after = await d.boundingBox();
  expect(after.width).toBeGreaterThan(before.width + 40);
  expect(after.height).toBeGreaterThan(before.height + 30);
});
});

test('footer buttons raise their click handlers and animationSettings are applied', async ({ app, page }) => {
  const section = app.section('dialog-buttons');
  const d = page.locator('.e-dialog.dlg-buttons-class');
  expect(await widgetProp(d, 'animationSettings')).toMatchObject({ effect: 'Zoom', duration: 100 });
  await section.getByTestId('dlg-buttons-open').click();
  await expect(d).toBeVisible();
  await expect(d.locator('.e-footer-content button')).toHaveText(['Yes', 'No']);
  await expect(d.locator('.e-footer-content button.e-primary')).toHaveText('Yes');
  await d.getByRole('button', { name: 'No' }).click();
  await expect(section.getByTestId('dlg-answer')).toHaveText('no');
  await expect(d).toBeHidden();
  await section.getByTestId('dlg-buttons-open').click();
  await d.getByRole('button', { name: 'Yes' }).click();
  await expect(section.getByTestId('dlg-answer')).toHaveText('yes');
});

test('footerTemplate replaces the footer', async ({ app, page }) => {
  const section = app.section('dialog-footer');
  await section.getByTestId('dlg-footer-open').click();
  const d = page.locator('.e-dialog.dlg-footer-class');
  await expect(d.locator('.e-footer-content .dlg-footer-content')).toHaveText('Custom footer');
});

test('destroyed is raised when the dialog is removed', async ({ app }) => {
  const section = app.section('dialog-destroy');
  await expect(section.getByTestId('dlg-destroyed')).toHaveText('0');
  await section.getByTestId('dlg-chk-exists').uncheck();
  await expect(section.getByTestId('dlg-destroyed')).toHaveText('1');
});
