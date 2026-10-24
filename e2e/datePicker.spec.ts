import { test, expect } from './fixtures';
import { openPopup } from './helpers';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('datePicker'));

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('dp-value');
  await expect(section.locator('input.e-datepicker')).toHaveValue('2024-05-15');
  await section.getByTestId('dp-set').click();
  await expect(section.locator('input.e-datepicker')).toHaveValue('2024-05-20');
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-20');
});

test('two-way value: view to model via popup', async ({ app, page }) => {
  const section = app.section('dp-value');
  await section.locator('.e-input-group-icon.e-date-icon').click();
  await page.locator('.e-calendar td:not(.e-other-month) span', { hasText: /^10$/ }).click();
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-10');
  await expect(section.getByTestId('dp-change-count')).toHaveText('1');
});

test('typed value updates model', async ({ app }) => {
  const section = app.section('dp-value');
  const input = section.locator('input.e-datepicker');
  await input.fill('2024-05-02');
  await input.blur();
  await expect(section.getByTestId('dp-value-out')).toHaveText('2024-05-02');
});

test('min/max disables out-of-range dates', async ({ app, page }) => {
  await app.section('dp-range').locator('.e-date-icon').click();
  await expect(page.locator('.e-datepicker.e-popup-open .e-calendar')).toBeVisible();
  await expect(page.locator('.e-calendar td.e-disabled').first()).toBeAttached();
  await expect(page.locator('.e-calendar td.e-selected')).toHaveCount(1);
  const host = app.section('dp-range').getByTestId('dp-range');
  expect(await widgetProps(host, ['min', 'max'])).toEqual({
    min: new Date(2024, 4, 1).toISOString(), max: new Date(2024, 4, 31).toISOString()
  });
});

test('readonly input', async ({ app }) => {
  await expect(app.section('dp-options').getByTestId('dp-readonly').locator('input.e-datepicker')).toHaveAttribute('readonly', '');
});

test('placeholder, floating label and clear button', async ({ app }) => {
  const host = app.section('dp-options').getByTestId('dp-options');
  await expect(host.locator('.e-float-text')).toHaveText('Pick a date');
  expect(await widgetProps(host, ['floatLabelType', 'showClearButton'])).toEqual({ floatLabelType: 'Auto', showClearButton: true });
});

test('events: created, focus, open, navigated, change, close, blur, cleared', async ({ app, page }) => {
  const section = app.section('dp-events');
  const log = section.getByTestId('dp-log');
  await expect(log).toContainText('created');
  const input = section.locator('input.e-datepicker');
  await input.focus();
  await expect(log).toContainText('focus');
  const popup = await openPopup(page, section.locator('.e-date-icon'), '.e-datepicker.e-popup-open');
  await expect(log).toContainText('open');
  await popup.locator('.e-header .e-next').click();
  await expect(log).toContainText('navigated');
  await popup.locator('td:not(.e-other-month) span', { hasText: /^12$/ }).click();
  await expect(log).toContainText('change');
  await expect(log).toContainText('close');
  await expect(section.getByTestId('dp-last-change')).toHaveText(/^\d{4}-\d+-12$/);
  await expect(input).toHaveValue(/-12$/);
  await section.locator('h3, .demo-output').first().click();
  await expect(log).toContainText('blur');
  await input.focus();
  await section.locator('.e-clear-icon').dispatchEvent('mousedown');
  await expect(log).toContainText('cleared');
  await expect(section.getByTestId('dp-last-change')).toHaveText('null');
});

test('renderDayCell handler decorates cells', async ({ app, page }) => {
  const section = app.section('dp-render');
  const popup = await openPopup(page, section.locator('.e-date-icon'), '.e-datepicker.e-popup-open');
  await expect(popup.locator('td.demo-mark')).toHaveCount(1);
  await expect(popup.locator('td.demo-mark')).toHaveText('15');
  await expect(section.getByTestId('dp-render-count')).not.toHaveText('0');
});

test('destroyed event fires when the element is removed', async ({ app }) => {
  const section = app.section('dp-destroy');
  await expect(section.getByTestId('dp-destroyed')).toHaveText('0');
  await section.getByTestId('dp-destroy-btn').click();
  await expect(section.getByTestId('dp-destroyed')).toHaveText('1');
});

const dynamicProps = ['enabled', 'readonly', 'allowEdit', 'strictMode', 'placeholder', 'floatLabelType', 'format',
  'width', 'zIndex', 'openOnFocus', 'showClearButton', 'showTodayButton', 'weekNumber', 'firstDayOfWeek', 'dayHeaderFormat',
  'weekRule', 'depth', 'start', 'serverTimezoneOffset', 'fullScreenMode', 'enableMask'];

test('model to widget: every bound property follows the view-model', async ({ app }) => {
  test.setTimeout(60_000);
  const section = app.section('dp-dynamic');
  const host = section.getByTestId('dp-dynamic');
  const a = await widgetProps(host, dynamicProps);
  expect(a).toMatchObject({
    enabled: true, readonly: false, allowEdit: true, strictMode: false,
    placeholder: 'Alpha', floatLabelType: 'Never', format: 'yyyy-MM-dd', width: 200, zIndex: 1500, openOnFocus: false,
    showClearButton: false, showTodayButton: true, weekNumber: false, firstDayOfWeek: 0, dayHeaderFormat: 'Short',
    weekRule: 'FirstDay', depth: 'Month', start: 'Month', serverTimezoneOffset: 0, fullScreenMode: false, enableMask: false
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-a');
  expect(await widgetProp(host, 'min')).toBe(new Date(1900, 0, 1).toISOString());
  expect(await widgetProp(host, 'max')).toBe(new Date(2099, 11, 31).toISOString());
  await expect(host.locator('input.e-datepicker')).toHaveValue('2024-05-15');
  await expect(host.locator('input.e-datepicker')).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.cls-a')).toBeVisible();

  await section.getByTestId('dp-toggle').click();
  await expect.poll(() => widgetProps(host, dynamicProps), { timeout: 20_000 }).toMatchObject({
    enabled: false, readonly: true, allowEdit: false, strictMode: true,
    placeholder: 'Beta', floatLabelType: 'Always', format: 'dd/MM/yyyy', width: 260, zIndex: 2000, openOnFocus: true,
    showClearButton: true, showTodayButton: false, weekNumber: true, firstDayOfWeek: 1, dayHeaderFormat: 'Narrow',
    weekRule: 'FirstFullWeek', depth: 'Year', start: 'Year', serverTimezoneOffset: 2, fullScreenMode: true, enableMask: true
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-b');
  expect(await widgetProp(host, 'min')).toBe(new Date(2024, 4, 1).toISOString());
  expect(await widgetProp(host, 'max')).toBe(new Date(2024, 4, 31).toISOString());
  await expect(host.locator('input.e-datepicker')).toHaveAttribute('data-flavor', 'b');
  await expect(host.locator('.e-input-group.cls-b')).toBeVisible();
  await expect(host.locator('.e-input-group.cls-a')).toHaveCount(0);
  await expect(host.locator('input.e-datepicker')).toBeDisabled();
  await expect(host.locator('.e-float-text')).toHaveText('Beta');
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(260, 0);

});

test('calendar layout: header format, first day, week numbers, no today button', async ({ app, page }) => {
  const host = app.section('dp-calendar').getByTestId('dp-calendar');
  const popup = await openPopup(page, app.section('dp-calendar').locator('.e-date-icon'), '.e-datepicker.e-popup-open');
  await expect(popup.locator('th').filter({ hasText: /^[A-Z]$/ }).first()).toHaveText('M');
  await expect(popup.locator('th.e-week-number')).toBeAttached();
  await expect(popup.locator('td.e-week-number').first()).toHaveText(/^\d+$/);
  await expect(popup.locator('.e-footer-container .e-today')).toHaveCount(0);
  expect(await widgetProps(host, ['calendarMode', 'weekRule', 'firstDayOfWeek'])).toEqual({ calendarMode: 'Gregorian', weekRule: 'FirstFullWeek', firstDayOfWeek: 1 });
});

test('start and depth restrict navigation to the year and month views', async ({ app, page }) => {
  const section = app.section('dp-depth');
  const popup = await openPopup(page, section.locator('.e-date-icon'), '.e-datepicker.e-popup-open');
  await expect(popup.locator('td span', { hasText: /^Aug$/ })).toBeVisible();
  await expect(popup.locator('td span', { hasText: /^15$/ })).toHaveCount(0);
  await popup.locator('td:not(.e-other-year) span', { hasText: /^Aug$/ }).click();
  await expect(section.locator('input.e-datepicker')).toHaveValue('Aug 2024');
  await expect(page.locator('.e-datepicker.e-popup-open')).toHaveCount(0);
});

test('strictMode rejects out-of-range input, loose mode flags it', async ({ app }) => {
  const section = app.section('dp-strict');
  const strictHost = section.getByTestId('dp-strict');
  const strict = strictHost.locator('input');
  await strict.fill('2024-09-09');
  await strict.blur();
  await expect.poll(() => widgetProp(strictHost, 'value')).not.toBe(new Date(2024, 8, 9).toISOString());
  const loose = section.getByTestId('dp-loose').locator('input');
  await loose.fill('2024-09-09');
  await loose.blur();
  await expect(section.getByTestId('dp-loose').locator('.e-input-group')).toHaveClass(/e-error/);
  expect(await widgetProp(strictHost, 'strictMode')).toBe(true);
  expect(await widgetProp(section.getByTestId('dp-loose'), 'strictMode')).toBe(false);
});

test('inputFormats parse alternative typed formats', async ({ app }) => {
  const host = app.section('dp-strict').getByTestId('dp-inputformats');
  const input = host.locator('input');
  await input.fill('09-06-2024');
  await input.blur();
  await expect(input).toHaveValue('2024-06-09');
  expect(await widgetProp(host, 'inputFormats')).toEqual(['dd-MM-yyyy']);
});

test('openOnFocus, allowEdit, zIndex, width, cssClass and htmlAttributes', async ({ app, page }) => {
  const section = app.section('dp-focus');
  const host = section.getByTestId('dp-focus');
  const input = host.locator('input');
  await input.focus();
  await expect(page.locator('.e-datepicker.e-popup-open')).toBeVisible();
  await expect(page.locator('.e-datepicker.e-popup-open')).toHaveCSS('z-index', '3500');
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.demo-dp-focus')).toBeVisible();
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(220, 0);
});

test('multiple selection from values', async ({ app, page }) => {
  const section = app.section('dp-multi');
  const host = section.getByTestId('dp-multi');
  expect(await widgetProp(host, 'isMultiSelection')).toBe(true);
  expect(await widgetProp(host, 'values')).toHaveLength(2);
  const popup = await openPopup(page, section.locator('.e-date-icon'), '.e-datepicker.e-popup-open');
  await expect(popup.locator('td.e-focused-date')).toHaveCount(2);
  // isMultiSelection/values are @private on DatePicker (selecting in the popup throws inside Syncfusion), so only
  // the passed-through state is asserted.
});

test('mask, mask placeholder, key configs and inert flags', async ({ app }) => {
  const host = app.section('dp-mask').getByTestId('dp-mask');
  const props = await widgetProps(host, ['enableMask', 'maskPlaceholder', 'keyConfigs', 'fullScreenMode', 'serverTimezoneOffset', 'locale', 'enableRtl']);
  expect(props).toMatchObject({
    enableMask: true, maskPlaceholder: { day: 'd', month: 'M', year: 'y' }, fullScreenMode: false,
    serverTimezoneOffset: 0, locale: 'en-US', enableRtl: false
  });
  expect(props.keyConfigs).toMatchObject({ escape: 'escape' });
  const input = host.locator('input');
  await input.focus();
  await expect(input).toHaveValue('d/M/y');
});
