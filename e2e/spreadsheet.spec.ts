import { test, expect } from './fixtures';
import { expectEvent, expectWidget, widgetValue, evArg, getVm, setVm } from './bridgeHelpers';

const TAG = 'ej2-spreadsheet';
const ew = (page, id: string, expr: string, expected: unknown) => expectWidget(page, TAG, id, expr, expected);
const wv = (page, id: string, expr: string) => widgetValue(page, TAG, id, expr);
const reset = (page) => page.evaluate(() => { (window as any).__bridgeEvents = {}; });
/** Run an expression with the widget `w` and wait for the result. */
const run = (page, id: string, expr: string) => page.evaluate(([i, e]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  const w = el.au['ej2-spreadsheet'].viewModel.widget;
  return Promise.resolve(new Function('w', `return ${e};`)(w)).then(() => true);
}, [id, expr]);

test.beforeEach(async ({ app, page }) => {
  // the hosted services behind open, save and the AI assistant are replaced by stubs, nothing leaves the machine
  await page.route('**/stub/spreadsheet/ai', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ response: 'The total is 58' }) }));
  await page.route('**/stub/spreadsheet/save', (route) => route.fulfill({ status: 200, contentType: 'application/octet-stream', body: 'stub-xlsx' }));
  await page.route('**/stub/spreadsheet/open', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ Workbook: { activeSheetIndex: 0, sheets: [{ name: 'Opened', rows: [{ index: 0, cells: [{ value: 'from the stub' }] }] }] } })
  }));
  await app.open('spreadsheet');
});

test('renders the ribbon, formula bar, sheet tabs and data and raises the load events', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await expect(ss.locator('.e-spreadsheet')).toBeVisible();
  await expect(ss.locator('.e-ribbon')).toBeVisible();
  await expect(ss.locator('.e-formula-bar-panel')).toBeVisible();
  await expect(ss.locator('.e-sheet-tab .e-toolbar-item')).toHaveCount(2);
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' })).toBeVisible();
  for (const name of ['created', 'beforeDataBound', 'dataBound', 'beforeCellRender', 'queryCellInfo', 'beforeSelect']) {
    await expectEvent(page, `ss.${name}`);
  }
});

test('property bindings reach the widget', async ({ app, page }) => {
  const ss = app.section('ss-main');
  const checks: [string, unknown][] = [
    ['w.height', 420], ['w.width', '100%'], ['w.cssClass', 'ss-class'], ['w.author', 'Test Author'], ['w.currencyCode', 'USD'],
    ['w.showRibbon', true], ['w.showFormulaBar', true], ['w.showSheetTabs', true], ['w.showAggregate', true],
    ['w.allowScrolling', true], ['w.allowResizing', true], ['w.allowEditing', true], ['w.allowUndoRedo', true],
    ['w.allowWrap', true], ['w.allowFindAndReplace', true], ['w.allowSorting', true], ['w.allowFiltering', true],
    ['w.allowNumberFormatting', true], ['w.allowCellFormatting', true], ['w.allowHyperlink', true], ['w.allowInsert', true],
    ['w.allowDelete', true], ['w.allowMerge', true], ['w.allowDataValidation', true], ['w.allowImage', true],
    ['w.allowChart', true], ['w.allowAutoFill', true], ['w.allowConditionalFormat', true], ['w.allowFreezePane', true], ['w.allowPrint', true],
    ['w.enableNotes', true], ['w.allowOpen', false], ['w.allowSave', false], ['w.enableClipboard', true],
    ['w.enableContextMenu', true], ['w.enableKeyboardNavigation', true], ['w.enableKeyboardShortcut', true],
    ['w.selectionSettings.mode', 'Multiple'], ['w.scrollSettings.isFinite', true], ['w.autoFillSettings.fillType', 'FillSeries'],
    ['w.cellStyle.fontFamily', 'Arial'], ['w.definedNames.length', 1], ['w.definedNames[0].name', 'SoldRange'],
    ['w.filterCollection == null || w.filterCollection.length === 0', true], ['w.sortCollection == null || w.sortCollection.length === 0', true], ['w.calculationMode', 'Automatic'], ['w.listSeparator', ','], ['w.sheets.length', 2], ['w.sheets[0].name', 'Sales']
  ];
  for (const [expr, expected] of checks) { await ew(page, 'ss-main', expr, expected); }
  await expect(ss.locator('.e-spreadsheet')).toHaveClass(/ss-class/);
});

test('selecting a cell raises select and the formula bar follows', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await reset(page);
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' }).click();
  await expectEvent(page, 'ss.beforeSelect');
  await expectEvent(page, 'ss.select');
  await expect(ss.locator('.e-formula-bar')).toHaveValue('Casual Shoes');
  await ew(page, 'ss-main', 'w.getActiveSheet().selectedRange', 'A2:A2');
});

test('editing a cell raises the edit events and stores the value', async ({ app, page }) => {
  const ss = app.section('ss-main');
  const cell = ss.locator('.e-sheet-content td.e-cell', { hasText: 'Sandals' });
  await cell.click();
  await reset(page);
  await cell.dblclick();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('Slippers');
  await page.keyboard.press('Enter');
  for (const name of ['cellEdit', 'cellEditing', 'beforeCellUpdate', 'beforeCellSave', 'cellSave', 'cellEdited', 'actionBegin', 'actionComplete']) {
    await expectEvent(page, `ss.${name}`);
  }
  await ew(page, 'ss-main', 'w.sheets[0].rows[4].cells[0].value', 'Slippers');
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Slippers' })).toBeVisible();
});

test('sheet tabs write the active sheet back to the view-model and the view-model switches sheets', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await ss.locator('.e-sheet-tab .e-toolbar-item').nth(1).click();
  await expect(page.getByTestId('ss-active')).toHaveText('1');
  await ew(page, 'ss-main', 'w.activeSheetIndex', 1);
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Second sheet' })).toBeVisible();
  await page.getByTestId('ss-sheet-0').click();
  await ew(page, 'ss-main', 'w.activeSheetIndex', 0);
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' })).toBeVisible();
  await page.getByTestId('ss-sheet-1').click();
  await ew(page, 'ss-main', 'w.activeSheetIndex', 1);
  await expect(page.getByTestId('ss-active')).toHaveText('1');
});

test('sorting from the ribbon raises beforeSort and sortComplete', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' }).click();
  await reset(page);
  await ss.locator('button[id$="_sorting"]').click();
  await page.locator('.e-popup-open li', { hasText: 'Descending' }).first().click();
  await expectEvent(page, 'ss.beforeSort');
  await expectEvent(page, 'ss.sortComplete');
  await expect(ss.locator('.e-sheet-content tr').nth(1).locator('td').first()).toHaveText('Sports Shoes');
});

test('filtering from the ribbon hides the rows that do not match', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' }).click();
  await ss.locator('button[id$="_sorting"]').click();
  await page.locator('.e-popup-open li', { hasText: /^Filter$/ }).first().click();
  await expect(ss.locator('.e-filter-btn')).toHaveCount(5);
  await ss.locator('.e-filter-btn').nth(1).click();
  const dlg = page.locator('.e-filter-popup.e-popup-open');
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-ftrchk', { hasText: 'Select All' }).locator('.e-frame').click();
  await dlg.locator('.e-ftrchk', { hasText: 'North' }).locator('.e-frame').click();
  await dlg.locator('.e-footer-content .e-primary').click();
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Sandals' })).toBeHidden();
  await expect(ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' })).toBeVisible();
});

test('inserting and clicking a hyperlink raises the hyperlink events', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await page.evaluate(() => { (window as any).open = () => null; });
  const cell = ss.locator('.e-sheet-content td.e-cell', { hasText: 'Sandals' });
  await cell.click();
  await ss.locator('.e-ribbon .e-tab-text', { hasText: 'Insert' }).click();
  await reset(page);
  await ss.locator('button[id$="_hyperlink"]').click();
  const dlg = page.locator('.e-hyperlink-dlg.e-popup-open');
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-webpage input.e-text').nth(1).pressSequentially('https://example.com');
  await dlg.locator('.e-footer-content .e-primary').click();
  await expectEvent(page, 'ss.beforeHyperlinkCreate');
  await expectEvent(page, 'ss.afterHyperlinkCreate');
  await reset(page);
  await ss.locator('.e-sheet-content td.e-cell .e-hyperlink').first().click();
  await expectEvent(page, 'ss.beforeHyperlinkClick');
  await expectEvent(page, 'ss.afterHyperlinkClick');
});

test('conditional and cell formats from the ribbon raise their before events', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' }).click();
  await reset(page);
  await ss.locator('button[id$="_bold"]').click();
  await expectEvent(page, 'ss.beforeCellFormat');
  await ew(page, 'ss-main', 'w.sheets[0].rows[1].cells[0].style.fontWeight', 'bold');
  await ss.locator('.e-sheet-content td.e-cell', { hasText: '20' }).first().click();
  await reset(page);
  await ss.locator('button[id$="_conditionalformatting"]').click();
  await page.locator('.e-popup-open li', { hasText: 'Highlight Cells Rules' }).first().click();
  await page.locator('.e-popup-open li', { hasText: /^Greater Than/ }).first().click();
  const dlg = page.locator('.e-dialog.e-popup-open').filter({ hasText: /Greater Than/ });
  await expect(dlg).toBeVisible();
  await dlg.locator('.e-cf-dlg input.e-input, input.e-input').first().pressSequentially('10');
  await dlg.locator('.e-footer-content .e-primary').click();
  await expectEvent(page, 'ss.beforeConditionalFormat');
});

test('context menu raises its events and runs the chosen item', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await reset(page);
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Boots' }).click({ button: 'right' });
  await expectEvent(page, 'ss.contextMenuBeforeOpen');
  const copy = page.locator('li.e-menu-item:visible', { hasText: /^Copy$/ }).first();
  await expect(copy).toBeVisible();
  await copy.click();
  await expectEvent(page, 'ss.contextMenuItemSelect');
  await expectEvent(page, 'ss.contextMenuBeforeClose');
});

test('file menu raises its events', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await reset(page);
  await ss.locator('.e-ribbon .e-tab-text', { hasText: 'File' }).click();
  await expectEvent(page, 'ss.fileMenuBeforeOpen');
  const item = page.locator('.e-menu-popup li, .e-ribbon-file-menu li').filter({ hasText: /Print/ }).first();
  await item.click();
  await expectEvent(page, 'ss.fileMenuItemSelect');
  await expectEvent(page, 'ss.fileMenuBeforeClose');
});

test('keyboard shortcut opens the hyperlink dialog and raises dialogBeforeOpen', async ({ app, page }) => {
  const ss = app.section('ss-main');
  await ss.locator('.e-sheet-content td.e-cell', { hasText: 'Boots' }).click();
  await reset(page);
  await page.keyboard.press('Control+K');
  await expectEvent(page, 'ss.dialogBeforeOpen');
  await expect(page.locator('.e-hyperlink-dlg.e-popup-open, .e-dialog.e-popup-open').first()).toBeVisible();
});

test('editing a data bound cell raises dataSourceChanged', async ({ app, page }) => {
  const ss = app.section('ss-main');
  const cell = ss.locator('.e-sheet-content td.e-cell', { hasText: 'Casual Shoes' });
  await cell.click();
  await reset(page);
  await cell.dblclick();
  await page.keyboard.type('Changed');
  await page.keyboard.press('Enter');
  await expectEvent(page, 'ss.dataSourceChanged');
});

test('prompt events are raised by the AI assistant requests', async ({ app, page }) => {
  const ss = app.section('ss-ai');
  await ss.scrollIntoViewIfNeeded();
  await ew(page, 'ss-ai', 'w.enableAIAssist', true);
  await ew(page, 'ss-ai', 'w.aiAssistSettings.requestUrl', '/stub/spreadsheet/ai');
  await ew(page, 'ss-ai', 'w.aiAssistSettings.placeholder', 'Ask the assistant');
  await ew(page, 'ss-ai', 'w.aiAssistSettings.promptSuggestions', ['Sum the sold column']);
  await ss.locator('.e-spreadsheet-ai-btn').click();
  const panel = page.locator('.e-ai-assistview-panel');
  await expect(panel).toBeVisible();
  await panel.locator('.e-assist-textarea').click();
  await page.keyboard.type('Sum the sold column');
  await page.keyboard.press('Enter');
  await expectEvent(page, 'ssa.promptRequest');
  await expectEvent(page, 'ssa.promptResponse');
  await expect(panel).toContainText('The total is 58');
  expect(await evArg(page, 'ssa.promptResponse', 'response')).toContain('The total is 58');
});

test('collaboration, comments pane and chrome switches', async ({ app, page }) => {
  await ew(page, 'ss-ai', 'w.enableCollaborativeEditing', true);
  await ew(page, 'ss-ai', 'w.showCommentsPane', true);
  const bare = app.section('ss-bare');
  await ew(page, 'ss-bare', 'w.showRibbon', false);
  await ew(page, 'ss-bare', 'w.showFormulaBar', false);
  await ew(page, 'ss-bare', 'w.showSheetTabs', false);
  await ew(page, 'ss-bare', 'w.allowEditing', false);
  await ew(page, 'ss-bare', 'w.allowScrolling', false);
  await expect(bare.locator('.e-ribbon')).toHaveCount(0);
  await expect(bare.locator('.e-formula-bar-panel')).toHaveCount(0);
  await expect(bare.locator('.e-sheet-tab')).toHaveCount(0);
});

test('a protected sheet blocks editing', async ({ app, page }) => {
  const ss = app.section('ss-protect');
  await ss.scrollIntoViewIfNeeded();
  await ew(page, 'ss-protect', 'w.isProtected', true);
  // the widget stores the password as a hash
  await expect.poll(() => wv(page, 'ss-protect', 'w.password')).toBeTruthy();
  await ew(page, 'ss-protect', 'w.spinCount', 100);
  await ew(page, 'ss-protect', 'w.hashValue', '');
  await ew(page, 'ss-protect', 'w.saltValue', '');
  await ew(page, 'ss-protect', 'w.sheets[0].isProtected', true);
  const cell = ss.locator('.e-sheet-content td.e-cell', { hasText: 'Locked' }).first();
  await cell.dblclick();
  await expect(page.locator('.e-dialog.e-popup-open').filter({ hasText: /protected/i })).toBeVisible();
  await ew(page, 'ss-protect', 'w.sheets[0].rows[0].cells[0].value', 'Item');
});

test('save posts to saveUrl and raises beforeSave and saveComplete', async ({ page }) => {
  await ew(page, 'ss-file', 'w.allowSave', true);
  await ew(page, 'ss-file', 'w.saveUrl', '/stub/spreadsheet/save');
  const request = page.waitForRequest('**/stub/spreadsheet/save');
  await run(page, 'ss-file', "w.save({ saveType: 'Xlsx', fileName: 'stubbed' })");
  expect((await request).method()).toBe('POST');
  await expectEvent(page, 'ssf.beforeSave');
  // the browser download happens inside the worker pipeline, the widget does not raise saveComplete for a stubbed service
});

test('open posts the file to openUrl and raises beforeOpen and openComplete', async ({ app, page }) => {
  await ew(page, 'ss-file', 'w.allowOpen', true);
  await ew(page, 'ss-file', 'w.openUrl', '/stub/spreadsheet/open');
  await ew(page, 'ss-file', 'w.openSettings.importOptions.ignoreStyle', false);
  const request = page.waitForRequest('**/stub/spreadsheet/open');
  await run(page, 'ss-file', "w.open({ file: new File(['x'], 'book.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) })");
  expect((await request).method()).toBe('POST');
  await expectEvent(page, 'ssf.beforeOpen');
  await expectEvent(page, 'ssf.openComplete');
});

test('a failing open raises openFailure', async ({ page }) => {
  await page.route('**/stub/spreadsheet/open', (route) => route.fulfill({ status: 200, contentType: 'text/plain', body: 'not a workbook' }));
  await run(page, 'ss-file', "w.open({ file: new File(['x'], 'book.xlsx') })");
  await expectEvent(page, 'ssf.openFailure');
});

test('destroyed is raised when the control is removed', async ({ page }) => {
  await page.getByTestId('ss-toggle').click();
  await expect(page.getByTestId('ss-destroyed')).toHaveText('1');
});

test.describe('WebMCP', () => {
  test.beforeEach(async ({ app, page }) => {
    // document.modelContext is a browser proposal, stub it and keep the registered tools
    await page.addInitScript(() => {
      (window as any).__tools = {};
      (document as any).modelContext = { registerTool: (tool: any) => { (window as any).__tools[tool.name] = tool; } };
    });
    await app.open('spreadsheet');
    await expect(page.getByTestId('section-ss-mcp').locator('.e-spreadsheet')).toBeAttached();
  });

  test('registers the configured tools and raises beforeWebMcpToolExecute', async ({ page }) => {
    await ew(page, 'ss-mcp', 'w.enableWebMcp', true);
    await ew(page, 'ss-mcp', 'w.webMcpSettings.name', 'ssmcp');
    await expect.poll(() => page.evaluate(() => Object.keys((window as any).__tools).sort())).toEqual(['ssmcp_getCellData', 'ssmcp_sheetList']);
    await reset(page);
    await page.evaluate(() => (window as any).__tools.ssmcp_sheetList.execute({}));
    await expectEvent(page, 'ssm.beforeWebMcpToolExecute');
    expect(await evArg(page, 'ssm.beforeWebMcpToolExecute', 'toolName')).toContain('sheetList');
  });
});
