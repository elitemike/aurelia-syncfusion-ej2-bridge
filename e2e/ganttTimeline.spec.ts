import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, widgetValue, expectEvent } = bridgeCtl('ej2-gantt', '__ganttEvents');

test.describe('Gantt timeline, calendar and templates', () => {
  test.beforeEach(async ({ app }) => { await app.open('gantt'); });

  const chartRows = (app: any, id: string) => app.section(id).locator('.e-chart-row');

  test('timelineSettings and zoomingLevels, the zoom toolbar changes the timeline', async ({ app }) => {
    const id = 'gantt-timeline';
    await expectWidget(app.page, id, 'w.timelineSettings.timelineViewMode', 'Week');
    await expectWidget(app.page, id, 'w.timelineSettings.timelineUnitSize', 80);
    await expectWidget(app.page, id, 'w.timelineSettings.weekStartDay', 1);
    await expectWidget(app.page, id, 'w.timelineSettings.weekendBackground', '#fde2e2');
    await expectWidget(app.page, id, 'w.zoomingLevels.length', 3);
    await expectWidget(app.page, id, 'w.toolbar', ['ZoomIn', 'ZoomOut', 'ZoomToFit']);
    const before = await widgetValue(app.page, id, 'w.timelineModule.topTierCollection.length');
    await app.section(id).locator('.e-toolbar .e-toolbar-item:has(.e-zoomin)').click();
    await expectEvent(app.page, 'zoomToolbarClick');
    await expectWidget(app.page, id, 'w.currentZoomingLevel.timelineViewMode', 'Day');
    expect(before).toBeGreaterThan(0);
    await app.section(id).locator('.e-toolbar .e-toolbar-item:has(.e-zoomout)').click();
    await expectWidget(app.page, id, 'w.currentZoomingLevel.timelineViewMode', 'Week');
  });

  test('calendar: weekends, holidays, markers and working time', async ({ app }) => {
    const id = 'gantt-calendar';
    await expectWidget(app.page, id, 'w.highlightWeekends', true);
    await expectWidget(app.page, id, 'w.holidays.length', 1);
    await expectWidget(app.page, id, 'w.eventMarkers.length', 1);
    await expectWidget(app.page, id, 'w.dayWorkingTime.length', 2);
    await expectWidget(app.page, id, 'w.weekWorkingTime[0].dayOfWeek', 'Friday');
    await expectWidget(app.page, id, 'w.calendarSettings.taskCalendars[0].calendarId', 'half');
    await expectWidget(app.page, id, 'w.timelineSettings.timelineViewMode', 'Hour');
    await expect(app.section(id).locator('.e-event-markers, .e-gantt-event-markers').filter({ hasText: 'Kickoff' }).first()).toBeAttached();
    await expect(app.section(id).locator('.gantt-holiday').first()).toBeAttached();
    await expect(app.section(id).locator('.e-weekend, .e-weekend-container').first()).toBeAttached();
  });

  test('baseline template and critical path', async ({ app }) => {
    const id = 'gantt-baseline';
    await expectWidget(app.page, id, 'w.renderBaseline', true);
    await expectWidget(app.page, id, 'w.enableCriticalPath', true);
    await expectWidget(app.page, id, 'typeof w.baselineTemplate', 'string');
    await expect(app.section(id).locator('.gantt-baseline-template').first()).toBeAttached();
    await expectWidget(app.page, id, 'w.criticalPathModule.criticalTasks.length > 0', true);
  });

  test('taskbar, parent taskbar, milestone and timeline templates render', async ({ app }) => {
    const id = 'gantt-templates';
    await expect(app.section(id).locator('.gantt-taskbar-template').first()).toBeAttached();
    await expect(app.section(id).locator('.gantt-milestone-template').first()).toBeAttached();
    await expect(app.section(id).locator('.gantt-timeline-template').first()).toBeAttached();
    await expectWidget(app.page, id, 'typeof w.parentTaskbarTemplate', 'string');
  });

  test('virtualization renders only a window of rows and timeline', async ({ app }) => {
    const id = 'gantt-virtual';
    await expectWidget(app.page, id, 'w.enableVirtualization', true);
    await expectWidget(app.page, id, 'w.enableTimelineVirtualization', true);
    expect(await chartRows(app, id).count()).toBeLessThan(200);
    expect(await chartRows(app, id).count()).toBeGreaterThan(0);
  });

  test('infinite timeline scroll extends the timeline', async ({ app }) => {
    const id = 'gantt-infinite';
    await expectWidget(app.page, id, 'w.enableInfiniteTimelineScroll', true);
    const before = await widgetValue(app.page, id, 'w.timelineModule.totalTimelineWidth');
    await app.section(id).locator('.e-chart-scroll-container').evaluate((el: HTMLElement) => { el.scrollLeft = el.scrollWidth; });
    await expect.poll(() => widgetValue(app.page, id, 'w.timelineModule.totalTimelineWidth')).toBeGreaterThan(before);
  });

  test('inline notes and unscheduled tasks', async ({ app }) => {
    const id = 'gantt-notes';
    await expectWidget(app.page, id, 'w.showInlineNotes', true);
    await expectWidget(app.page, id, 'w.allowUnscheduledTasks', true);
    await expect(app.section(id).locator('.e-right-label-container, .e-gantt-notes-label, .e-label').filter({ hasText: 'Inline note text' }).first()).toBeAttached();
    await expect(chartRows(app, id).nth(1).locator('.e-taskbar-main-container')).toHaveCount(0);
  });
});
