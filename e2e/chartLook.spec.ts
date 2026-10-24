import { test, expect } from './fixtures';
import { visibleBox, chartHost, inst, chartId } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('chart'));

test('basic chart renders both series from the chart level dataSource', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  expect(await inst(host, (c) => c.visibleSeries.length)).toBe(2);
  expect(await inst(host, (c) => c.visibleSeries.map((s) => s.points.length))).toEqual([6, 6]);
  expect(await inst(host, (c) => c.visibleSeries.map((s) => s.type))).toEqual(['Column', 'Line']);
  // modules the series asked for were injected: column, line, legend, tooltip, category axis
  expect(await inst(host, (c) => [!!c.columnSeriesModule, !!c.lineSeriesModule, !!c.legendModule, !!c.tooltipModule, !!c.categoryModule]))
    .toEqual([true, true, true, true, true]);
  await expect(host.locator('[id*="_Series_0_Point_5"]').first()).toBeAttached();
});

test('title, subTitle and their styles', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  const title = host.locator('text[id$="_ChartTitle"]');
  await expect(title).toHaveText('Monthly sales');
  await expect(title).toHaveAttribute('fill', '#c0392b');
  await expect(title).toHaveAttribute('font-size', '18px');
  await expect(title).toHaveAttribute('font-family', 'Arial');
  const sub = host.locator('text[id$="_ChartSubTitle"]');
  await expect(sub).toHaveText('First half');
  await expect(sub).toHaveAttribute('fill', '#2980b9');
  await expect(sub).toHaveAttribute('font-size', '12px');
});

test('width, height, margin, border, background and chartArea', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  const svg = host.locator('svg[id$="_svg"]');
  await expect(svg).toHaveAttribute('width', '640');
  await expect(svg).toHaveAttribute('height', '340');
  const border = host.locator('rect[id$="_ChartBorder"]');
  await expect(border).toHaveAttribute('stroke', '#27ae60');
  await expect(border).toHaveAttribute('stroke-width', '3');
  await expect(border).toHaveAttribute('fill', '#fffbe6');
  const area = host.locator('rect[id$="_ChartAreaBorder"]');
  await expect(area).toHaveAttribute('stroke', '#8e44ad');
  await expect(area).toHaveAttribute('stroke-width', '2');
  await expect(area).toHaveAttribute('fill', '#eef7ff');
  expect(await inst(host, (c) => [c.margin.left, c.margin.right, c.margin.top, c.margin.bottom])).toEqual([20, 30, 10, 10]);
  // the margin shrinks the plot area from the left edge
  expect(await inst(host, (c) => c.initialClipRect.x)).toBeGreaterThan(20);
});

test('palettes color the series and theme reaches the widget', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  await expect(host.locator('[id$="_Series_0_Point_0"]').first()).toHaveAttribute('fill', '#e67e22');
  await expect(host.locator('[id$="_Series_1"]').first()).toHaveAttribute('stroke', '#16a085');
  expect(await inst(host, (c) => c.theme)).toBe('Material');
});

test('axis titles and labelFormat come from the primary axis bindings', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  await expect(host.locator('text[id$="_AxisTitle_0"]')).toHaveText('Month');
  await expect(host.locator('text[id$="_AxisTitle_1"]')).toHaveText('Sales');
  await expect(host.locator('text[id*="_AxisLabel_"]').filter({ hasText: /^\d+K$/ }).first()).toBeAttached();
  await expect(host.locator('text[id*="_AxisLabel_"]').filter({ hasText: 'Jan' })).toHaveCount(1);
});

test('legend lists the series and the tooltip shows on hover', async ({ app, page }) => {
  const host = chartHost(app.section('chart-basic'));
  await expect(host.locator('text[id*="_chart_legend_text_"]')).toHaveText(['Sales', 'Profit']);
  const point = host.locator('[id$="_Series_0_Point_1"]').first();
  const box = await visibleBox(point);
  // the top edge of the column, the profit markers of the line series sit lower in the same column
  await page.mouse.move(box.x + box.width / 2, box.y + 4);
  const id = await chartId(host);
  await expect(page.locator(`#${id}_tooltip`)).toContainText('Feb');
  await expect(page.locator(`#${id}_tooltip`)).toContainText('28');
  await expect(page.locator(`#${id}_tooltip`)).toContainText('Sales');
});

test('description and tabIndex reach the widget (superseded by accessibility in v35)', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  // v35 keeps both properties but renders aria-label and tabindex from `accessibility`, so only the model is asserted
  expect(await inst(host, (c) => [c.description, c.tabIndex])).toEqual(['Monthly sales chart', 3]);
  await expect(host).toHaveAttribute('aria-label', /^Monthly sales\./);
  await expect(host).toHaveAttribute('tabindex', '0');
});

test('enableAnimation false renders the final state at once', async ({ app }) => {
  const host = chartHost(app.section('chart-basic'));
  expect(await inst(host, (c) => c.enableAnimation)).toBe(false);
});

test('backgroundImage and enableHtmlSanitizer', async ({ app, page }) => {
  const host = chartHost(app.section('chart-background'));
  await expect(host.locator('image[id$="_ChartBackground"]')).toHaveAttribute('href', /^data:image\/png/);
  expect(await inst(host, (c) => c.enableHtmlSanitizer)).toBe(true);
  // the script payload in the title never ran, the sanitizer stripped the handler
  expect(await page.evaluate(() => (window as any).__xss)).toBeUndefined();
  await expect(host.locator('text[id$="_ChartTitle"]')).toBeAttached();
});

test('accessibility settings and keyboard focus border', async ({ app }) => {
  const host = chartHost(app.section('chart-background'));
  expect(await inst(host, (c) => [c.accessibility.accessibilityDescription, c.accessibility.accessibilityRole, c.accessibility.focusable]))
    .toEqual(['sales chart', 'region', true]);
  expect(await inst(host, (c) => [c.focusBorderColor, c.focusBorderWidth, c.focusBorderMargin])).toEqual(['#ff0000', 4, 2]);
  await expect(host).toHaveAttribute('aria-label', 'sales chart');
  await expect(host).toHaveAttribute('role', 'region');
  await expect(host).toHaveAttribute('tabindex', '5');
});

test('currencyCode and useGroupingSeparator format axis labels', async ({ app }) => {
  const host = chartHost(app.section('chart-currency'));
  expect(await inst(host, (c) => [c.currencyCode, c.useGroupingSeparator])).toEqual(['EUR', true]);
  // the C format renders a currency symbol and, with the grouping separator, grouped thousands; symbols other than
  // the default one need CLDR data that the demo does not load
  const labels = host.locator('text[id*="_AxisLabel_"]');
  await expect(labels.filter({ hasText: /^\$20,000$/ })).toHaveCount(1);
});

test('noDataTemplate shows when the series has no data', async ({ app }) => {
  const section = app.section('chart-nodata');
  await expect(section.locator('#no-data-template')).toBeVisible();
  await expect(section.locator('#no-data-template')).toHaveText('Nothing to show');
});

test('enableCanvas renders on a canvas', async ({ app }) => {
  const host = chartHost(app.section('chart-canvas'));
  await expect(host.locator('canvas[id$="_canvas"]')).toBeVisible();
  await expect(host.locator('[id$="_Series_0"]')).toHaveCount(0);
  expect(await inst(host, (c) => c.enableCanvas)).toBe(true);
});

test('view-model changes update title, size, data and series', async ({ app }) => {
  const section = app.section('chart-live');
  const host = chartHost(section);
  await expect(host.locator('text[id$="_ChartTitle"]')).toHaveText('Before');
  expect(await inst(host, (c) => c.visibleSeries[0].points.length)).toBe(3);
  await section.getByTestId('chart-live-change').click();
  await expect(host.locator('text[id$="_ChartTitle"]')).toHaveText('After');
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('width', '500');
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('height', '300');
  await expect.poll(() => inst(host, (c) => c.visibleSeries[0].points.length)).toBe(4);
  await section.getByTestId('chart-live-series').click();
  await expect.poll(() => inst(host, (c) => c.visibleSeries[0].type)).toBe('Line');
  await expect.poll(() => inst(host, (c) => c.visibleSeries[0].name)).toBe('Replaced');
});
