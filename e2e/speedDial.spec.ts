import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('speedDial'));

const dial = (section: any, box: string) => section.getByTestId(box).locator('button.e-speeddial');
const popup = (section: any, box: string) => section.getByTestId(box).locator('.e-speeddial-popup');

test('linear: button content, icon, css class, position and created', async ({ app }) => {
  const section = app.section('sd-linear');
  await expect(section.getByTestId('sd-created')).toHaveText('1');
  const button = dial(section, 'sd-box');
  await expect(button).toContainText('Open');
  await expect(button.locator('.e-btn-icon')).toHaveClass(/e-plus/);
  await expect(button).toHaveClass(/sd-linear-class/);
  await expect(button).toHaveClass(/e-primary/);
  await expect(button).toHaveClass(/e-fab-bottom/);
  await expect(button).toHaveClass(/e-fab-right/);
  await expect(popup(section, 'sd-box')).toHaveClass(/e-speeddial-linear/);
  await expect(popup(section, 'sd-box').locator('.e-speeddial-li')).toHaveCount(3);
  expect(await widgetProp(button, 'mode')).toBe('Linear');
  expect(await widgetProp(button, 'position')).toBe('BottomRight');
  expect(await widgetProp(button, 'target')).toBe('#sd-box');
});

test('linear: opening and closing raises the lifecycle events and swaps the icon', async ({ app }) => {
  const section = app.section('sd-linear');
  const button = dial(section, 'sd-box');
  const items = popup(section, 'sd-box').locator('.e-speeddial-li');
  await expect(items.first()).toBeHidden();
  await button.click();
  await expect(items.first()).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(button.locator('.e-btn-icon')).toHaveClass(/e-close/);
  await expect(section.getByTestId('sd-before-open')).toHaveText('1');
  await expect(section.getByTestId('sd-opened')).toHaveText('1');
  expect(Number(await section.getByTestId('sd-item-renders').textContent())).toBeGreaterThanOrEqual(3);
  await button.click();
  await expect(items.first()).toBeHidden();
  await expect(section.getByTestId('sd-before-close')).toHaveText('1');
  await expect(section.getByTestId('sd-closed')).toHaveText('1');
  await expect(button.locator('.e-btn-icon')).toHaveClass(/e-plus/);
});

test('linear: item texts and icons are rendered and clicking an item raises clicked', async ({ app }) => {
  const section = app.section('sd-linear');
  const button = dial(section, 'sd-box');
  const items = popup(section, 'sd-box').locator('.e-speeddial-li');
  await button.click();
  await expect(items.locator('.e-speeddial-li-text')).toHaveText(['Cut', 'Copy', 'Paste']);
  await expect(items.nth(1).locator('.e-speeddial-li-icon')).toHaveClass(/e-copy/);
  await items.nth(1).click();
  await expect(section.getByTestId('sd-clicked')).toHaveText('Copy');
  await expect(items.first()).toBeHidden();
});

test('linear: direction follows the view-model', async ({ app }) => {
  const section = app.section('sd-linear');
  const button = dial(section, 'sd-box');
  const items = popup(section, 'sd-box').locator('.e-speeddial-li');
  await button.click();
  await expect(items.first()).toBeVisible();
  let b = await button.boundingBox();
  let i = await items.first().boundingBox();
  expect(i.y + i.height).toBeLessThanOrEqual(b.y + 2);
  await button.click();
  await expect(items.first()).toBeHidden();
  await section.getByTestId('sd-direction').selectOption('Left');
  await expect.poll(() => widgetProp(button, 'direction')).toBe('Left');
  await button.click();
  await expect(items.first()).toBeVisible();
  b = await button.boundingBox();
  i = await items.first().boundingBox();
  expect(i.x + i.width).toBeLessThanOrEqual(b.x + 2);
});

test('linear: iconPosition, isPrimary, disabled and visible follow the view-model', async ({ app }) => {
  const section = app.section('sd-linear');
  const button = dial(section, 'sd-box');
  await expect(button.locator('.e-btn-icon')).toHaveClass(/e-icon-left/);
  await section.getByTestId('sd-icon-position').selectOption('Right');
  await expect(button.locator('.e-btn-icon')).toHaveClass(/e-icon-right/);
  await section.getByTestId('sd-chk-primary').uncheck();
  await expect(button).not.toHaveClass(/e-primary/);
  await section.getByTestId('sd-chk-disabled').check();
  await expect(button).toBeDisabled();
  await section.getByTestId('sd-chk-disabled').uncheck();
  await expect(button).toBeEnabled();
  await section.getByTestId('sd-chk-visible').uncheck();
  await expect(button).toBeHidden();
  await section.getByTestId('sd-chk-visible').check();
  await expect(button).toBeVisible();
});

test('radial: items are arranged on an arc around the button', async ({ app }) => {
  const section = app.section('sd-radial');
  const button = dial(section, 'sd-radial-box');
  expect(await widgetProp(button, 'mode')).toBe('Radial');
  expect(await widgetProp(button, 'radialSettings')).toMatchObject({ startAngle: 180, endAngle: 270, offset: '80px' });
  await expect(popup(section, 'sd-radial-box')).toHaveClass(/e-speeddial-radial/);
  await button.click();
  const items = popup(section, 'sd-radial-box').locator('.e-speeddial-li');
  await expect(items.first()).toBeVisible();
  const b = await button.boundingBox();
  const centre = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const distances: number[] = [];
  for (let n = 0; n < 3; n++) {
    const box = await items.nth(n).boundingBox();
    // the arc between 180 and 270 degrees is the top left quadrant of the button
    expect(box.x + box.width / 2).toBeLessThanOrEqual(centre.x + 6);
    expect(box.y + box.height / 2).toBeLessThanOrEqual(centre.y + 6);
    distances.push(Math.hypot(box.x + box.width / 2 - centre.x, box.y + box.height / 2 - centre.y));
  }
  expect(Math.max(...distances) - Math.min(...distances)).toBeLessThan(6);
});

test('opensOnHover opens on hover and closes when the pointer leaves', async ({ app, page }) => {
  const section = app.section('sd-hover');
  const button = dial(section, 'sd-hover-box');
  await button.scrollIntoViewIfNeeded();
  expect(await widgetProp(button, 'opensOnHover')).toBe(true);
  const items = popup(section, 'sd-hover-box').locator('.e-speeddial-li');
  await button.hover();
  await expect(items.first()).toBeVisible();
  await page.mouse.move(5, 5);
  await expect(items.first()).toBeHidden();
});

test('modal shows an overlay while open and animation is passed on', async ({ app }) => {
  const section = app.section('sd-modal');
  const button = dial(section, 'sd-modal-box');
  expect(await widgetProp(button, 'modal')).toBe(true);
  expect(await widgetProp(button, 'animation')).toMatchObject({ effect: 'Fade', duration: 100 });
  const overlay = section.getByTestId('sd-modal-box').locator('.e-speeddial-overlay');
  await expect(overlay).toBeHidden();
  await button.click();
  await expect(overlay).toBeVisible();
  await button.click();
  await expect(overlay).toBeHidden();
});

test('itemTemplate and popupTemplate customise the popup', async ({ app }) => {
  const section = app.section('sd-template');
  const itemDial = dial(section, 'sd-item-template-box');
  await itemDial.click();
  const tplItems = section.getByTestId('sd-item-template-box').locator('.sd-tpl-item');
  await expect(tplItems).toHaveText(['Cut', 'Copy', 'Paste']);
  await expect(tplItems.first()).toHaveAttribute('data-text', 'Cut');
  const popupDial = dial(section, 'sd-popup-template-box');
  await popupDial.click();
  await expect(section.getByTestId('sd-popup-template-box').locator('.sd-tpl-popup')).toHaveText('Custom popup');
});
