import { test, expect } from './fixtures';
import { Page } from '@playwright/test';
import { typeInto } from './helpers';

/** Suggestions re-render while typing, clicking a stale item closes the popup instead of selecting it. */
async function pickSuggestion(page: Page, text: string) {
  const items = page.locator('.e-popup-open li.e-list-item');
  await expect(items).toHaveCount(1);
  await page.waitForTimeout(250);
  await items.filter({ hasText: text }).click();
}

/** Read a property from the Syncfusion widget behind a demo element. */
function widgetProp(page: Page, testId: string, prop: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-auto-complete'].viewModel.widget[p];
  }, [testId, prop]);
}

test.beforeEach(async ({ app }) => app.open('autoComplete'));

test('suggests matches while typing', async ({ app, page }) => {
  await typeInto(app.section('ac-default').locator('input.e-autocomplete'), 'ba');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Badminton', 'Basketball', 'Football']); // default filterType is Contains
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ac-value');
  await typeInto(section.locator('input.e-autocomplete'), 'cr');
  await pickSuggestion(page, 'Cricket');
  await expect(section.getByTestId('ac-value-out')).toHaveText('Cricket');
  await expect(section.getByTestId('ac-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ac-value');
  await section.getByTestId('ac-set').click();
  await expect(section.locator('input.e-autocomplete')).toHaveValue('Hockey');
});

test('enabled binding', async ({ app }) => {
  const section = app.section('ac-value');
  await section.getByTestId('ac-enabled').uncheck();
  await expect(section.locator('input.e-autocomplete')).toBeDisabled();
  await section.getByTestId('ac-enabled').check();
  await expect(section.locator('input.e-autocomplete')).toBeEnabled();
});

test('object data source uses fields', async ({ app, page }) => {
  await typeInto(app.section('ac-fields').locator('input.e-autocomplete'), 'c');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Cricket']);
});

test('suggestionCount limits the list, clear button empties input', async ({ app, page }) => {
  const section = app.section('ac-options');
  const input = section.locator('input.e-autocomplete');
  await typeInto(input, 'o');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(3);
  await section.locator('.e-clear-icon').click();
  await expect(input).toHaveValue('');
});

test('ignoreAccent, ignoreCase and filterType follow the view-model', async ({ app, page }) => {
  const section = app.section('ac-ignore');
  const input = section.locator('input.e-autocomplete');
  expect(await widgetProp(page, 'ac-ignore', 'filterBarPlaceholder')).toBe('Search cafes');
  await typeInto(input, 'CAFE');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Café', 'Cafe latte']);
  await input.fill('');
  await page.locator('main h2').click();
  await section.getByTestId('ac-ignore-toggle').click();
  await expect.poll(() => widgetProp(page, 'ac-ignore', 'ignoreAccent')).toBe(false);
  expect(await widgetProp(page, 'ac-ignore', 'ignoreCase')).toBe(false);
  expect(await widgetProp(page, 'ac-ignore', 'filterType')).toBe('Contains');
  await typeInto(input, 'afe');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveText(['Cafe latte']); // accent now matters
  await input.fill('');
  await input.pressSequentially('AFE');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(0); // and so does case
});

test('bound properties reach the widget and follow view-model changes', async ({ app, page }) => {
  const section = app.section('ac-dyn');
  const wrapper = section.locator('.e-input-group');
  const input = section.locator('input.e-autocomplete');
  await expect(wrapper).toHaveClass(/dyn-one/);
  await expect(wrapper).toHaveCSS('width', '300px');
  await expect(input).toHaveAttribute('placeholder', 'First');
  await expect(section.locator('[data-attr="one"]')).toHaveCount(1);
  await expect(section.locator('.e-input-group-icon')).toHaveCount(0);
  const expectProps = async (p: Record<string, any>) => {
    for (const [k, v] of Object.entries(p)) {
      await expect.poll(() => widgetProp(page, 'ac-dyn', k), { message: k }).toEqual(v);
    }
  };
  await expectProps({
    popupHeight: '300px', popupWidth: '200px', zIndex: 1000, readonly: false, floatLabelType: 'Never', sortOrder: 'None',
    allowFiltering: false, isDeviceFullScreen: false, allowResize: false, debounceDelay: 300, showClearButton: false,
    showPopupButton: false, highlight: false, allowCustom: false, minLength: 1, suggestionCount: 5
  });
  await section.getByTestId('ac-dyn-toggle').click();
  await expect(wrapper).toHaveClass(/dyn-two/);
  await expect(wrapper).not.toHaveClass(/dyn-one/);
  await expect(wrapper).toHaveCSS('width', '250px');
  await expect(section.locator('[data-attr="two"]')).toHaveCount(1);
  await expect(section.locator('.e-input-group-icon')).toHaveCount(1);
  await expectProps({
    popupHeight: '150px', popupWidth: '320px', zIndex: 2000, readonly: true, floatLabelType: 'Always', sortOrder: 'Descending',
    allowFiltering: true, isDeviceFullScreen: true, allowResize: true, debounceDelay: 100, showClearButton: true, placeholder: 'Second',
    showPopupButton: true, highlight: true, allowCustom: true, minLength: 2, suggestionCount: 2
  });
});

test('highlight marks the matching text', async ({ app, page }) => {
  await typeInto(app.section('ac-highlight').locator('input.e-autocomplete'), 'ba');
  const first = page.locator('.e-popup-open li.e-list-item').first();
  await expect(first).toBeVisible();
  await expect(first.locator('.e-highlight')).toHaveText('Ba');
});

test('templates are rendered', async ({ app, page }) => {
  const section = app.section('ac-templates');
  expect(await widgetProp(page, 'ac-templates', 'actionFailureTemplate')).toContain('tpl-fail');
  expect(await widgetProp(page, 'ac-templates', 'valueTemplate')).toContain('tpl-value');
  await typeInto(section.locator('input.e-autocomplete'), 'e');
  const popup = page.locator('.e-popup-open');
  await expect(popup.locator('.tpl-header')).toHaveText('Header');
  await expect(popup.locator('.tpl-footer')).toHaveText('Footer');
  await expect(popup.locator('.tpl-item').first()).toContainText('Item');
  await expect(popup.locator('.tpl-group').first()).toContainText('Group');
});

test('noRecordsTemplate is shown when nothing matches', async ({ app, page }) => {
  await typeInto(app.section('ac-norecords').locator('input.e-autocomplete'), 'zzz');
  await expect(page.locator('.e-popup-open .tpl-none')).toHaveText('Nothing here');
});

test('index and text select an item initially', async ({ app }) => {
  await expect(app.section('ac-index').locator('input.e-autocomplete')).toHaveValue('Basketball');
  await expect(app.section('ac-text').locator('input.e-autocomplete')).toHaveValue('Cricket');
});

test('allowObjectBinding makes the value the data object', async ({ app, page }) => {
  const section = app.section('ac-object');
  await typeInto(section.locator('input.e-autocomplete'), 'tenn');
  await pickSuggestion(page, 'Tennis');
  await expect(section.getByTestId('ac-object-out')).toHaveText('Tennis');
  expect(await widgetProp(page, 'ac-object', 'allowObjectBinding')).toBe(true);
  expect(await widgetProp(page, 'ac-object', 'value')).toEqual(expect.objectContaining({ text: 'Tennis' }));
});

test('query limits the items', async ({ app, page }) => {
  await typeInto(app.section('ac-query').locator('input.e-autocomplete'), 'a');
  await expect(page.locator('.e-popup-open li.e-list-item')).toHaveCount(2);
});

test('enableVirtualization renders only part of a large list', async ({ app, page }) => {
  expect(await widgetProp(page, 'ac-virtual', 'enableVirtualization')).toBe(true);
  await typeInto(app.section('ac-virtual').locator('input.e-autocomplete'), 'Item');
  const items = page.locator('.e-popup-open li.e-list-item');
  await expect(items.first()).toBeVisible();
  expect(await items.count()).toBeLessThan(500);
});

test('autofill completes the typed text', async ({ app }) => {
  const input = app.section('ac-autofill').locator('input.e-autocomplete');
  await typeInto(input, 'Bad');
  await expect(input).toHaveValue('Badminton');
});

test('events fire in response to user interaction', async ({ app, page }) => {
  const section = app.section('ac-events');
  const log = section.getByTestId('ac-events-out');
  const seen = async () => ((await log.textContent()) || '').split(',');
  const input = section.locator('input.e-autocomplete');
  await typeInto(input, 'b');
  await expect.poll(seen).toEqual(expect.arrayContaining(['focus', 'filtering', 'actionBegin', 'actionComplete', 'dataBound', 'beforeOpen', 'open']));
  await page.waitForTimeout(250);
  await page.locator('.e-popup-open li', { hasText: 'Badminton' }).click();
  await expect.poll(seen).toEqual(expect.arrayContaining(['select', 'change', 'close']));
  await input.fill('Curling');
  await page.locator('main h2').click();
  await expect.poll(seen).toContain('blur');
  await expect.poll(seen).toContain('customValueSpecifier');
});

test('resize events fire when the popup is resized', async ({ app, page }) => {
  const section = app.section('ac-events');
  await typeInto(section.locator('input.e-autocomplete'), 'b');
  const handle = page.locator('.e-popup-open .e-resizer-right');
  await expect(handle).toBeVisible();
  await page.waitForTimeout(250);
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 40, box.y + 20, { steps: 5 });
  await page.mouse.up();
  const log = section.getByTestId('ac-events-out');
  await expect(log).toContainText('resizeStart');
  await expect(log).toContainText('resizing');
  await expect(log).toContainText('resizeStop');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('ac-lifecycle');
  await expect(section.getByTestId('ac-created')).toHaveText('1');
  await section.getByTestId('ac-lifecycle-toggle').click();
  await expect(section.getByTestId('ac-destroyed')).toHaveText('1');
  await section.getByTestId('ac-lifecycle-toggle').click();
  await expect(section.getByTestId('ac-created')).toHaveText('2');
});

test('actionFailure fires when the remote data source fails', async ({ app, page }) => {
  await page.route('**/api/ac-fail*', route => route.fulfill({ status: 500, body: 'nope' }));
  await app.open('autoComplete');
  await typeInto(app.section('ac-fail').locator('input.e-autocomplete'), 'a'); // the remote request is made while typing
  await expect(app.section('ac-fail').getByTestId('ac-fail-count')).not.toHaveText('0');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
});
