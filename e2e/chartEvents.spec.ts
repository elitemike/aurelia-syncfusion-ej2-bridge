import { test, expect } from './fixtures';
import { visibleBox, chartHost, inst, chartId, center, eventCount, eventLast } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('chart'));

const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);

test('rendering events fire while the chart renders', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events'), 'chart-events');
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  for (const name of ['load', 'loaded', 'animationComplete', 'legendRender', 'textRender', 'pointRender', 'seriesRender',
    'axisLabelRender', 'axisRangeCalculated', 'axisMultiLabelRender', 'annotationRender']) {
    await fired(page, name);
  }
  // args carry what the render hooks give: series name, text, axis name
  expect((await eventLast(page, 'axisLabelRender')).text).toBeTruthy();
  expect(await eventLast(page, 'legendRender')).toMatchObject({ text: expect.any(String) });
  expect(await eventLast(page, 'seriesRender')).toBeTruthy();
});

test('mouse events: move, down, up, click, point events, double click and leave', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events'), 'chart-events');
  await fired(page, 'loaded');
  const point = host.locator('[id$="_Series_0_Point_2"]').first();
  const box = await visibleBox(point);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x - 20, y);
  await page.mouse.move(x, y, { steps: 4 });
  await fired(page, 'chartMouseMove');
  await fired(page, 'pointMove');
  await fired(page, 'tooltipRender');
  await fired(page, 'crosshairLabelRender');
  await page.mouse.down();
  await fired(page, 'chartMouseDown');
  await page.mouse.up();
  await fired(page, 'chartMouseUp');
  await fired(page, 'chartMouseClick');
  await fired(page, 'pointClick');
  expect(await eventLast(page, 'pointClick')).toMatchObject({ pointIndex: 2, seriesIndex: 0 });
  await page.mouse.dblclick(x, y);
  await fired(page, 'chartDoubleClick');
  await fired(page, 'pointDoubleClick');
  await page.mouse.move(2, 2, { steps: 5 });
  await fired(page, 'chartMouseLeave');
});

test('axisLabelClick, legendClick and multiLevelLabelClick', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events'), 'chart-events');
  await fired(page, 'loaded');
  await host.locator('text[id*="_AxisLabel_"]').filter({ hasText: 'Jan' }).first().click();
  await fired(page, 'axisLabelClick');
  expect((await eventLast(page, 'axisLabelClick')).text).toBe('Jan');
  await host.locator('text[id*="_chart_legend_text_0"]').click();
  await fired(page, 'legendClick');
  await host.locator('text[id*="_Axis_MultiLevelLabel"]').filter({ hasText: 'Q1' }).click();
  await fired(page, 'multiLevelLabelClick');
});

test('resize raises beforeResize and resized', async ({ app, page }) => {
  await chartHost(app.section('chart-events'), 'chart-events').locator('svg[id$="_svg"]').waitFor();
  await fired(page, 'loaded');
  await page.setViewportSize({ width: 900, height: 700 });
  await fired(page, 'beforeResize');
  await fired(page, 'resized');
});

test('print raises beforePrint and export raises beforeExport and afterExport', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events'), 'chart-events');
  await fired(page, 'loaded');
  const download = page.waitForEvent('download');
  await host.evaluate((el: any) => el.ej2_instances[0].export('PNG', 'events'));
  await download;
  await fired(page, 'beforeExport');
  await fired(page, 'afterExport');
  const popup = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  await host.evaluate((el: any) => el.ej2_instances[0].print());
  await fired(page, 'beforePrint');
  const p = await popup;
  if (p) { await p.close().catch(() => undefined); }
});

test('sharedTooltipRender fires for a shared tooltip', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-shared'), 'chart-events-shared');
  const box = await visibleBox(host.locator('[id$="_Series_0_Point_1"]').first());
  await page.mouse.move(box.x + box.width / 2, box.y + 3, { steps: 4 });
  await fired(page, 'sharedTooltipRender');
});

test('selection zooming raises onZooming and zoomComplete', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-zoom'), 'chart-events-zoom');
  const id = await chartId(host);
  const b = await visibleBox(host.locator(`rect[id="${id}_ChartAreaBorder"]`));
  await page.mouse.move(b.x + b.width * 0.2, b.y + b.height * 0.2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5, { steps: 6 });
  await page.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.6, { steps: 6 });
  await page.mouse.up();
  await fired(page, 'onZooming');
  await fired(page, 'zoomComplete');
});

test('clicking a point in Point selection mode raises selectionComplete', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-select'), 'chart-events-select');
  await host.locator('[id$="_Series_0_Point_2"]').first().click();
  await fired(page, 'selectionComplete');
  expect(await inst(host, (c) => c.selectionModule.selectedDataIndexes.map((i) => `${i.series}:${i.point}`))).toEqual(['0:2']);
});

test('drag selection raises dragComplete', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-dragselect'), 'chart-events-dragselect');
  const id = await chartId(host);
  const b = await visibleBox(host.locator(`rect[id="${id}_ChartAreaBorder"]`));
  await page.mouse.move(b.x + b.width * 0.1, b.y + b.height * 0.1);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5, { steps: 6 });
  await page.mouse.move(b.x + b.width * 0.7, b.y + b.height * 0.9, { steps: 6 });
  await page.mouse.up();
  await fired(page, 'dragComplete');
});

test('axis scrollbar raises scrollStart, scrollChanged and scrollEnd', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-scroll'), 'chart-events-scroll');
  const thumb = host.locator('[id$="_scrollBarThumb_primaryXAxis"]');
  const c = await center(thumb);
  await page.mouse.move(c.x, c.y);
  await page.mouse.down();
  await page.mouse.move(c.x + 60, c.y, { steps: 8 });
  await page.mouse.up();
  await fired(page, 'scrollStart');
  await fired(page, 'scrollChanged');
  // the lazy scrollbar reports the end of a scroll step when an arrow button is pressed
  await host.locator('[id$="_scrollBar_rightArrow_primaryXAxis"]').click({ force: true });
  await fired(page, 'scrollEnd');
});

test('dragging a point raises dragStart, drag and dragEnd', async ({ app, page }) => {
  const host = chartHost(app.section('chart-events-drag'), 'chart-events-drag');
  const marker = host.locator('[id$="_Series_0_Point_1_Symbol"]');
  const c = await center(marker);
  await page.mouse.move(c.x, c.y);
  await page.mouse.down();
  await page.mouse.move(c.x, c.y - 40, { steps: 8 });
  await page.mouse.up();
  await fired(page, 'dragStart');
  await fired(page, 'drag');
  await fired(page, 'dragEnd');
  // the dragged point value changed
  expect(await inst(host, (ch) => ch.visibleSeries[0].points[1].yValue)).toBeGreaterThan(20);
});
