import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

/** Open the popup and wait until it has finished animating in, clicking mid-animation races the popup's own blur handling. */
async function openPopup(page: Page, section: Locator) {
  await section.locator('.e-ddl').click();
  const popup = page.locator('.e-ddl.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup.locator('li.e-list-item').first()).toBeVisible();
  await page.waitForTimeout(250);
  return popup;
}

/** Read a property from the Syncfusion widget behind a demo element. */
function widgetProp(page: Page, testId: string, prop: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-drop-down-list'].viewModel.widget[p];
  }, [testId, prop]);
}

test.beforeEach(async ({ app }) => app.open('dropDownList'));

test('model binding renders placeholder and data', async ({ app, page }) => {
  const section = app.section('ddl-model');
  await expect(section.locator('input.e-dropdownlist')).toHaveAttribute('placeholder', 'Select a sport');
  const popup = await openPopup(page, section);
  await expect(popup.locator('li.e-list-item')).toHaveCount(6);
});

test('two-way value: view to model', async ({ app, page }) => {
  const section = app.section('ddl-value');
  await expect(section.getByTestId('ddl-value-out')).toHaveText('Game3');
  const popup = await openPopup(page, section);
  await popup.locator('li', { hasText: 'Tennis' }).click();
  await expect(section.getByTestId('ddl-value-out')).toHaveText('Game6');
  await expect(section.getByTestId('ddl-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('ddl-value');
  await section.getByTestId('ddl-set-game1').click();
  await expect(section.locator('input.e-dropdownlist')).toHaveValue('American Football');
});

test('enabled binding', async ({ app }) => {
  const section = app.section('ddl-value');
  await section.getByTestId('ddl-enabled').uncheck();
  await expect(section.locator('.e-ddl')).toHaveClass(/e-disabled/);
});

test('showClearButton clears the selection', async ({ app, page }) => {
  const section = app.section('ddl-value');
  expect(await widgetProp(page, 'ddl-value', 'showClearButton')).toBe(true);
  await section.locator('.e-ddl').click(); // the clear icon is shown while focused
  await section.locator('.e-clear-icon').click();
  await expect(section.locator('input.e-dropdownlist')).toHaveValue('');
});

test('filtering narrows the list', async ({ app, page }) => {
  const section = app.section('ddl-filter');
  expect(await widgetProp(page, 'ddl-filter', 'filterBarPlaceholder')).toBe('Search sports');
  const popup = await openPopup(page, section);
  await expect(popup.locator('input.e-input-filter')).toHaveAttribute('placeholder', 'Search sports');
  await popup.locator('input.e-input-filter').pressSequentially('ba');
  await expect(popup.locator('li.e-list-item')).toHaveText(['Badminton', 'Basketball']); // default filterType is StartsWith
});

test('markup (select) data source', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ddl-select'));
  await expect(popup.locator('li.e-list-item')).toHaveText(['Golf', 'Hockey', 'Rugby']);
});

test('ignoreAccent, ignoreCase and filterType follow the view-model', async ({ app, page }) => {
  const section = app.section('ddl-ignore');
  let popup = await openPopup(page, section);
  await popup.locator('input.e-input-filter').pressSequentially('CAFE');
  await expect(popup.locator('li.e-list-item')).toHaveText(['Café', 'Cafe latte']);
  await page.keyboard.press('Escape');
  await expect(page.locator('.e-ddl.e-popup-open')).toHaveCount(0);
  await section.getByTestId('ddl-ignore-toggle').click();
  await expect.poll(() => widgetProp(page, 'ddl-ignore', 'ignoreAccent')).toBe(false);
  expect(await widgetProp(page, 'ddl-ignore', 'ignoreCase')).toBe(false);
  expect(await widgetProp(page, 'ddl-ignore', 'filterType')).toBe('Contains');
  popup = await openPopup(page, section);
  const filter = popup.locator('input.e-input-filter');
  await filter.pressSequentially('afe');
  await expect(popup.locator('li.e-list-item')).toHaveText(['Cafe latte']); // accent now matters
  await filter.fill('');
  await filter.pressSequentially('AFE');
  await expect(popup.locator('li.e-list-item')).toHaveCount(0); // and so does case
});

test('bound properties reach the widget and follow view-model changes', async ({ app, page }) => {
  const section = app.section('ddl-dyn');
  const wrapper = section.locator('.e-ddl');
  const input = section.locator('input.e-dropdownlist');
  await expect(wrapper).toHaveClass(/dyn-one/);
  await expect(wrapper).toHaveCSS('width', '300px');
  await expect(input).toHaveAttribute('placeholder', 'First');
  await expect(section.locator('[data-attr="one"]')).toHaveCount(1);
  const expectProps = async (p: Record<string, any>) => {
    for (const [k, v] of Object.entries(p)) {
      await expect.poll(() => widgetProp(page, 'ddl-dyn', k), { message: k }).toEqual(v);
    }
  };
  await expectProps({
    popupHeight: '300px', popupWidth: '200px', zIndex: 1000, readonly: false, floatLabelType: 'Never', sortOrder: 'None',
    allowFiltering: false, isDeviceFullScreen: false, allowResize: false, debounceDelay: 300, showClearButton: false
  });
  await section.getByTestId('ddl-dyn-toggle').click();
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
  const section = app.section('ddl-templates');
  await expect(section.locator('.tpl-value')).toHaveText('Chosen Cricket');
  expect(await widgetProp(page, 'ddl-templates', 'actionFailureTemplate')).toContain('tpl-fail');
  const popup = await openPopup(page, section);
  await expect(popup.locator('.tpl-header')).toHaveText('Header');
  await expect(popup.locator('.tpl-footer')).toHaveText('Footer');
  await expect(popup.locator('.tpl-item')).toHaveText(['Item Cricket', 'Item Baseball', 'Item Tennis']);
  await expect(popup.locator('.tpl-group').first()).toHaveText('Group Bat');
  await popup.locator('input.e-input-filter').pressSequentially('zzz');
  await expect(popup.locator('.tpl-none')).toHaveText('Nothing here');
});

test('index and text select an item initially', async ({ app }) => {
  await expect(app.section('ddl-index').locator('input.e-dropdownlist')).toHaveValue('Basketball');
  await expect(app.section('ddl-text').locator('input.e-dropdownlist')).toHaveValue('Cricket');
});

test('allowObjectBinding makes the value the data object', async ({ app, page }) => {
  const section = app.section('ddl-object');
  const popup = await openPopup(page, section);
  await popup.locator('li', { hasText: 'Tennis' }).click();
  await expect(section.getByTestId('ddl-object-out')).toHaveText('Tennis');
  expect(await widgetProp(page, 'ddl-object', 'allowObjectBinding')).toBe(true);
  expect(await page.evaluate(() => typeof (document.querySelector('[data-testid="ddl-object"]') as any)
    .au['ej2-drop-down-list'].viewModel.widget.value)).toBe('object');
});

test('query limits the items', async ({ app, page }) => {
  const popup = await openPopup(page, app.section('ddl-query'));
  await expect(popup.locator('li.e-list-item')).toHaveCount(2);
});

test('enableVirtualization renders only part of a large list', async ({ app, page }) => {
  expect(await widgetProp(page, 'ddl-virtual', 'enableVirtualization')).toBe(true);
  const popup = await openPopup(page, app.section('ddl-virtual'));
  const rendered = await popup.locator('li.e-list-item').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(500);
});

test('events fire in response to user interaction', async ({ app, page }) => {
  const section = app.section('ddl-events');
  const log = section.getByTestId('ddl-events-out');
  const seen = async () => ((await log.textContent()) || '').split(',');
  const popup = await openPopup(page, section); // the list is only loaded when the popup first opens
  await expect.poll(seen).toEqual(expect.arrayContaining(['focus', 'actionBegin', 'actionComplete', 'dataBound', 'beforeOpen', 'open']));
  await popup.locator('input.e-input-filter').pressSequentially('b');
  await expect.poll(seen).toContain('filtering');
  await popup.locator('li', { hasText: 'Badminton' }).click();
  await expect.poll(seen).toEqual(expect.arrayContaining(['select', 'change', 'close']));
  // blur is raised when the open popup (focus is in its filter box) loses focus to a click elsewhere
  await openPopup(page, section);
  await page.locator('main h2').click();
  await expect.poll(seen).toContain('blur');
});

test('resize events fire when the popup is resized', async ({ app, page }) => {
  const section = app.section('ddl-events');
  const popup = await openPopup(page, section);
  const handle = popup.locator('.e-resizer-right');
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 40, box.y + 20, { steps: 5 });
  await page.mouse.up();
  const log = section.getByTestId('ddl-events-out');
  await expect(log).toContainText('resizeStart');
  await expect(log).toContainText('resizing');
  await expect(log).toContainText('resizeStop');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('ddl-lifecycle');
  await expect(section.getByTestId('ddl-created')).toHaveText('1');
  await section.getByTestId('ddl-lifecycle-toggle').click();
  await expect(section.getByTestId('ddl-destroyed')).toHaveText('1');
  await section.getByTestId('ddl-lifecycle-toggle').click();
  await expect(section.getByTestId('ddl-created')).toHaveText('2');
});

test('actionFailure fires when the remote data source fails', async ({ app, page }) => {
  await page.route('**/api/ddl-fail*', route => route.fulfill({ status: 500, body: 'nope' }));
  await app.open('dropDownList');
  await app.section('ddl-fail').locator('.e-ddl').click(); // the remote request is made when the popup opens
  await expect(app.section('ddl-fail').getByTestId('ddl-fail-count')).not.toHaveText('0');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
});
