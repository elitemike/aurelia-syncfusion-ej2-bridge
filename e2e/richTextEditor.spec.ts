import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('richTextEditor'));

test('renders toolbar and content', async ({ app }) => {
  const section = app.section('rte-value');
  await expect(section.locator('.e-toolbar')).toBeVisible();
  await expect(section.locator('.e-rte-content [contenteditable]').first()).toContainText('Some content');
  await expect(section.locator('.e-toolbar [title*="Bold"]').first()).toBeVisible();
});

test('two-way value: view to model on blur', async ({ app, page }) => {
  const section = app.section('rte-value');
  const editable = section.locator('.e-rte-content [contenteditable]').first();
  await editable.click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type(' typed');
  await page.locator('main h2').click();
  await expect(section.getByTestId('rte-value-out')).toContainText('typed');
  await expect(section.getByTestId('rte-change-count')).toHaveText('1');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('rte-value');
  await section.getByTestId('rte-set').click();
  await expect(section.locator('.e-rte-content [contenteditable]').first()).toContainText('Set from the view-model');
});

test('toolbar bold formatting is written to the model', async ({ app, page }) => {
  const section = app.section('rte-value');
  const editable = section.locator('.e-rte-content [contenteditable]').first();
  await editable.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Control+B');
  await page.locator('main h2').click();
  await expect(section.getByTestId('rte-value-out')).toContainText(/<(strong|b)>/);
});

test('widget api is reachable through view-model.ref', async ({ app }) => {
  const section = app.section('rte-value');
  await section.getByTestId('rte-xhtml').click();
  await expect(section.getByTestId('rte-xhtml-out')).toContainText('Some content');
});

test('readonly editor is not editable', async ({ app }) => {
  const editable = app.section('rte-readonly').locator('.e-rte-content [contenteditable]').first();
  await expect(editable).toHaveAttribute('contenteditable', 'false');
});

test('character count', async ({ app }) => {
  await expect(app.section('rte-count').locator('.e-rte-character-count')).toContainText('5 / 20');
});

/* ------------------------------------------------------------------ helpers */

/** Evaluate an expression against the Syncfusion widget behind an ej2-rich-text-editor. */
const widgetValue = (page: Page, testId: string, expr: string) => page.evaluate(([id, e]) => {
  const el: any = document.querySelector(`[data-testid="${id}"]`);
  const w = el.au['ej2-rich-text-editor'].viewModel.widget;
  return new Function('w', `return ${e}`)(w);
}, [testId, expr]);

/** Assert that an event name was logged at least n times in a "name:count name:count" log. */
const logHas = (loc: Locator, name: string, n = 1) =>
  expect(loc).toHaveText(new RegExp(`(^|\\s)${name}:([${n}-9]|\\d{2,})(\\s|$)`));

const editable = (section: Locator) => section.locator('.e-rte-content [contenteditable]').first();
const blur = (page: Page) => page.locator('main h2').click();
/** Toolbar buttons carry the item name at the end of their id. */
const tb = (section: Locator, name: string) => section.locator(`[id$="_toolbar_${name}"]`).first();
const popupItem = (page: Page, text: string) => page.locator('.e-dropdown-popup.e-popup-open .e-item', { hasText: text }).first();

async function typeAtEnd(page: Page, section: Locator, text: string) {
  await editable(section).click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type(text);
}

/* ------------------------------------------------------------------ char count */

test('maxLength stops typing at the limit', async ({ app, page }) => {
  const section = app.section('rte-count');
  await typeAtEnd(page, section, ' and a lot more text than allowed');
  await expect(section.locator('.e-rte-character-count')).toContainText('20 / 20');
});

/* ------------------------------------------------------------------ look */

test('look: cssClass, htmlAttributes, size and placeholder', async ({ app, page }) => {
  const section = app.section('rte-look');
  const root = section.locator('.e-richtexteditor');
  await expect(root).toHaveClass(/my-rte/);
  await expect(root).toHaveAttribute('data-x', 'y');
  await expect.poll(async () => (await root.boundingBox()).height).toBeCloseTo(320, 0);
  const parentWidth = (await section.getByTestId('rte-look').boundingBox()).width;
  await expect.poll(async () => (await root.boundingBox()).width).toBeCloseTo(parentWidth * 0.8, -1);
  await expect(section.locator('.e-rte-placeholder')).toHaveText('Write something');
  await editable(section).click();
  await page.keyboard.type('x');
  await expect(section.locator('.e-rte-placeholder')).toBeHidden();
});

test('look: showTooltip false and floatingToolbarOffset are applied', async ({ app, page }) => {
  const section = app.section('rte-look');
  expect(await widgetValue(page, 'rte-look', 'w.showTooltip')).toBe(false);
  expect(await widgetValue(page, 'rte-look', 'w.floatingToolbarOffset')).toBe(10);
  await tb(section, 'Formats').hover();
  await expect(page.locator('.e-tooltip-wrap:visible')).toHaveCount(0);
});

test('look: enabled follows the view-model', async ({ app, page }) => {
  const section = app.section('rte-look');
  await expect(section.locator('.e-richtexteditor')).not.toHaveClass(/e-disabled/);
  await section.getByTestId('rte-toggle-enabled').click();
  await expect.poll(() => widgetValue(page, 'rte-look', 'w.enabled')).toBe(false);
  await expect(section.locator('.e-richtexteditor')).toHaveClass(/e-disabled/);
  await section.getByTestId('rte-toggle-enabled').click();
  await expect(section.locator('.e-richtexteditor')).not.toHaveClass(/e-disabled/);
});

test('look: font family, font size and format settings', async ({ app, page }) => {
  const section = app.section('rte-look');
  await expect(tb(section, 'FontName')).toContainText('Demo Font');
  await expect(tb(section, 'FontSize')).toContainText('18pt');
  await expect(tb(section, 'Formats')).toContainText('Heading 2');
  await tb(section, 'FontName').click();
  await expect(popupItem(page, 'Other Font')).toBeVisible();
  await expect(popupItem(page, 'Demo Font')).toBeVisible();
  await page.keyboard.press('Escape');
  await tb(section, 'FontSize').click();
  await expect(popupItem(page, '24pt')).toBeVisible();
  await page.keyboard.press('Escape');
  await tb(section, 'Formats').click();
  await expect(popupItem(page, 'Quote')).toBeVisible();
});

test('look: number, bullet and line height lists', async ({ app, page }) => {
  const section = app.section('rte-look');
  await section.locator('[id$="_toolbar_NumberFormatList_dropdownbtn"]').click();
  await expect(popupItem(page, 'Lower Alpha')).toBeVisible();
  await page.keyboard.press('Escape');
  await section.locator('[id$="_toolbar_BulletFormatList_dropdownbtn"]').click();
  await expect(popupItem(page, 'Square')).toBeVisible();
  await page.keyboard.press('Escape');
  await tb(section, 'LineHeight').click();
  await expect(popupItem(page, 'Double')).toBeVisible();
  await page.keyboard.press('Escape');
  await section.locator('[id$="_toolbar_codeBlock_dropdownbtn"]').click();
  await expect(popupItem(page, 'Demo script')).toBeVisible();
});

test('look: color, table, painter, emoji and enableResize settings reach the widget', async ({ app, page }) => {
  const section = app.section('rte-look');
  expect(await widgetValue(page, 'rte-look', 'w.fontColor.default')).toBe('#ff0000');
  expect(await widgetValue(page, 'rte-look', 'w.backgroundColor.default')).toBe('#ffff00');
  expect(await widgetValue(page, 'rte-look', 'w.tableSettings.width')).toBe('60%');
  expect(await widgetValue(page, 'rte-look', 'w.formatPainterSettings.allowedFormats')).toBe('b;em;font;u');
  expect(await widgetValue(page, 'rte-look', 'w.emojiPickerSettings.iconsSet[0].name')).toBe('Demo');
  expect(await widgetValue(page, 'rte-look', 'w.lineHeight.default')).toBe('1.5');
  expect(await widgetValue(page, 'rte-look', 'w.codeBlockSettings.defaultLanguage')).toBe('plaintext');
  await expect(section.locator('.e-resize-handle')).toBeVisible();
});

test('look: resizing the editor raises resizeStart, resizing and resizeStop', async ({ app, page }) => {
  const section = app.section('rte-look');
  await section.locator('.e-resize-handle').scrollIntoViewIfNeeded();
  const handle = await section.locator('.e-resize-handle').boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(handle.x + 5 + i * 5, handle.y + 5 + i * 10);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r(null))));
  }
  await page.mouse.up();
  const log = section.getByTestId('rte-look-log');
  await logHas(log, 'resizeStart');
  await logHas(log, 'resizing');
  await logHas(log, 'resizeStop');
});

/* ------------------------------------------------------------------ behaviour */

test('behavior: enterKey BR, shiftEnterKey P and the two-way value', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await typeAtEnd(page, section, 'a');
  await page.keyboard.press('Enter');
  await page.keyboard.type('b');
  await page.keyboard.press('Shift+Enter');
  await page.keyboard.type('c');
  await blur(page);
  const out = section.getByTestId('rte-behavior-out');
  // in BR mode Enter does not start a paragraph, Shift+Enter does
  await expect(out).not.toContainText('<p>b</p>');
  await expect(out).toContainText('</p>b<p>c</p>');
});

test('behavior: autoSaveOnIdle and saveInterval update the model without blur', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await typeAtEnd(page, section, 'zzz');
  await expect(section.getByTestId('rte-behavior-out')).toContainText('zzz');
  await logHas(section.getByTestId('rte-behavior-log'), 'change');
  expect(await widgetValue(page, 'rte-behavior', 'w.autoSaveOnIdle')).toBe(true);
  expect(await widgetValue(page, 'rte-behavior', 'w.saveInterval')).toBe(400);
});

test('behavior: enableTabKey keeps the focus and inserts spacing', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await typeAtEnd(page, section, 'x');
  await page.keyboard.press('Tab');
  await page.keyboard.type('y');
  await expect(editable(section)).toBeFocused();
  await blur(page);
  await expect(section.getByTestId('rte-behavior-out')).toContainText('&nbsp;');
});

test('behavior: enableAutoUrl turns typed addresses into links', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await typeAtEnd(page, section, ' https://example.org ');
  await expect(editable(section).locator('a[href="https://example.org"]')).toBeVisible();
});

test('behavior: keyConfig adds a custom shortcut', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await editable(section).click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Control+q');
  await expect(editable(section).locator('strong, b')).toBeVisible();
});

test('behavior: enableMarkdownAutoFormat converts markdown shortcuts', async ({ app, page }) => {
  const section = app.section('rte-behavior');
  await editable(section).click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('# Heading');
  await expect(editable(section).locator('h1')).toHaveText('Heading');
});

test('xhtml: enableXhtml makes getXhtml return valid markup', async ({ page }) => {
  expect(await widgetValue(page, 'rte-value', 'w.enableXhtml')).toBe(true);
  const xhtml = await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="rte-value"]') as any).au['ej2-rich-text-editor'].viewModel.widget;
    w.value = '<p>a<br>b</p>';
    w.dataBind();
    return w.getXhtml();
  });
  expect(xhtml).toContain('<br/>');
});

test('behavior: undo/redo, clipboard cleanup and paste settings reach the widget', async ({ app, page }) => {
  expect(await widgetValue(page, 'rte-behavior', 'w.undoRedoSteps')).toBe(3);
  expect(await widgetValue(page, 'rte-behavior', 'w.undoRedoTimer')).toBe(500);
  expect(await widgetValue(page, 'rte-behavior', 'w.enableClipboardCleanup')).toBe(true);
  expect(await widgetValue(page, 'rte-behavior', 'w.enableMarkdownAutoFormat')).toBe(true);
  expect(await widgetValue(page, 'rte-behavior', 'w.enableTabKey')).toBe(true);
  expect(await widgetValue(page, 'rte-behavior', 'w.enableAutoUrl')).toBe(true);
  expect(await widgetValue(page, 'rte-ev', 'w.pasteCleanupSettings.deniedTags[0]')).toBe('a');
});

test('encode: enableHtmlEncode writes an encoded model value', async ({ app, page }) => {
  const section = app.section('rte-encode');
  await typeAtEnd(page, section, ' c');
  await page.keyboard.press('Shift+Enter');
  await page.keyboard.type('d');
  await blur(page);
  const out = section.getByTestId('rte-encode-out');
  await expect(out).toContainText('&lt;p&gt;');
  await expect(out).toContainText('&lt;br&gt;d&lt;/p&gt;');
  await expect(out).toContainText('&amp;');
});

test('sanitize: scripts and event handlers are removed and beforeSanitizeHtml is raised', async ({ app, page }) => {
  const section = app.section('rte-sanitize');
  await logHas(section.getByTestId('rte-sanitize-log'), 'beforeSanitizeHtml');
  await expect(editable(section)).toContainText('clean');
  expect(await page.evaluate(() => (window as any).__xss)).toBeUndefined();
  await expect(editable(section).locator('img[onerror]')).toHaveCount(0);
});

test('markdown: editorMode and custom formatter', async ({ app, page }) => {
  const section = app.section('rte-markdown');
  const textarea = section.locator('.e-rte-content textarea');
  await expect(textarea).toHaveValue('markdown text');
  await textarea.click();
  await page.keyboard.press('Control+a');
  await tb(section, 'Bold').click();
  await expect(textarea).toHaveValue('__markdown text__');
  await blur(page);
  await expect(section.getByTestId('rte-markdown-out')).toContainText('__markdown text__');
});

test('inline mode: the toolbar appears on selection', async ({ app, page }) => {
  const section = app.section('rte-inline');
  expect(await widgetValue(page, 'rte-inline', 'w.inlineMode.enable')).toBe(true);
  await expect(page.locator('.e-rte-inline-popup:visible, .e-rte-inline-toolbar:visible')).toHaveCount(0);
  await editable(section).dblclick({ position: { x: 20, y: 10 } });
  await expect(page.locator('.e-rte-inline-popup .e-toolbar, .e-rte-quick-popup .e-toolbar').first()).toBeVisible();
});

test('iframe: iframeSettings render the content in a frame and valueTemplate fills it', async ({ app, page }) => {
  const section = app.section('rte-iframe');
  await expect(section.locator('iframe.e-rte-content')).toBeVisible();
  await expect(section.frameLocator('iframe').locator('body')).toContainText('content from the template');
  expect(await widgetValue(page, 'rte-iframe', 'w.iframeSettings.enable')).toBe(true);
});

/* ------------------------------------------------------------------ events */

test('events: created, focus, blur, change, toolbar and action events', async ({ app, page }) => {
  const section = app.section('rte-ev');
  const log = section.getByTestId('rte-ev-log');
  await logHas(log, 'created');
  await typeAtEnd(page, section, ' typed');
  await logHas(log, 'focus');
  await page.keyboard.press('Shift+Home');
  await tb(section, 'Bold').click();
  await logHas(log, 'toolbarClick');
  await logHas(log, 'actionBegin');
  await logHas(log, 'actionComplete');
  await logHas(log, 'updatedToolbarStatus');
  await blur(page);
  await logHas(log, 'blur');
  await logHas(log, 'change');
});

test('events: selectionChanged is raised for a text selection, the deprecated toolbarStatusUpdate stays silent', async ({ app }) => {
  const section = app.section('rte-ev');
  const log = section.getByTestId('rte-ev-log');
  await editable(section).dblclick({ position: { x: 20, y: 10 } });
  await logHas(log, 'selectionChanged');
  await expect(log).not.toContainText('toolbarStatusUpdate');
});

test('events: the link quick toolbar raises beforeQuickToolbarOpen, quickToolbarOpen and quickToolbarClose', async ({ app, page }) => {
  const section = app.section('rte-ev');
  const log = section.getByTestId('rte-ev-log');
  await editable(section).locator('a').click();
  await logHas(log, 'beforeQuickToolbarOpen');
  await logHas(log, 'quickToolbarOpen');
  // quickToolbarSettings.link limits the items to Open, Edit and UnLink
  const items = page.locator('.e-rte-quick-popup .e-toolbar-item:visible');
  await expect(items).toHaveCount(3);
  await blur(page);
  await logHas(log, 'quickToolbarClose');
});

test('events: dialogs raise beforeDialogOpen, dialogOpen, beforeDialogClose and dialogClose', async ({ app, page }) => {
  const section = app.section('rte-ev');
  const log = section.getByTestId('rte-ev-log');
  await editable(section).click();
  await tb(section, 'CreateLink').click();
  await logHas(log, 'beforeDialogOpen');
  await logHas(log, 'dialogOpen');
  const dialog = page.locator('.e-rte-link-dialog.e-popup-open, .e-dialog.e-popup-open').first();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await logHas(log, 'beforeDialogClose');
  await logHas(log, 'dialogClose');
});

test('events: copying raises beforeClipboardWrite', async ({ app, page }) => {
  const section = app.section('rte-ev');
  await editable(section).click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Control+c');
  await logHas(section.getByTestId('rte-ev-log'), 'beforeClipboardWrite');
});

test('events: pasting raises the paste cleanup events and deniedTags removes links', async ({ app, page }) => {
  const section = app.section('rte-ev');
  const log = section.getByTestId('rte-ev-log');
  await typeAtEnd(page, section, ' ');
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="rte-ev"] .e-rte-content [contenteditable]');
    const data = new DataTransfer();
    data.setData('text/html', '<p><a href="https://pasted.example" class="c">pasted</a> text</p>');
    data.setData('text/plain', 'pasted text');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await logHas(log, 'beforePasteCleanup');
  await logHas(log, 'afterPasteCleanup');
  await expect(editable(section)).toContainText('pasted');
  await expect(editable(section).locator('a[href="https://pasted.example"]')).toHaveCount(0);
});

test('events: the slash menu lists the configured items and raises slashMenuItemSelect', async ({ app, page }) => {
  const section = app.section('rte-ev');
  await editable(section).click();
  await page.keyboard.press('Control+End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('/');
  const items = page.locator('.e-rte-slash-menu .e-list-item, .e-slash-menu .e-list-item, .e-mention.e-popup-open .e-list-item');
  await expect(items).toHaveCount(3);
  await items.filter({ hasText: 'Heading 1' }).click();
  await logHas(section.getByTestId('rte-ev-log'), 'slashMenuItemSelect');
  await expect(editable(section).locator('h1')).toBeAttached();
});

/* ------------------------------------------------------------------ ai assistant */

test('ai: popup, prompt, toolbar and stop events', async ({ app, page }) => {
  const section = app.section('rte-ai');
  const log = section.getByTestId('rte-ai-log');
  expect(await widgetValue(page, 'rte-ai', 'w.aiAssistantSettings.placeholder')).toBe('Ask the demo');
  await editable(section).click();
  await tb(section, 'AIQuery').click();
  await logHas(log, 'beforePopupOpen');
  const popup = page.locator('.e-rte-aiquery-popup');
  await expect(popup).toBeVisible();
  await popup.locator('.e-assist-textarea').click();
  await page.keyboard.type('Summarize this');
  await page.keyboard.press('Enter');
  await logHas(log, 'aiAssistantPromptRequest');
  // nobody answers the prompt, so the assistant keeps offering to stop
  await popup.locator('[aria-label="Stop Responding"]').click();
  await logHas(log, 'aiAssistantStopRespondingClick');
  await popup.locator('[aria-label="Regenerate"]').click();
  await logHas(log, 'aiAssistantToolbarClick');
  await popup.locator('[aria-label="Close"]').first().click();
  await logHas(log, 'beforePopupClose');
});

/* ------------------------------------------------------------------ media */

const png = { name: 'pic.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64') };
const mp3 = { name: 'clip.mp3', mimeType: 'audio/mpeg', buffer: Buffer.from('ID3fake') };
const mp4 = { name: 'clip.mp4', mimeType: 'video/mp4', buffer: Buffer.from('fakevideo') };
const dialogOf = (page: Page) => page.locator('.e-dialog.e-popup-open');

test('media: insertImageSettings upload raises the image events', async ({ app, page }) => {
  const section = app.section('rte-media');
  const log = section.getByTestId('rte-media-log');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Image').click();
  const dlg = dialogOf(page);
  // allowedTypes limits what the file chooser accepts
  await expect(dlg.locator('input[type=file]')).toHaveAttribute('accept', '.png,.jpg');
  await dlg.locator('input[type=file]').setInputFiles(png);
  await logHas(log, 'imageSelected');
  await logHas(log, 'beforeImageUpload');
  await logHas(log, 'imageUploading');
  await logHas(log, 'imageUploadSuccess');
  await dlg.getByRole('button', { name: 'Insert' }).click();
  // width 50px comes from insertImageSettings
  await expect(editable(section).locator('img[src*="/api/file/uploads/pic.png"]')).toBeAttached();
  expect(await widgetValue(page, 'rte-media', 'w.insertImageSettings.path')).toBe('/api/file/uploads/');
});

test('media: removing a selected image file raises imageRemoving', async ({ app, page }) => {
  const section = app.section('rte-media');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Image').click();
  const dlg = dialogOf(page);
  await dlg.locator('input[type=file]').setInputFiles(png);
  await logHas(section.getByTestId('rte-media-log'), 'imageUploadSuccess');
  await dlg.locator('.e-file-remove-btn, .e-file-delete-btn, .e-file-abort-btn').first().click();
  await logHas(section.getByTestId('rte-media-log'), 'imageRemoving');
});

test('media: a rejected image upload raises imageUploadFailed', async ({ app, page }) => {
  await page.route('**/api/file/upload/test', route => route.fulfill({ status: 500, body: 'no' }));
  const section = app.section('rte-media');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Image').click();
  await dialogOf(page).locator('input[type=file]').setInputFiles(png);
  await logHas(section.getByTestId('rte-media-log'), 'imageUploadFailed');
  // the browser reports the rejected request itself, that is the expected outcome here
  app.errors.length = 0;
});

test('media: deleting an image raises afterImageDelete', async ({ app, page }) => {
  const section = app.section('rte-media');
  const image = editable(section).locator('#media-img');
  await image.click();
  await expect(image).toHaveClass(/e-img-focus/);
  await page.locator('.e-rte-quick-popup [aria-label="Remove"]').click();
  await logHas(section.getByTestId('rte-media-log'), 'afterImageDelete');
  await expect(editable(section).locator('#media-img')).toHaveCount(0);
});

test('media: audio upload raises the file events, deleting it raises afterMediaDelete', async ({ app, page }) => {
  const section = app.section('rte-media');
  const log = section.getByTestId('rte-media-log');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Audio').click();
  const dlg = dialogOf(page);
  await dlg.locator('input[type=file]').setInputFiles(mp3);
  await logHas(log, 'fileSelected');
  await logHas(log, 'beforeFileUpload');
  await logHas(log, 'fileUploading');
  await logHas(log, 'fileUploadSuccess');
  await dlg.getByRole('button', { name: 'Insert' }).click();
  await expect(editable(section).locator('audio source[src$="clip.mp3"]')).toBeAttached();
  // the caret sits after the inserted audio, the first Backspace removes the spacing and the second the audio
  await editable(section).click();
  await page.keyboard.press('Control+End');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await logHas(log, 'afterMediaDelete');
  await expect(editable(section).locator('audio')).toHaveCount(0);
});

test('media: removing a selected media file raises fileRemoving', async ({ app, page }) => {
  const section = app.section('rte-media');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Video').click();
  const dlg = dialogOf(page);
  await expect(dlg.locator('input[type=file]')).toHaveAttribute('accept', '.mp4');
  await dlg.locator('input[type=file]').setInputFiles(mp4);
  await logHas(section.getByTestId('rte-media-log'), 'fileUploadSuccess');
  await dlg.locator('.e-file-remove-btn, .e-file-delete-btn, .e-file-abort-btn').first().click();
  await logHas(section.getByTestId('rte-media-log'), 'fileRemoving');
});

test('media: a rejected media upload raises fileUploadFailed', async ({ app, page }) => {
  await page.route('**/api/file/upload/test', route => route.fulfill({ status: 500, body: 'no' }));
  const section = app.section('rte-media');
  await typeAtEnd(page, section, ' ');
  await tb(section, 'Audio').click();
  await dialogOf(page).locator('input[type=file]').setInputFiles(mp3);
  await logHas(section.getByTestId('rte-media-log'), 'fileUploadFailed');
  app.errors.length = 0;
});

test('media: dropping files raises beforeImageDrop and beforeMediaDrop', async ({ app, page }) => {
  const section = app.section('rte-media');
  await typeAtEnd(page, section, ' ');
  const drop = (kind: string) => page.evaluate((k) => {
    const el = document.querySelector('[data-testid="rte-media"] .e-rte-content [contenteditable]');
    const data = new DataTransfer();
    data.items.add(k === 'image' ? new File(['x'], 'drop.png', { type: 'image/png' }) : new File(['x'], 'drop.mp4', { type: 'video/mp4' }));
    el.dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true, cancelable: true }));
  }, kind);
  await drop('image');
  await logHas(section.getByTestId('rte-media-log'), 'beforeImageDrop');
  await drop('video');
  await logHas(section.getByTestId('rte-media-log'), 'beforeMediaDrop');
});

test('media: fileManagerSettings and the media settings reach the widget', async ({ page }) => {
  expect(await widgetValue(page, 'rte-media', 'w.fileManagerSettings.enable')).toBe(true);
  expect(await widgetValue(page, 'rte-media', 'w.insertAudioSettings.allowedTypes[0]')).toBe('.mp3');
  expect(await widgetValue(page, 'rte-media', 'w.insertVideoSettings.width')).toBe('100px');
  expect(await widgetValue(page, 'rte-media', 'w.insertImageSettings.saveFormat')).toBe('Base64');
});

test('media: resizing an image raises the resize events', async ({ app, page }) => {
  const section = app.section('rte-media');
  const log = section.getByTestId('rte-media-log');
  await editable(section).locator('#media-img').click();
  const handle = section.locator('.e-rte-imageboxmark.e-rte-botRight, .e-rte-botRight').first();
  await expect(handle).toBeVisible();
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(box.x + 5 + i * 6, box.y + 5 + i * 6);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r(null))));
  }
  await page.mouse.up();
  await logHas(log, 'resizeStart');
  await logHas(log, 'resizing');
  await logHas(log, 'resizeStop');
});

/* ------------------------------------------------------------------ import and export */

test('io: exporting raises documentExporting with the export type', async ({ app, page }) => {
  await page.route('**/api/file/rte/export*', route => route.fulfill({
    status: 200, contentType: 'application/octet-stream', body: Buffer.from('file')
  }));
  const section = app.section('rte-io');
  expect(await widgetValue(page, 'rte-io', 'w.exportWord.fileName')).toBe('demo.docx');
  expect(await widgetValue(page, 'rte-io', 'w.exportPdf.fileName')).toBe('demo.pdf');
  const request = page.waitForRequest(r => r.url().includes('/api/file/rte/exportword'));
  await tb(section, 'ExportWord').click();
  await logHas(section.getByTestId('rte-io-log'), 'documentExporting');
  await request;
  const pdfRequest = page.waitForRequest(r => r.url().includes('/api/file/rte/exportpdf'));
  await tb(section, 'ExportPdf').click();
  await pdfRequest;
});

test('io: importing a word document raises wordImporting', async ({ app, page }) => {
  await page.route('**/api/file/rte/import', route => route.fulfill({
    status: 200, contentType: 'text/html', body: '<p>imported</p>'
  }));
  const section = app.section('rte-io');
  expect(await widgetValue(page, 'rte-io', 'w.importWord.serviceUrl')).toBe('/api/file/rte/import');
  const chooser = page.waitForEvent('filechooser');
  await tb(section, 'ImportWord').click();
  await (await chooser).setFiles({ name: 'doc.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: Buffer.from('docx') });
  await logHas(section.getByTestId('rte-io-log'), 'wordImporting');
});

/* ------------------------------------------------------------------ webmcp and lifecycle */

test('webMcp: tools are registered and beforeWebMcpToolExecute is raised', async ({ page, app }) => {
  // document.modelContext is a browser proposal, stub it and keep the registered tools
  await page.addInitScript(() => {
    (window as any).__tools = {};
    (document as any).modelContext = { registerTool: (tool: any) => { (window as any).__tools[tool.name] = tool; } };
  });
  await app.open('richTextEditor');
  await expect.poll(() => page.evaluate(() => Object.keys((window as any).__tools).join(','))).toContain('demo-rte_getContent');
  await page.evaluate(() => (window as any).__tools['demo-rte_getContent'].execute({}));
  await logHas(app.section('rte-mcp').getByTestId('rte-mcp-log'), 'beforeWebMcpToolExecute');
  expect(await widgetValue(page, 'rte-mcp', 'w.enableWebMcp')).toBe(true);
  expect(await widgetValue(page, 'rte-mcp', 'w.webMcpSettings.name')).toBe('demo-rte');
  expect(await widgetValue(page, 'rte-mcp', 'w.webMcpSettings.tools.length')).toBe(2);
});

test('destroyed is raised when the editor is removed', async ({ app }) => {
  const section = app.section('rte-life');
  await expect(section.locator('.e-richtexteditor')).toBeVisible();
  await section.getByTestId('rte-remove').click();
  await expect(section.locator('.e-richtexteditor')).toHaveCount(0);
  await logHas(section.getByTestId('rte-life-log'), 'destroyed');
});
