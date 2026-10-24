import { Page, Locator } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app, page }) => {
  // a stand-in for the WebMCP registry so the widget has somewhere to register its tools
  await page.addInitScript(() => {
    const tools: any[] = [];
    (window as any).__mcpTools = tools;
    (document as any).modelContext = { registerTool: (tool: any) => { tools.push(tool); } };
  });
  await app.open('schedule');
});

/** Read properties from the Syncfusion Schedule behind an `ej2-schedule` element. */
function widgetProps(page: Page, testId: string, names: string[]): Promise<Record<string, any>> {
  return page.evaluate(([id, props]) => {
    const w = (document.querySelector(`[data-testid="${id}"]`) as any).au['ej2-schedule'].viewModel.widget;
    // complex properties are model instances, reduce them to their plain values
    const plain = (v: any): any => {
      if (Array.isArray(v)) { return v.map(plain); }
      if (v && typeof v === 'object' && !(v instanceof Date)) {
        const source = v.properties || (v.constructor === Object ? v : null);
        if (!source) { return undefined; }
        const out: Record<string, any> = {};
        Object.keys(source).forEach(k => { out[k] = plain(source[k]); });
        return out;
      }
      return v;
    };
    const result: Record<string, any> = {};
    (props as string[]).forEach(p => { result[p] = plain(w[p]); });
    return result;
  }, [testId, names] as [string, string[]]);
}

function counter(section: Locator, name: string) {
  return section.getByTestId(`ev-${name}`);
}

async function count(section: Locator, name: string) {
  return Number(await counter(section, name).textContent());
}

/** Wait until the event counter shows at least one occurrence. */
async function expectFired(section: Locator, name: string) {
  await expect.poll(() => count(section, name), { message: `${name} fired` }).toBeGreaterThan(0);
}

test('renders the bound week with its events', async ({ app }) => {
  const section = app.section('sch-week');
  await expect(section.locator('.e-schedule-toolbar .e-date-range')).toContainText('May 12 - 18, 2024');
  await expect(section.locator('.e-appointment')).toHaveCount(3);
  await expect(section.locator('.e-appointment', { hasText: 'Planning' })).toBeVisible();
});

test('view switching from the toolbar', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-toolbar-item.e-month').click();
  await expect(section.locator('.e-month-view')).toBeVisible();
  await section.locator('.e-toolbar-item.e-agenda').click();
  await expect(section.locator('.e-table-wrap.e-agenda-view')).toBeVisible();
});

test('navigation moves the date range and raises navigating', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-toolbar-item.e-next').click();
  await expect(section.locator('.e-date-range')).toContainText('May 19 - 25, 2024');
  await expect(counter(section, 'navigating')).not.toHaveText('0');
  await expect(section.getByTestId('ev-navigating-last')).toHaveText('date');
  await section.locator('.e-toolbar-item.e-prev').click();
  await expect(section.locator('.e-date-range')).toContainText('May 12 - 18, 2024');
});

test('eventClick event carries the appointment data', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-appointment', { hasText: 'Review' }).click();
  await expect(section.getByTestId('sch-clicked')).toHaveText('Review');
  await expect(section.getByTestId('sch-click-count')).toHaveText('1');
});

test('selectedDate and currentView follow the view-model', async ({ app, page }) => {
  const section = app.section('sch-week');
  await section.getByTestId('sch-goto-june').click();
  await expect(section.locator('.e-date-range')).toContainText('June 02 - 08, 2024');
  await section.getByTestId('sch-day-view').click();
  await expect(section.locator('.e-date-range')).toContainText('June 5, 2024');
  expect((await widgetProps(page, 'sch-week', ['currentView'])).currentView).toBe('Day');
});

test('lifecycle and rendering events fire', async ({ app }) => {
  const section = app.section('sch-week');
  for (const name of ['created', 'dataBinding', 'dataBound', 'renderCell', 'actionBegin', 'actionComplete']) {
    await expectFired(section, name);
  }
  await expect.poll(() => count(section, 'eventRendered')).toBeGreaterThanOrEqual(3);
  await expect(section.getByTestId('ev-eventRendered-last')).not.toHaveText('');
});

test('model configuration starts in month view', async ({ app }) => {
  const section = app.section('sch-model');
  await expect(section.locator('.e-month-view')).toBeVisible();
  await expect(section.locator('.e-appointment').first()).toBeVisible();
});

test('layout options reach the widget and the DOM, and follow the view-model', async ({ app, page }) => {
  const section = app.section('sch-layout');
  const names = ['width', 'height', 'cssClass', 'startHour', 'endHour', 'workHours', 'workDays', 'firstDayOfWeek', 'showWeekend',
    'showWeekNumber', 'weekRule', 'timeScale', 'timeFormat', 'dateFormat', 'showHeaderBar', 'showTimeIndicator',
    'currentTimeIndicatorSettings', 'rowAutoHeight', 'enableAllDayScroll', 'timezone', 'timezoneDataSource', 'calendarMode',
    'enableHtmlSanitizer'];
  const initial = await widgetProps(page, 'sch-layout', names);
  expect(initial).toMatchObject({
    width: '900px', height: '460px', cssClass: 'my-sch', startHour: '08:00', endHour: '20:00',
    workHours: { highlight: true, start: '10:00', end: '16:00' }, workDays: [1, 2, 3, 4], firstDayOfWeek: 1, showWeekend: true,
    showWeekNumber: true, weekRule: 'FirstFullWeek', timeScale: { enable: true, interval: 60, slotCount: 4 },
    timeFormat: 'HH:mm', dateFormat: 'dd MMM yyyy', showHeaderBar: true, showTimeIndicator: true,
    currentTimeIndicatorSettings: { showTime: false, showPreviousDates: true, onTop: true }, rowAutoHeight: false,
    enableAllDayScroll: true, timezone: 'UTC', calendarMode: 'Gregorian', enableHtmlSanitizer: true
  });
  expect(initial.timezoneDataSource).toEqual([{ Value: 'UTC', Text: 'UTC' }, { Value: 'Europe/Paris', Text: 'Paris' }]);

  const schedule = section.locator('.e-schedule');
  await expect(schedule).toHaveClass(/my-sch\b/);
  await expect(schedule).toHaveCSS('width', '900px');
  await expect(section.locator('.e-week-number').first()).toBeVisible();
  await expect(section.locator('.e-date-range')).toContainText('13 May 2024 - 19 May 2024');
  await expect(section.locator('.e-time-slots span').first()).toHaveText('08:00');
  await expect(section.locator('.e-date-header-wrap .e-header-cells')).toHaveCount(7);
  await expect(section.locator('.e-date-header-wrap .e-header-cells').first()).toContainText('Mon');

  await section.getByTestId('sch-flip-layout').click();
  await expect(schedule).toHaveClass(/my-sch2/);
  await expect(section.locator('.e-week-number')).toHaveCount(0);
  await expect(section.locator('.e-schedule-toolbar')).toBeHidden();
  await expect(section.locator('.e-time-slots span').first()).toHaveText('09:00 AM');
  await expect(section.locator('.e-date-header-wrap .e-header-cells')).toHaveCount(5); // weekends are hidden
  await expect.poll(async () => (await widgetProps(page, 'sch-layout', names)).cssClass).toBe('my-sch2');
  expect(await widgetProps(page, 'sch-layout', names)).toMatchObject({
    width: '800px', height: '400px', startHour: '09:00', endHour: '18:00', workDays: [1, 2, 3, 4, 5], firstDayOfWeek: 0,
    showWeekend: false, showWeekNumber: false, timeFormat: 'hh:mm a', showHeaderBar: false, rowAutoHeight: true
  });
});

test('toolbarItems, views and templates render', async ({ app, page }) => {
  const section = app.section('sch-toolbar');
  await expect(section.locator('.e-toolbar-item.e-day')).toBeVisible();
  await expect(section.locator('.e-toolbar-item.e-week')).toBeVisible();
  await expect(section.locator('.e-toolbar-item.e-month')).toHaveCount(0);
  await expect(section.locator('.e-toolbar-item.e-add')).toBeVisible();
  await expect(section.locator('.tpl-range')).toHaveText('Range template');
  await expect(section.locator('.tpl-date')).toHaveCount(7);
  await expect(section.locator('.tpl-cell').first()).toBeAttached();
  const views = await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="sch-toolbar"]') as any).au['ej2-schedule'].viewModel.widget;
    return w.views.map((v: any) => (typeof v === 'string' ? v : v.option));
  });
  expect(views).toEqual(['Day', 'Week']);
  expect((await widgetProps(page, 'sch-toolbar', ['toolbarItems'])).toolbarItems.length).toBe(6);
});

test('month view: cellHeaderTemplate and moreEventsClick', async ({ app }) => {
  const section = app.section('sch-month');
  await expect(section.locator('.tpl-cell-header').first()).toBeAttached();
  await section.locator('.e-more-indicator').first().click();
  await expectFired(section, 'moreEventsClick');
  await expect(section.getByTestId('ev-moreEventsClick-last')).toHaveText('Day');
});

test('agenda view options', async ({ app, page }) => {
  const section = app.section('sch-agenda');
  expect(await widgetProps(page, 'sch-agenda', ['agendaDaysCount', 'hideEmptyAgendaDays', 'monthsCount']))
    .toEqual({ agendaDaysCount: 3, hideEmptyAgendaDays: false, monthsCount: 6 });
  await expect(section.locator('.e-table-wrap.e-agenda-view')).toBeVisible();
  // May 20 has no events: hideEmptyAgendaDays false still lists the three days of agendaDaysCount
  await expect(section.locator('.e-agenda-item', { hasText: 'No events' })).toHaveCount(3);
});

test('timeline year: header templates, firstMonthOfYear and headerRows', async ({ app, page }) => {
  const section = app.section('sch-year');
  expect(await widgetProps(page, 'sch-year', ['firstMonthOfYear', 'headerRows'])).toMatchObject({
    firstMonthOfYear: 3, headerRows: [{ option: 'Year' }, { option: 'Month' }]
  });
  await expect(section.locator('.tpl-day-header').first()).toBeAttached();
  await expect(section.locator('.tpl-month-header').first()).toBeAttached();
});

test('behaviour flags reach the widget and follow the view-model', async ({ app, page }) => {
  const section = app.section('sch-flags');
  const names = ['readonly', 'allowDragAndDrop', 'allowResizing', 'allowMultiDrag', 'allowKeyboardInteraction', 'allowSwiping',
    'allowOverlap', 'allowInline', 'allowMultiCellSelection', 'allowMultiRowSelection', 'quickInfoOnSelectionEnd', 'showQuickInfo',
    'enableRecurrenceValidation', 'prerenderDialogs', 'overscanCount', 'enableAdaptiveUI', 'minDate', 'maxDate'];
  expect(await widgetProps(page, 'sch-flags', names)).toEqual({
    readonly: false, allowDragAndDrop: false, allowResizing: false, allowMultiDrag: true, allowKeyboardInteraction: false,
    allowSwiping: false, allowOverlap: false, allowInline: true, allowMultiCellSelection: false, allowMultiRowSelection: false,
    quickInfoOnSelectionEnd: true, showQuickInfo: false, enableRecurrenceValidation: false, prerenderDialogs: true,
    overscanCount: 5, enableAdaptiveUI: true, minDate: new Date(2024, 4, 13), maxDate: new Date(2024, 4, 19)
  });
  // allowResizing false: no resize handles are rendered
  await expect(section.locator('.e-appointment .e-event-resize')).toHaveCount(0);
  await section.getByTestId('sch-flip-flags').click();
  await expect.poll(async () => (await widgetProps(page, 'sch-flags', ['readonly'])).readonly).toBe(true);
  expect(await widgetProps(page, 'sch-flags', names)).toEqual({
    readonly: true, allowDragAndDrop: true, allowResizing: true, allowMultiDrag: false, allowKeyboardInteraction: true,
    allowSwiping: true, allowOverlap: true, allowInline: false, allowMultiCellSelection: true, allowMultiRowSelection: true,
    quickInfoOnSelectionEnd: false, showQuickInfo: true, enableRecurrenceValidation: true, prerenderDialogs: true,
    overscanCount: 3, enableAdaptiveUI: false, minDate: new Date(2024, 4, 10), maxDate: new Date(2024, 4, 25)
  });
});

test('cell, selection, popup, hover and tooltip events', async ({ app, page }) => {
  const section = app.section('sch-interact');
  const cell = section.locator('.e-work-cells').nth(30);
  await cell.click();
  await expectFired(section, 'cellClick');
  await expectFired(section, 'select');
  await expectFired(section, 'popupOpen');
  await expect(section.getByTestId('ev-popupOpen-last')).toHaveText('QuickInfo');
  await page.keyboard.press('Escape');
  await expectFired(section, 'popupClose');

  await section.locator('.e-work-cells').nth(60).dblclick();
  await expectFired(section, 'cellDoubleClick');
  await expect(section.getByTestId('ev-popupOpen-last')).toHaveText('Editor');
  await page.locator('.e-dialog.e-popup-open .e-event-cancel').click();

  await section.locator('.e-appointment', { hasText: 'Review' }).dblclick();
  await expectFired(section, 'eventDoubleClick');
  await expect(section.getByTestId('ev-eventDoubleClick-last')).toHaveText('Review');
  await page.locator('.e-dialog.e-popup-open .e-event-cancel').click();

  await section.locator('.e-work-cells').nth(5).hover();
  await expectFired(section, 'hover');
  await section.locator('.e-appointment', { hasText: 'Planning' }).hover();
  await expectFired(section, 'tooltipOpen');
  await expect(page.locator('.e-schedule-event-tooltip, .e-tooltip-wrap').first()).toContainText('Planning');
});

test('clipboard: beforePaste fires when pasting a copied appointment', async ({ app, page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const section = app.section('sch-interact');
  await section.locator('.e-appointment', { hasText: 'Review' }).click();
  await page.keyboard.press('Control+c');
  await section.locator('.e-work-cells').nth(40).click();
  await page.keyboard.press('Escape'); // close the quick info of the cell, a paste is ignored while it is open
  // headless Chromium does not deliver the native paste for the shortcut, so replay it with the copied text
  await page.evaluate(async () => {
    const data = new DataTransfer();
    data.setData('text', await navigator.clipboard.readText());
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
  });
  await expectFired(section, 'beforePaste');
});

test('drag and resize events fire for real mouse gestures', async ({ app, page }) => {
  const section = app.section('sch-drag');
  expect(await widgetProps(page, 'sch-drag', ['allowDragAndDrop', 'allowResizing', 'allowMultiDrag', 'eventDragArea', 'showQuickInfo']))
    .toEqual({ allowDragAndDrop: true, allowResizing: true, allowMultiDrag: true, eventDragArea: '#sch-drag-area', showQuickInfo: false });
  const appt = section.locator('.e-appointment', { hasText: 'Review' });
  await appt.scrollIntoViewIfNeeded();
  const box = (await appt.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 40, { steps: 5 });
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 90, { steps: 5 });
  await page.mouse.up();
  for (const name of ['dragStart', 'drag', 'dragStop']) { await expectFired(section, name); }
  await expect(section.getByTestId('ev-dragStop-last')).toHaveText('Review');

  const planning = section.locator('.e-appointment', { hasText: 'Planning' });
  await planning.scrollIntoViewIfNeeded();
  await planning.hover();
  const handle = (await planning.locator('.e-bottom-handler').boundingBox())!;
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + 30, { steps: 5 });
  await page.mouse.move(handle.x + handle.width / 2, handle.y + 60, { steps: 5 });
  await page.mouse.up();
  for (const name of ['resizeStart', 'resizing', 'resizeStop']) { await expectFired(section, name); }
});

test('resources, group and resource templates', async ({ app, page }) => {
  const section = app.section('sch-resources');
  await expect(section.locator('.tpl-resource')).toHaveCount(2);
  await expect(section.locator('.tpl-indent').first()).toBeAttached();
  const props = await widgetProps(page, 'sch-resources', ['group', 'resources']);
  expect(props.group.resources).toEqual(['Rooms']);
  expect(props.resources[0].name).toBe('Rooms');
  await expect(section.locator('.e-appointment')).toHaveCount(2);
});

test('selectedResource with the adaptive UI', async ({ app, page }) => {
  const props = await widgetProps(page, 'sch-adaptive', ['selectedResource', 'enableAdaptiveUI']);
  expect(props).toEqual({ selectedResource: 2, enableAdaptiveUI: true });
  await expect(app.section('sch-adaptive').locator('.e-schedule')).toHaveClass(/e-device|e-adaptive/);
});

test('editor header, footer and quick info templates', async ({ app, page }) => {
  const section = app.section('sch-editor');
  await section.locator('.e-work-cells').nth(30).click();
  const quick = page.locator('.e-quick-popup-wrapper.e-popup-open');
  await expect(quick.locator('.tpl-qi-header')).toBeVisible();
  await expect(quick.locator('.tpl-qi-content')).toBeVisible();
  await expect(quick.locator('.tpl-qi-footer')).toBeVisible();
  await section.locator('.e-work-cells').nth(60).dblclick();
  await expect(page.locator('.tpl-editor-header')).toBeVisible();
  await expect(page.locator('.tpl-editor-footer')).toBeVisible();
});

test('editorTemplate replaces the editor body', async ({ app, page }) => {
  const section = app.section('sch-editor-body');
  await section.locator('.e-work-cells').nth(60).dblclick();
  await expect(page.locator('.e-schedule-dialog .tpl-editor')).toBeVisible();
  // dialogs are created on demand here
  expect((await widgetProps(page, 'sch-editor-body', ['prerenderDialogs'])).prerenderDialogs).toBe(false);
});

test('print and excel export raise their events', async ({ app }) => {
  const section = app.section('sch-export');
  await section.getByTestId('sch-print').click();
  await expect(counter(section, 'beforePrint')).toHaveText('1');
  await section.getByTestId('sch-export-excel').click();
  await expect(counter(section, 'excelExport')).toHaveText('1');
});

test('WebMCP tools register and raise beforeWebMcpToolExecute', async ({ app, page }) => {
  const section = app.section('sch-mcp');
  const props = await widgetProps(page, 'sch-mcp', ['enableWebMcp', 'webMcpSettings']);
  expect(props).toMatchObject({ enableWebMcp: true, webMcpSettings: { name: 'sched' } });
  await expect.poll(() => page.evaluate(() => (window as any).__mcpTools.length)).toBeGreaterThan(0);
  await page.evaluate(() => {
    const tool = (window as any).__mcpTools[0];
    tool.execute({});
  });
  await expectFired(section, 'beforeWebMcpToolExecute');
  await expect(section.getByTestId('ev-beforeWebMcpToolExecute-last')).toContainText('sched_');
});

test('virtual scrolling raises its events', async ({ app }) => {
  const section = app.section('sch-virtual');
  await expect(section.locator('.e-appointment').first()).toBeAttached();
  await section.locator('.e-content-wrap').evaluate(el => { el.scrollTop = 1200; el.dispatchEvent(new Event('scroll')); });
  await expectFired(section, 'virtualScrollStart');
  await expectFired(section, 'virtualScrollStop');
});

test('actionFailure fires when the data request fails', async ({ app }) => {
  await expectFired(app.section('sch-failure'), 'actionFailure');
});

test('if.bind destroys and recreates the widget and raises destroyed', async ({ app }) => {
  const section = app.section('sch-lifecycle');
  await expect(section.locator('.e-schedule')).toHaveCount(1);
  await expect(counter(section, 'destroyed')).toHaveText('0');
  await section.getByTestId('sch-toggle').click();
  await expect(section.locator('.e-schedule')).toHaveCount(0);
  await expect(counter(section, 'destroyed')).toHaveText('1');
  await section.getByTestId('sch-toggle').click();
  await expect(section.locator('.e-schedule')).toHaveCount(1);
});
