import { test, expect } from './fixtures';
import { visibleBox, chartHost, inst, chartId, center, eventCount, eventLast } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('stockChart'));

const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);
const basic = (app) => chartHost(app.section('stock-basic'), 'stock-basic');

test('candle stock chart renders with period selector and range selector', async ({ app }) => {
  const host = basic(app);
  await expect(host.locator('svg').first()).toBeVisible();
  expect(await inst(host, (c) => c.series[0].type)).toBe('Candle');
  expect(await inst(host, (c) => [c.enablePeriodSelector, c.enableSelector, c.enableCustomRange, c.isSelect])).toEqual([true, true, true, true]);
  await expect(host.locator('[id*="_Series_0_Point_"]').first()).toBeAttached();
  // period selector toolbar, one button per period and the range selector below the chart
  await expect(host.locator('.e-toolbar').first()).toBeVisible();
  await expect(host.locator('.e-toolbar-item').filter({ hasText: '1M' })).toHaveCount(1);
  await expect(host.locator('.e-toolbar-item').filter({ hasText: '3M' })).toHaveCount(1);
  await expect(host.locator('[id*="RangeSelector"], [id*="_stockChart_rangeSelector"]').first()).toBeAttached();
});

test('title, size, margin, border, background, chartArea and theme', async ({ app }) => {
  const host = basic(app);
  const id = await chartId(host);
  await expect(host.locator('text[id*="_ChartTitle"]').first()).toHaveText('ACME stock price');
  await expect(host.locator('text[id*="_ChartTitle"]').first()).toHaveAttribute('fill', '#c0392b');
  await expect(host.locator('text[id*="_ChartTitle"]').first()).toHaveAttribute('font-size', '18px');
  expect(await inst(host, (c) => [c.width, c.height, c.theme])).toEqual(['900px', '460px', 'Material']);
  expect(await inst(host, (c) => [c.margin.left, c.margin.right, c.margin.top, c.margin.bottom])).toEqual([15, 25, 10, 10]);
  expect(await inst(host, (c) => [c.border.width, c.border.color, c.background])).toEqual([3, '#27ae60', '#fffbe6']);
  const border = host.locator(`rect[id*="${id}"][id*="Border"]`).first();
  await expect(border).toBeAttached();
  expect(await inst(host, (c) => c.chartArea.background)).toBe('#eef7ff');
});

test('chartArea follows the view-model', async ({ app }) => {
  const section = app.section('stock-basic');
  const host = chartHost(section, 'stock-basic');
  await section.getByTestId('stock-area-border').click();
  await expect.poll(() => inst(host, (c) => [c.chartArea.border.width, c.chartArea.border.color])).toEqual([3, '#123456']);
});

test('axes, tooltip, crosshair and legend settings reach the inner chart', async ({ app }) => {
  const host = basic(app);
  expect(await inst(host, (c) => [c.chart.primaryXAxis.valueType, c.chart.primaryYAxis.title, c.chart.primaryYAxis.labelFormat])).toEqual(['DateTime', 'Price', 'n0']);
  expect(await inst(host, (c) => [c.tooltip.enable, c.crosshair.enable, c.crosshair.lineType, c.legendSettings.visible, c.legendSettings.position]))
    .toEqual([true, true, 'Both', true, 'Top']);
  expect(await inst(host, (c) => [!!c.chart.tooltipModule, !!c.chart.crosshairModule, !!c.stockLegendModule])).toEqual([true, true, true]);
  await expect(host.locator('text[id*="_chart_legend_text_"]').first()).toHaveText('ACME');
  await expect(host.locator('text[id*="_AxisTitle_1"]').first()).toHaveText('Price');
});

test('periods are listed and selecting one changes the visible range', async ({ app, page }) => {
  const host = basic(app);
  await expect(host.locator('.e-toolbar-item').filter({ hasText: /^All$/ })).toHaveCount(1);
  const before = await inst(host, (c) => c.chart.primaryXAxis.visibleRange ? c.chart.primaryXAxis.visibleRange.min : 0);
  await host.locator('.e-toolbar-item').filter({ hasText: /^All$/ }).click();
  await expect.poll(() => inst(host, (c) => c.chart.primaryXAxis.visibleRange.min)).toBeLessThan(before);
  await fired(page, 'stock.rangeChange');
});

test('seriesType, indicatorType, trendlineType and exportType fill the toolbar dropdowns', async ({ app }) => {
  const host = basic(app);
  // the chart appends 'Hollow Candle' to the series types it was given
  expect(await inst(host, (c) => c.seriesType)).toEqual(expect.arrayContaining(['Line', 'Candle', 'Hilo', 'Column']));
  expect(await inst(host, (c) => [c.indicatorType, c.trendlineType, c.exportType])).toEqual([
    ['Sma', 'Ema', 'Rsi', 'BollingerBands'], ['Linear', 'Polynomial'], ['PNG', 'SVG', 'CSV']]);
  for (const name of ['Series', 'Indicators', 'Trendline', 'Export']) {
    await expect(host.locator('.e-toolbar-item.e-template').filter({ hasText: name }).first()).toBeAttached();
  }
  // modules for the listed indicators and trendlines were injected up front
  const modules = await inst(host, (c) => c.getInjectedModules().map((m) => m.prototype.getModuleName()));
  expect(modules).toEqual(expect.arrayContaining(['SmaIndicator', 'EmaIndicator', 'RsiIndicator', 'BollingerBandsIndicator', 'TrendLine', 'CandleSeries', 'HiloSeries']));
});

test('rendering events fire', async ({ app, page }) => {
  const host = basic(app);
  await expect(host.locator('svg').first()).toBeVisible();
  for (const n of ['stock.load', 'stock.loaded', 'stock.selectorRender', 'stock.legendRender', 'stock.axisLabelRender', 'stock.seriesRender']) {
    await fired(page, n);
  }
  expect((await eventLast(page, 'stock.axisLabelRender')).text).toBeTruthy();
});

test('mouse, point, tooltip and crosshair events', async ({ app, page }) => {
  const host = basic(app);
  await fired(page, 'stock.loaded');
  const id = await chartId(host);
  const area = await visibleBox(host.locator('[id*="_ChartAreaBorder"]').first());
  const x = area.x + area.width * 0.5;
  const y = area.y + area.height * 0.4;
  await page.mouse.move(x - 30, y);
  await page.mouse.move(x, y, { steps: 5 });
  await fired(page, 'stock.stockChartMouseMove');
  await fired(page, 'stock.crosshairLabelRender');
  await page.mouse.down();
  await fired(page, 'stock.stockChartMouseDown');
  await page.mouse.up();
  await fired(page, 'stock.stockChartMouseUp');
  await fired(page, 'stock.stockChartMouseClick');
  // hovering and clicking a candle raises the point events and the tooltip
  const candle = host.locator('[id*="_Series_0_Point_60"]').first();
  const c = await center(candle);
  await page.mouse.move(c.x, c.y, { steps: 5 });
  await fired(page, 'stock.pointMove');
  await fired(page, 'stock.tooltipRender');
  await page.mouse.click(c.x, c.y);
  await fired(page, 'stock.pointClick');
  expect(id).toBeTruthy();
});

test('legend click raises legendClick', async ({ app, page }) => {
  const host = basic(app);
  await host.locator('text[id*="_chart_legend_text_"]').first().click();
  await fired(page, 'stock.legendClick');
});

test('mouse wheel zooming raises onZooming', async ({ app, page }) => {
  const host = basic(app);
  await fired(page, 'stock.loaded');
  const b = await visibleBox(host.locator('[id*="_ChartAreaBorder"]').first());
  await page.mouse.move(b.x + b.width / 2 - 5, b.y + b.height / 2);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 3 });
  await page.mouse.wheel(0, -120);
  await fired(page, 'stock.onZooming');
  expect(await eventLast(page, 'stock.onZooming')).toBeTruthy();
});

test('exporting through the toolbar raises beforeExport', async ({ app, page }) => {
  const host = basic(app);
  await fired(page, 'stock.loaded');
  const download = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
  await host.locator('[id$="_export"]').click();
  // only the CSV / XLSX path raises beforeExport on the stock chart itself, image exports raise it on the inner chart
  await page.locator('.e-popup-open .e-item').filter({ hasText: /CSV/ }).first().click();
  await fired(page, 'stock.beforeExport');
  await download;
});

test('choosing an indicator raises beforeIndicatorChange and indicatorChanged', async ({ app, page }) => {
  const host = basic(app);
  await fired(page, 'stock.loaded');
  await host.locator('.e-toolbar-item').filter({ hasText: /Indicator/i }).first().click();
  await page.locator('.e-popup-open .e-item').filter({ hasText: /Sma/i }).first().click();
  await fired(page, 'stock.beforeIndicatorChange');
  await fired(page, 'stock.indicatorChanged');
});

test('chart level dataSource feeds the series', async ({ app }) => {
  const host = chartHost(app.section('stock-datasource'), 'stock-datasource');
  await expect(host.locator('[id*="_Series_0_Point_"]').first()).toBeAttached();
  expect(await inst(host, (c) => c.chart.visibleSeries[0].points.length)).toBe(120);
});

test('indicators render in their own row', async ({ app }) => {
  const host = chartHost(app.section('stock-indicators'), 'stock-indicators');
  expect(await inst(host, (c) => [c.indicators.map((i) => i.type), c.rows.length, c.axes.map((a) => a.name)])).toEqual([['Sma', 'Rsi'], 2, ['yRsi']]);
  expect(await inst(host, (c) => [!!c.chart.smaIndicatorModule, !!c.chart.rsiIndicatorModule])).toEqual([true, true]);
  await expect(host.locator('[id*="_Indicator_"]').first()).toBeAttached();
});

test('stock events render flags and circles and raise stockEventRender', async ({ app, page }) => {
  const host = chartHost(app.section('stock-events'), 'stock-events');
  expect(await inst(host, (c) => c.stockEvents.map((e) => e.type))).toEqual(['Flag', 'Circle']);
  await fired(page, 'stock.stockEventRender');
  await expect(host.locator('[id*="StockEvents"], [id*="_stockEvent"]').first()).toBeAttached();
  await expect(host.locator('text').filter({ hasText: /^Split$/ })).toHaveCount(1);
});

test('selection, annotations, transposed axes and the no data template', async ({ app }) => {
  const sel = chartHost(app.section('stock-selection'), 'stock-selection');
  expect(await inst(sel, (c) => [c.selectionMode, c.isMultiSelect, c.selectedDataIndexes.map((i) => `${i.series}:${i.point}`)])).toEqual(['Point', true, ['0:3']]);
  await expect(sel.locator('#stock-annotation')).toHaveText('Note');
  const trans = chartHost(app.section('stock-selection'), 'stock-transposed');
  expect(await inst(trans, (c) => c.isTransposed)).toBe(true);
  // isTransposed is declared by StockChart but v35 never reads it, so the model value is all there is to assert
  await expect(app.section('stock-selection').locator('#stock-no-data')).toHaveText('Nothing to show');
});
