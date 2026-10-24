import { Page, Locator } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('fileManager'));

/** Evaluate an expression against the Syncfusion widget behind an ej2-file-manager. */
const widgetValue = (page: Page, testId: string, expr: string) => page.evaluate(([id, e]) => {
  const el: any = document.querySelector(`[data-testid="${id}"]`);
  const w = el.au['ej2-file-manager'].viewModel.widget;
  return new Function('w', `return ${e}`)(w);
}, [testId, expr]);

/** Assert that an event name was logged at least n times in a "name:count name:count" log. */
const logHas = (loc: Locator, name: string, n = 1) =>
  expect(loc).toHaveText(new RegExp(`(^|\\s)${name}:([${n}-9]|\\d{2,})(\\s|$)`));

const toolbar = (section: Locator, title: string) => section.locator(`.e-toolbar-item[title="${title}"]`);
const item = (section: Locator, name: string) => section.locator('.e-large-icons li.e-list-item', { hasText: name }).first();
const dialog = (page: Page) => page.locator('.e-dialog.e-popup-open');

test('loads the root folder through the service', async ({ app }) => {
  const section = app.section('fm-details');
  await expect(section.locator('.e-filemanager .e-toolbar')).toBeVisible();
  await expect(section.locator('.e-grid .e-row')).toHaveCount(2);
  await expect(section.locator('.e-grid .e-row', { hasText: 'Documents' })).toBeVisible();
  await expect(section.locator('.e-grid .e-row', { hasText: 'readme.txt' })).toBeVisible();
});

test('navigation pane shows the root', async ({ app }) => {
  await expect(app.section('fm-details').locator('.e-treeview .e-list-text', { hasText: 'Files' })).toBeVisible();
});

test('view binding switches to large icons', async ({ app }) => {
  const section = app.section('fm-details');
  await section.getByTestId('fm-icons-btn').click();
  await expect(section.locator('.e-large-icons')).toBeVisible();
  await expect(section.locator('.e-large-icons li.e-list-item')).toHaveCount(2);
  await section.getByTestId('fm-details-btn').click();
  await expect(section.locator('.e-grid .e-row')).toHaveCount(2);
});

test('fileOpen event is raised when opening a file', async ({ app }) => {
  const section = app.section('fm-details');
  await section.locator('.e-grid .e-row', { hasText: 'readme.txt' }).dblclick();
  await expect(section.getByTestId('fm-opened')).toHaveText('readme.txt');
  await expect(section.getByTestId('fm-open-count')).toHaveText('1');
});

test('navigation pane and toolbar can be customised', async ({ app }) => {
  const section = app.section('fm-minimal');
  await expect(section.locator('.e-navigation')).toBeHidden();
  await expect(section.locator('.e-toolbar .e-toolbar-item:visible')).toHaveCount(2);
});

test('ajaxSettings binding loads the folder through the service', async ({ app, page }) => {
  const section = app.section('fm-minimal');
  await expect(section.locator('.e-large-icons li.e-list-item', { hasText: 'readme.txt' })).toBeVisible();
  expect(await widgetValue(page, 'fm-minimal', 'w.ajaxSettings.url')).toContain('AzureFileOperations');
});

test('service events: beforeSend and success are raised by requests', async ({ app }) => {
  const log = app.section('fm-details').getByTestId('fm-log');
  await logHas(log, 'beforeSend');
  await logHas(log, 'success');
  expect(await widgetValue(app.page, 'fm-details', 'w.ajaxSettings.url')).toContain('AzureFileOperations');
});

test('service events: beforeDownload can cancel the download', async ({ app }) => {
  const section = app.section('fm-details');
  await section.locator('.e-grid .e-row', { hasText: 'readme.txt' }).click();
  await toolbar(section, 'Download').click();
  await logHas(section.getByTestId('fm-log'), 'beforeDownload');
});

test('service events: failure is raised when the service reports an error', async ({ app, page }) => {
  await page.route('https://ej2-azure-aspcore-service.azurewebsites.net/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ cwd: null, files: null, error: { code: '417', message: 'service says no', fileExists: null } })
  }));
  const section = app.section('fm-details');
  await toolbar(section, 'Refresh').click();
  await logHas(section.getByTestId('fm-log'), 'failure');
});

test('uploadSettings: manual upload, size limits and uploadListCreate', async ({ app, page }) => {
  const section = app.section('fm-upload');
  expect(await widgetValue(page, 'fm-upload', 'w.uploadSettings.autoUpload')).toBe(false);
  expect(await widgetValue(page, 'fm-upload', 'w.uploadSettings.minFileSize')).toBe(2);
  // the toolbar button opens the browser's file chooser, feed the uploader behind it directly
  const input = section.locator('.e-filemanager input[type=file]').first();
  await input.setInputFiles({ name: 'up.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  const dlg = dialog(page);
  await expect(dlg.locator('.e-upload-file-list')).toHaveCount(1);
  // autoUpload is off, the file waits for the Upload button
  await expect(dlg.locator('.e-file-upload-btn')).toBeVisible();
  await logHas(app.section('fm-details').getByTestId('fm-log'), 'uploadListCreate');
  await input.setInputFiles({ name: 'tiny.txt', mimeType: 'text/plain', buffer: Buffer.from('x') });
  await expect(dlg.locator('.e-validation-fails')).toHaveCount(1);
});

/* ------------------------------------------------------------------ local data and operations */

test('local data: lifecycle events and in-memory data', async ({ app }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await expect(item(section, 'Documents')).toBeVisible();
  await logHas(log, 'created');
  await logHas(log, 'toolbarCreate');
  await logHas(log, 'fileLoad');
  await logHas(log, 'beforeImageLoad');
});

test('local data: selection events, multi selection and range selection', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'readme.txt').click();
  await logHas(log, 'fileSelect');
  await logHas(log, 'fileSelection');
  // allowMultiSelection: ctrl+a selects everything in the folder
  await page.keyboard.press('Control+a');
  await expect.poll(() => widgetValue(page, 'fm-local', 'w.getSelectedFiles().length')).toBeGreaterThan(3);
  // enableRangeSelection: drag a rubber band over the empty area to select the items it touches
  const box = await section.locator('.e-large-icons').boundingBox();
  await page.mouse.move(box.x + box.width - 10, box.y + box.height - 10);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + 20, { steps: 15 });
  await expect.poll(() => widgetValue(page, 'fm-local', 'w.getSelectedFiles().length')).toBeGreaterThan(3);
  await page.mouse.up();
  expect(await widgetValue(page, 'fm-local', 'w.allowMultiSelection')).toBe(true);
  expect(await widgetValue(page, 'fm-local', 'w.enableRangeSelection')).toBe(true);
});

test('local data: opening items raises fileOpen and fileLoad', async ({ app }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'Documents').dblclick();
  await logHas(log, 'fileOpen');
  await expect(section.locator('.e-large-icons li.e-list-item', { hasText: 'work.docx' })).toBeVisible();
  await logHas(log, 'fileLoad', 2);
});

test('local data: toolbarClick', async ({ app }) => {
  const section = app.section('fm-local');
  await toolbar(section, 'Refresh').click();
  await logHas(section.getByTestId('fm-local-log'), 'toolbarClick');
});

test('local data: context menu raises menuOpen, menuClick, menuClose and the details popup events', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'readme.txt').click({ button: 'right' });
  await logHas(log, 'menuOpen');
  await page.locator('.e-contextmenu-wrapper li.e-menu-item', { hasText: 'Details' }).click();
  await logHas(log, 'menuClick');
  await logHas(log, 'menuClose');
  await logHas(log, 'beforePopupOpen');
  await logHas(log, 'popupOpen');
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('button', { name: 'Close' }).first().click();
  await logHas(log, 'beforePopupClose');
  await logHas(log, 'popupClose');
});

test('local data: new folder raises beforeFolderCreate and folderCreate', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await toolbar(section, 'New folder').click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).locator('input').fill('Archive');
  await dialog(page).getByRole('button', { name: 'Create' }).click();
  await logHas(log, 'beforeFolderCreate');
  await logHas(log, 'folderCreate');
  await expect(item(section, 'Archive')).toBeVisible();
});

test('local data: rename raises beforeRename and rename', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'notes.md').click();
  await toolbar(section, 'Rename').click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).locator('input').fill('renamed.md');
  await dialog(page).getByRole('button', { name: 'Save' }).click();
  await logHas(log, 'beforeRename');
  await logHas(log, 'rename');
  await expect(item(section, 'renamed.md')).toBeVisible();
});

test('local data: delete raises beforeDelete and delete', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'big.log').click();
  await toolbar(section, 'Delete').click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('button', { name: 'Yes' }).click();
  await logHas(log, 'beforeDelete');
  await logHas(log, 'delete');
  await expect(section.locator('.e-large-icons li.e-list-item', { hasText: 'big.log' })).toHaveCount(0);
});

test('local data: cut and paste raises beforeMove and move', async ({ app }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'notes.md').click();
  await toolbar(section, 'Cut').click();
  await item(section, 'Documents').dblclick();
  await expect(section.locator('.e-large-icons li.e-list-item', { hasText: 'work.docx' })).toBeVisible();
  await toolbar(section, 'Paste').click();
  await logHas(log, 'beforeMove');
  await logHas(log, 'move');
  await expect(item(section, 'notes.md')).toBeVisible();
});

test('local data: searching raises search', async ({ app }) => {
  const section = app.section('fm-local');
  const search = section.locator('input.e-textbox[aria-label="Search"]');
  await search.fill('read');
  await search.press('Enter');
  await logHas(section.getByTestId('fm-local-log'), 'search');
  await expect(section.locator('.e-large-icons li.e-list-item', { hasText: 'readme.txt' })).toBeVisible();
});

test('local data: dragging a file onto a folder raises the drag events', async ({ app, page }) => {
  const section = app.section('fm-local');
  const log = section.getByTestId('fm-local-log');
  await item(section, 'notes.md').click();
  const from = await item(section, 'notes.md').boundingBox();
  const to = await item(section, 'Pictures').boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  // let the draggable process every move before the next one arrives
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(from.x + from.width / 2 + (to.x - from.x) * i / 20, from.y + from.height / 2 + (to.y - from.y) * i / 20);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r(null))));
  }
  await page.mouse.up();
  await logHas(log, 'fileDragStart');
  await logHas(log, 'fileDragging');
  await logHas(log, 'fileDragStop');
  await logHas(log, 'fileDropped');
});

/* ------------------------------------------------------------------ appearance and data */

test('props: cssClass, size, rootAliasName and the navigation pane template', async ({ app, page }) => {
  const section = app.section('fm-props');
  await expect(section.locator('.e-filemanager')).toHaveClass(/my-fm/);
  await expect.poll(async () => (await section.locator('.e-filemanager').boundingBox()).height).toBeCloseTo(300, 0);
  const parentWidth = (await app.section('fm-props').locator('#fm-popup-target').boundingBox()).width;
  await expect.poll(async () => (await section.locator('.e-filemanager').boundingBox()).width)
    .toBeCloseTo(parentWidth * 0.9, -1);
  await expect(section.locator('.e-treeview .np-tpl', { hasText: 'nav-Home' })).toBeVisible();
  await expect(section.locator('.e-treeview .np-tpl', { hasText: 'nav-Documents' })).toBeVisible();
  expect(await widgetValue(page, 'fm-props', 'w.rootAliasName')).toBe('Home');
  expect(await widgetValue(page, 'fm-props', 'w.enableHtmlSanitizer')).toBe(true);
  expect(await widgetValue(page, 'fm-props', 'w.enableVirtualization')).toBe(false);
});

test('props: detailsViewSettings columns, showFileExtension, sortBy and sortOrder', async ({ app }) => {
  const section = app.section('fm-props');
  await expect(section.locator('.e-grid .e-headercell', { hasText: 'Title' })).toBeVisible();
  await expect(section.locator('.e-grid .e-headercell', { hasText: 'Bytes' })).toBeVisible();
  // extensions are hidden and files are sorted by size, biggest first
  await expect(section.locator('.e-grid .e-row td.e-fe-grid-name', { hasText: 'readme' }).first()).toBeVisible();
  await expect(section.locator('.e-grid .e-row td.e-fe-grid-name', { hasText: 'readme.txt' })).toHaveCount(0);
  const names = section.locator('.e-grid .e-row .e-fe-grid-name');
  await expect(names.nth(2)).toHaveText('big');
  await expect(names.last()).toHaveText('notes');
});

test('props: sortOrder is updated from the view-model', async ({ app }) => {
  const section = app.section('fm-props');
  const names = section.locator('.e-grid .e-row .e-fe-grid-name');
  await expect(names.nth(2)).toHaveText('big');
  await section.getByTestId('fm-sort').click();
  await expect(names.nth(2)).toHaveText('notes');
  await expect(names.last()).toHaveText('big');
});

test('props: selectedItems follow the view-model', async ({ app, page }) => {
  const section = app.section('fm-props');
  const checked = section.locator('.e-grid .e-row', { has: page.locator('input.e-checkselect:checked') });
  await expect(checked).toHaveCount(1);
  await expect(checked).toContainText('readme');
  await section.getByTestId('fm-select').click();
  await expect(checked).toHaveCount(1);
  await expect(checked).toContainText('notes');
});

test('props: path is sent to the service and follows the view-model', async ({ app, page }) => {
  const section = app.section('fm-details');
  const readPath = (req) => req.method() === 'POST' && /"path":"\/Documents\/"/.test(req.postData() || '');
  const request = page.waitForRequest(readPath);
  await section.getByTestId('fm-set-path').click();
  await request;
});

test('props: showItemCheckBoxes renders selection check boxes', async ({ app }) => {
  const section = app.section('fm-props');
  await expect(section.locator('.e-grid .e-row .e-checkbox-wrapper input.e-checkselect')).toHaveCount(6);
});

test('props: showHiddenItems follows the view-model and popupTarget hosts the dialogs', async ({ app, page }) => {
  const section = app.section('fm-props');
  expect(await widgetValue(page, 'fm-props', 'w.showHiddenItems')).toBe(false);
  await section.getByTestId('fm-hidden').click();
  await expect.poll(() => widgetValue(page, 'fm-props', 'w.showHiddenItems')).toBe(true);
  expect(await widgetValue(page, 'fm-props', 'w.popupTarget')).toBe('#fm-popup-target');
  await toolbar(section, 'New folder').click();
  await expect(section.locator('#fm-popup-target .e-dialog.e-popup-open')).toBeVisible();
});

/* ------------------------------------------------------------------ large icons */

test('icons: largeIconsTemplate, showThumbnail and sortComparer', async ({ app }) => {
  const section = app.section('fm-icons');
  const tpl = section.locator('.e-large-icons .li-tpl');
  await expect(tpl.first()).toBeVisible();
  await expect(tpl).toHaveCount(6);
  await expect(section.locator('.e-large-icons img')).toHaveCount(0);
  // the comparer sorts descending by name: readme.txt comes before big.log
  const texts = await tpl.allTextContents();
  expect(texts.indexOf('icon-readme.txt')).toBeLessThan(texts.indexOf('icon-big.log'));
});

test('icons: contextMenuSettings limit the menu items', async ({ app, page }) => {
  const section = app.section('fm-icons');
  await item(section, 'readme.txt').click({ button: 'right' });
  const items = page.locator('.e-contextmenu-wrapper li.e-menu-item:not(.e-separator):visible');
  await expect(items).toHaveCount(2);
  await expect(items.first()).toHaveText('Open');
  await expect(items.last()).toHaveText('Details');
});

test('icons: searchSettings, search only starts on Enter', async ({ app }) => {
  const section = app.section('fm-icons');
  const search = section.locator('input.e-textbox[aria-label="Search"]');
  await search.fill('DOC');
  // allowSearchOnTyping is off: nothing is filtered yet
  await expect(section.locator('.e-large-icons .li-tpl')).toHaveCount(6);
  await search.press('Enter');
  await expect(section.locator('.e-large-icons .li-tpl')).toHaveCount(1);
  await expect(section.locator('.e-large-icons .li-tpl')).toHaveText('icon-Documents');
});

test('icons: toolbarItems add a custom item that raises toolbarClick', async ({ app }) => {
  const section = app.section('fm-icons');
  await expect(section.locator('.e-toolbar-item', { hasText: 'Custom action' })).toBeVisible();
  await section.locator('.e-toolbar-item', { hasText: 'Custom action' }).click();
  await logHas(app.section('fm-details').getByTestId('fm-log'), 'iconsToolbarClick');
});

test('icons: allowMultiSelection false keeps a single selection', async ({ app, page }) => {
  const section = app.section('fm-icons');
  await item(section, 'readme.txt').click();
  await page.keyboard.press('Control+a');
  await item(section, 'notes.md').click({ modifiers: ['Control'] });
  await expect.poll(() => widgetValue(page, 'fm-icons', 'w.getSelectedFiles().length')).toBe(1);
  expect(await widgetValue(page, 'fm-icons', 'w.allowMultiSelection')).toBe(false);
});

/* ------------------------------------------------------------------ webmcp and lifecycle */

test('webMcp: tools are registered and beforeWebMcpToolExecute is raised', async ({ page, app }) => {
  // document.modelContext is a browser proposal, stub it and keep the registered tools
  await page.addInitScript(() => {
    (window as any).__tools = {};
    (document as any).modelContext = { registerTool: (tool: any) => { (window as any).__tools[tool.name] = tool; } };
  });
  await app.open('fileManager');
  await expect.poll(() => page.evaluate(() => Object.keys((window as any).__tools).join(','))).toContain('demo-fm_getSelectedFiles');
  await page.evaluate(() => (window as any).__tools['demo-fm_getSelectedFiles'].execute({}));
  await logHas(app.section('fm-mcp').getByTestId('fm-mcp-log'), 'beforeWebMcpToolExecute');
  expect(await widgetValue(page, 'fm-mcp', 'w.enableWebMcp')).toBe(true);
  expect(await widgetValue(page, 'fm-mcp', 'w.webMcpSettings.name')).toBe('demo-fm');
});

test('destroyed is raised when the control is removed', async ({ app }) => {
  const section = app.section('fm-life');
  await expect(section.locator('.e-filemanager')).toBeVisible();
  await section.getByTestId('fm-remove').click();
  await expect(section.locator('.e-filemanager')).toHaveCount(0);
  await logHas(section.getByTestId('fm-life-log'), 'destroyed');
});
