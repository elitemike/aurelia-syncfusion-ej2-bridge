import { test, expect } from './fixtures';
import { openPopup } from './helpers';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('timePicker'));

const POPUP = '.e-timepicker.e-popup-open';

test('initial value is formatted', async ({ app }) => {
  await expect(app.section('tp-value').locator('input.e-timepicker')).toHaveValue('09:30');
});

test('two-way value: popup selection to model', async ({ app, page }) => {
  const section = app.section('tp-value');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await popup.locator('li', { hasText: '10:30' }).click();
  await expect(section.getByTestId('tp-value-out')).toHaveText('10:30');
  await expect(section.getByTestId('tp-change-count')).toHaveText('1');
});

test('model to view', async ({ app }) => {
  const section = app.section('tp-value');
  await section.getByTestId('tp-set').click();
  await expect(section.locator('input.e-timepicker')).toHaveValue('11:00');
});

test('typed value updates the model', async ({ app }) => {
  const section = app.section('tp-value');
  const input = section.locator('input.e-timepicker');
  await input.fill('14:45');
  await input.blur();
  await expect(section.getByTestId('tp-value-out')).toHaveText('14:45');
});

test('step controls the list', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('tp-value').locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('li.e-list-item').nth(1)).toHaveText('00:30');
});

test('min and max limit the list and follow the view-model', async ({ app, page }) => {
  const section = app.section('tp-limits');
  const host = section.getByTestId('tp-limits');
  expect(await widgetProps(host, ['min', 'max'])).toEqual({
    min: new Date(2024, 4, 15, 8, 0).toISOString(), max: new Date(2024, 4, 15, 12, 0).toISOString()
  });
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('li.e-list-item')).toHaveText(['08:00', '09:00', '10:00', '11:00', '12:00']);
  await page.keyboard.press('Escape');
  await section.getByTestId('tp-limits-set').click();
  await expect.poll(() => widgetProps(host, ['min', 'max'])).toEqual({
    min: new Date(2024, 4, 15, 7, 0).toISOString(), max: new Date(2024, 4, 15, 13, 0).toISOString()
  });
  const popup2 = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(popup2.locator('li.e-list-item')).toHaveText(['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00']);
});

test('placeholder, clear button and readonly', async ({ app }) => {
  const section = app.section('tp-options');
  await expect(section.locator('input.e-timepicker').first()).toHaveAttribute('placeholder', 'Pick a time');
  await expect(section.getByTestId('tp-readonly').locator('input')).toHaveAttribute('readonly', '');
  expect(await widgetProp(section.getByTestId('tp-options'), 'showClearButton')).toBe(true);
});

test('events: created, focus, open, change, close, blur, cleared', async ({ app, page }) => {
  const section = app.section('tp-events');
  const log = section.getByTestId('tp-log');
  await expect(log).toContainText('created');
  const input = section.locator('input.e-timepicker');
  await input.focus();
  await expect(log).toContainText('focus');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(log).toContainText('open');
  await popup.locator('li', { hasText: '10:00' }).click();
  await expect(log).toContainText('change');
  await expect(log).toContainText('close');
  await expect(section.getByTestId('tp-last-change')).toHaveText('10:0');
  await expect(input).toHaveValue('10:00');
  await section.locator('h3, .demo-output').first().click();
  await expect(log).toContainText('blur');
  await input.focus();
  await section.locator('.e-clear-icon').dispatchEvent('mousedown');
  await expect(log).toContainText('cleared');
  await expect(section.getByTestId('tp-last-change')).toHaveText('null');
});

test('itemRender handler decorates list entries', async ({ app, page }) => {
  const section = app.section('tp-render');
  const popup = await openPopup(page, section.locator('.e-input-group-icon'), POPUP);
  await expect(popup.locator('li.demo-mark')).toHaveCount(1);
  await expect(popup.locator('li.demo-mark')).toHaveText('10:00');
  await expect(section.getByTestId('tp-render-count')).not.toHaveText('0');
});

test('destroyed event fires when the element is removed', async ({ app }) => {
  const section = app.section('tp-destroy');
  await expect(section.getByTestId('tp-destroyed')).toHaveText('0');
  await section.getByTestId('tp-destroy-btn').click();
  await expect(section.getByTestId('tp-destroyed')).toHaveText('1');
});

const dynamicProps = ['enabled', 'strictMode', 'placeholder', 'floatLabelType', 'format', 'step', 'width', 'zIndex',
  'openOnFocus', 'showClearButton', 'fullScreenMode', 'enableMask'];
const editProps = ['readonly', 'allowEdit', 'serverTimezoneOffset', 'min', 'max'];

test('model to widget: every bound property follows the view-model', async ({ app }) => {
  test.setTimeout(60_000);
  const section = app.section('tp-dynamic');
  const host = section.getByTestId('tp-dynamic');
  const edit = section.getByTestId('tp-dynamic-edit');
  const a = await widgetProps(host, dynamicProps);
  expect(a).toMatchObject({
    enabled: true, strictMode: false, placeholder: 'Alpha', floatLabelType: 'Never', format: 'hh:mm a', step: 30,
    width: 200, zIndex: 1500, openOnFocus: false, showClearButton: false, fullScreenMode: false, enableMask: false
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-a');
  expect(await widgetProp(host, 'scrollTo')).toBeNull();
  const editA = await widgetProps(edit, editProps);
  expect(editA).toEqual({
    readonly: false, allowEdit: true, serverTimezoneOffset: 0,
    min: new Date(2024, 4, 15, 0, 0).toISOString(), max: new Date(2024, 4, 15, 23, 59).toISOString()
  });
  await expect(host.locator('input.e-timepicker')).toHaveValue('09:30 AM');
  await expect(host.locator('input.e-timepicker')).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.cls-a')).toBeVisible();

  await section.getByTestId('tp-toggle').click();
  await expect.poll(() => widgetProps(host, dynamicProps), { timeout: 20_000 }).toMatchObject({
    enabled: false, strictMode: true, placeholder: 'Beta', floatLabelType: 'Always', format: 'HH:mm', step: 15,
    width: 240, zIndex: 2000, openOnFocus: true, showClearButton: true, fullScreenMode: true, enableMask: true
  });
  expect(await widgetProp(host, 'cssClass')).toContain('cls-b');
  expect(await widgetProp(host, 'scrollTo')).toBe(new Date(2024, 4, 15, 16, 0).toISOString());
  await expect.poll(() => widgetProps(edit, editProps), { timeout: 20_000 }).toEqual({
    readonly: true, allowEdit: false, serverTimezoneOffset: 2,
    min: new Date(2024, 4, 15, 8, 0).toISOString(), max: new Date(2024, 4, 15, 12, 0).toISOString()
  });
  await expect(host.locator('input.e-timepicker')).toHaveAttribute('data-flavor', 'b');
  await expect(host.locator('.e-input-group.cls-b')).toBeVisible();
  await expect(host.locator('.e-input-group.cls-a')).toHaveCount(0);
  await expect(host.locator('input.e-timepicker')).toBeDisabled();
  await expect(host.locator('.e-float-text')).toHaveText('Beta');
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(240, 0);

});

test('strictMode rejects out-of-range input, loose mode flags it', async ({ app }) => {
  const section = app.section('tp-strict');
  const strictHost = section.getByTestId('tp-strict');
  const strict = strictHost.locator('input.e-timepicker');
  await strict.fill('18:00');
  await strict.blur();
  // strict mode clamps an out-of-range time to the max (12:00)
  await expect.poll(async () => new Date(await widgetProp(strictHost, 'value')).getHours()).toBe(12);
  const loose = section.getByTestId('tp-loose').locator('input.e-timepicker');
  await loose.fill('18:00');
  await loose.blur();
  await expect(section.getByTestId('tp-loose').locator('.e-input-group')).toHaveClass(/e-error/);
  expect(await widgetProp(strictHost, 'strictMode')).toBe(true);
  expect(await widgetProp(section.getByTestId('tp-loose'), 'strictMode')).toBe(false);
});

test('openOnFocus, allowEdit, zIndex, width, cssClass, htmlAttributes and scrollTo', async ({ app, page }) => {
  const host = app.section('tp-focus').getByTestId('tp-focus');
  const input = host.locator('input.e-timepicker');
  await input.focus();
  const popup = page.locator(POPUP);
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('z-index', '3500');
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('data-flavor', 'a');
  await expect(host.locator('.e-input-group.demo-tp-focus')).toBeVisible();
  await expect.poll(async () => (await host.locator('.e-input-group').boundingBox()).width).toBeCloseTo(220, 0);
  const target = popup.locator('li.e-list-item', { hasText: /^16:00$/ });
  await expect.poll(async () => {
    const [p, t] = [await popup.boundingBox(), await target.boundingBox()];
    return !!p && !!t && t.y >= p.y && t.y + t.height <= p.y + p.height;
  }).toBe(true);
  expect(await widgetProp(host, 'scrollTo')).toBe(new Date(2024, 4, 15, 16, 0).toISOString());
});

test('mask, mask placeholder, key configs and inert flags', async ({ app }) => {
  const host = app.section('tp-mask').getByTestId('tp-mask');
  const props = await widgetProps(host, ['enableMask', 'maskPlaceholder', 'keyConfigs', 'fullScreenMode', 'serverTimezoneOffset', 'locale', 'enableRtl']);
  expect(props).toMatchObject({
    enableMask: true, maskPlaceholder: { hour: 'h', minute: 'm' }, fullScreenMode: false,
    serverTimezoneOffset: 0, locale: 'en-US', enableRtl: false
  });
  expect(props.keyConfigs).toMatchObject({ escape: 'escape' });
  const input = host.locator('input.e-timepicker');
  await input.focus();
  await expect(input).toHaveValue('h:m');
});
