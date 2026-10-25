import { test, expect } from './fixtures';
import { chartHost, inst, chartId, center, eventCount, eventLast } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('accumulationChart'));

const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);
const basic = (app) => chartHost(app.section('acc-basic'), 'acc-basic');

test('pie series renders every point with the injected modules', async ({ app }) => {
  const host = basic(app);
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  expect(await inst(host, (c) => c.visibleSeries[0].points.length)).toBe(5);
  expect(await inst(host, (c) => [!!c.pieSeriesModule, !!c.accumulationLegendModule, !!c.accumulationDataLabelModule, !!c.accumulationTooltipModule]))
    .toEqual([true, true, true, true]);
  await expect(host.locator('[id*="_Series_0_Point_4"]').first()).toBeAttached();
});

test('title, subTitle and their styles', async ({ app }) => {
  const host = basic(app);
  const id = await chartId(host);
  const title = host.locator(`text[id="${id}_title"]`);
  await expect(title).toHaveText('Browser share');
  await expect(title).toHaveAttribute('fill', '#c0392b');
  await expect(title).toHaveAttribute('font-size', '18px');
  const sub = host.locator(`text[id="${id}_subTitle"]`);
  await expect(sub).toHaveText('Desktop 2024');
  await expect(sub).toHaveAttribute('fill', '#2980b9');
});

test('width, height, margin, border, background and center', async ({ app }) => {
  const host = basic(app);
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('width', '640');
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('height', '360');
  const border = host.locator('rect[id$="_border"]');
  await expect(border).toHaveAttribute('stroke', '#27ae60');
  await expect(border).toHaveAttribute('stroke-width', '3');
  await expect(border).toHaveAttribute('fill', '#fffbe6');
  expect(await inst(host, (c) => [c.margin.left, c.margin.right])).toEqual([15, 25]);
  expect(await inst(host, (c) => [c.center.x, c.center.y, c.theme])).toEqual(['40%', '55%', 'Material']);
});

test('legend, tooltip, data labels, explode and smart labels', async ({ app, page }) => {
  const host = basic(app);
  const id = await chartId(host);
  await expect(host.locator('text[id*="_chart_legend_text_"]')).toHaveText(['Chrome', 'Safari', 'Edge', 'Firefox', 'Other']);
  await expect(host.locator('text[id$="_chart_legend_title"]')).toHaveText('Browsers');
  await expect(host.locator('text[id*="_datalabel_Series_0_text_"]').first()).toHaveText('61.3%');
  expect(await inst(host, (c) => [c.visibleSeries[0].points[0].isExplode, c.enableSmartLabels])).toEqual([true, true]);
  const slice = host.locator('[id$="_Series_0_Point_1"]').first();
  // other charts are still rendering and shifting the page, so aim again on every attempt
  await expect(async () => {
    const c = await center(slice);
    await page.mouse.move(c.x - 15, c.y - 15);
    await page.mouse.move(c.x, c.y, { steps: 5 });
    await expect(page.locator(`#${id}_tooltip`)).toContainText(/Safari.*24\.2%/, { timeout: 1500 });
  }).toPass();
  // legend click hides a point
  await host.locator('text[id$="_chart_legend_text_0_2"]').click();
  await expect.poll(() => inst(host, (ch) => ch.visibleSeries[0].points[2].visible)).toBe(false);
});

test('semi doughnut with center label', async ({ app }) => {
  const host = chartHost(app.section('acc-doughnut'), 'acc-doughnut');
  expect(await inst(host, (c) => [c.visibleSeries[0].innerRadius, c.visibleSeries[0].startAngle, c.visibleSeries[0].endAngle])).toEqual(['55%', 270, 90]);
  await expect(host.locator('text[id*="_centerLabel"]').first()).toContainText('Center');
});

test('funnel and pyramid series', async ({ app }) => {
  const funnel = chartHost(app.section('acc-funnel'), 'acc-funnel');
  expect(await inst(funnel, (c) => [c.visibleSeries[0].type, !!c.funnelSeriesModule])).toEqual(['Funnel', true]);
  await expect(funnel.locator('[id*="_Series_0_Point_0"]').first()).toBeAttached();
  const pyramid = chartHost(app.section('acc-funnel'), 'acc-pyramid');
  expect(await inst(pyramid, (c) => [c.visibleSeries[0].type, !!c.pyramidSeriesModule])).toEqual(['Pyramid', true]);
});

test('selection: preselected indexes, pattern, highlight and selectionComplete', async ({ app, page }) => {
  const host = chartHost(app.section('acc-selection'), 'acc-selection');
  expect(await inst(host, (c) => [c.selectionMode, c.highlightMode, c.selectionPattern, c.highlightPattern, c.highlightColor, c.isMultiSelect, c.enableBorderOnMouseMove]))
    .toEqual(['Point', 'Point', 'Dots', 'Chessboard', '#ff00ff', true, true]);
  await expect.poll(() => inst(host, (c) => c.accumulationSelectionModule.selectedDataIndexes.map((i) => `${i.series}:${i.point}`))).toEqual(['0:1']);
  await expect(host.locator('[id$="_Series_0_Point_1"]').first()).toHaveClass(/_ej2_chart_selection_series_0/);
  await host.locator('[id$="_Series_0_Point_3"]').first().click();
  await expect(host.locator('[id$="_Series_0_Point_3"]').first()).toHaveClass(/_ej2_chart_selection_series_0/);
  await fired(page, 'acc.selectionComplete');
  await expect(host.locator('pattern').first()).toBeAttached();
  const c = await center(host.locator('[id$="_Series_0_Point_0"]').first());
  await page.mouse.move(c.x, c.y);
  await expect(host.locator('[class*="_ej2_chart_highlight_series_0"]').first()).toBeAttached();
});

test('background image, sanitizer, accessibility and annotation', async ({ app, page }) => {
  const host = chartHost(app.section('acc-look'), 'acc-background');
  await expect(host.locator('image[id$="_background"]')).toHaveAttribute('href', /^data:image\/png/);
  expect(await inst(host, (c) => c.enableHtmlSanitizer)).toBe(true);
  expect(await page.evaluate(() => (window as any).__accxss)).toBeUndefined();
  expect(await inst(host, (c) => [c.accessibility.accessibilityDescription, c.accessibility.accessibilityRole, c.accessibility.focusable]))
    .toEqual(['browser chart', 'region', true]);
  expect(await inst(host, (c) => [c.focusBorderColor, c.focusBorderWidth, c.focusBorderMargin])).toEqual(['#ff0000', 4, 2]);
  await expect(host).toHaveAttribute('aria-label', 'browser chart');
  await expect(host.locator('#acc-annotation')).toHaveText('Total');
  expect(await inst(host, (c) => !!c.annotationModule)).toBe(true);
});

test('currencyCode and useGroupingSeparator format data labels', async ({ app }) => {
  const host = chartHost(app.section('acc-look'), 'acc-money');
  expect(await inst(host, (c) => [c.currencyCode, c.useGroupingSeparator])).toEqual(['EUR', true]);
  await expect(host.locator('text[id*="_datalabel_Series_0_text_"]').filter({ hasText: /^\$12,000$/ })).toHaveCount(1);
});

test('noDataTemplate and chart level dataSource', async ({ app }) => {
  await expect(app.section('acc-look').locator('#acc-no-data')).toHaveText('Nothing to show');
  const host = chartHost(app.section('acc-look'), 'acc-datasource');
  expect(await inst(host, (c) => c.visibleSeries[0].points.length)).toBe(5);
});

test('enableExport and allowExport load the export module', async ({ app, page }) => {
  const host = chartHost(app.section('acc-look'), 'acc-export');
  expect(await inst(host, (c) => [c.enableExport, c.allowExport, !!c.exportModule])).toEqual([true, true, true]);
});

test('rendering events fire', async ({ app, page }) => {
  const host = chartHost(app.section('acc-events'), 'acc-events');
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  for (const n of ['acc.load', 'acc.loaded', 'acc.animationComplete', 'acc.seriesRender', 'acc.legendRender', 'acc.textRender', 'acc.pointRender', 'acc.annotationRender']) {
    await fired(page, n);
  }
  expect((await eventLast(page, 'acc.legendRender')).text).toBeTruthy();
});

test('mouse, point, legend and tooltip events', async ({ app, page }) => {
  const host = chartHost(app.section('acc-events'), 'acc-events');
  await fired(page, 'acc.animationComplete');
  const c = await center(host.locator('[id$="_Series_0_Point_1"]').first());
  await page.mouse.move(c.x - 10, c.y);
  await page.mouse.move(c.x, c.y, { steps: 4 });
  await fired(page, 'acc.chartMouseMove');
  await fired(page, 'acc.pointMove');
  await fired(page, 'acc.tooltipRender');
  await page.mouse.down();
  await fired(page, 'acc.chartMouseDown');
  await page.mouse.up();
  await fired(page, 'acc.chartMouseUp');
  await fired(page, 'acc.chartMouseClick');
  await fired(page, 'acc.pointClick');
  expect(await eventLast(page, 'acc.pointClick')).toMatchObject({ pointIndex: 1 });
  await page.mouse.dblclick(c.x, c.y);
  await fired(page, 'acc.chartDoubleClick');
  await host.locator('text[id$="_chart_legend_text_0_0"]').click();
  await fired(page, 'acc.legendClick');
  await page.mouse.move(2, 2, { steps: 5 });
  await fired(page, 'acc.chartMouseLeave');
});

test('resize, export and print events', async ({ app, page }) => {
  const host = chartHost(app.section('acc-events'), 'acc-events');
  await fired(page, 'acc.animationComplete');
  await page.setViewportSize({ width: 900, height: 700 });
  await fired(page, 'acc.beforeResize');
  await fired(page, 'acc.resized');
  const download = page.waitForEvent('download');
  await host.evaluate((el: any) => el.ej2_instances[0].export('PNG', 'acc'));
  await download;
  await fired(page, 'acc.beforeExport');
  await fired(page, 'acc.afterExport');
  const popup = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  await host.evaluate((el: any) => el.ej2_instances[0].print());
  await fired(page, 'acc.beforePrint');
  const p = await popup;
  if (p) { await p.close().catch(() => undefined); }
});
