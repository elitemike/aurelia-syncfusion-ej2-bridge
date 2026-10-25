import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('colorPicker'));

async function openPopup(page: Page, section: Locator) {
  await section.locator('.e-dropdown-btn').click();
  const popup = page.locator('.e-colorpicker-popup.e-popup-open');
  await expect(popup).toBeVisible();
  await page.waitForTimeout(250);
  return popup;
}

test('renders the split button with the bound colour', async ({ app }) => {
  const section = app.section('cp-basic');
  await expect(section.locator('.e-colorpicker-wrapper')).toHaveCount(1);
  await expect(section.getByTestId('cp-created')).toHaveText('1');
  await expect(section.locator('.e-split-preview')).toHaveCSS('background-color', 'rgb(0, 128, 0)');
});

test('picking a colour raises select, change and updates the value (view to model)', async ({ app, page }) => {
  const section = app.section('cp-basic');
  const popup = await openPopup(page, section);
  await expect(section.getByTestId('cp-before-open')).toHaveText('1');
  await expect(section.getByTestId('cp-open')).toHaveText('1');
  const hsv = popup.locator('.e-hsv-container');
  const box = await hsv.boundingBox();
  await page.mouse.click(box.x + 5, box.y + 5);
  await expect(section.getByTestId('cp-select-count')).not.toHaveText('0');
  await expect(section.getByTestId('cp-select-out')).not.toHaveText('');
  // the colour is only applied with the Apply button
  await expect(section.getByTestId('cp-change-count')).toHaveText('0');
  const selected = await section.getByTestId('cp-select-out').textContent();
  await popup.locator('.e-apply').click();
  await expect(section.getByTestId('cp-change-count')).toHaveText('1');
  await expect(section.getByTestId('cp-change-hex')).toHaveText(selected);
  await expect(section.getByTestId('cp-change-prev')).toHaveText('#008000');
  await expect(section.getByTestId('cp-value-out')).toHaveText(new RegExp(`^${selected}[0-9a-f]{2}$`));
  await expect(section.getByTestId('cp-before-close')).toHaveText('1');
});

test('value is two-way: model to view', async ({ app }) => {
  const section = app.section('cp-basic');
  await section.getByTestId('cp-set').click();
  await expect(section.locator('.e-split-preview')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  expect(await widgetProp(section.getByTestId('cp-basic'), 'value')).toBe('#ff0000ff');
});

test('beforeClose can cancel closing the popup', async ({ app, page }) => {
  const section = app.section('cp-basic');
  await section.getByTestId('cp-block-close').check();
  const popup = await openPopup(page, section);
  await popup.locator('.e-cancel').click();
  await expect(section.getByTestId('cp-before-close')).toHaveText('1');
  await expect(popup).toBeVisible();
});

test('showButtons binding hides the apply and cancel buttons', async ({ app, page }) => {
  const section = app.section('cp-basic');
  expect(await widgetProp(section.getByTestId('cp-basic'), 'showButtons')).toBe(true);
  await section.getByTestId('cp-buttons').click();
  await expect.poll(() => widgetProp(section.getByTestId('cp-basic'), 'showButtons')).toBe(false);
  const popup = await openPopup(page, section);
  await expect(popup.locator('.e-apply')).toHaveCount(0);
});

test('palette renders preset colours, columns and no colour', async ({ app }) => {
  const section = app.section('cp-palette');
  const host = section.getByTestId('cp-palette');
  expect(await widgetProps(host, ['mode', 'inline', 'columns', 'noColor', 'showRecentColors', 'showButtons', 'modeSwitcher']))
    .toEqual({ mode: 'Palette', inline: true, columns: 4, noColor: true, showRecentColors: true, showButtons: false, modeSwitcher: false });
  await expect(section.locator('.e-custom-palette .e-tile')).toHaveCount(8);
  await expect(section.locator('.e-custom-palette .e-row')).toHaveCount(2);
  await expect(section.locator('.e-nocolor-item')).toHaveCount(1);
  expect(Number(await section.getByTestId('cp-tiles').textContent())).toBeGreaterThanOrEqual(8);
  await section.getByTestId('cp-palette-change').click();
  await expect(section.locator('.e-custom-palette .e-row')).toHaveCount(3);
});

test('clicking a palette tile applies the colour (view to model)', async ({ app }) => {
  const section = app.section('cp-palette');
  await expect(section.getByTestId('cp-palette-out')).toHaveText('#ff0000ff');
  await section.locator('.e-custom-palette .e-tile').nth(2).click();
  await expect(section.getByTestId('cp-palette-out')).toHaveText('#0000ffff');
  await expect(section.getByTestId('cp-palette-changes')).toHaveText('1');
  // the applied colour is remembered in the recent colours row
  await expect(section.locator('.e-clr-pal-rec-wpr')).toHaveCount(1);
  await expect(section.locator('.e-recent-palette .e-tile')).toHaveCount(1);
});

test('mode switcher raises beforeModeSwitch and onModeSwitch', async ({ app }) => {
  const section = app.section('cp-switch');
  const host = section.getByTestId('cp-switch');
  await expect(section.locator('.e-hsv-container')).toBeVisible();
  await section.locator('.e-mode-switch-btn').click();
  await expect(section.getByTestId('cp-before-switch')).toHaveText('Palette');
  await expect(section.getByTestId('cp-on-switch')).toHaveText('Palette');
  await expect(section.locator('.e-color-palette')).toBeVisible();
  await section.locator('.e-mode-switch-btn').click();
  await expect(section.getByTestId('cp-on-switch')).toHaveText('Picker');
  expect(await widgetProps(host, ['modeSwitcher', 'enableOpacity', 'mode'])).toEqual({ modeSwitcher: true, enableOpacity: true, mode: 'Picker' });
  await expect(section.locator('.e-opacity-slider')).toHaveCount(1);
});

test('enableOpacity removes the opacity slider', async ({ app }) => {
  const section = app.section('cp-switch');
  await section.getByTestId('cp-opacity').click();
  await expect.poll(() => widgetProp(section.getByTestId('cp-switch'), 'enableOpacity')).toBe(false);
});

test('disabled, cssClass, enablePersistence and enableRtl', async ({ app }) => {
  const section = app.section('cp-look');
  const disabled = section.getByTestId('cp-disabled');
  await expect(disabled.locator('.e-colorpicker-wrapper')).toHaveClass(/cp-custom/);
  await expect(disabled.locator('.e-split-btn-wrapper')).toHaveClass(/e-rtl/);
  await expect(disabled.locator('.e-split-colorpicker')).toBeDisabled();
  expect(await widgetProp(disabled, 'enablePersistence')).toBe(false);
  await section.getByTestId('cp-look-change').click();
  await expect(disabled.locator('.e-split-colorpicker')).toBeEnabled();
  await expect(disabled.locator('.e-colorpicker-wrapper')).toHaveClass(/cp-custom-two/);
});

test('createPopupOnClick builds the popup lazily', async ({ app, page }) => {
  const lazy = app.section('cp-look').getByTestId('cp-lazy');
  expect(await widgetProp(lazy, 'createPopupOnClick')).toBe(true);
  // the popup of the lazy picker is only created by the first click
  const before = await page.locator('.e-dropdown-popup').count();
  await lazy.locator('.e-dropdown-btn').click();
  await expect(page.locator('.e-dropdown-popup')).toHaveCount(before + 1);
  const popup = page.locator('.e-dropdown-popup.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup.locator('.e-hsv-container')).toBeVisible();
});
