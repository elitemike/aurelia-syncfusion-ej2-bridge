import { test, expect } from './fixtures';
import { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('blockEditor'));

const host = (section: Locator) => section.locator('.e-blockeditor');
const block = (section: Locator, id: string) => section.locator(`.e-block[id="${id}"]`);
const blockContent = (section: Locator, id: string) => block(section, id).locator('.e-block-content').first();
/** Read a (nested) property from the Syncfusion instance behind an editor. */
const prop = (section: Locator, path: string) =>
  host(section).evaluate((e: any, p) => {
    let v = e.ej2_instances[0];
    for (const k of p.split('.')) { v = v[k]; }
    // complex properties hold a back reference to the widget, return plain data only
    const plain = (x: any): any => {
      if (x && typeof x === 'object' && x.properties && typeof x.properties === 'object' && !Array.isArray(x)) { x = x.properties; }
      return JSON.parse(JSON.stringify(x, (k, val) => (k === 'parentObj' || k === 'controlParent' ? undefined
        : (val && typeof val === 'object' && !Array.isArray(val) && val.properties && typeof val.properties === 'object' ? val.properties : val))));
    };
    return plain(v);
  }, path);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.describe('default', () => {
  test('renders the bound blocks', async ({ app }) => {
    const section = app.section('be-default');
    await expect(section.locator('.e-block')).toHaveCount(4);
    await expect(block(section, 'b-title')).toHaveAttribute('data-block-type', 'Heading');
    await expect(block(section, 'b-title').locator('h1')).toHaveText('Block Editor title');
    await expect(blockContent(section, 'b-intro')).toHaveText('Paragraph block content');
    await expect(block(section, 'b-todo')).toHaveAttribute('data-block-type', 'Checklist');
    await expect(block(section, 'b-bullet')).toHaveAttribute('data-block-type', 'BulletList');
    await expect(host(section)).toHaveCSS('height', '320px');
    await expect(section.getByTestId('be-ev-created')).toHaveText('1');
    expect(await prop(section, 'blocks')).toHaveLength(4);
  });

  test('typing raises blockChanged and selectionChanged, focus and blur are raised', async ({ app }) => {
    const section = app.section('be-default');
    await expect(section.getByTestId('be-ev-focus')).toHaveText('0');
    await blockContent(section, 'b-intro').click();
    await expect(section.getByTestId('be-ev-focus')).not.toHaveText('0');
    await blockContent(section, 'b-intro').dblclick({ position: { x: 20, y: 5 } });
    await expect(section.getByTestId('be-ev-selectionChanged')).not.toHaveText('0');
    await app.page.keyboard.press('End');
    await app.page.keyboard.type('!!');
    await expect(blockContent(section, 'b-intro')).toHaveText('Paragraph block content!!');
    await expect(section.getByTestId('be-ev-blockChanged')).not.toHaveText('0');
    await expect(section.getByTestId('be-ev-blockChanged-action')).not.toHaveText('');
    await section.getByTestId('be-outside').click();
    await expect(section.getByTestId('be-ev-blur')).not.toHaveText('0');
  });

  test('blocks follow the view-model', async ({ app }) => {
    const section = app.section('be-default');
    await section.getByTestId('be-replace').click();
    await expect(section.locator('.e-block')).toHaveCount(2);
    await expect(block(section, 'r-1').locator('h2')).toHaveText('Replaced heading');
    await expect(blockContent(section, 'r-2')).toHaveText('Replaced paragraph');
  });
});

test.describe('size, state and editing options', () => {
  test('size, css class and editing options reach the widget', async ({ app }) => {
    const section = app.section('be-state');
    await expect(host(section)).toHaveCSS('height', '260px');
    await expect(host(section)).toHaveClass(/be-first/);
    expect(await prop(section, 'undoRedoStack')).toBe(25);
    expect(await prop(section, 'keyConfig')).toEqual({ bold: 'ctrl+shift+b' });
    expect(await prop(section, 'enableHtmlEncode')).toBe(true);
    expect(await prop(section, 'enableHtmlSanitizer')).toBe(true);
    expect(await prop(section, 'enableDragAndDrop')).toBe(true);
    await expect(section.locator('.e-block')).toHaveCount(3);
  });

  test('width, height and cssClass follow the view-model', async ({ app }) => {
    const section = app.section('be-state');
    await section.getByTestId('be-resize').click();
    await expect(host(section)).toHaveCSS('width', '420px');
    await expect(host(section)).toHaveCSS('height', '200px');
    await expect(host(section)).toHaveClass(/be-second/);
    await expect(host(section)).not.toHaveClass(/be-first/);
  });

  test('readOnly blocks editing and follows the view-model', async ({ app }) => {
    const section = app.section('be-state');
    await expect(blockContent(section, 's-1')).toHaveAttribute('contenteditable', 'true');
    await section.getByTestId('be-toggle-readonly').click();
    await expect.poll(() => prop(section, 'readOnly')).toBe(true);
    await expect(blockContent(section, 's-1')).toHaveAttribute('contenteditable', 'false');
    await section.getByTestId('be-toggle-readonly').click();
    await expect(blockContent(section, 's-1')).toHaveAttribute('contenteditable', 'true');
  });

  test('the key configuration changes the bold shortcut', async ({ app }) => {
    const section = app.section('be-state');
    await blockContent(section, 's-1').dblclick({ position: { x: 20, y: 5 } });
    await app.page.keyboard.press('Control+Shift+B');
    await expect(blockContent(section, 's-1').locator('strong, b')).toBeAttached();
  });

  test('dragging a block raises the drag events', async ({ app }) => {
    const section = app.section('be-state');
    const source = block(section, 's-1');
    await source.hover();
    const handle = section.locator('.e-block-drag-icon');
    const box = await handle.boundingBox();
    const target = await block(section, 's-3').boundingBox();
    await app.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await app.page.mouse.down();
    await app.page.mouse.move(box.x + 10, box.y + 30, { steps: 5 });
    await app.page.mouse.move(target.x + 40, target.y + target.height - 4, { steps: 10 });
    await app.page.mouse.up();
    await expect(section.getByTestId('be-ev-blockDragStart')).not.toHaveText('0');
    await expect(section.getByTestId('be-ev-blockDragging')).not.toHaveText('0');
    await expect(section.getByTestId('be-ev-blockDropped')).not.toHaveText('0');
  });
});

test.describe('menus, labels and colors', () => {
  test('the slash command menu lists the configured commands', async ({ app }) => {
    const section = app.section('be-menus');
    const cmd = await prop(section, 'commandMenuSettings');
    expect(cmd.popupWidth).toBe('260px');
    expect(cmd.popupHeight).toBe('220px');
    expect(cmd.commands).toHaveLength(3);
    await blockContent(section, 'm-1').click();
    await app.page.keyboard.press('End');
    await app.page.keyboard.type(' /');
    const menu = app.page.locator('.e-blockeditor-command-menu.e-popup-open');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText('Text');
    await expect(menu).toContainText('Big heading');
    await expect(menu).toContainText('Quote it');
    await expect(menu).not.toContainText('Checklist');
    await menu.getByText('Quote it').click();
    await expect(section.locator('.e-block[data-block-type="Quote"]')).toBeAttached();
  });

  test('the inline toolbar appears for a selection with the configured items', async ({ app }) => {
    const section = app.section('be-menus');
    const inline = await prop(section, 'inlineToolbarSettings');
    expect(inline.enable).toBe(true);
    expect(inline.popupWidth).toBe('320px');
    expect(inline.items).toEqual(['Bold', 'Italic', 'Underline', '|', 'Color']);
    await blockContent(section, 'm-1').dblclick({ position: { x: 20, y: 5 } });
    const toolbar = host(section).locator('.e-blockeditor-inline-toolbar-popup.e-popup-open');
    await expect(toolbar).toBeVisible();
    await expect(toolbar.locator('[data-command="Bold"]')).toBeVisible();
    await expect(toolbar.locator('[data-command="Underline"]')).toBeVisible();
    await expect(toolbar.locator('[data-command="Strikethrough"]')).toHaveCount(0);
    await toolbar.locator('[data-command="Bold"] button').click();
    await expect(blockContent(section, 'm-1').locator('strong, b')).toBeAttached();
  });

  test('labelSettings open the label menu with the trigger character', async ({ app }) => {
    const section = app.section('be-menus');
    const labels = await prop(section, 'labelSettings');
    expect(labels.triggerChar).toBe('$');
    expect(labels.items).toHaveLength(2);
    await blockContent(section, 'm-1').click();
    await app.page.keyboard.press('End');
    await app.page.keyboard.type(' $');
    const menu = app.page.locator('.e-blockeditor-label-menu.e-popup-open');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText('Status');
    await expect(menu).toContainText('Todo');
    await expect(menu).toContainText('Done');
    await menu.getByText('Todo').click();
    await expect(blockContent(section, 'm-1').locator('[data-label-id], .e-label-chip, .e-mention-chip').first()).toContainText('Todo');
  });

  test('the context menu shows the custom items', async ({ app }) => {
    const section = app.section('be-menus');
    const ctx = await prop(section, 'contextMenuSettings');
    expect(ctx.enable).toBe(true);
    expect(ctx.showItemOnClick).toBe(false);
    expect(ctx.items).toHaveLength(1);
    expect(ctx.table).toEqual(['Insert', 'Delete']);
    expect(ctx.link).toEqual(['Edit', 'Open']);
    await blockContent(section, 'm-1').click({ button: 'right' });
    await expect(app.page.locator('.e-blockeditor-contextmenu li', { hasText: 'Custom entry' }).first()).toBeVisible();
  });

  test('the block action menu opens from the drag handle', async ({ app }) => {
    const section = app.section('be-menus');
    const actions = await prop(section, 'blockActionMenuSettings');
    expect(actions.enable).toBe(true);
    expect(actions.enableTooltip).toBe(true);
    expect(actions.popupWidth).toBe('200px');
    expect(actions.popupHeight).toBe('200px');
    expect(actions.items).toHaveLength(2);
    await block(section, 'm-1').hover();
    await section.locator('.e-block-drag-icon').click();
    const popup = host(section).locator('.e-blockeditor-blockaction-popup.e-popup-open');
    await expect(popup).toBeVisible();
    await expect(popup).toContainText('Remove block');
    await expect(popup).toContainText('Copy block');
  });

  test('transform, color and code block settings reach the widget', async ({ app }) => {
    const section = app.section('be-menus');
    const transform = await prop(section, 'transformSettings');
    expect(transform.items).toEqual(['Paragraph', 'Heading1', 'Quote']);
    expect(transform.popupWidth).toBe('200px');
    expect(transform.popupHeight).toBe('180px');
    const font = await prop(section, 'fontColorSettings');
    expect(font.default).toBe('#ff0000');
    expect(font.columns).toBe(5);
    expect(font.modeSwitcher).toBe(false);
    const bg = await prop(section, 'backgroundColorSettings');
    expect(bg.default).toBe('#ffff00');
    expect(bg.columns).toBe(6);
    const code = await prop(section, 'codeBlockSettings');
    expect(code.defaultLanguage).toBe('javascript');
    expect(code.languages).toHaveLength(2);
    await expect(block(section, 'm-2')).toHaveAttribute('data-block-type', 'Code');
    await expect(block(section, 'm-2')).toContainText('const answer = 42;');
  });
});

test('users, currentUserId and collaborationSettings reach the widget', async ({ app }) => {
  const section = app.section('be-users');
  expect(await prop(section, 'users')).toHaveLength(2);
  expect(await prop(section, 'currentUserId')).toBe('u2');
  const collab = await prop(section, 'collaborationSettings');
  expect(collab.enableAwareness).toBe(true);
});

test.describe('paste cleanup', () => {
  test('pasting html is cleaned up', async ({ app }) => {
    const section = app.section('be-paste');
    const settings = await prop(section, 'pasteCleanupSettings');
    expect(settings.keepFormat).toBe(true);
    expect(settings.plainText).toBe(false);
    expect(settings.deniedTags).toEqual(['script']);
    expect(settings.allowedStyles).toEqual(['color']);
    await blockContent(section, 'p-1').click();
    await app.page.keyboard.press('End');
    await blockContent(section, 'p-1').evaluate((el: HTMLElement) => {
      const data = new DataTransfer();
      data.setData('text/html', '<p>pasted <b>bold</b><script>1</script></p>');
      data.setData('text/plain', 'pasted bold');
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    });
    await expect(host(section)).toContainText('pasted');
    await expect(host(section).locator('script')).toHaveCount(0);
    // the widget declares beforePasteCleanup and afterPasteCleanup but 35.1.40 never raises them
    await expect(section.getByTestId('be-ev-beforePasteCleanup')).toHaveText('0');
    await expect(section.getByTestId('be-ev-afterPasteCleanup')).toHaveText('0');
  });
});

test.describe('image block and file upload', () => {
  test('imageBlockSettings reach the widget', async ({ app }) => {
    const section = app.section('be-image');
    const image = await prop(section, 'imageBlockSettings');
    expect(image.saveUrl).toBe('/api/blockeditor/upload');
    expect(image.path).toBe('/uploads/');
    expect(image.maxFileSize).toBe(500000);
    expect(image.saveFormat).toBe('Blob');
    expect(image.allowedTypes).toEqual(['.png', '.jpg']);
    expect(image.width).toBe(200);
    expect(image.enableResize).toBe(true);
    expect(image.minWidth).toBe(50);
    expect(image.maxWidth).toBe(400);
    expect(image.minHeight).toBe(20);
    expect(image.maxHeight).toBe(400);
  });

  async function insertImageBlock(page: Page, section: Locator) {
    await blockContent(section, 'i-1').click();
    await page.keyboard.press('End');
    await page.keyboard.type(' /');
    const menu = page.locator('.e-blockeditor-command-menu.e-popup-open');
    await expect(menu).toBeVisible();
    await menu.getByText('Image', { exact: true }).click();
    await expect(section.locator('.e-block[data-block-type="Image"]')).toBeAttached();
  }

  test('uploading an image raises the upload events', async ({ app }) => {
    await app.page.route('**/api/blockeditor/upload', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await app.page.route('**/uploads/**', route => route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
    const section = app.section('be-image');
    await insertImageBlock(app.page, section);
    await section.locator('input[type="file"]').first().setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('be-ev-beforeFileUpload')).toHaveText('1');
    await expect(section.getByTestId('be-ev-fileUploading')).toHaveText('1');
    await expect(section.getByTestId('be-ev-fileUploadSuccess')).toHaveText('1');
    await expect(section.getByTestId('be-ev-fileUploadFailed')).toHaveText('0');
  });

  test('a rejected upload raises fileUploadFailed', async ({ app }) => {
    await app.page.route('**/api/blockeditor/upload', route => route.fulfill({ status: 500, body: 'no' }));
    const section = app.section('be-image');
    await insertImageBlock(app.page, section);
    await section.locator('input[type="file"]').first().setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('be-ev-fileUploadFailed')).not.toHaveText('0');
    await expect(section.getByTestId('be-ev-fileUploadSuccess')).toHaveText('0');
    // the browser reports the 500 of the stubbed endpoint, that is the point of this test
    app.errors.length = 0;
  });
});
