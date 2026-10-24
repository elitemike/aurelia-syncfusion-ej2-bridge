import { test, expect } from './fixtures';
import { Locator, Page } from '@playwright/test';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('inPlaceEditor'));

const display = (editor: Locator) => editor.locator('.e-editable-value');
const form = (editor: Locator) => editor.locator('.e-editable-form');
const save = (root: Locator) => root.locator('.e-btn-save');
const cancel = (root: Locator) => root.locator('.e-btn-cancel');
/** Popup mode renders the editor in a tooltip appended to the body. */
const popup = (page: Page) => page.locator('.e-inplaceeditor-tip.e-popup-open');
const prop = (editor: Locator, name: string) =>
  editor.locator('.e-inplaceeditor').evaluate((e: any, n) => e.ej2_instances[0][n], name);

async function stub(page: Page) {
  const bodies: any[] = [];
  await page.route('**/api/inplace/save', async route => {
    bodies.push({ url: route.request().url(), post: route.request().postData() });
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ name: 'ok' })
    });
  });
  await page.route('**/api/inplace/fail', route => route.fulfill({ status: 500, body: 'nope' }));
  return bodies;
}

test.describe('default', () => {
  test('renders the value, name, empty text and model', async ({ app }) => {
    const section = app.section('ipe-default');
    const editor = section.getByTestId('ipe-default');
    await expect(display(editor)).toHaveText('Andrew');
    expect(await prop(editor, 'name')).toBe('employee');
    await display(editor).click();
    const input = form(editor).locator('input.e-textbox');
    await expect(input).toHaveValue('Andrew');
    await expect(input).toHaveAttribute('name', 'employee');
    await expect(input).toHaveAttribute('placeholder', 'Enter value');
  });

  test('two-way value: view to model on submit', async ({ app }) => {
    const section = app.section('ipe-default');
    const editor = section.getByTestId('ipe-default');
    await display(editor).click();
    await form(editor).locator('input.e-textbox').fill('Margaret');
    // nothing is committed before the save
    await expect(section.getByTestId('ipe-default-out')).toHaveText('Andrew');
    await save(editor).click();
    await expect(section.getByTestId('ipe-default-out')).toHaveText('Margaret');
    await expect(display(editor)).toHaveText('Margaret');
    expect(await prop(editor, 'value')).toBe('Margaret');
  });

  test('two-way value: model to view and empty text', async ({ app }) => {
    const section = app.section('ipe-default');
    const editor = section.getByTestId('ipe-default');
    await section.getByTestId('ipe-default-set').click();
    await expect(display(editor)).toHaveText('Set by view-model');
    await section.getByTestId('ipe-default-clear').click();
    await expect(display(editor)).toHaveText('Click to enter a name');
    expect(await prop(editor, 'emptyText')).toBe('Click to enter a name');
  });

  test('cancel keeps the old value', async ({ app }) => {
    const section = app.section('ipe-default');
    const editor = section.getByTestId('ipe-default');
    await display(editor).click();
    await form(editor).locator('input.e-textbox').fill('discarded');
    await cancel(editor).click();
    await expect(form(editor)).toHaveCount(0);
    await expect(display(editor)).toHaveText('Andrew');
    await expect(section.getByTestId('ipe-default-out')).toHaveText('Andrew');
  });
});

test.describe('editor types', () => {
  const types: [string, string, string][] = [
    ['text', 'Text', 'input.e-textbox'],
    ['numeric', 'Numeric', 'input.e-numerictextbox'],
    ['mask', 'Mask', 'input.e-maskedtextbox'],
    ['date', 'Date', 'input.e-datepicker'],
    ['datetime', 'DateTime', 'input.e-datetimepicker'],
    ['dropdown', 'DropDownList', 'input.e-dropdownlist'],
    ['autocomplete', 'AutoComplete', 'input.e-autocomplete'],
    ['combobox', 'ComboBox', 'input.e-combobox'],
    ['multiselect', 'MultiSelect', '.e-multiselect'],
    ['color', 'Color', 'input.e-colorpicker'],
    ['slider', 'Slider', '.e-slider-container'],
    ['time', 'Time', 'input.e-timepicker'],
    ['daterange', 'DateRange', 'input.e-daterangepicker'],
    ['rte', 'RTE', '.e-richtexteditor']
  ];
  for (const [key, type, selector] of types) {
    test(`${type} renders its editor`, async ({ app }) => {
      const editor = app.section('ipe-types').getByTestId(`ipe-type-${key}`);
      expect(await prop(editor, 'type')).toBe(type);
      await display(editor).click();
      await expect(form(editor).locator(selector).first()).toBeAttached();
      await cancel(editor).click();
      await expect(form(editor)).toHaveCount(0);
    });
  }

  test('display values and models', async ({ app }) => {
    const section = app.section('ipe-types');
    await expect(display(section.getByTestId('ipe-type-text'))).toHaveText('Plain text');
    await expect(display(section.getByTestId('ipe-type-numeric'))).toHaveText('25');
    await expect(display(section.getByTestId('ipe-type-mask'))).toHaveText('1234567890');
    await expect(display(section.getByTestId('ipe-type-date'))).toHaveText(/2024/);
    await expect(display(section.getByTestId('ipe-type-dropdown'))).toHaveText('Football');
    await expect(display(section.getByTestId('ipe-type-multiselect'))).toContainText('Cricket');
    await expect(display(section.getByTestId('ipe-type-color'))).toBeVisible();
    await expect(display(section.getByTestId('ipe-type-rte'))).toContainText('Rich text');
    // the model reaches the inner editor
    const mask = section.getByTestId('ipe-type-mask');
    await display(mask).click();
    await expect(form(mask).locator('input.e-maskedtextbox')).toHaveValue('(123) 456-7890');
  });

  test('numeric: two-way value converts back to a number', async ({ app }) => {
    const section = app.section('ipe-types');
    const editor = section.getByTestId('ipe-type-numeric');
    await display(editor).click();
    const input = form(editor).locator('input.e-numerictextbox');
    await input.fill('40');
    await save(editor).click();
    await expect(section.getByTestId('ipe-type-numeric-out')).toHaveText('40');
    expect(await prop(editor, 'value')).toBe(40);
  });

  test('dropdown: two-way value from the list', async ({ app }) => {
    const section = app.section('ipe-types');
    const editor = section.getByTestId('ipe-type-dropdown');
    await display(editor).click();
    const list = await openPopup(app.page, form(editor).locator('.e-ddl'), '.e-ddl.e-popup-open');
    await list.locator('li', { hasText: 'Golf' }).click();
    await expect(form(editor).locator('input.e-dropdownlist')).toHaveValue('Golf');
    await save(editor).click();
    await expect(section.getByTestId('ipe-type-dropdown-out')).toHaveText('Golf');
    await expect(display(editor)).toHaveText('Golf');
  });
});

test.describe('modes and triggers', () => {
  test('popup mode with title and css class', async ({ app }) => {
    const editor = app.section('ipe-modes').getByTestId('ipe-popup');
    await expect(editor.locator('.e-inplaceeditor')).toHaveClass(/ipe-custom/);
    expect(await prop(editor, 'mode')).toBe('Popup');
    await expect(async () => {
      await display(editor).click();
      await expect(popup(app.page).locator('.e-editable-title')).toHaveText('Enter the name', { timeout: 2000 });
    }).toPass({ timeout: 15000 });
    const input = popup(app.page).locator('input.e-textbox');
    await expect(input).toHaveValue('Popup editor');
    await input.fill('Saved from popup');
    await save(popup(app.page)).click();
    await expect(display(editor)).toHaveText('Saved from popup');
    await expect(popup(app.page)).toHaveCount(0);
  });

  test('editableOn DblClick only opens on double click', async ({ app }) => {
    const editor = app.section('ipe-modes').getByTestId('ipe-dblclick');
    expect(await prop(editor, 'editableOn')).toBe('DblClick');
    await display(editor).click();
    await expect(form(editor)).toHaveCount(0);
    await display(editor).dblclick();
    await expect(form(editor).locator('input.e-textbox')).toBeVisible();
  });

  test('editableOn EditIconClick only opens from the icon', async ({ app }) => {
    const editor = app.section('ipe-modes').getByTestId('ipe-editicon');
    expect(await prop(editor, 'editableOn')).toBe('EditIconClick');
    await display(editor).click();
    await expect(form(editor)).toHaveCount(0);
    await editor.locator('.e-editable-overlay-icon').click();
    await expect(form(editor).locator('input.e-textbox')).toBeVisible();
  });

  test('disabled editors do not open', async ({ app }) => {
    const editor = app.section('ipe-modes').getByTestId('ipe-disabled');
    expect(await prop(editor, 'disabled')).toBe(true);
    await expect(editor.locator('.e-inplaceeditor')).toHaveClass(/e-disable/);
    await display(editor).click({ force: true });
    await expect(form(editor)).toHaveCount(0);
  });

  test('textOption Always sets the combobox text initially', async ({ app }) => {
    const editor = app.section('ipe-modes').getByTestId('ipe-textoption');
    expect(await prop(editor, 'textOption')).toBe('Always');
    await display(editor).click();
    await expect(form(editor).locator('input.e-combobox')).toHaveValue('Cricket');
  });
});

test.describe('buttons, blur and keyboard', () => {
  test('custom save and cancel buttons', async ({ app }) => {
    const editor = app.section('ipe-buttons').getByTestId('ipe-custom-buttons');
    await display(editor).click();
    await expect(save(editor)).toHaveText('Apply');
    await expect(save(editor)).toHaveClass(/ipe-save/);
    await expect(cancel(editor)).toHaveText('Discard');
    await expect(cancel(editor)).toHaveClass(/ipe-cancel/);
    await form(editor).locator('input.e-textbox').fill('applied');
    await save(editor).click();
    await expect(display(editor)).toHaveText('applied');
  });

  test('showButtons false with actionOnBlur Submit saves on blur', async ({ app }) => {
    const section = app.section('ipe-buttons');
    const editor = section.getByTestId('ipe-no-buttons');
    await display(editor).click();
    await expect(editor.locator('.e-editable-action-buttons')).toHaveCount(0);
    await form(editor).locator('input.e-textbox').fill('blurred in');
    await section.getByTestId('ipe-no-buttons-out').click();
    await expect(section.getByTestId('ipe-no-buttons-out')).toHaveText('blurred in');
    await expect(display(editor)).toHaveText('blurred in');
  });

  test('actionOnBlur Cancel discards on blur', async ({ app }) => {
    const section = app.section('ipe-buttons');
    const editor = section.getByTestId('ipe-blur-cancel');
    await display(editor).click();
    await form(editor).locator('input.e-textbox').fill('thrown away');
    await section.locator('h3').click();
    await expect(form(editor)).toHaveCount(0);
    await expect(display(editor)).toHaveText('Blur to cancel');
  });

  test('actionOnBlur Ignore keeps the editor open and submitOnEnter false ignores Enter', async ({ app }) => {
    const section = app.section('ipe-buttons');
    const editor = section.getByTestId('ipe-ignore');
    await display(editor).click();
    const input = form(editor).locator('input.e-textbox');
    await input.fill('typed');
    await section.locator('h3').click();
    await expect(input).toBeVisible();
    await input.press('Enter');
    await expect(input).toBeVisible();
    await expect(display(editor)).toHaveText('Stay open');
    expect(await prop(editor, 'submitOnEnter')).toBe(false);
    await save(editor).click();
    await expect(display(editor)).toHaveText('typed');
  });

  test('submitOnEnter true (default) submits with Enter', async ({ app }) => {
    const editor = app.section('ipe-default').getByTestId('ipe-default');
    expect(await prop(editor, 'submitOnEnter')).toBe(true);
    await display(editor).click();
    const input = form(editor).locator('input.e-textbox');
    await input.fill('entered');
    await input.press('Enter');
    await expect(display(editor)).toHaveText('entered');
  });

  test('enableEditMode opens the editor from the view-model', async ({ app }) => {
    const section = app.section('ipe-buttons');
    const editor = section.getByTestId('ipe-enable-edit');
    await expect(form(editor)).toHaveCount(0);
    await section.getByTestId('ipe-open-edit').click();
    await expect(form(editor).locator('input.e-textbox')).toBeVisible();
    expect(await prop(editor, 'enableEditMode')).toBe(true);
  });
});

test('validationRules block an empty submit and raise validating', async ({ app }) => {
  const section = app.section('ipe-validation');
  const editor = section.getByTestId('ipe-validation');
  expect(await prop(editor, 'validationRules')).toHaveProperty('Required');
  await display(editor).click();
  const input = form(editor).locator('input.e-textbox');
  await input.fill('');
  await save(editor).click();
  await expect(section.getByTestId('ipe-validating-count')).not.toHaveText('0');
  await expect(section.getByTestId('ipe-validating-message')).toHaveText('This field is required');
  await expect(editor.locator('.e-editable-error')).toContainText('This field is required');
  await expect(form(editor)).toBeVisible();
  await input.fill('fixed');
  await save(editor).click();
  await expect(display(editor)).toHaveText('fixed');
});

test.describe('server data and events', () => {
  test('url, adaptor and primaryKey post the value and raise the action events', async ({ app }) => {
    const bodies = await stub(app.page);
    await app.page.reload();
    const section = app.section('ipe-server');
    const editor = section.getByTestId('ipe-server');
    expect(await prop(editor, 'url')).toBe('/api/inplace/save');
    expect(await prop(editor, 'adaptor')).toBe('UrlAdaptor');
    expect(await prop(editor, 'primaryKey')).toBe(1004);
    await expect(section.getByTestId('ipe-ev-created')).toHaveText('1');
    await display(editor).click();
    await expect(section.getByTestId('ipe-ev-beginEdit')).toHaveText('1');
    await form(editor).locator('input.e-textbox').fill('Posted value');
    await save(editor).click();
    await expect(section.getByTestId('ipe-ev-submitClick')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-actionBegin')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-actionBegin-key')).toHaveText('name,primaryKey,value');
    await expect(section.getByTestId('ipe-ev-actionSuccess')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-actionSuccess-value')).toHaveText('Posted value');
    await expect(section.getByTestId('ipe-ev-change')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-change-value')).toHaveText('Posted value');
    await expect(section.getByTestId('ipe-ev-change-previous')).toHaveText('Saved remotely');
    await expect(section.getByTestId('ipe-ev-endEdit')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-endEdit-action')).toHaveText('submit');
    await expect(display(editor)).toHaveText('Posted value');
    expect(bodies).toHaveLength(1);
    expect(bodies[0].url).toContain('/api/inplace/save');
    expect(bodies[0].post).toContain('Posted value');
    expect(bodies[0].post).toContain('1004');
    await expect(section.getByTestId('ipe-ev-actionFailure')).toHaveText('0');
  });

  test('cancelClick and endEdit with the cancel action', async ({ app }) => {
    const section = app.section('ipe-server');
    const editor = section.getByTestId('ipe-server');
    await display(editor).click();
    await cancel(editor).click();
    await expect(section.getByTestId('ipe-ev-cancelClick')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-endEdit')).toHaveText('1');
    await expect(section.getByTestId('ipe-ev-endEdit-action')).toHaveText('cancel');
    await expect(section.getByTestId('ipe-ev-change')).toHaveText('0');
  });

  test('destroyed is raised when the editor is removed', async ({ app }) => {
    const section = app.section('ipe-server');
    await expect(section.getByTestId('ipe-ev-destroyed')).toHaveText('0');
    await section.getByTestId('ipe-server-toggle').click();
    await expect(section.locator('.e-inplaceeditor')).toHaveCount(0);
    await expect(section.getByTestId('ipe-ev-destroyed')).toHaveText('1');
    await section.getByTestId('ipe-server-toggle').click();
    await expect(section.getByTestId('ipe-ev-created')).toHaveText('2');
  });

  test('actionFailure when the server rejects the value', async ({ app }) => {
    await stub(app.page);
    await app.page.reload();
    const section = app.section('ipe-failure');
    const editor = section.getByTestId('ipe-failure');
    await display(editor).click();
    await form(editor).locator('input.e-textbox').fill('rejected');
    await save(editor).click();
    await expect(section.getByTestId('ipe-failure-count')).toHaveText('1');
    // the browser reports the 500 of the stubbed endpoint, that is the point of this test
    app.errors.length = 0;
  });
});

test('enableHtmlSanitizer raises beforeSanitizeHtml, enableHtmlParse controls markup display', async ({ app }) => {
  const section = app.section('ipe-sanitize');
  const editor = section.getByTestId('ipe-sanitize');
  expect(await prop(editor, 'enableHtmlSanitizer')).toBe(true);
  await display(editor).click();
  await form(editor).locator('input.e-textbox').fill('<img src=x onerror=alert(1)> text');
  await save(editor).click();
  await expect(section.getByTestId('ipe-sanitize-count')).not.toHaveText('0');
  await expect(display(editor).locator('[onerror]')).toHaveCount(0);

  const parsed = section.getByTestId('ipe-parse-on');
  expect(await prop(parsed, 'enableHtmlParse')).toBe(true);
  await expect(display(parsed).locator('b')).toHaveText('bold');
  const raw = section.getByTestId('ipe-parse-off');
  expect(await prop(raw, 'enableHtmlParse')).toBe(false);
  await expect(display(raw).locator('b')).toHaveCount(0);
  await expect(display(raw)).toHaveText('<b>bold</b>');
});

test('template renders a custom editor', async ({ app }) => {
  const editor = app.section('ipe-template').getByTestId('ipe-template');
  await display(editor).click();
  const input = form(editor).locator('input.ipe-template-input');
  await expect(input).toBeVisible();
  await input.fill('typed in template');
  await save(editor).click();
  await expect(display(editor)).toHaveText('typed in template (template)');
});
