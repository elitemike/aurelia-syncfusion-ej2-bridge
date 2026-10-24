import { test, expect } from './fixtures';
import { visibleBox, chartHost, inst, chartId, center } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('chart'));

test('shared tooltip lists both series and the crosshair follows the pointer', async ({ app, page }) => {
  const host = chartHost(app.section('chart-tooltip'), 'chart-tooltip');
  const id = await chartId(host);
  expect(await inst(host, (c) => [c.tooltip.enable, c.tooltip.shared, c.crosshair.enable, !!c.tooltipModule, !!c.crosshairModule])).toEqual([true, true, true, true, true]);
  const marker = host.locator('[id$="_Series_0_Point_2_Symbol"]');
  await expect(marker).toBeAttached();
  const c = await center(marker);
  await page.mouse.move(c.x, c.y);
  const tooltip = page.locator(`#${id}_tooltip`);
  await expect(tooltip).toContainText('Sales');
  await expect(tooltip).toContainText('Profit');
  await expect(tooltip).toContainText('Mar');
  // crosshair lines and the axis labels are drawn while hovering
  await expect(host.locator(`[id="${id}_UserInteraction"] line, [id="${id}_UserInteraction"] path`).first()).toBeAttached();
  await expect(host.locator('[id*="_axis_tooltip_text_"]').first()).toBeVisible();
});

test('selectedDataIndexes preselects a point and follows the view-model', async ({ app }) => {
  const section = app.section('chart-selection');
  const host = chartHost(section, 'chart-selection');
  expect(await inst(host, (c) => [c.selectionMode, !!c.selectionModule, c.isMultiSelect, c.allowMultiSelection])).toEqual(['Point', true, true, true]);
  await expect.poll(() => inst(host, (c) => c.selectionModule.selectedDataIndexes.map((i) => `${i.series}:${i.point}`))).toEqual(['0:1']);
  await expect(host.locator('[id$="_Series_0_Point_1"]').first()).toHaveClass(/_ej2_chart_selection_series_0/);
  await section.getByTestId('chart-select-index').click();
  await expect.poll(() => inst(host, (c) => c.selectedDataIndexes.map((i) => i.point))).toEqual([3]);
  await expect.poll(() => inst(host, (c) => c.selectionModule.selectedDataIndexes.map((i) => `${i.series}:${i.point}`))).toEqual(['0:3']);
  await expect(host.locator('[id$="_Series_0_Point_3"]').first()).toHaveClass(/_ej2_chart_selection_series_0/);
});

test('clicking points selects several when multi selection is on, the pattern is applied', async ({ app, page }) => {
  const host = chartHost(app.section('chart-selection'), 'chart-selection');
  const first = host.locator('[id$="_Series_0_Point_0"]').first();
  await first.click();
  await expect.poll(() => inst(host, (c) => c.selectionModule.selectedDataIndexes.length)).toBeGreaterThan(1);
  expect(await inst(host, (c) => [c.selectionPattern, c.highlightPattern, c.highlightColor, c.highlightMode])).toEqual(['DiagonalForward', 'Dots', '#ff00ff', 'Series']);
  // the selection pattern is registered as an svg pattern the selected points reference
  await expect(host.locator('pattern[id$="_DiagonalForward_Selection_0"]')).toBeAttached();
  await expect(host.locator('pattern[id*="_Dots_Selection_"]').first()).toBeAttached();
  await expect(host.locator('[id$="_Series_0_Point_0"]').first()).toHaveClass(/_ej2_chart_selection_series_0/);
  // hovering a series highlights it with the highlight pattern
  const other = host.locator('[id$="_Series_1_Point_4"]').first();
  const c = await center(other);
  await page.mouse.move(c.x, c.y);
  await expect(host.locator('[class*="_ej2_chart_highlight_series_1"]').first()).toBeAttached();
});

test('selectionMode follows the view-model', async ({ app }) => {
  const section = app.section('chart-selection');
  const host = chartHost(section, 'chart-selection');
  await section.getByTestId('chart-select-mode').click();
  await expect.poll(() => inst(host, (c) => c.selectionMode)).toBe('Series');
});

test('zoom toolbar, selection zooming, wheel zooming and reset', async ({ app, page }) => {
  const host = chartHost(app.section('chart-zoom'), 'chart-zoom');
  const id = await chartId(host);
  expect(await inst(host, (c) => [c.zoomSettings.enableSelectionZooming, c.zoomSettings.enablePan, c.zoomSettings.showToolbar, !!c.zoomModule])).toEqual([true, true, true, true]);
  const area = host.locator(`rect[id="${id}_ChartAreaBorder"]`);
  const b = await visibleBox(area);
  await page.mouse.move(b.x + b.width * 0.2, b.y + b.height * 0.2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5, { steps: 6 });
  await page.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.6, { steps: 6 });
  await page.mouse.up();
  await expect.poll(() => inst(host, (c) => c.primaryXAxis.zoomFactor)).toBeLessThan(1);
  await expect(host.locator(`[id="${id}_Zooming_KitCollection"]`)).toBeAttached();
  // reset through the toolbar
  await host.locator(`[id="${id}_Zooming_Reset"]`).click();
  await expect.poll(() => inst(host, (c) => c.primaryXAxis.zoomFactor)).toBe(1);
  // mouse wheel zooming
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => inst(host, (c) => c.primaryXAxis.zoomFactor)).toBeLessThan(1);
});

test('legend position, title, shape size and toggling', async ({ app }) => {
  const host = chartHost(app.section('chart-legend'), 'chart-legend');
  const id = await chartId(host);
  expect(await inst(host, (c) => [c.legendSettings.position, c.legendSettings.shapeWidth, c.legendSettings.shapeHeight, c.legendSettings.title, !!c.legendModule]))
    .toEqual(['Right', 14, 14, 'Legend title', true]);
  await expect(host.locator('text[id$="_chart_legend_title"]')).toHaveText(/Legend\s*title/);
  const legendBox = await visibleBox(host.locator('text[id$="_chart_legend_text_0"]'));
  const svgBox = await visibleBox(host.locator('svg[id$="_svg"]'));
  expect(legendBox.x).toBeGreaterThan(svgBox.x + svgBox.width * 0.6);
  expect(await inst(host, (c) => c.visibleSeries.map((s) => s.visible))).toEqual([true, true]);
  await host.locator(`[id="${id}_chart_legend_text_1"]`).click();
  await expect.poll(() => inst(host, (c) => c.visibleSeries.map((s) => s.visible))).toEqual([true, false]);
  await host.locator(`[id="${id}_chart_legend_text_1"]`).click();
  await expect.poll(() => inst(host, (c) => c.visibleSeries.map((s) => s.visible))).toEqual([true, true]);
});

test('legendSettings visible false removes the legend and its module requirement', async ({ app }) => {
  const host = chartHost(app.section('chart-legend'), 'chart-legend-hidden');
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  await expect(host.locator('text[id*="_chart_legend_text_"]')).toHaveCount(0);
  expect(await inst(host, (c) => !!c.legendModule)).toBe(false);
});

test('legend hover highlights the series', async ({ app, page }) => {
  const host = chartHost(app.section('chart-legend'), 'chart-legend-highlight');
  const id = await chartId(host);
  expect(await inst(host, (c) => [c.legendSettings.enableHighlight, !!c.highlightModule])).toEqual([true, true]);
  const item = host.locator(`[id="${id}_chart_legend_text_0"]`);
  const c = await center(item);
  await page.mouse.move(c.x, c.y);
  await expect(host.locator('[class*="_ej2_chart_highlight_series_0"]').first()).toBeAttached();
});
