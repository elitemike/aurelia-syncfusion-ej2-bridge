import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('dropDownTree'));

/** Reads a property of the Syncfusion widget behind a demo element (data-testid). */
function prop(page: Page, testId: string, name: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-drop-down-tree'].viewModel.widget[p];
  }, [testId, name]);
}

const blur = (page: Page) => page.locator('main h2').click();
const openDdt = (page: Page, section: Locator) =>
  openPopup(page, section.locator('.e-ddt'), '.e-ddt.e-popup-open');

test('initial value is selected', async ({ app }) => {
  const section = app.section('ddt-value');
  await expect(section.locator('.e-ddt')).toContainText('Warming.ppt');
});

test('two-way value: view to model, text and change event', async ({ app, page }) => {
  const section = app.section('ddt-value');
  const popup = await openDdt(page, section);
  await popup.getByText('Naturals.mp4', { exact: true }).click({ force: true });
  await blur(page); // change is raised on blur (changeOnBlur)
  await expect(section.getByTestId('ddt-value-out')).toHaveText('02-01');
  await expect(section.getByTestId('ddt-text-out')).toHaveText('Naturals.mp4');
  await expect(section.getByTestId('ddt-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app, page }) => {
  const section = app.section('ddt-value');
  await section.getByTestId('ddt-set').click();
  await expect(section.locator('.e-ddt')).toContainText('Naturals.mp4');
  await expect.poll(() => prop(page, 'ddt-value', 'value')).toEqual(['02-01']);
});

test('lifecycle, popup, selection and key events', async ({ app, page }) => {
  const section = app.section('ddt-events');
  const life = section.getByTestId('ddt-life-ev');
  await expect(life).toContainText('created,');
  const popup = await openDdt(page, section);
  await expect(life).toContainText('focus,');
  await expect(life).toContainText('beforeOpen,');
  await expect(life).toContainText('open,');
  await expect(life).toContainText('dataBound,');
  await popup.getByText('Wild.mpeg', { exact: true }).click({ force: true });
  await expect(section.getByTestId('ddt-select-ev')).toContainText('select,');
  await page.keyboard.press('ArrowDown');
  await expect(section.getByTestId('ddt-select-ev')).toContainText('keyPress,');
  await page.keyboard.press('Escape');
  await expect(life).toContainText('close,');
  await blur(page);
  await expect(life).toContainText('blur,');
});

test('checkbox mode, select all labels, Box mode and treeSettings', async ({ app, page }) => {
  const section = app.section('ddt-checkbox');
  expect(await prop(page, 'ddt-checkbox', 'showCheckBox')).toBe(true);
  expect(await prop(page, 'ddt-checkbox', 'mode')).toBe('Box');
  expect(await prop(page, 'ddt-checkbox', 'showSelectAll')).toBe(true);
  expect(await page.evaluate(() => {
    const ts = (document.querySelector('[data-testid="ddt-checkbox"]') as any).au['ej2-drop-down-tree'].viewModel.widget.treeSettings;
    return { autoCheck: ts.autoCheck, expandOn: ts.expandOn, loadOnDemand: ts.loadOnDemand };
  })).toEqual({ autoCheck: true, expandOn: 'Click', loadOnDemand: false });
  const popup = await openDdt(page, section);
  await expect(popup.locator('.e-selectall-parent .e-all-text')).toHaveText('Tick all');
  // autoCheck: checking the parent checks every child
  await popup.locator('li[data-uid="03"] > .e-text-content .e-checkbox-wrapper').click({ force: true });
  await expect(section.locator('.e-chips')).toHaveCount(4); // Documents and its three children
  await expect(section.locator('.e-chips', { hasText: 'Warming.ppt' })).toBeVisible();
  await popup.locator('.e-selectall-parent .e-checkbox-wrapper').click({ force: true });
  await expect(popup.locator('.e-selectall-parent .e-all-text')).toHaveText('Untick all');
  await expect(section.locator('.e-chips')).toHaveCount(9); // every node is selected
});

test('multi selection, delimiter mode, wrapText and changeOnBlur', async ({ app, page }) => {
  const section = app.section('ddt-multi');
  expect(await prop(page, 'ddt-multi', 'allowMultiSelection')).toBe(true);
  expect(await prop(page, 'ddt-multi', 'mode')).toBe('Delimiter');
  expect(await prop(page, 'ddt-multi', 'delimiterChar')).toBe(' | ');
  expect(await prop(page, 'ddt-multi', 'wrapText')).toBe(true);
  expect(await prop(page, 'ddt-multi', 'changeOnBlur')).toBe(false);
  await expect(section.locator('input.e-dropdowntree')).toHaveValue('Naturals.mp4 |  Wild.mpeg'); // delimiterChar plus a space
  const popup = await openDdt(page, section);
  await page.keyboard.down('Control');
  await popup.getByText('Videos', { exact: true }).click({ force: true });
  await page.keyboard.up('Control');
  await expect(section.locator('input.e-dropdowntree')).toHaveValue(/Videos/);
});

test('filtering properties, event and noRecordsTemplate', async ({ app, page }) => {
  const section = app.section('ddt-filter');
  const popup = await openDdt(page, section);
  const filter = popup.locator('.e-filter-wrap input');
  await expect(filter).toHaveAttribute('placeholder', 'Find a file');
  await filter.pressSequentially('WARM'); // ignoreCase, Contains
  await expect(section.getByTestId('ddt-filter-ev')).toContainText('filtering,');
  await expect(popup.getByText('Warming.ppt', { exact: true })).toBeVisible();
  await expect(popup.getByText('Wild.mpeg', { exact: true })).toBeHidden();
  await filter.fill('');
  await filter.pressSequentially('zzzz');
  await expect(popup.locator('.tpl-norecords')).toHaveText('No files match');
  expect(await prop(page, 'ddt-filter', 'allowFiltering')).toBe(true);
  expect(await prop(page, 'ddt-filter', 'filterType')).toBe('Contains');
  expect(await prop(page, 'ddt-filter', 'ignoreCase')).toBe(true);
  expect(await prop(page, 'ddt-filter', 'ignoreAccent')).toBe(true);
});

test('appearance properties reach the widget and follow the view-model', async ({ app, page }) => {
  const section = app.section('ddt-appearance');
  const ddt = section.locator('.e-ddt');
  await expect(ddt).toHaveClass(/ddt-custom-class/);
  await expect.poll(async () => (await ddt.boundingBox()).width).toBeCloseTo(320, 0);
  await expect(section.locator('.e-float-text')).toHaveText('Pick a file');
  await expect(section.locator('.e-clear-icon')).toBeAttached();
  await expect(section.locator('.e-ddt-icon')).toBeVisible();
  await expect(section.locator('[data-extra="hello"]').first()).toBeAttached();
  expect(await prop(page, 'ddt-appearance', 'zIndex')).toBe(4321);
  expect(await prop(page, 'ddt-appearance', 'sortOrder')).toBe('Descending');
  const popup = await openDdt(page, section);
  await expect(popup).toHaveClass(/ddt-custom-class/);
  expect(await popup.evaluate(el => (el as HTMLElement).style.maxHeight)).toBe('180px');
  expect(await popup.evaluate(el => (el as HTMLElement).style.width)).toBe('280px');
  expect(await popup.evaluate(el => (el as HTMLElement).style.zIndex)).toBe('4321');
  await expect(popup.locator('li.e-list-item').first()).toContainText('Videos'); // Descending: Videos, Music, Documents ...
  await page.keyboard.press('Escape');
  await blur(page);

  await section.getByTestId('ddt-restyle').click();
  await expect(ddt).toHaveClass(/ddt-other-class/);
  await expect.poll(async () => (await ddt.boundingBox()).width).toBeCloseTo(400, 0);
  await expect(ddt).toHaveClass(/e-disabled/);
  await expect(section.locator('.e-ddt-icon')).toBeHidden();
  await expect(section.locator('[data-extra="changed"]').first()).toBeAttached();
  expect(await prop(page, 'ddt-appearance', 'enabled')).toBe(false);
  expect(await prop(page, 'ddt-appearance', 'readonly')).toBe(true);
  expect(await prop(page, 'ddt-appearance', 'placeholder')).toBe('Changed placeholder');
  expect(await prop(page, 'ddt-appearance', 'popupHeight')).toBe('220px');
  expect(await prop(page, 'ddt-appearance', 'popupWidth')).toBe('320px');
  expect(await prop(page, 'ddt-appearance', 'zIndex')).toBe(5555);
  expect(await prop(page, 'ddt-appearance', 'sortOrder')).toBe('Ascending');
  expect(await prop(page, 'ddt-appearance', 'floatLabelType')).toBe('Never');
  expect(await prop(page, 'ddt-appearance', 'showClearButton')).toBe(false);
});

test('item, value, header and footer templates', async ({ app, page }) => {
  const section = app.section('ddt-templates');
  await expect(section.locator('.tpl-value')).toHaveText('Chosen: Naturals.mp4');
  const popup = await openDdt(page, section);
  await expect(popup.locator('.tpl-item').first()).toContainText('Node: ');
  await expect(popup.locator('.tpl-header')).toHaveText('The header');
  await expect(popup.locator('.tpl-footer')).toHaveText('The footer');
});

test('customTemplate in Custom mode', async ({ app, page }) => {
  const section = app.section('ddt-custom');
  expect(await prop(page, 'ddt-custom', 'mode')).toBe('Custom');
  await expect(section.locator('.tpl-custom')).toContainText('Custom: ');
  await expect(section.locator('.tpl-custom')).toContainText('Naturals.mp4');
});

test('enableHtmlSanitizer and disableHtmlEncode', async ({ app, page }) => {
  expect(await prop(page, 'ddt-html', 'enableHtmlSanitizer')).toBe(false);
  expect(await prop(page, 'ddt-html', 'disableHtmlEncode')).toBe(false);
  const popup = await openDdt(page, app.section('ddt-html'));
  await expect(popup.locator('b.bold-node')).toHaveText('Bold'); // markup is rendered, not escaped
});

test('actionFailure and actionFailureTemplate for a failing request', async ({ app, page }) => {
  const section = app.section('ddt-remote');
  await expect(section.getByTestId('ddt-remote-ev')).toContainText('actionFailure,');
  const popup = await openDdt(page, section);
  await expect(popup.locator('.tpl-failure')).toHaveText('Tree failed');
});

test('destroyPopupOnHide and destroyed event', async ({ app, page }) => {
  const section = app.section('ddt-destroy');
  expect(await prop(page, 'ddt-destroy', 'destroyPopupOnHide')).toBe(true);
  await openDdt(page, section);
  await page.keyboard.press('Escape');
  await expect(page.locator('.e-ddt.e-popup')).toHaveCount(0);
  await expect(section.getByTestId('ddt-destroyed-count')).toHaveText('0');
  await section.getByTestId('ddt-destroy-btn').click();
  await expect(section.getByTestId('ddt-destroyed-count')).toHaveText('1');
  await expect(section.locator('.e-ddt')).toHaveCount(0);
});
