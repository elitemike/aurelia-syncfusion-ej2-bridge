import { test, expect } from './fixtures';
import { chartHost, inst, eventCount, eventLast, center, hitPoint } from './chartFamilyHelpers';

test.beforeEach(async ({ app }) => app.open('chart3D'));

const main = (app) => chartHost(app.section('c3d-main'), 'c3d-main');
const click = (app, id: string) => app.section('c3d-main').getByTestId(id).click();
const svg = (host) => host.locator('svg[id$="_svg"]');
const faces = (host, s = 0, p = 0) => host.locator(`[id*="-region-series-${s}-point-${p}"]`);
const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);
const pathD = async (loc) => loc.first().getAttribute('d');

test('default sample renders walls, two series of columns, axes and legend', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toBeVisible();
  await expect(faces(host, 0, 0).first()).toBeAttached();
  await expect(faces(host, 1, 5).first()).toBeAttached();
  // six faces per column and twelve columns
  await expect(host.locator('[id*="-region-series-"]')).toHaveCount(72);
  await expect(host.locator('[id$="-0-axis-label-0"]')).toHaveText('Jan');
  await expect(host.locator('[id$="-svg-axis-title-0"]')).toHaveText('Month');
  await expect(host.locator('[id$="-svg-axis-title-1"]')).toHaveText('Sales');
  await expect(host.locator('[id*="_chart_legend_text_"]')).toHaveText(['Sales', 'Profit']);
  // the series points describe themselves
  await expect(faces(host, 0, 1).first()).toHaveAttribute('aria-label', 'Feb:28, Sales');
  const ids = await app.page.locator('.e-chart3d').evaluateAll((els) => els.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test('width and height are applied and follow the view-model', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toHaveAttribute('height', '380');
  expect(await inst(host, (c) => [c.width, c.height])).toEqual(['90%', '380px']);
  await click(app, 'c3d-size');
  await expect(svg(host)).toHaveAttribute('width', '500');
  await expect(svg(host)).toHaveAttribute('height', '300');
});

test('title, subTitle and their styles', async ({ app }) => {
  const host = main(app);
  const title = host.locator('[id$="-chart-title"]');
  await expect(title).toHaveText('Monthly sales');
  await expect(title).toHaveAttribute('font-size', '18px');
  await expect(title).toHaveAttribute('fill', '#1b3a57');
  const sub = host.locator('[id$="-chart-sub-title"]');
  await expect(sub).toHaveText('In thousands');
  await expect(sub).toHaveAttribute('fill', '#667788');
  await click(app, 'c3d-title');
  await expect(title).toHaveText('Quarterly sales');
  await expect(sub).toHaveText('In millions');
  await click(app, 'c3d-styles');
  await expect(title).toHaveAttribute('font-size', '26px');
  await expect(title).toHaveAttribute('fill', '#c0392b');
  await expect(sub).toHaveAttribute('font-size', '16px');
  await expect(host.locator('[id$="-chart-border"]')).toHaveAttribute('stroke', '#e67e22');
  await expect(host.locator('[id$="-chart-border"]')).toHaveAttribute('stroke-width', '5');
});

test('theme restyles the chart', async ({ app }) => {
  const host = main(app);
  const fill = () => host.locator('[id$="-0-axis-label-0"]').getAttribute('fill');
  const before = await fill();
  await click(app, 'c3d-theme');
  await expect.poll(() => inst(host, (c) => c.theme)).toBe('Bootstrap5Dark');
  await expect.poll(fill).not.toBe(before);
});

test('description, enableExport, border and background', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => [c.description, c.enableExport])).toEqual(['Sales per month as 3D columns', true]);
  await expect(host.locator('[id$="-chart-border"]')).toHaveAttribute('stroke', '#34495e');
  await expect(host.locator('[id$="-chart-border"]')).toHaveAttribute('stroke-width', '2');
  await click(app, 'c3d-description');
  await expect.poll(() => inst(host, (c) => c.description)).toBe('Updated description');
  await click(app, 'c3d-background');
  await expect.poll(() => inst(host, (c) => c.background)).toBe('#fff3e0');
});

test('backgroundImage renders an image element', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('image[id$="-chart-background"]')).toHaveAttribute('href', /data:image\/png;base64/);
});

test('depth, wallSize, tilt, rotation and perspectiveAngle reshape the 3D scene', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => [c.depth, c.wallSize, c.tilt, c.rotation, c.perspectiveAngle])).toEqual([100, 6, 10, 20, 90]);
  const d0 = await pathD(faces(host, 0, 0));
  await click(app, 'c3d-depth');
  await expect.poll(() => pathD(faces(host, 0, 0))).not.toBe(d0);
  const d1 = await pathD(faces(host, 0, 0));
  await click(app, 'c3d-angles');
  await expect.poll(() => pathD(faces(host, 0, 0))).not.toBe(d1);
  expect(await inst(host, (c) => [c.depth, c.wallSize, c.tilt, c.rotation, c.perspectiveAngle])).toEqual([40, 12, 25, 50, 60]);
});

test('wallColor paints the walls', async ({ app }) => {
  const host = main(app);
  const wall = host.locator('[id$="-svg-4-left-wall-brush"]');
  await expect(wall).toHaveAttribute('fill', '#d6e4f0');
  await click(app, 'c3d-wall');
  await expect(host.locator('[id$="-svg-4-left-wall-brush"]')).toHaveAttribute('fill', '#c8e6c9');
});

test('enableRotation lets the user rotate the chart by dragging', async ({ app, page }) => {
  const host = main(app);
  const p = await center(host.locator('[id$="-svg-4-back-wall-brush"]').first());
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x + 80, p.y + 20, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => inst(host, (c) => c.rotation)).not.toBe(20);
  await click(app, 'c3d-norotation');
  await expect.poll(() => inst(host, (c) => c.enableRotation)).toBe(false);
  const rotation = await inst(host, (c) => c.rotation);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x - 80, p.y - 20, { steps: 8 });
  await page.mouse.up();
  expect(await inst(host, (c) => c.rotation)).toBe(rotation);
});

test('isTransposed swaps the axes and enableSideBySidePlacement overlaps the series', async ({ app }) => {
  const host = main(app);
  const d0 = await pathD(faces(host, 1, 0));
  await click(app, 'c3d-sidebyside');
  await expect.poll(() => pathD(faces(host, 1, 0))).not.toBe(d0);
  expect(await inst(host, (c) => c.enableSideBySidePlacement)).toBe(false);
  const label = host.locator('[id$="-0-axis-label-0"]');
  await expect(label).toHaveAttribute('text-anchor', 'middle');
  await click(app, 'c3d-transposed');
  await expect.poll(() => inst(host, (c) => c.isTransposed)).toBe(true);
  // the category axis is now vertical, its labels hang off the axis
  await expect(host.locator('[id$="-0-axis-label-0"]')).toHaveAttribute('text-anchor', 'end');
});

test('margin moves the plot', async ({ app }) => {
  const host = main(app);
  const x0 = Number(await host.locator('[id$="-0-axis-label-0"]').getAttribute('x'));
  await click(app, 'c3d-margin');
  await expect.poll(async () => Number(await host.locator('[id$="-0-axis-label-0"]').getAttribute('x'))).toBeGreaterThan(x0);
});

test('palettes color the series', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('[id*="_chart_legend_shape_0"]')).toHaveAttribute('fill', '#e74c3c');
  await expect(host.locator('[id*="_chart_legend_shape_1"]')).toHaveAttribute('fill', '#3498db');
  await click(app, 'c3d-palettes');
  await expect(host.locator('[id*="_chart_legend_shape_0"]')).toHaveAttribute('fill', '#8e44ad');
  await expect(host.locator('[id*="_chart_legend_shape_1"]')).toHaveAttribute('fill', '#16a085');
});

test('legendSettings moves the legend', async ({ app }) => {
  const host = main(app);
  const y = async () => (await host.locator('[id$="_chart_legend_element"]').boundingBox()).y;
  const before = await y();
  await click(app, 'c3d-legend');
  await expect.poll(y).toBeLessThan(before);
  expect(await inst(host, (c) => c.legendSettings.position)).toBe('Top');
});

test('tooltip shows the formatted point on hover', async ({ app, page }) => {
  const host = main(app);
  const p = await hitPoint(host, '[id*=\"-region-series-0-point-1\"]');
  await page.mouse.move(p.x - 15, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await expect(page.locator('[id$="_tooltip"], [id*="tooltip"]').filter({ hasText: /Feb.*28/ }).first()).toBeVisible();
  await click(app, 'c3d-tooltip');
  expect(await inst(host, (c) => c.tooltip.format)).toBe('Value ${point.y}');
});

test('primaryXAxis, primaryYAxis, series and dataSource follow the view-model', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('[id$="-1-axis-label-5"]')).toHaveText('50');
  await click(app, 'c3d-axes');
  await expect(host.locator('[id$="-svg-axis-title-0"]')).toHaveText('Months of year');
  await expect(host.locator('[id$="-svg-axis-title-1"]')).toHaveText('Amount');
  await expect(host.locator('[id$="-1-axis-label-3"]')).toHaveText('60');
  await click(app, 'c3d-series');
  await expect(host.locator('[id*="_chart_legend_text_"]')).toHaveText(['Target']);
  await expect(faces(host, 1, 0)).toHaveCount(0);
  expect(await inst(host, (c) => c.dataSource.length)).toBe(6);
});

test('currencyCode and useGroupingSeparator format the axis labels', async ({ app }) => {
  const host = chartHost(app.section('c3d-format'), 'c3d-format');
  const label = host.locator('[id$="-1-axis-label-1"]');
  await expect(label).toHaveText('$1,000');
  await app.section('c3d-format').getByTestId('c3d-euro').click();
  // Chart3D never hands currencyCode to the number formatter, the property only reaches the instance
  expect(await inst(host, (c) => c.currencyCode)).toBe('EUR');
  await expect(label).toHaveText('$1,000');
  await app.section('c3d-format').getByTestId('c3d-nogroup').click();
  await expect(label).toHaveText('$1000');
  const main1 = main(app);
  await click(app, 'c3d-currency');
  expect(await inst(main1, (c) => [c.currencyCode, c.useGroupingSeparator])).toEqual(['EUR', false]);
});

test('bar, stacked column, stacked bar, 100% stacked and data label samples', async ({ app }) => {
  for (const [id, series] of [['c3d-bar', 'Bar'], ['c3d-stack-column', 'StackingColumn'], ['c3d-stack-bar', 'StackingBar'],
    ['c3d-full-stack', 'StackingColumn100'], ['c3d-labels', 'Column']]) {
    const host = chartHost(app.section(id), id);
    await expect(faces(host, 0, 0).first()).toBeAttached();
    expect(await inst(host, (c) => c.series[0].type)).toBe(series);
  }
  const stack = chartHost(app.section('c3d-stack-column'), 'c3d-stack-column');
  await expect(faces(stack, 1, 5).first()).toBeAttached();
  const labels = chartHost(app.section('c3d-labels'), 'c3d-labels');
  await expect(labels.locator('text[id*="-text-"], text[id*="data-label"], text[id*="datalabel" i]').first()).toBeAttached();
});

test('selection and highlight: selectedDataIndexes, selectionMode, isMultiSelect, patterns, highlight', async ({ app, page }) => {
  const section = app.section('c3d-selection');
  const host = chartHost(section, 'c3d-selection');
  const selected = (s: number, p: number) => faces(host, s, p).first();
  await expect(selected(0, 1)).toHaveClass(/_ej2_chart_selection_series_0/);
  await expect(selected(0, 0)).toHaveClass(/_ej2_deselected/);
  // click a point in Point mode
  const p = await hitPoint(host, '[id*=\"-region-series-1-point-3\"]');
  await page.mouse.click(p.x, p.y);
  await expect(selected(1, 3)).toHaveClass(/_ej2_chart_selection_series_1/);
  await section.getByTestId('c3d-sel-indexes').click();
  await expect(selected(1, 3)).toHaveClass(/_ej2_chart_selection_series_1/);
  await section.getByTestId('c3d-sel-multi').click();
  await expect.poll(() => inst(host, (c) => c.isMultiSelect)).toBe(true);
  await section.getByTestId('c3d-sel-series').click();
  await expect.poll(() => inst(host, (c) => c.selectionMode)).toBe('Series');
  await section.getByTestId('c3d-sel-cluster').click();
  await expect.poll(() => inst(host, (c) => c.selectionMode)).toBe('Cluster');
  await section.getByTestId('c3d-sel-patterns').click();
  expect(await inst(host, (c) => [c.selectionPattern, c.highlightPattern])).toEqual(['DiagonalForward', 'Dots']);
  await section.getByTestId('c3d-sel-highlight').click();
  expect(await inst(host, (c) => [c.highlightMode, c.highlightColor])).toEqual(['Point', '#ff5722']);
  // hovering a point raises the highlight style on it
  const q = await hitPoint(host, '[id*=\"-region-series-0-point-4\"]');
  await page.mouse.move(q.x - 12, q.y);
  await page.mouse.move(q.x, q.y, { steps: 4 });
  await expect(selected(0, 4)).toHaveClass(/_ej2_chart_highlight_series_0|_ej2_chart_selection_series_0/);
});

test('multiple axes sample: rows, columns and axes', async ({ app }) => {
  const host = chartHost(app.section('c3d-multi-axes'), 'c3d-multi-axes');
  expect(await inst(host, (c) => [c.rows.length, c.columns.length, c.axes.length])).toEqual([2, 1, 1]);
  await expect(host.locator('[id$="-svg-axis-title-2"], text:text-is("Profit")').first()).toBeAttached();
  await expect(faces(host, 1, 0).first()).toBeAttached();
});

test('DateTime and Logarithmic axes', async ({ app }) => {
  const date = chartHost(app.section('c3d-datetime'), 'c3d-datetime');
  await expect(date.locator('[id$="-0-axis-label-0"]')).toHaveText('Jan');
  const log = chartHost(app.section('c3d-log'), 'c3d-log');
  await expect(log.locator('text:text-is("1000")')).toBeAttached();
  await expect(log.locator('[id*="-region-series-0-point-2"]').first()).toBeAttached();
});

test('events: rendering, mouse, point, legend, selection, export, print and resize', async ({ app, page }) => {
  const section = app.section('c3d-events');
  const host = chartHost(section, 'c3d-events');
  for (const name of ['load', 'loaded', 'pointRender', 'seriesRender', 'textRender', 'legendRender', 'axisLabelRender']) {
    await fired(page, name);
  }
  expect((await eventLast(page, 'axisLabelRender')).text).toBeDefined();
  const p = await hitPoint(host, '[id*=\"-region-series-0-point-2\"]');
  await page.mouse.move(p.x - 20, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await fired(page, 'chart3DMouseMove');
  await fired(page, 'pointMove');
  await fired(page, 'tooltipRender');
  await page.mouse.down();
  await fired(page, 'chart3DMouseDown');
  await page.mouse.up();
  await fired(page, 'chart3DMouseUp');
  await fired(page, 'chart3DMouseClick');
  await fired(page, 'pointClick');
  await fired(page, 'selectionComplete');
  await host.locator('[id*="_chart_legend_text_0"]').click();
  await fired(page, 'legendClick');
  await page.mouse.move(2, 2, { steps: 5 });
  await fired(page, 'chart3DMouseLeave');
  await section.getByTestId('c3d-print').click();
  await fired(page, 'beforePrint');
  const download = page.waitForEvent('download');
  await section.getByTestId('c3d-export').click();
  await fired(page, 'beforeExport');
  await download;
  await fired(page, 'afterExport');
  await page.setViewportSize({ width: 900, height: 700 });
  await fired(page, 'beforeResize');
  await fired(page, 'resized');
});
