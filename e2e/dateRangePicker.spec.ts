import { test, expect } from './fixtures';
import { openPopup } from './helpers';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('dateRangePicker'));

const POPUP = '.e-daterangepicker.e-popup-open';

test('initial start and end render in the input', async ({ app }) => {
  await expect(app.section('drp-range').locator('input.e-daterangepicker')).toHaveValue('2024-05-10 - 2024-05-20');
});

test('model to view', async ({ app }) => {
  const section = app.section('drp-range');
  await section.getByTestId('drp-set').click();
  await expect(section.locator('input.e-daterangepicker')).toHaveValue('2024-05-01 - 2024-05-03');
});

test('view to model via popup and Apply', async ({ app, page }) => {
  const section = app.section('drp-range');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  const days = popup.locator('.e-left-calendar td:not(.e-other-month):not(.e-disabled) span');
  await days.getByText('2', { exact: true }).click();
  await days.getByText('6', { exact: true }).click();
  await popup.locator('.e-apply').click();
  await expect(section.getByTestId('drp-start-out')).toHaveText('2024-05-02');
  await expect(section.getByTestId('drp-end-out')).toHaveText('2024-05-06');
  await expect(section.getByTestId('drp-change-count')).toHaveText('1');
});

test('two-way value pair: model to view and view to model', async ({ app, page }) => {
  const section = app.section('drp-value');
  const input = section.locator('input.e-daterangepicker');
  await expect(input).toHaveValue('2024-05-06 - 2024-05-08');
  await section.getByTestId('drp-value-set').click();
  await expect(input).toHaveValue('2024-06-03 - 2024-06-05');
  await input.fill('2024-07-01 - 2024-07-04');
  await input.blur();
  await expect(section.getByTestId('drp-value-out')).toHaveText('2024-7-1 / 2024-7-4');
});

test('presets apply a range', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('drp-presets').locator('.e-input-group-icon'), POPUP);
  await popup.locator('.e-presets li', { hasText: 'Whole week' }).click();
  await expect(app.section('drp-presets').locator('input.e-daterangepicker')).toHaveValue('2024-05-06 - 2024-05-12');
});

test('minDays and maxDays limit the selectable span', async ({ app, page }) => {
  const host = app.section('drp-limits').getByTestId('drp-limits');
  expect(await widgetProps(host, ['minDays', 'maxDays'])).toEqual({ minDays: 2, maxDays: 3 });
  const popup = await openPopup(page, app.section('drp-limits').locator('.e-input-group-icon'), POPUP);
  await popup.locator('.e-left-calendar td:not(.e-other-month) span').getByText('10', { exact: true }).click();
  await expect(popup.locator('.e-left-calendar td.e-disabled:not(.e-other-month)').first()).toBeAttached();
});

test('placeholder, separator and clear button', async ({ app }) => {
  const section = app.section('drp-options');
  const input = section.locator('input.e-daterangepicker');
  await expect(input).toHaveAttribute('placeholder', 'Select a range');
  await expect(input).toHaveValue('2024-05-10 to 2024-05-20');
  expect(await widgetProps(section.getByTestId('drp-options'), ['separator', 'showClearButton'])).toEqual({ separator: 'to', showClearButton: true });
  await input.focus();
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});

test('events: created, focus, open, select, navigated, change, close, blur, cleared', async ({ app, page }) => {
  const section = app.section('drp-events');
  const log = section.getByTestId('drp-log');
  await expect(log).toContainText('created');
  const input = section.locator('input.e-daterangepicker');
  await input.focus();
  await expect(log).toContainText('focus');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(log).toContainText('open');
  await popup.locator('.e-left-calendar .e-header .e-next').click();
  await expect(log).toContainText('navigated');
  const days = popup.locator('.e-left-calendar td:not(.e-other-month):not(.e-disabled) span');
  await days.getByText('3', { exact: true }).click();
  await days.getByText('5', { exact: true }).click();
  await expect(log).toContainText('select');
  // the popup opens below the fold, a native click would scroll and close it
  await popup.locator('.e-apply').dispatchEvent('click');
  await expect(log).toContainText('change');
  await expect(log).toContainText('close');
  await expect(section.getByTestId('drp-last-change')).toHaveText(/^\d+\/3-\d+\/5$/);
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await expect(log).toContainText('blur');
  await input.focus();
  await section.locator('.e-clear-icon').dispatchEvent('mousedown');
  await expect(log).toContainText('cleared');
  await expect(section.getByTestId('drp-last-change')).toHaveText('null');
});

test('renderDayCell handler decorates cells', async ({ app, page }) => {
  const section = app.section('drp-render');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('td.demo-mark').first()).toHaveText('15');
  await expect(section.getByTestId('drp-render-count')).not.toHaveText('0');
});

test('destroyed event fires when the element is removed', async ({ app }) => {
  const section = app.section('drp-destroy');
  await expect(section.getByTestId('drp-destroyed')).toHaveText('0');
  await section.getByTestId('drp-destroy-btn').click();
  await expect(section.getByTestId('drp-destroyed')).toHaveText('1');
});

const dynamicProps = ['enabled', 'strictMode', 'placeholder', 'floatLabelType', 'format', 'separator',
  'width', 'zIndex', 'openOnFocus', 'showClearButton', 'showTodayButton', 'weekNumber', 'firstDayOfWeek', 'dayHeaderFormat',
  'weekRule', 'depth', 'start', 'minDays', 'maxDays', 'serverTimezoneOffset', 'fullScreenMode'];

test('model to widget: every bound property follows the view-model', async ({ app }) => {
  test.setTimeout(60_000);
  const section = app.section('drp-dynamic');
  const host = section.getByTestId('drp-dynamic');
  const a = await widgetProps(host, dynamicProps);
  expect(a).toMatchObject({
    enabled: true, strictMode: false, placeholder: 'Alpha', floatLabelType: 'Never',
    format: 'yyyy-MM-dd', separator: '-', width: 300, zIndex: 1500, openOnFocus: false, showClearButton: false,
    showTodayButton: true, weekNumber: false, firstDayOfWeek: 0, dayHeaderFormat: 'Short', weekRule: 'FirstDay',
    depth: 'Month', start: 'Month', minDays: 1, maxDays: 30, serverTimezoneOffset: 0, fullScreenMode: false
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-a');
  await expect(host.locator('input.e-daterangepicker')).toHaveValue('2024-05-10 - 2024-05-20');
  await expect(host.locator('input.e-daterangepicker')).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.cls-a')).toBeVisible();

  const edit = section.getByTestId('drp-dynamic-edit');
  expect(await widgetProps(edit, ['readonly', 'allowEdit'])).toEqual({ readonly: false, allowEdit: true });
  expect(await widgetProps(edit, ['min', 'max'])).toEqual({
    min: new Date(1900, 0, 1).toISOString(), max: new Date(2099, 11, 31).toISOString()
  });
  await section.getByTestId('drp-toggle').click();
  await expect.poll(() => widgetProps(edit, ['readonly', 'allowEdit']), { timeout: 20_000 }).toEqual({ readonly: true, allowEdit: false });
  await expect.poll(() => widgetProps(host, dynamicProps), { timeout: 20_000 }).toMatchObject({
    enabled: false, strictMode: true, placeholder: 'Beta', floatLabelType: 'Always',
    format: 'dd/MM/yyyy', separator: '~', width: 360, zIndex: 2000, openOnFocus: true, showClearButton: true,
    showTodayButton: false, weekNumber: true, firstDayOfWeek: 1, dayHeaderFormat: 'Narrow', weekRule: 'FirstFullWeek',
    depth: 'Year', start: 'Year', minDays: 2, maxDays: 9, serverTimezoneOffset: 2, fullScreenMode: true
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-b');
  // Syncfusion re-enables the input whenever min/max change, so those are bound on the second widget
  await expect.poll(() => widgetProps(edit, ['min', 'max']), { timeout: 20_000 }).toEqual({
    min: new Date(2024, 4, 1).toISOString(), max: new Date(2024, 4, 31).toISOString()
  });
  await expect(host.locator('input.e-daterangepicker')).toHaveAttribute('data-flavor', 'b');
  await expect(host.locator('.e-input-group.cls-b')).toBeVisible();
  await expect(host.locator('input.e-daterangepicker')).toBeDisabled();
  await expect(host.locator('.e-float-text')).toHaveText('Beta');
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(360, 0);

});

test('calendar layout: header format, week numbers, no today button', async ({ app, page }) => {
  const host = app.section('drp-calendar').getByTestId('drp-calendar');
  const popup = await openPopup(page, app.section('drp-calendar').locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('.e-left-calendar th').filter({ hasText: /^[A-Z]$/ }).first()).toHaveText('M');
  await expect(popup.locator('.e-left-calendar th.e-week-number')).toBeAttached();
  await expect(popup.locator('.e-left-calendar td.e-week-number').first()).toHaveText(/^\d+$/);
  expect(await widgetProps(host, ['calendarMode', 'weekRule', 'firstDayOfWeek', 'showTodayButton']))
    .toEqual({ calendarMode: 'Gregorian', weekRule: 'FirstFullWeek', firstDayOfWeek: 1, showTodayButton: false });
});

test('start and depth show months instead of days', async ({ app, page }) => {
  const section = app.section('drp-depth');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('.e-left-calendar td span', { hasText: /^Aug$/ })).toBeVisible();
  await expect(popup.locator('.e-left-calendar td span', { hasText: /^15$/ })).toHaveCount(0);
  await expect(section.locator('input.e-daterangepicker')).toHaveValue('May 2024 - May 2024');
});

test('strictMode rejects out-of-range input, loose mode flags it', async ({ app }) => {
  const section = app.section('drp-strict');
  const strictHost = section.getByTestId('drp-strict');
  const strict = strictHost.locator('input.e-daterangepicker');
  await strict.fill('2024-09-02 - 2024-09-05');
  await strict.blur();
  await expect.poll(() => widgetProp(strictHost, 'startDate')).not.toBe(new Date(2024, 8, 2).toISOString());
  const loose = section.getByTestId('drp-loose').locator('input.e-daterangepicker');
  await loose.fill('2024-09-02 - 2024-09-05');
  await loose.blur();
  await expect(section.getByTestId('drp-loose').locator('.e-input-group')).toHaveClass(/e-error/);
  expect(await widgetProp(strictHost, 'strictMode')).toBe(true);
  expect(await widgetProp(section.getByTestId('drp-loose'), 'strictMode')).toBe(false);
});

test('inputFormats parse alternative typed formats', async ({ app }) => {
  const host = app.section('drp-strict').getByTestId('drp-inputformats');
  const input = host.locator('input.e-daterangepicker');
  await input.fill('09-06-2024 - 12-06-2024');
  await input.blur();
  await expect(input).toHaveValue('2024-06-09 - 2024-06-12');
  expect(await widgetProp(host, 'inputFormats')).toEqual(['dd-MM-yyyy']);
});

test('openOnFocus, allowEdit, zIndex, width, cssClass, htmlAttributes and passthrough flags', async ({ app, page }) => {
  const host = app.section('drp-focus').getByTestId('drp-focus');
  const input = host.locator('input.e-daterangepicker');
  await input.focus();
  await expect(page.locator(POPUP)).toBeVisible();
  await expect(page.locator(POPUP)).toHaveCSS('z-index', '3500');
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.demo-drp-focus')).toBeVisible();
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(320, 0);
  const props = await widgetProps(host, ['keyConfigs', 'serverTimezoneOffset', 'fullScreenMode', 'locale', 'enableRtl']);
  expect(props).toMatchObject({ serverTimezoneOffset: 0, fullScreenMode: false, locale: 'en-US', enableRtl: false });
  expect(props.keyConfigs).toMatchObject({ escape: 'escape' });
});
