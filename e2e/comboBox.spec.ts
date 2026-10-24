import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { openPopup, typeInto } from './helpers';

/** Read a property from the Syncfusion widget behind a demo element. */
function widgetProp(page: Page, testId: string, prop: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-combo-box'].viewModel.widget[p];
  }, [testId, prop]);
}

const iconOf = (section: Locator) => section.locator('.e-input-group-icon');

test.beforeEach(async ({ app }) => app.open('combobox'));

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('cb-value');
  await expect(section.locator('input.e-combobox')).toHaveValue('Badminton');
  const popup = await openPopup(page, iconOf(section));
  await popup.locator('li', { hasText: 'Cricket' }).click();
  await expect(section.getByTestId('cb-value-out')).toHaveText('Game4');
  await expect(section.getByTestId('cb-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('cb-value');
  await section.getByTestId('cb-set').click();
  await expect(section.locator('input.e-combobox')).toHaveValue('Football');
});

test('enabled binding', async ({ app }) => {
  const section = app.section('cb-value');
  await section.getByTestId('cb-enabled').uncheck();
  await expect(section.locator('.e-combobox').first()).toBeDisabled();
});

test('allowCustom keeps typed text', async ({ app }) => {
  const section = app.section('cb-custom');
  const input = section.locator('input.e-combobox');
  await typeInto(input, 'Curling');
  await input.blur();
  await expect(input).toHaveValue('Curling');
});

test('filtering narrows the list', async ({ app, page }) => {
  await typeInto(app.section('cb-filter').locator('input.e-combobox'), 'ba');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Badminton', 'Basketball']);
});

test('sortOrder descending and showClearButton', async ({ app, page }) => {
  const section = app.section('cb-sorted');
  expect(await widgetProp(page, 'cb-sorted', 'showClearButton')).toBe(true);
  const popup = await openPopup(page, iconOf(section));
  await expect(popup.locator('li.e-list-item').first()).toHaveText('Football');
  await popup.locator('li', { hasText: 'Cricket' }).click();
  await section.locator('input.e-combobox').click();
  await section.locator('.e-clear-icon').click();
  await expect(section.locator('input.e-combobox')).toHaveValue('');
});

test('ignoreAccent, ignoreCase and filterType follow the view-model', async ({ app, page }) => {
  const section = app.section('cb-ignore');
  const input = section.locator('input.e-combobox');
  expect(await widgetProp(page, 'cb-ignore', 'filterBarPlaceholder')).toBe('Search cafes');
  await typeInto(input, 'CAFE');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Café', 'Cafe latte']);
  await input.fill('');
  // clearing the filter reopens the popup with the full list and it covers the toggle button, so skip the hit test
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(3);
  await section.getByTestId('cb-ignore-toggle').dispatchEvent('click');
  await expect.poll(() => widgetProp(page, 'cb-ignore', 'ignoreAccent')).toBe(false);
  expect(await widgetProp(page, 'cb-ignore', 'ignoreCase')).toBe(false);
  expect(await widgetProp(page, 'cb-ignore', 'filterType')).toBe('Contains');
  await input.focus();
  await input.pressSequentially('afe');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Cafe latte']); // accent now matters
  await input.fill('');
  await input.pressSequentially('AFE');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(0); // and so does case
});

test('bound properties reach the widget and follow view-model changes', async ({ app, page }) => {
  const section = app.section('cb-dyn');
  const wrapper = section.locator('.e-input-group');
  const input = section.locator('input.e-combobox');
  await expect(wrapper).toHaveClass(/dyn-one/);
  await expect(wrapper).toHaveCSS('width', '300px');
  await expect(input).toHaveAttribute('placeholder', 'First');
  await expect(section.locator('[data-attr="one"]')).toHaveCount(1);
  const expectProps = async (p: Record<string, any>) => {
    for (const [k, v] of Object.entries(p)) {
      await expect.poll(() => widgetProp(page, 'cb-dyn', k), { message: k }).toEqual(v);
    }
  };
  await expectProps({
    popupHeight: '300px', popupWidth: '200px', zIndex: 1000, readonly: false, floatLabelType: 'Never', sortOrder: 'None',
    allowFiltering: false, isDeviceFullScreen: false, allowResize: false, debounceDelay: 300, showClearButton: false
  });
  await section.getByTestId('cb-dyn-toggle').click();
  await expect(wrapper).toHaveClass(/dyn-two/);
  await expect(wrapper).not.toHaveClass(/dyn-one/);
  await expect(wrapper).toHaveCSS('width', '250px');
  await expect(section.locator('[data-attr="two"]')).toHaveCount(1);
  await expectProps({
    popupHeight: '150px', popupWidth: '320px', zIndex: 2000, readonly: true, floatLabelType: 'Always', sortOrder: 'Descending',
    allowFiltering: true, isDeviceFullScreen: true, allowResize: true, debounceDelay: 100, showClearButton: true, placeholder: 'Second'
  });
});

test('templates are rendered', async ({ app, page }) => {
  const section = app.section('cb-templates');
  expect(await widgetProp(page, 'cb-templates', 'actionFailureTemplate')).toContain('tpl-fail');
  await expect(section.locator('.tpl-value')).toHaveText('Chosen Cricket');
  const popup = await openPopup(page, iconOf(section));
  await expect(popup.locator('.tpl-header')).toHaveText('Header');
  await expect(popup.locator('.tpl-footer')).toHaveText('Footer');
  await expect(popup.locator('.tpl-item')).toHaveText(['Item Cricket', 'Item Baseball', 'Item Tennis']);
  await expect(popup.locator('.tpl-group').first()).toHaveText('Group Bat');
});

test('noRecordsTemplate is shown when nothing matches', async ({ app, page }) => {
  await typeInto(app.section('cb-norecords').locator('input.e-combobox'), 'zzz');
  await expect(page.locator('.e-popup-open .tpl-none')).toHaveText('Nothing here');
});

test('index and text select an item initially', async ({ app }) => {
  await expect(app.section('cb-index').locator('input.e-combobox')).toHaveValue('Basketball');
  await expect(app.section('cb-text').locator('input.e-combobox')).toHaveValue('Cricket');
});

test('allowObjectBinding makes the value the data object', async ({ app, page }) => {
  const section = app.section('cb-object');
  const popup = await openPopup(page, iconOf(section));
  await popup.locator('li', { hasText: 'Tennis' }).click();
  await expect(section.getByTestId('cb-object-out')).toHaveText('Tennis');
  expect(await widgetProp(page, 'cb-object', 'allowObjectBinding')).toBe(true);
  expect(await page.evaluate(() => typeof (document.querySelector('[data-testid="cb-object"]') as any)
    .au['ej2-combo-box'].viewModel.widget.value)).toBe('object');
});

test('query limits the items', async ({ app, page }) => {
  const popup = await openPopup(page, iconOf(app.section('cb-query')));
  await expect(popup.locator('li.e-list-item')).toHaveCount(2);
});

test('enableVirtualization renders only part of a large list', async ({ app, page }) => {
  expect(await widgetProp(page, 'cb-virtual', 'enableVirtualization')).toBe(true);
  const popup = await openPopup(page, iconOf(app.section('cb-virtual')));
  const rendered = await popup.locator('li.e-list-item').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(500);
});

test('autofill completes the typed text', async ({ app }) => {
  const input = app.section('cb-autofill').locator('input.e-combobox');
  await typeInto(input, 'Bad');
  await expect(input).toHaveValue('Badminton');
});

test('events fire in response to user interaction', async ({ app, page }) => {
  const section = app.section('cb-events');
  const log = section.getByTestId('cb-events-out');
  const seen = async () => ((await log.textContent()) || '').split(',');
  const popup = await openPopup(page, iconOf(section));
  await expect.poll(seen).toEqual(expect.arrayContaining(['actionBegin', 'actionComplete', 'dataBound', 'beforeOpen', 'open']));
  await popup.locator('li', { hasText: 'Badminton' }).click();
  await expect.poll(seen).toEqual(expect.arrayContaining(['select', 'change', 'close']));
  const input = section.locator('input.e-combobox');
  await input.click();
  await input.pressSequentially('b');
  await expect.poll(seen).toContain('filtering');
  await expect.poll(seen).toContain('focus');
  await input.fill('Curling');
  await page.locator('main h2').click();
  await expect.poll(seen).toContain('blur');
  await expect.poll(seen).toContain('customValueSpecifier');
});

test('resize events fire when the popup is resized', async ({ app, page }) => {
  const section = app.section('cb-events');
  const popup = await openPopup(page, iconOf(section));
  const handle = popup.locator('.e-resizer-right');
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 40, box.y + 20, { steps: 5 });
  await page.mouse.up();
  const log = section.getByTestId('cb-events-out');
  await expect(log).toContainText('resizeStart');
  await expect(log).toContainText('resizing');
  await expect(log).toContainText('resizeStop');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('cb-lifecycle');
  await expect(section.getByTestId('cb-created')).toHaveText('1');
  await section.getByTestId('cb-lifecycle-toggle').click();
  await expect(section.getByTestId('cb-destroyed')).toHaveText('1');
  await section.getByTestId('cb-lifecycle-toggle').click();
  await expect(section.getByTestId('cb-created')).toHaveText('2');
});

test('actionFailure fires when the remote data source fails', async ({ app, page }) => {
  await page.route('**/api/cb-fail*', route => route.fulfill({ status: 500, body: 'nope' }));
  await app.open('combobox');
  await iconOf(app.section('cb-fail')).click(); // the remote request is made when the popup opens
  await expect(app.section('cb-fail').getByTestId('cb-fail-count')).not.toHaveText('0');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
});
