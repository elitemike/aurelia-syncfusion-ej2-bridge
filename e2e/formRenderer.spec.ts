import { test, expect } from './fixtures';
import { Locator } from '@playwright/test';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('formRenderer'));

const host = (section: Locator) => section.locator('.e-form-renderer');
const field = (section: Locator, name: string) => section.locator(`[data-fr-field="${name}"]`);
const prop = (section: Locator, name: string) =>
  host(section).evaluate((e: any, n) => {
    const v = e.ej2_instances[0][n];
    return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v, (k, val) => (k === 'parentObj' || k === 'controlParent' ? undefined : (val && val.properties && val.parentObj ? val.properties : val)))) : v;
  }, name);

test.describe('default', () => {
  test('renders the schema fields with the data model values', async ({ app }) => {
    const section = app.section('fr-default');
    // the widget raises created itself and once more after rendering the fields
    await expect(section.getByTestId('fr-ev-created')).not.toHaveText('0');
    await expect(field(section, 'fullName').locator('input.e-textbox')).toHaveValue('Grace Hopper');
    await expect(field(section, 'fullName').locator('label')).toContainText('Full name');
    await expect(field(section, 'fullName').locator('input')).toHaveAttribute('placeholder', 'Your name');
    await expect(field(section, 'age').locator('input.e-numerictextbox')).toHaveValue('85.00');
    await expect(field(section, 'country').locator('input.e-dropdownlist')).toHaveValue('Brazil');
    await expect(field(section, 'newsletter').locator('input.e-checkbox')).toBeChecked();
    await expect(section.getByRole('button', { name: 'Send' })).toBeVisible();
    expect((await prop(section, 'schema')).properties.fullName.label).toBe('Full name');
    expect(await prop(section, 'dataModel')).toMatchObject({ fullName: 'Grace Hopper', age: 85 });
  });

  test('className and layout reach the widget and the host id is unique', async ({ app }) => {
    const section = app.section('fr-default');
    await expect(host(section)).toHaveClass(/fr-custom-class/);
    expect(await prop(section, 'className')).toBe('fr-custom-class');
    expect(await prop(section, 'layout')).toBe('SingleColumn');
    await expect(host(section)).toHaveAttribute('id', /^form-renderer-\d+$/);
    await expect(field(section, 'fullName').locator('input.e-textbox')).toHaveAttribute('id', /^form-renderer-\d+-fullName$/);
  });

  test('change is raised with the field, value and data model', async ({ app }) => {
    const section = app.section('fr-default');
    const input = field(section, 'fullName').locator('input.e-textbox');
    await input.fill('Katherine Johnson');
    await input.blur();
    await expect(section.getByTestId('fr-ev-change')).not.toHaveText('0');
    await expect(section.getByTestId('fr-ev-change-field')).toHaveText('fullName');
    await expect(section.getByTestId('fr-ev-change-value')).toHaveText('Katherine Johnson');
  });

  test('change is raised for dropdown and checkbox fields too', async ({ app }) => {
    const section = app.section('fr-default');
    await field(section, 'newsletter').locator('label').click();
    await expect(section.getByTestId('fr-ev-change-field')).toHaveText('newsletter');
    await expect(section.getByTestId('fr-ev-change-value')).toHaveText('false');
    const popup = await openPopup(app.page, field(section, 'country').locator('.e-ddl'), '.e-ddl.e-popup-open');
    await popup.locator('li', { hasText: 'Canada' }).click();
    await expect(section.getByTestId('fr-ev-change-field')).toHaveText('country');
    await expect(section.getByTestId('fr-ev-change-value')).toHaveText('Canada');
  });

  test('submit is raised with the form data', async ({ app }) => {
    const section = app.section('fr-default');
    await section.getByRole('button', { name: 'Send' }).click();
    await expect(section.getByTestId('fr-ev-submit')).toHaveText('1');
    await expect(section.getByTestId('fr-ev-submit-valid')).toHaveText('true');
    const data = JSON.parse(await section.getByTestId('fr-ev-submit-data').innerText());
    expect(data).toMatchObject({ fullName: 'Grace Hopper', country: 'Brazil', newsletter: true });
  });

  test('an invalid form shows the validation message and is not submitted', async ({ app }) => {
    const section = app.section('fr-default');
    const input = field(section, 'fullName').locator('input.e-textbox');
    await input.fill('');
    await section.getByRole('button', { name: 'Send' }).click();
    await expect(field(section, 'fullName').locator('.e-error-message')).toBeVisible();
    // an invalid form is not submitted
    await expect(section.getByTestId('fr-ev-submit')).toHaveText('0');
  });

  test('buttonClick is raised for a plain button', async ({ app }) => {
    const section = app.section('fr-default');
    await section.getByRole('button', { name: 'Help' }).click();
    await expect(section.getByTestId('fr-ev-buttonClick')).not.toHaveText('0');
    await expect(section.getByTestId('fr-ev-button-field')).toHaveText('help');
    await expect(section.getByTestId('fr-ev-submit')).toHaveText('0');
  });

  test('dataModel follows the view-model', async ({ app }) => {
    const section = app.section('fr-default');
    await section.getByTestId('fr-new-data').click();
    await expect(field(section, 'fullName').locator('input.e-textbox')).toHaveValue('Ada Lovelace');
    await expect(field(section, 'country').locator('input.e-dropdownlist')).toHaveValue('Austria');
    await expect(field(section, 'newsletter').locator('input.e-checkbox')).not.toBeChecked();
  });
});

test('layout switches the column layout', async ({ app }) => {
  const section = app.section('fr-layout');
  const width = async () => (await field(section, 'fullName').boundingBox()).width;
  const single = await width();
  await section.getByTestId('fr-two-column').click();
  await expect.poll(() => prop(section, 'layout')).toBe('TwoColumn');
  await expect.poll(width).toBeLessThan(single * 0.75);
  const two = await width();
  await section.getByTestId('fr-three-column').click();
  await expect.poll(() => prop(section, 'layout')).toBe('ThreeColumn');
  await expect.poll(width).toBeLessThan(two * 0.9);
});

test('customWidgetSettings render the template instead of the component', async ({ app }) => {
  const section = app.section('fr-custom');
  await expect(field(section, 'nickname').locator('.fr-custom-widget')).toContainText('Custom nickname editor');
  await expect(field(section, 'nickname').locator('input.e-textbox')).toHaveCount(0);
  const settings = await prop(section, 'customWidgetSettings');
  expect(settings[0]).toMatchObject({ fieldName: 'nickname', type: 'textbox' });
});

test('enableHtmlSanitizer strips scripts and event handlers', async ({ app }) => {
  const section = app.section('fr-sanitize');
  expect(await prop(section, 'enableHtmlSanitizer')).toBe(true);
  await expect(section.locator('.fr-note')).toContainText('Safe text');
  await expect(section.locator('[onerror]')).toHaveCount(0);
  await expect(section.locator('script')).toHaveCount(0);
  expect(await app.page.evaluate(() => (window as any).__frHacked)).toBeUndefined();
});

test('failure is raised when the schema cannot be parsed', async ({ app }) => {
  const section = app.section('fr-failure');
  await expect(section.getByTestId('fr-ev-failure')).toHaveText('1');
});
