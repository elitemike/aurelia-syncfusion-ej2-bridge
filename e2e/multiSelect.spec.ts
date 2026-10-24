import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('multiSelect'));

/** Reads a property of the Syncfusion widget behind a demo element (data-testid). */
function prop(page: Page, testId: string, name: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au['ej2-multi-select'].viewModel.widget;
    return w[p];
  }, [testId, name]);
}

const blur = (page: Page) => page.locator('main h2').click();

test('initial values render as chips', async ({ app }) => {
  await expect(app.section('ms-value').locator('.e-chips')).toHaveCount(2);
});

test('two-way value: view to model with select, tagging and change events', async ({ app, page }) => {
  const section = app.section('ms-value');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await popup.locator('li', { hasText: 'Golf' }).click();
  await expect(section.getByTestId('ms-select-detail')).toHaveText('Golf');
  await expect(section.getByTestId('ms-value-ev')).toContainText('select,');
  await expect(section.getByTestId('ms-value-ev')).toContainText('tagging,');
  await blur(page); // change is raised on blur
  await expect(section.getByTestId('ms-value-out')).toHaveText('Game2,Game4,Game6');
  await expect(section.getByTestId('ms-change-count')).toHaveText('1');
});

test('removing a chip updates the model and raises removing/removed', async ({ app, page }) => {
  const section = app.section('ms-value');
  await section.locator('.e-chips', { hasText: 'Badminton' }).locator('.e-chips-close').dispatchEvent('mousedown');
  await blur(page);
  await expect(section.getByTestId('ms-value-out')).toHaveText('Game4');
  await expect(section.getByTestId('ms-value-ev')).toContainText('removing,removed,');
});

test('selecting a chip with the keyboard raises chipSelection', async ({ app, page }) => {
  const section = app.section('ms-value');
  await section.locator('input.e-dropdownbase').focus();
  await page.keyboard.press('ArrowLeft'); // moves the selection onto the last chip
  await expect(section.getByTestId('ms-value-ev')).toContainText('chipSelection,');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ms-value');
  await section.getByTestId('ms-set').click();
  await expect(section.locator('.e-chips')).toHaveCount(1);
  await expect(section.locator('.e-chips')).toContainText('American Football');
});

test('checkbox mode with select all, labels and events', async ({ app, page }) => {
  const section = app.section('ms-checkbox');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await expect(popup.locator('.e-selectall-parent .e-all-text')).toHaveText('Pick everything');
  await popup.locator('.e-selectall-parent').click();
  await expect(popup.locator('li.e-active')).toHaveCount(6);
  await expect(popup.locator('.e-selectall-parent .e-all-text')).toHaveText('Pick nothing');
  await expect(section.getByTestId('ms-checkbox-ev')).toContainText('beforeSelectAll,');
  await expect(section.getByTestId('ms-checkbox-ev')).toContainText('selectedAll,');
  expect(await prop(page, 'ms-checkbox', 'selectAllText')).toBe('Pick everything');
  expect(await prop(page, 'ms-checkbox', 'unSelectAllText')).toBe('Pick nothing');
});

test('enableGroupCheckBox and groupTemplate', async ({ app, page }) => {
  const section = app.section('ms-group');
  expect(await prop(page, 'ms-group', 'enableGroupCheckBox')).toBe(true);
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await expect(popup.locator('.tpl-group').first()).toContainText('Group: Fruit');
  await expect(popup.locator('.e-list-group-item .e-checkbox-wrapper')).toHaveCount(2);
});

test('summaryTagCount and summaryTagTemplate', async ({ app, page }) => {
  const section = app.section('ms-summary');
  expect(await prop(page, 'ms-summary', 'summaryTagCount')).toBe(2);
  await section.getByTestId('ms-summary-set').click();
  await expect(section.locator('.e-multi-select-wrapper')).toContainText('3 chosen');
  await expect(section.locator('.e-chips:visible')).toHaveCount(0);
});

test('maximumSelectionLength', async ({ app, page }) => {
  const section = app.section('ms-limit');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await popup.locator('li', { hasText: 'Cricket' }).click();
  await expect(section.locator('.e-chips')).toHaveCount(1);
  await popup.locator('li', { hasText: 'Golf' }).click();
  await expect(section.locator('.e-chips')).toHaveCount(2);
  await popup.locator('li', { hasText: 'Basketball' }).click();
  await expect.poll(() => prop(page, 'ms-limit', 'value')).toHaveLength(2);
  await expect(section.locator('.e-chips')).toHaveCount(2);
  expect(await prop(page, 'ms-limit', 'maximumSelectionLength')).toBe(2);
});

test('select markup data source', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ms-select').locator('.e-multi-select-wrapper'));
  await expect(popup.locator('li.e-list-item')).toHaveText(['Golf', 'Hockey', 'Rugby']);
});

test('allowCustomValue adds free text and raises customValueSelection', async ({ app, page }) => {
  const section = app.section('ms-custom');
  const input = section.locator('input.e-dropdownbase');
  await input.click();
  await input.pressSequentially('Curling');
  await page.keyboard.press('Enter');
  await expect(section.locator('.e-chips')).toContainText('Curling');
  await expect(section.getByTestId('ms-custom-ev')).toContainText('customValueSelection,');
  expect(await prop(page, 'ms-custom', 'allowCustomValue')).toBe(true);
});

test('lifecycle and popup events', async ({ app, page }) => {
  const section = app.section('ms-life');
  const log = section.getByTestId('ms-life-ev');
  await expect(log).toContainText('created,');
  await section.locator('.e-multi-select-wrapper').click();
  await expect(log).toContainText('focus,');
  await expect(log).toContainText('beforeOpen,');
  await expect(log).toContainText('open,');
  await expect(log).toContainText('dataBound,');
  await expect(log).toContainText('actionBegin,');
  await expect(log).toContainText('actionComplete,');
  await page.keyboard.press('Escape');
  await expect(log).toContainText('close,');
  await blur(page);
  await expect(log).toContainText('blur,');
});

test('destroyed event is raised when the wrapper is removed', async ({ app }) => {
  const section = app.section('ms-destroy');
  await expect(section.getByTestId('ms-destroyed-count')).toHaveText('0');
  await section.getByTestId('ms-destroy-btn').click();
  await expect(section.getByTestId('ms-destroyed-count')).toHaveText('1');
  await expect(section.locator('.e-multi-select-wrapper')).toHaveCount(0);
});

test('appearance properties reach the widget and follow the view-model', async ({ app, page }) => {
  const section = app.section('ms-appearance');
  const wrapper = section.locator('.e-multi-select-wrapper');
  const host = section.locator('.e-multi-select-wrapper').locator('..'); // component wrapper
  await expect(host).toHaveClass(/ms-custom-class/);
  await expect.poll(async () => (await host.boundingBox()).width).toBeCloseTo(320, 0);
  await expect(section.locator('.e-float-text')).toHaveText('Pick sports'); // floatLabelType Always moves the placeholder into the label
  await expect(section.locator('.e-close-hooker')).toBeAttached();
  await expect(section.locator('.e-ddl-icon')).toBeVisible();
  expect(await prop(page, 'ms-appearance', 'zIndex')).toBe(4321);
  expect(await prop(page, 'ms-appearance', 'locale')).toBe('en-US');
  expect(await prop(page, 'ms-appearance', 'enableHtmlSanitizer')).toBe(true);
  expect(await prop(page, 'ms-appearance', 'openOnClick')).toBe(true);
  expect(await prop(page, 'ms-appearance', 'htmlAttributes')).toMatchObject({ 'data-extra': 'hello' });
  await expect(section.locator('[data-extra="hello"]').first()).toBeAttached();
  const popup = await openPopup(page, wrapper);
  await expect(popup).toHaveClass(/ms-custom-class/);
  expect(await popup.evaluate(el => (el as HTMLElement).style.maxHeight)).toBe('150px');
  expect(await popup.evaluate(el => (el as HTMLElement).style.width)).toBe('260px');
  expect(await popup.evaluate(el => (el as HTMLElement).style.zIndex)).toBe('4321');
  await page.keyboard.press('Escape');
  await blur(page);

  await section.getByTestId('ms-restyle').click();
  await expect(host).toHaveClass(/ms-other-class/);
  await expect.poll(async () => (await host.boundingBox()).width).toBeCloseTo(400, 0);
  await expect(section.locator('.e-close-hooker')).toBeHidden();
  await expect(section.locator('.e-ddl-icon')).toHaveCount(0);
  await expect(section.locator('[data-extra="changed"]').first()).toBeAttached();
  expect(await prop(page, 'ms-appearance', 'placeholder')).toBe('Changed placeholder');
  expect(await prop(page, 'ms-appearance', 'popupHeight')).toBe('200px');
  expect(await prop(page, 'ms-appearance', 'popupWidth')).toBe('300px');
  expect(await prop(page, 'ms-appearance', 'zIndex')).toBe(5555);
  expect(await prop(page, 'ms-appearance', 'floatLabelType')).toBe('Never');
});

test('selection behaviour properties', async ({ app, page }) => {
  const section = app.section('ms-behaviour');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  // sortOrder Descending
  await expect(popup.locator('li.e-list-item').first()).toHaveText('Golf');
  await popup.locator('li', { hasText: 'Cricket' }).click();
  await expect(section.locator('.e-chips')).toHaveCount(1);
  await expect(popup).toBeVisible(); // closePopupOnSelect false
  await popup.locator('li', { hasText: 'Badminton' }).click();
  // enableSelectionOrder, chips keep the click order
  await expect(section.locator('.e-chips')).toHaveText(['Cricket', 'Badminton']);
  // hideSelectedItem false, selected items stay in the list
  await expect(popup.locator('li.e-list-item')).toHaveCount(6);
  expect(await prop(page, 'ms-behaviour', 'closePopupOnSelect')).toBe(false);
  expect(await prop(page, 'ms-behaviour', 'hideSelectedItem')).toBe(false);
  expect(await prop(page, 'ms-behaviour', 'enableSelectionOrder')).toBe(true);
  expect(await prop(page, 'ms-behaviour', 'sortOrder')).toBe('Descending');
  expect(await prop(page, 'ms-behaviour', 'changeOnBlur')).toBe(false);
  expect(await prop(page, 'ms-behaviour', 'addTagOnBlur')).toBe(false);
});

test('delimiter mode and delimiterChar', async ({ app, page }) => {
  const section = app.section('ms-delimiter');
  expect(await prop(page, 'ms-delimiter', 'mode')).toBe('Delimiter');
  await expect(section.locator('.e-delim-view')).toContainText(/American Football;\s*Basketball/);
  expect(await prop(page, 'ms-delimiter', 'delimiterChar')).toBe(';');
  await section.getByTestId('ms-delim-btn').click();
  expect(await prop(page, 'ms-delimiter', 'delimiterChar')).toBe('|');
  expect(await prop(page, 'ms-delimiter', 'text')).toContain('American Football');
});

test('enabled and readonly follow the view-model', async ({ app, page }) => {
  const section = app.section('ms-state');
  const wrapper = section.locator('.e-multi-select-wrapper');
  await expect(wrapper.locator('..')).not.toHaveClass(/e-disabled/);
  expect(await prop(page, 'ms-state', 'readonly')).toBe(false);
  await section.getByTestId('ms-state-btn').click();
  await expect(wrapper.locator('..')).toHaveClass(/e-disabled/);
  expect(await prop(page, 'ms-state', 'enabled')).toBe(false);
  expect(await prop(page, 'ms-state', 'readonly')).toBe(true);
});

test('filtering properties and event', async ({ app, page }) => {
  const section = app.section('ms-filter');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  const filter = popup.locator('input.e-input-filter');
  await expect(filter).toHaveAttribute('placeholder', 'Search here');
  await filter.pressSequentially('CAFE'); // ignoreCase and ignoreAccent, Contains filter
  await expect(section.getByTestId('ms-filter-ev')).toContainText('filtering,');
  await expect(popup.locator('li.e-list-item')).toHaveText(['Café', 'Cafe Latte']);
  expect(await prop(page, 'ms-filter', 'allowFiltering')).toBe(true);
  expect(await prop(page, 'ms-filter', 'filterType')).toBe('Contains');
  expect(await prop(page, 'ms-filter', 'ignoreCase')).toBe(true);
  expect(await prop(page, 'ms-filter', 'ignoreAccent')).toBe(true);
  expect(await prop(page, 'ms-filter', 'debounceDelay')).toBe(0);
  expect(await prop(page, 'ms-filter', 'isDeviceFullScreen')).toBe(false);
});

test('query limits the list', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ms-query').locator('.e-multi-select-wrapper'));
  await expect(popup.locator('li.e-list-item')).toHaveCount(3);
});

test('allowObjectBinding keeps objects in value', async ({ app, page }) => {
  const section = app.section('ms-object');
  expect(await prop(page, 'ms-object', 'allowObjectBinding')).toBe(true);
  await expect(section.locator('.e-chips')).toContainText('Badminton');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await popup.locator('li', { hasText: 'Golf' }).click();
  await blur(page);
  await expect(section.getByTestId('ms-object-out')).toHaveText('2 / Badminton');
  expect(await page.evaluate(() => {
    const el: any = document.querySelector('[data-testid="ms-object"]');
    return typeof el.au['ej2-multi-select'].viewModel.widget.value[1];
  })).toBe('object');
});

test('item, value, header and footer templates', async ({ app, page }) => {
  const section = app.section('ms-templates');
  await expect(section.locator('.tpl-value')).toHaveText('Value: American Football');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await expect(popup.locator('.tpl-item')).toHaveCount(6);
  await expect(popup.locator('.tpl-item').first()).toHaveText('Item: American Football');
  await expect(popup.locator('.tpl-header')).toHaveText('The header');
  await expect(popup.locator('.tpl-footer')).toHaveText('The footer');
});

test('noRecordsTemplate for an empty data source', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ms-norecords').locator('.e-multi-select-wrapper'));
  await expect(popup.locator('.tpl-norecords')).toHaveText('Nothing found');
});

test('actionFailure and actionFailureTemplate for a failing request', async ({ app, page }) => {
  const section = app.section('ms-remote');
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  await expect(section.getByTestId('ms-remote-ev')).toContainText('actionFailure,');
  await expect(popup.locator('.tpl-failure')).toHaveText('Data failed');
});

test('enableVirtualization renders a window of a long list', async ({ app, page }) => {
  expect(await prop(page, 'ms-virtual', 'enableVirtualization')).toBe(true);
  const popup = await openPopup(page, app.section('ms-virtual').locator('.e-multi-select-wrapper'));
  await expect(popup.locator('.e-virtual-ddl')).toBeAttached();
  const count = await popup.locator('li.e-list-item').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(300);
});

test('resizable popup raises resize events', async ({ app, page }) => {
  const section = app.section('ms-resize');
  expect(await prop(page, 'ms-resize', 'allowResize')).toBe(true);
  const popup = await openPopup(page, section.locator('.e-multi-select-wrapper'));
  const handle = popup.locator('.e-resizer-right');
  await expect(handle).toBeVisible();
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 60, box.y + 40, { steps: 5 });
  await page.mouse.up();
  const log = section.getByTestId('ms-resize-ev');
  await expect(log).toContainText('resizeStart,');
  await expect(log).toContainText('resizing,');
  await expect(log).toContainText('resizeStop,');
});
