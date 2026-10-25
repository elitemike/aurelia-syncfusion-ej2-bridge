import { test, expect } from './fixtures';
import { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('formBuilder'));

const host = (section: Locator) => section.locator('.e-form-builder');
const fields = (section: Locator) => section.locator('.form-field');
const palette = (section: Locator, label: string) => section.locator('.palette-item', { hasText: label }).first();
const prop = (section: Locator, name: string) =>
  host(section).evaluate((e: any, n) => {
    const v = e.ej2_instances[0][n];
    return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v, (k, val) => (k === 'parentObj' ? undefined : val))) : v;
  }, name);

/** Drag a toolbox item with real mouse movements onto the lower half of the target field. */
async function dragToField(page: Page, section: Locator, label: string, fieldIndex: number) {
  await dragItem(page, palette(section, label), async () => {
    const target = await fields(section).nth(fieldIndex).boundingBox();
    return { x: target.x + target.width / 2, y: target.y + target.height - 5 };
  });
}

async function dragItem(page: Page, item: Locator, targetPoint: () => Promise<{ x: number; y: number }>) {
  await item.scrollIntoViewIfNeeded();
  const a = await item.boundingBox();
  const { x: tx, y: ty } = await targetPoint();
  await page.mouse.move(a.x + 20, a.y + 20);
  await page.mouse.down();
  for (let i = 1; i <= 30; i++) {
    await page.mouse.move(a.x + 20 + ((tx - a.x - 20) * i) / 30, a.y + 20 + ((ty - a.y - 20) * i) / 30);
    await page.waitForTimeout(15);
  }
  await page.mouse.up();
}

test.describe('default', () => {
  test('renders the schema in the canvas with the toolbox', async ({ app }) => {
    const section = app.section('fb-default');
    await expect(fields(section)).toHaveCount(2);
    await expect(section.locator('.field-label-text').first()).toHaveText('Full name');
    await expect(section.getByText('Email', { exact: true }).first()).toBeVisible();
    await expect(palette(section, 'Text Box')).toBeVisible();
    await expect(palette(section, 'Checkbox')).toBeVisible();
    const schema = await prop(section, 'schema');
    expect(Object.keys(schema.properties)).toEqual(['fullName', 'email']);
    expect(schema.layout).toHaveLength(2);
    expect(await prop(section, 'mode')).toBe('Simple');
    await expect(host(section)).toHaveAttribute('id', /^form-builder-\d+$/);
  });

  test('dragging a toolbox item raises the drag events and adds the field', async ({ app }) => {
    const section = app.section('fb-default');
    await dragToField(app.page, section, 'Checkbox', 1);
    await expect(section.getByTestId('fb-ev-dragStarted')).toHaveText('1');
    await expect(section.getByTestId('fb-ev-dragStarted-type')).toHaveText('checkbox');
    await expect(section.getByTestId('fb-ev-dragOver')).not.toHaveText('0');
    await expect(section.getByTestId('fb-ev-dropped')).toHaveText('1');
    await expect(section.getByTestId('fb-ev-dropped-type')).toHaveText('checkbox');
    await expect(fields(section)).toHaveCount(3);
  });

  test('changing a field property raises onFieldPropertyChanged', async ({ app }) => {
    const section = app.section('fb-default');
    await fields(section).first().click();
    const label = section.locator('.e-form-builder-right-pane-host input[id^="prop-text-label_"]');
    await expect(label).toHaveValue('Full name');
    await label.fill('Your full name');
    await label.blur();
    await expect(section.getByTestId('fb-ev-propertyChanged')).not.toHaveText('0');
    await expect(section.getByTestId('fb-ev-propertyChanged-name')).toHaveText('label');
    await expect(section.locator('.field-label-text').first()).toHaveText('Your full name');
  });
});

test.describe('mode, export and preview', () => {
  const toolbarTitles = (section: Locator) =>
    section.locator('.e-formbuilder-toolbar .e-toolbar-item').evaluateAll(e => e.map((x: HTMLElement) => x.title).filter(t => t));

  test('allowExport and enablePreview show the export and preview actions', async ({ app }) => {
    const section = app.section('fb-options');
    expect(await prop(section, 'allowExport')).toBe(true);
    expect(await prop(section, 'enablePreview')).toBe(true);
    expect(await prop(section, 'enableHtmlSanitizer')).toBe(true);
    await expect(host(section).getByRole('button', { name: 'Export json schema' })).toBeVisible();
    expect(await toolbarTitles(section)).toContain('Preview form');
  });

  test('allowExport and enablePreview follow the view-model', async ({ app }) => {
    const section = app.section('fb-options');
    await section.getByTestId('fb-no-export').click();
    await expect(host(section).getByRole('button', { name: 'Export json schema' })).toHaveCount(0);
    await expect.poll(() => toolbarTitles(section)).not.toContain('Preview form');
    expect(await prop(section, 'allowExport')).toBe(false);
    expect(await prop(section, 'enablePreview')).toBe(false);
  });

  test('mode follows the view-model and adds the templates tab', async ({ app }) => {
    const section = app.section('fb-options');
    await expect(section.locator('.e-form-builder-left-pane-host').getByText('Templates', { exact: true })).toHaveCount(0);
    await section.getByTestId('fb-developer').click();
    await expect.poll(() => prop(section, 'mode')).toBe('Developer');
    await expect(section.locator('.mode-button')).toBeVisible();
    await expect(section.locator('.e-form-builder-left-pane-host').getByText('Templates', { exact: true })).toBeVisible();
  });
});

test.describe('toolbox and templates', () => {
  test('toolboxCategories limit the toolbox items', async ({ app }) => {
    const section = app.section('fb-toolbox');
    const categories = await prop(section, 'toolboxCategories');
    expect(categories).toHaveLength(2);
    expect(categories[0].items).toEqual(['textbox', 'checkbox']);
    await expect(section.locator('.palette-item:not(.template-item)')).toHaveText([/Text Box/, /Checkbox/]);
    await expect(palette(section, 'Radio Button')).toHaveCount(0);
  });

  test('toolboxItems reach the widget', async ({ app }) => {
    const section = app.section('fb-toolbox');
    const items = await host(section).evaluate((e: any) =>
      e.ej2_instances[0].toolboxItems.map((i: any) => ({ type: i.type, template: String(i.template) })));
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('checkbox');
    expect(items[0].template).toContain('Fancy checkbox');
  });

  test('formTemplates are listed on the templates tab and applied to the canvas', async ({ app }) => {
    const section = app.section('fb-toolbox');
    const templates = await prop(section, 'formTemplates');
    expect(templates).toHaveLength(1);
    expect(templates[0].title).toBe('Contact form');
    await section.locator('.e-form-builder-left-pane-host').getByText('Templates', { exact: true }).click();
    const item = section.locator('.palette-item.template-item', { hasText: 'Contact form' });
    await expect(item).toBeVisible();
    await dragItem(app.page, item, async () => {
      const canvas = await section.locator('.e-form-builder-canvas-area').boundingBox();
      return { x: canvas.x + canvas.width / 2, y: canvas.y + 150 };
    });
    await expect(section.getByText('Contact name').first()).toBeVisible();
  });
});
