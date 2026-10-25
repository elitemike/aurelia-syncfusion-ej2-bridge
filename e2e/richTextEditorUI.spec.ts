import { test, expect } from './fixtures';
import { Locator, Page } from '@playwright/test';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('richTextEditorUI'));

const content = (section: Locator) => section.locator('.ProseMirror');
/** Read a (nested) property from the Syncfusion instance behind an editor. */
const prop = (section: Locator, path: string) =>
  section.locator('.e-richtexteditor-ui').evaluate((e: any, p) => {
    let v = e.ej2_instances[0];
    for (const k of p.split('.')) { v = v[k]; }
    return v && typeof v === 'object' && !Array.isArray(v) && v.parentObj ? undefined : v;
  }, path);
const toolbarButton = (section: Locator, id: string) => section.locator(`[id$="_toolbar_${id}"]`);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function selectWord(section: Locator, page: Page, selector = 'p', x = 20) {
  await content(section).locator(selector).first().dblclick({ position: { x, y: 8 } });
}

test.describe('default', () => {
  test('renders the toolbar and the html value', async ({ app }) => {
    const section = app.section('rteui-default');
    await expect(section.locator('.e-toolbar').first()).toBeVisible();
    await expect(content(section)).toContainText('Hello Rich Text Editor UI');
    await expect(content(section).locator('strong')).toHaveText('Rich Text Editor UI');
    await expect(section.getByTestId('rteui-value-out')).toHaveText('<p>Hello <b>Rich Text Editor UI</b></p>');
    expect(await prop(section, 'valueFormat')).toBe('html');
    expect(await prop(section, 'placeholder')).toBe('Write something');
    expect(await prop(section, 'saveInterval')).toBe(100);
    await expect(section.locator('.e-richtexteditor-ui')).toHaveCSS('height', '260px');
    // every editor gets its own editable id
    await expect(content(section)).toHaveAttribute('id', /^rte-ui-\d+_edit-view$/);
  });

  test('two-way value: typing updates the view-model and raises change', async ({ app }) => {
    const section = app.section('rteui-default');
    await content(section).click();
    await app.page.keyboard.press('Control+End');
    await app.page.keyboard.type(' typed');
    await expect(section.getByTestId('rteui-value-out')).toContainText('typed');
    await expect(section.getByTestId('rteui-ev-change')).not.toHaveText('0');
    expect(await prop(section, 'value')).toContain('typed');
  });

  test('two-way value: view-model to editor', async ({ app }) => {
    const section = app.section('rteui-default');
    await section.getByTestId('rteui-set').click();
    await expect(content(section)).toContainText('Set from the view-model');
    await expect(content(section).locator('strong')).toHaveText('view-model');
  });

  test('focus and blur events', async ({ app }) => {
    const section = app.section('rteui-default');
    await expect(section.getByTestId('rteui-ev-focus')).toHaveText('0');
    await content(section).click();
    await expect(section.getByTestId('rteui-ev-focus')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-blur')).toHaveText('0');
    await section.getByTestId('rteui-focus-out').click();
    await expect(section.getByTestId('rteui-ev-blur')).toHaveText('1');
  });

  test('toolbar commands raise actionBegin and actionComplete', async ({ app }) => {
    const section = app.section('rteui-default');
    await selectWord(section, app.page, 'p', 20);
    await toolbarButton(section, 'Italic').click();
    await expect(section.getByTestId('rteui-ev-actionBegin')).not.toHaveText('0');
    await expect(section.getByTestId('rteui-ev-actionComplete')).not.toHaveText('0');
    await expect(section.getByTestId('rteui-ev-actionBegin-name')).not.toHaveText('');
    await expect(content(section).locator('em')).toHaveText('Hello');
  });
});

test.describe('toolbar and formatting', () => {
  test('toolbarSettings items, type and position', async ({ app }) => {
    const section = app.section('rteui-toolbar');
    for (const id of ['Undo', 'Redo', 'Bold', 'Italic', 'FontName', 'FontSize', 'Formats', 'FontColor', 'BackgroundColor']) {
      await expect(toolbarButton(section, id).first()).toBeAttached();
    }
    await expect(toolbarButton(section, 'Underline')).toHaveCount(0);
    expect(await prop(section, 'toolbarSettings.type')).toBe('MultiRow');
    expect(await prop(section, 'toolbarSettings.position')).toBe('Top');
    expect(await prop(section, 'toolbarSettings.enableFloating')).toBe(false);
    expect(await prop(section, 'toolbarSettings.items')).toHaveLength(15);
  });

  test('fontSize, fontFamily, format, colors and list settings reach the widget', async ({ app }) => {
    const section = app.section('rteui-toolbar');
    expect(await prop(section, 'fontSize.width')).toBe('80px');
    expect(await prop(section, 'fontSize.items')).toHaveLength(3);
    expect(await prop(section, 'fontFamily.width')).toBe('140px');
    expect(await prop(section, 'fontFamily.items')).toHaveLength(2);
    expect(await prop(section, 'format.width')).toBe('110px');
    expect(await prop(section, 'format.items')).toEqual(['Paragraph', 'Heading 1', 'Heading 2']);
    expect(await prop(section, 'fontColor.default')).toBe('#ff0000');
    expect(await prop(section, 'fontColor.columns')).toBe(5);
    expect(await prop(section, 'fontColor.modeSwitcher')).toBe(false);
    expect(await prop(section, 'backgroundColor.default')).toBe('#ffff00');
    expect(await prop(section, 'backgroundColor.mode')).toBe('Picker');
    expect(await prop(section, 'backgroundColor.showRecentColors')).toBe(true);
    expect(await prop(section, 'listSettings.checklistType')).toBe('Square');
    expect(await prop(section, 'listSettings.numberFormatListItems')).toEqual(['decimal', 'lower-roman']);
    expect(await prop(section, 'listSettings.bulletFormatListItems')).toEqual(['disc', 'square']);
  });

  test('replacing the dropdown settings updates the widget properties', async ({ app }) => {
    // 35.1.40 renders the dropdown items of the toolbar from its built-in defaults, the settings are only stored
    const section = app.section('rteui-toolbar');
    await section.getByTestId('rteui-apply-dropdowns').click();
    await expect.poll(() => prop(section, 'fontSize.width')).toBe('90px');
    expect(await prop(section, 'fontSize.items')).toEqual([{ text: '20', value: '20px' }, { text: '40', value: '40px' }]);
    expect(await prop(section, 'fontFamily.width')).toBe('150px');
    expect(await prop(section, 'fontFamily.items')).toEqual([{ text: 'Verdana', value: 'Verdana,sans-serif' }]);
    expect(await prop(section, 'format.width')).toBe('120px');
    expect(await prop(section, 'format.items')).toEqual(['Paragraph', 'Heading 3']);
  });

  test('the format dropdown applies a heading', async ({ app }) => {
    const section = app.section('rteui-toolbar');
    await content(section).click();
    const popup = await openPopup(app.page, toolbarButton(section, 'Formats'), '.e-dropdown-popup.e-popup-open');
    await popup.locator('li', { hasText: /^Heading 1$/ }).first().click();
    await expect(content(section).locator('h1')).toHaveText('Toolbar customization');
  });
});

test.describe('quick toolbars, links, tables and keyboard', () => {
  test('quick toolbar settings: text quick toolbar on selection', async ({ app }) => {
    const section = app.section('rteui-quick');
    expect(await prop(section, 'quickToolbarSettings.enable')).toBe(true);
    expect(await prop(section, 'quickToolbarSettings.text')).toEqual(['Bold', 'Italic', 'Underline']);
    expect(await prop(section, 'quickToolbarSettings.enableAppendToBody')).toBe(false);
    await selectWord(section, app.page, 'p', 20);
    const quick = app.page.locator('.e-rte-ui-quick-popup.e-popup-open .e-text-quicktoolbar');
    await expect(quick).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title^="Bold"]')).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title^="Italic"]')).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title^="Underline"]')).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title^="Strikethrough"]')).toHaveCount(0);
    await quick.locator('.e-toolbar-item[title^="Underline"] button').click();
    await expect(content(section).locator('u')).toContainText('Select');
  });

  test('quick toolbar settings: link quick toolbar', async ({ app }) => {
    const section = app.section('rteui-quick');
    expect(await prop(section, 'quickToolbarSettings.link')).toEqual(['Open', 'Edit', 'Remove']);
    expect(await prop(section, 'quickToolbarSettings.image')).toEqual(['Replace', 'Remove']);
    expect(await prop(section, 'quickToolbarSettings.table')).toEqual(['Row', 'Column', 'Remove']);
    await content(section).locator('a').click();
    const quick = app.page.locator('.e-rte-ui-quick-popup.e-popup-open .e-link-quicktoolbar');
    await expect(quick).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title="Open Link"]')).toBeVisible();
  });

  test('quick toolbar settings: image quick toolbar', async ({ app }) => {
    const section = app.section('rteui-quick');
    await content(section).locator('img.e-img-core-element').click();
    const quick = app.page.locator('.e-rte-ui-quick-popup.e-popup-open .e-image-quicktoolbar');
    await expect(quick).toBeVisible();
    await expect(quick.locator('.e-toolbar-item[title="Replace"]')).toBeVisible();
  });

  test('table content renders and tableSettings are applied', async ({ app }) => {
    const section = app.section('rteui-quick');
    await expect(content(section).locator('table td')).toHaveCount(4);
    expect(await prop(section, 'tableSettings.resize')).toBe(false);
  });

  test('linkSettings and interactionSettings reach the widget', async ({ app }) => {
    const section = app.section('rteui-quick');
    expect(await prop(section, 'linkSettings.linkOnPaste')).toBe(true);
    expect(await prop(section, 'linkSettings.defaultTarget')).toBe('_blank');
    expect(await prop(section, 'linkSettings.autoPrependProtocol')).toBe(true);
    expect(await prop(section, 'linkSettings.defaultProtocol')).toBe('https://');
    expect(await prop(section, 'linkSettings.allowedProtocols')).toEqual(['http://', 'https://', 'mailto:']);
    expect(await prop(section, 'interactionSettings.enableAutoFormat')).toBe(true);
    expect(await prop(section, 'interactionSettings.enableTabKeyIndent')).toBe(true);
  });

  test('the link toolbar button opens the link dialog', async ({ app }) => {
    const section = app.section('rteui-quick');
    await content(section).click();
    await toolbarButton(section, 'Link').click();
    const dialog = app.page.locator('.e-rte-ui-link-dialog.e-popup-open');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Insert Link');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
  });

  test('keyBindings override the shortcut', async ({ app }) => {
    const section = app.section('rteui-quick');
    expect(await prop(section, 'keyBindings.bold')).toBe('ctrl+shift+b');
    await selectWord(section, app.page, 'p', 20);
    await app.page.keyboard.press('Control+Shift+B');
    await expect(content(section).locator('strong')).toContainText('Select');
  });
});

test('slashCommandSettings opens the command popup and applies an item', async ({ app }) => {
  const section = app.section('rteui-slash');
  expect(await prop(section, 'slashCommandSettings.enable')).toBe(true);
  expect(await prop(section, 'slashCommandSettings.popupWidth')).toBe(280);
  expect(await prop(section, 'slashCommandSettings.popupHeight')).toBe(240);
  expect(await prop(section, 'slashCommandSettings.items')).toHaveLength(5);
  await content(section).click();
  await app.page.keyboard.type('/');
  const popup = app.page.locator('.e-slash-command.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('Heading 1');
  await expect(popup).toContainText('Bulleted List');
  await expect(popup).not.toContainText('Checklist');
  await popup.getByText('Heading 1', { exact: true }).click();
  await app.page.keyboard.type('Title');
  await expect(content(section).locator('h1')).toHaveText('Title');
});

test.describe('json value format', () => {
  test('value is an editor document and follows typing', async ({ app }) => {
    const section = app.section('rteui-json');
    expect(await prop(section, 'valueFormat')).toBe('json');
    await expect(content(section)).toContainText('JSON content');
    await expect(section.getByTestId('rteui-json-type')).toHaveText('object');
    await content(section).click();
    await app.page.keyboard.press('Control+End');
    await app.page.keyboard.type(' more');
    await expect(section.getByTestId('rteui-json-text')).toContainText('JSON content more');
    await expect(section.getByTestId('rteui-json-type')).toHaveText('object');
  });

  test('a document set from the view-model is rendered', async ({ app }) => {
    const section = app.section('rteui-json');
    await section.getByTestId('rteui-json-set').click();
    await expect(content(section).locator('h2')).toHaveText('Set by view-model');
  });
});

test.describe('state, size, history and attributes', () => {
  test('size, css class, html attributes and history settings', async ({ app }) => {
    const section = app.section('rteui-state');
    const host = section.locator('.e-richtexteditor-ui');
    await expect(host).toHaveCSS('height', '240px');
    await expect(host).toHaveClass(/rteui-first/);
    await expect(host).toHaveAttribute('data-rteui', 'state');
    await expect(host).toHaveAttribute('aria-label', 'State editor');
    expect(await prop(section, 'saveInterval')).toBe(150);
    expect(await prop(section, 'undoRedoSteps')).toBe(5);
    expect(await prop(section, 'undoRedoTimer')).toBe(200);
  });

  test('width, height and cssClass follow the view-model', async ({ app }) => {
    const section = app.section('rteui-state');
    const host = section.locator('.e-richtexteditor-ui');
    await section.getByTestId('rteui-resize').click();
    await expect(host).toHaveCSS('width', '420px');
    await expect(host).toHaveCSS('height', '180px');
    await expect(host).toHaveClass(/rteui-second/);
    await expect(host).not.toHaveClass(/rteui-first/);
  });

  test('enable and readonly toggle editing', async ({ app }) => {
    const section = app.section('rteui-state');
    await expect(content(section)).toHaveAttribute('contenteditable', 'true');
    await section.getByTestId('rteui-toggle-readonly').click();
    await expect(content(section)).toHaveAttribute('contenteditable', 'false');
    expect(await prop(section, 'readonly')).toBe(true);
    await section.getByTestId('rteui-toggle-readonly').click();
    await expect(content(section)).toHaveAttribute('contenteditable', 'true');
    await section.getByTestId('rteui-toggle-enable').click();
    await expect.poll(() => prop(section, 'enable')).toBe(false);
    await expect(section.locator('.e-richtexteditor-ui')).toHaveClass(/e-disabled/);
    await expect(section.locator('.e-richtexteditor-ui')).toHaveAttribute('aria-disabled', 'true');
    await section.getByTestId('rteui-toggle-enable').click();
    await expect.poll(() => prop(section, 'enable')).toBe(true);
    await expect(section.locator('.e-richtexteditor-ui')).not.toHaveClass(/e-disabled/);
  });
});

test.describe('image settings and file events', () => {
  test('imageSettings reach the widget', async ({ app }) => {
    const section = app.section('rteui-upload');
    expect(await prop(section, 'imageSettings.allowedTypes')).toEqual(['.png', '.jpg']);
    expect(await prop(section, 'imageSettings.maxFileSize')).toBe(500000);
    expect(await prop(section, 'imageSettings.uploadUrl')).toBe('/api/rteui/upload');
    expect(await prop(section, 'imageSettings.removeUrl')).toBe('/api/rteui/remove');
    expect(await prop(section, 'imageSettings.imageUrl')).toBe('/images/');
    expect(await prop(section, 'imageSettings.saveFormat')).toBe('Blob');
    expect(await prop(section, 'imageSettings.display')).toBe('inline');
    expect(await prop(section, 'imageSettings.dimension.width')).toBe(200);
    expect(await prop(section, 'imageSettings.dimension.maxWidth')).toBe(400);
    expect(await prop(section, 'imageSettings.resize')).toBe(true);
  });

  test('uploading from the image dialog raises the upload events and inserts the image', async ({ app }) => {
    const hits: string[] = [];
    await app.page.route('**/api/rteui/upload', route => {
      hits.push(route.request().method());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await app.page.route('**/images/dot.png', route => route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
    const section = app.section('rteui-upload');
    await content(section).click();
    await toolbarButton(section, 'Image').click();
    const dialog = app.page.locator('.e-rte-ui-image-dialog, .e-dialog.e-popup-open').filter({ hasText: 'Insert Image' });
    await expect(dialog).toBeVisible();
    await app.page.locator('input.e-rte-ui-image-file-input').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('rteui-ev-fileSelected')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-beforeFileUpload')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-fileUploading')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-fileUploadSuccess')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-fileUploadFailed')).toHaveText('0');
    expect(hits).toEqual(['POST']);
    const insert = dialog.getByRole('button', { name: 'Insert' });
    await expect(insert).toBeEnabled();
    await insert.click();
    await expect(content(section).locator('img[src="/images/dot.png"]')).toBeAttached();
  });

  test('a rejected upload raises fileUploadFailed', async ({ app }) => {
    await app.page.route('**/api/rteui/upload', route => route.fulfill({ status: 500, body: 'no' }));
    const section = app.section('rteui-upload');
    await content(section).click();
    await toolbarButton(section, 'Image').click();
    await app.page.locator('input.e-rte-ui-image-file-input').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('rteui-ev-fileUploadFailed')).not.toHaveText('0');
    await expect(section.getByTestId('rteui-ev-fileUploadSuccess')).toHaveText('0');
    // the browser reports the 500 of the stubbed endpoint, that is the point of this test
    app.errors.length = 0;
  });

  test('uploadFile with a disallowed type raises fileUploadFailed', async ({ app }) => {
    const section = app.section('rteui-upload');
    await section.locator('.e-richtexteditor-ui').evaluate((e: any) => {
      e.ej2_instances[0].uploadFile('.gif', new Blob(['x'], { type: 'image/gif' }));
    });
    await expect(section.getByTestId('rteui-ev-fileUploadFailed')).toHaveText('1');
    await expect(section.getByTestId('rteui-ev-beforeFileUpload')).toHaveText('0');
  });

  test('removing the uploaded file raises fileRemoving', async ({ app }) => {
    await app.page.route('**/api/rteui/upload', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await app.page.route('**/api/rteui/remove', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    const section = app.section('rteui-upload');
    await content(section).click();
    await toolbarButton(section, 'Image').click();
    await app.page.locator('input.e-rte-ui-image-file-input').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('rteui-ev-fileUploadSuccess')).toHaveText('1');
    await app.page.locator('.e-rte-dialog-upload .e-file-remove-btn, .e-rte-dialog-upload .e-file-delete-btn').first().click();
    await expect(section.getByTestId('rteui-ev-fileRemoving')).not.toHaveText('0');
  });

  test('beforeFileDrop is bound; the widget declares it but does not raise it yet', async ({ app }) => {
    const section = app.section('rteui-upload');
    await content(section).dispatchEvent('drop', { dataTransfer: await app.page.evaluateHandle(() => new DataTransfer()) });
    await expect(section.getByTestId('rteui-ev-beforeFileDrop')).toHaveText('0');
  });
});

test('beforeDialogOpen and beforeDialogClose are bound; the widget declares them but does not raise them yet', async ({ app }) => {
  const section = app.section('rteui-quick');
  await content(section).click();
  await toolbarButton(section, 'Link').click();
  const dialog = app.page.locator('.e-rte-ui-link-dialog.e-popup-open');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(section.getByTestId('rteui-ev-beforeDialogOpen')).toHaveText('0');
  await expect(section.getByTestId('rteui-ev-beforeDialogClose')).toHaveText('0');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('rteui-life');
  await expect(content(section)).toBeVisible();
  await expect(section.getByTestId('rteui-ev-created')).toHaveText('1');
  await expect(section.getByTestId('rteui-ev-destroyed')).toHaveText('0');
  await section.getByTestId('rteui-toggle').click();
  await expect(section.locator('.e-richtexteditor-ui')).toHaveCount(0);
  await expect(section.getByTestId('rteui-ev-destroyed')).toHaveText('1');
  await section.getByTestId('rteui-toggle').click();
  await expect(section.getByTestId('rteui-ev-created')).toHaveText('2');
});
