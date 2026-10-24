import { test, expect } from './fixtures';
import { openPopup } from './helpers';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('dateTimePicker'));

const DATE_POPUP = '.e-popup-open:has(.e-calendar)';
const TIME_POPUP = '.e-datetimepicker.e-popup-open';

test('initial value is formatted', async ({ app }) => {
  await expect(app.section('dtp-value').locator('input.e-datetimepicker')).toHaveValue('2024-05-15 09:30');
});

test('model to view', async ({ app }) => {
  const section = app.section('dtp-value');
  await section.getByTestId('dtp-set').click();
  await expect(section.locator('input.e-datetimepicker')).toHaveValue('2024-05-20 14:00');
});

test('typed value updates the model', async ({ app }) => {
  const section = app.section('dtp-value');
  const input = section.locator('input.e-datetimepicker');
  await input.fill('2024-06-02 08:15');
  await input.blur();
  await expect(section.getByTestId('dtp-value-out')).toHaveText('2024-06-02 08:15');
  await expect(section.getByTestId('dtp-change-count')).toHaveText('1');
});

test('date popup then time list', async ({ app, page }) => {
  const section = app.section('dtp-value');
  const popup = await openPopup(page, section.locator('.e-input-group-icon.e-date-icon'), DATE_POPUP);
  await popup.locator('td:not(.e-other-month) span').getByText('10', { exact: true }).click();
  await expect(section.getByTestId('dtp-value-out')).toContainText('2024-05-10');
});

test('time step shows a sparse list', async ({ app, page }) => {
  const section = app.section('dtp-step');
  await section.locator('.e-input-group-icon.e-time-icon').click();
  const list = page.locator(`${TIME_POPUP} li.e-list-item`);
  await expect(list.first()).toBeVisible();
  await expect(list).toHaveCount(12);
  expect(await widgetProp(section.getByTestId('dtp-step'), 'step')).toBe(120);
});

test('placeholder, floating label, clear button and readonly', async ({ app }) => {
  const section = app.section('dtp-options');
  await expect(section.locator('.e-float-text').first()).toHaveText('Pick date and time');
  await expect(section.getByTestId('dtp-readonly').locator('input')).toHaveAttribute('readonly', '');
  expect(await widgetProps(section.getByTestId('dtp-options'), ['floatLabelType', 'showClearButton'])).toEqual({ floatLabelType: 'Auto', showClearButton: true });
});

test('timeFormat, minTime and maxTime shape the time list', async ({ app, page }) => {
  const section = app.section('dtp-time');
  await section.locator('.e-input-group-icon.e-time-icon').click();
  await expect(page.locator(`${TIME_POPUP} li.e-list-item`)).toHaveText(['08:00', '09:00', '10:00', '11:00', '12:00']);
  expect(await widgetProps(section.getByTestId('dtp-time'), ['timeFormat', 'minTime', 'maxTime'])).toEqual({
    timeFormat: 'HH:mm', minTime: new Date(2024, 4, 15, 8, 0).toISOString(), maxTime: new Date(2024, 4, 15, 12, 0).toISOString()
  });
});

test('scrollTo scrolls the time list to the given time', async ({ app, page }) => {
  const section = app.section('dtp-scroll');
  await section.locator('.e-input-group-icon.e-time-icon').click();
  const popup = page.locator(TIME_POPUP);
  await expect(popup.locator('li.e-list-item').first()).toBeVisible();
  const target = popup.locator('li.e-list-item', { hasText: /^16:00$/ });
  await expect.poll(async () => {
    const [p, t] = [await popup.boundingBox(), await target.boundingBox()];
    return !!p && !!t && t.y >= p.y && t.y + t.height <= p.y + p.height;
  }).toBe(true);
  expect(await widgetProp(section.getByTestId('dtp-scroll'), 'scrollTo')).toBe(new Date(2024, 4, 15, 16, 0).toISOString());
});

test('events: created, focus, open, navigated, change, close, blur, cleared', async ({ app, page }) => {
  const section = app.section('dtp-events');
  const log = section.getByTestId('dtp-log');
  await expect(log).toContainText('created');
  const input = section.locator('input.e-datetimepicker');
  await input.focus();
  await expect(log).toContainText('focus');
  const popup = await openPopup(page, section.locator('.e-date-icon'), DATE_POPUP);
  await expect(log).toContainText('open');
  await popup.locator('.e-header .e-next').click();
  await expect(log).toContainText('navigated');
  await popup.locator('td:not(.e-other-month) span', { hasText: /^12$/ }).click();
  await expect(log).toContainText('change');
  await expect(log).toContainText('close');
  await expect(section.getByTestId('dtp-last-change')).toHaveText(/^\d{4}-\d+-12 \d+:\d+$/);
  await expect(input).toHaveValue(/-12 /);
  await section.locator('h3, .demo-output').first().click();
  await expect(log).toContainText('blur');
  await input.focus();
  await section.locator('.e-clear-icon').dispatchEvent('mousedown');
  await expect(log).toContainText('cleared');
  await expect(section.getByTestId('dtp-last-change')).toHaveText('null');
});

test('renderDayCell handler decorates cells', async ({ app, page }) => {
  const section = app.section('dtp-render');
  const popup = await openPopup(page, section.locator('.e-date-icon'), DATE_POPUP);
  await expect(popup.locator('td.demo-mark')).toHaveCount(1);
  await expect(popup.locator('td.demo-mark')).toHaveText('15');
  await expect(section.getByTestId('dtp-render-count')).not.toHaveText('0');
});

test('destroyed event fires when the element is removed', async ({ app }) => {
  const section = app.section('dtp-destroy');
  await expect(section.getByTestId('dtp-destroyed')).toHaveText('0');
  await section.getByTestId('dtp-destroy-btn').click();
  await expect(section.getByTestId('dtp-destroyed')).toHaveText('1');
});

const dynamicProps = ['enabled', 'strictMode', 'placeholder', 'floatLabelType', 'format', 'timeFormat', 'step',
  'width', 'zIndex', 'openOnFocus', 'showClearButton', 'showTodayButton', 'weekNumber', 'firstDayOfWeek', 'dayHeaderFormat',
  'weekRule', 'depth', 'start', 'fullScreenMode', 'enableMask'];

const timeProps = ['scrollTo', 'minTime', 'maxTime'];
const editProps = ['readonly', 'allowEdit', 'serverTimezoneOffset', 'min', 'max'];

test('bound properties start with the view-model values', async ({ app }) => {
  const section = app.section('dtp-dynamic');
  const host = section.getByTestId('dtp-dynamic');
  expect(await widgetProps(host, dynamicProps)).toMatchObject({
    enabled: true, strictMode: false, placeholder: 'Alpha', floatLabelType: 'Never', format: 'yyyy-MM-dd HH:mm',
    timeFormat: 'hh:mm a', step: 30, width: 280, zIndex: 1500, openOnFocus: false, showClearButton: false,
    showTodayButton: true, weekNumber: false, firstDayOfWeek: 0, dayHeaderFormat: 'Short', weekRule: 'FirstDay',
    depth: 'Month', start: 'Month', fullScreenMode: false, enableMask: false
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-a');
  expect(await widgetProps(host, timeProps)).toEqual({
    scrollTo: null, minTime: new Date(2024, 4, 15, 0, 0).toISOString(), maxTime: new Date(2024, 4, 15, 23, 59).toISOString()
  });
  expect(await widgetProps(section.getByTestId('dtp-dynamic-edit'), editProps)).toEqual({
    readonly: false, allowEdit: true, serverTimezoneOffset: 0, min: new Date(1900, 0, 1).toISOString(), max: new Date(2099, 11, 31).toISOString()
  });
  await expect(host.locator('input.e-datetimepicker')).toHaveValue('2024-05-15 09:30');
  await expect(host.locator('input.e-datetimepicker')).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.cls-a')).toBeVisible();
});

test('model to widget: every bound property follows the view-model', async ({ app }) => {
  test.setTimeout(60_000);
  const section = app.section('dtp-dynamic');
  const host = section.getByTestId('dtp-dynamic');
  await section.getByTestId('dtp-toggle').click();
  await expect.poll(() => widgetProps(host, dynamicProps), { timeout: 20_000 }).toMatchObject({
    enabled: false, strictMode: true, placeholder: 'Beta', floatLabelType: 'Always', format: 'dd/MM/yyyy HH:mm',
    timeFormat: 'HH:mm', step: 15, width: 320, zIndex: 2000, openOnFocus: true, showClearButton: true,
    showTodayButton: false, weekNumber: true, firstDayOfWeek: 1, dayHeaderFormat: 'Narrow', weekRule: 'FirstFullWeek',
    depth: 'Year', start: 'Year', fullScreenMode: true, enableMask: true
  });
  await expect.poll(() => widgetProps(host, timeProps), { timeout: 20_000 }).toEqual({
    scrollTo: new Date(2024, 4, 15, 16, 0).toISOString(), minTime: new Date(2024, 4, 15, 8, 0).toISOString(),
    maxTime: new Date(2024, 4, 15, 12, 0).toISOString()
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-b');
  await expect.poll(() => widgetProps(section.getByTestId('dtp-dynamic-edit'), editProps), { timeout: 20_000 }).toEqual({
    readonly: true, allowEdit: false, serverTimezoneOffset: 2, min: new Date(2024, 4, 1).toISOString(), max: new Date(2024, 4, 31).toISOString()
  });
  await expect(host.locator('input.e-datetimepicker')).toHaveAttribute('data-flavor', 'b');
  await expect(host.locator('.e-input-group.cls-b')).toBeVisible();
  await expect(host.locator('.e-input-group.cls-a')).toHaveCount(0);
  await expect(host.locator('input.e-datetimepicker')).toBeDisabled();
  await expect(host.locator('.e-float-text')).toHaveText('Beta');
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(320, 0);
});

test('calendar layout: header format, week numbers, no today button', async ({ app, page }) => {
  const host = app.section('dtp-calendar').getByTestId('dtp-calendar');
  const popup = await openPopup(page, app.section('dtp-calendar').locator('.e-date-icon'), DATE_POPUP);
  await expect(popup.locator('th').filter({ hasText: /^[A-Z]$/ }).first()).toHaveText('M');
  await expect(popup.locator('th.e-week-number')).toBeAttached();
  await expect(popup.locator('td.e-week-number').first()).toHaveText(/^\d+$/);
  await expect(popup.locator('.e-footer-container .e-today')).toHaveCount(0);
  expect(await widgetProps(host, ['calendarMode', 'weekRule', 'firstDayOfWeek'])).toEqual({ calendarMode: 'Gregorian', weekRule: 'FirstFullWeek', firstDayOfWeek: 1 });
});

test('start and depth restrict navigation to the year and month views', async ({ app, page }) => {
  const section = app.section('dtp-depth');
  const popup = await openPopup(page, section.locator('.e-date-icon'), DATE_POPUP);
  await expect(popup.locator('td span', { hasText: /^Aug$/ })).toBeVisible();
  await expect(popup.locator('td span', { hasText: /^15$/ })).toHaveCount(0);
  await popup.locator('td:not(.e-other-year) span', { hasText: /^Aug$/ }).click();
  await expect(section.locator('input.e-datetimepicker')).toHaveValue('Aug 2024');
});

test('strictMode rejects out-of-range input, loose mode flags it', async ({ app }) => {
  const section = app.section('dtp-strict');
  const strictHost = section.getByTestId('dtp-strict');
  const strict = strictHost.locator('input.e-datetimepicker');
  await strict.fill('2024-09-09 10:00');
  await strict.blur();
  await expect.poll(() => widgetProp(strictHost, 'value')).not.toBe(new Date(2024, 8, 9, 10, 0).toISOString());
  const loose = section.getByTestId('dtp-loose').locator('input.e-datetimepicker');
  await loose.fill('2024-09-09 10:00');
  await loose.blur();
  await expect(section.getByTestId('dtp-loose').locator('.e-input-group')).toHaveClass(/e-error/);
  expect(await widgetProp(strictHost, 'strictMode')).toBe(true);
  expect(await widgetProp(section.getByTestId('dtp-loose'), 'strictMode')).toBe(false);
});

test('inputFormats parse alternative typed formats', async ({ app }) => {
  const host = app.section('dtp-strict').getByTestId('dtp-inputformats');
  const input = host.locator('input.e-datetimepicker');
  await input.fill('09-06-2024 10:15');
  await input.blur();
  await expect(input).toHaveValue('2024-06-09 10:15');
  expect(await widgetProp(host, 'inputFormats')).toEqual(['dd-MM-yyyy HH:mm']);
});

test('openOnFocus, allowEdit, zIndex, width, cssClass and htmlAttributes', async ({ app, page }) => {
  const host = app.section('dtp-focus').getByTestId('dtp-focus');
  const input = host.locator('input.e-datetimepicker');
  await input.focus();
  await expect(page.locator(DATE_POPUP)).toBeVisible();
  await expect(page.locator(DATE_POPUP)).toHaveCSS('z-index', '3500');
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.demo-dtp-focus')).toBeVisible();
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(260, 0);
});

test('multiple selection values are passed to the widget', async ({ app }) => {
  // isMultiSelection/values are @private on DateTimePicker, so only the passed-through state is asserted.
  const host = app.section('dtp-multi').getByTestId('dtp-multi');
  expect(await widgetProp(host, 'isMultiSelection')).toBe(true);
  expect(await widgetProp(host, 'values')).toEqual([new Date(2024, 4, 2).toISOString(), new Date(2024, 4, 4).toISOString()]);
});

test('mask, mask placeholder, key configs and inert flags', async ({ app }) => {
  const host = app.section('dtp-mask').getByTestId('dtp-mask');
  const props = await widgetProps(host, ['enableMask', 'maskPlaceholder', 'keyConfigs', 'fullScreenMode', 'serverTimezoneOffset', 'locale', 'enableRtl']);
  expect(props).toMatchObject({
    enableMask: true, maskPlaceholder: { day: 'd', month: 'M', year: 'y', hour: 'h', minute: 'm' }, fullScreenMode: false,
    serverTimezoneOffset: 0, locale: 'en-US', enableRtl: false
  });
  expect(props.keyConfigs).toMatchObject({ escape: 'escape' });
  const input = host.locator('input.e-datetimepicker');
  await input.focus();
  await expect(input).toHaveValue(/^d\/M\/y/);
});
