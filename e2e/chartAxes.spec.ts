import { test, expect } from './fixtures';
import { visibleBox, chartHost, inst } from './chartHelpers';

test.beforeEach(async ({ app }) => app.open('chart'));

test('rows split the plot area and a series binds to the secondary axis', async ({ app }) => {
  const host = chartHost(app.section('chart-rows'), 'chart-rows');
  expect(await inst(host, (c) => c.rows.length)).toBe(2);
  expect(await inst(host, (c) => c.axes.map((a) => a.name))).toEqual(['yProfit']);
  expect(await inst(host, (c) => c.visibleSeries.map((s) => s.yAxis.name))).toEqual(['primaryYAxis', 'yProfit']);
  // the two rows are stacked, the secondary axis sits in the lower half of the plot
  const [top, bottom] = await inst(host, (c) => [c.rows[0].computedTop, c.rows[1].computedTop]);
  expect(top).not.toBe(bottom);
  expect(await inst(host, (c) => Math.abs(c.rows[0].computedHeight - c.rows[1].computedHeight))).toBeLessThan(2);
  expect(await inst(host, (c) => c.axes[0].rowIndex)).toBe(1);
  expect(await inst(host, (c) => c.axes[0].opposedPosition)).toBe(true);
  await expect(host.locator('text[id$="_AxisTitle_2"]')).toHaveText('Profit');
});

test('columns split the plot area and a series binds to the secondary x axis', async ({ app }) => {
  const host = chartHost(app.section('chart-columns'), 'chart-columns');
  expect(await inst(host, (c) => c.columns.length)).toBe(2);
  expect(await inst(host, (c) => c.visibleSeries.map((s) => s.xAxis.name))).toEqual(['primaryXAxis', 'xSecond']);
  const [left, right] = await inst(host, (c) => [c.columns[0].computedLeft, c.columns[1].computedLeft]);
  expect(right).not.toBe(left);
  await expect(host.locator('text[id$="_AxisTitle_2"]')).toHaveText('Second');
});

test('isTransposed swaps the axes', async ({ app }) => {
  const host = chartHost(app.section('chart-transposed'), 'chart-transposed');
  expect(await inst(host, (c) => [c.isTransposed, c.requireInvertedAxis])).toEqual([true, true]);
  // the category axis is now vertical
  expect(await inst(host, (c) => c.primaryXAxis.orientation)).toBe('Vertical');
});

test('enableSideBySidePlacement false overlaps the columns', async ({ app }) => {
  const host = chartHost(app.section('chart-placement'), 'chart-placement');
  expect(await inst(host, (c) => c.enableSideBySidePlacement)).toBe(false);
  const a = await visibleBox(host.locator('[id$="_Series_0_Point_0"]').first());
  const b = await visibleBox(host.locator('[id$="_Series_1_Point_0"]').first());
  expect(Math.abs(a.x - b.x)).toBeLessThan(1);
});

test('enableAutoIntervalOnBothAxis reaches the widget', async ({ app }) => {
  const host = chartHost(app.section('chart-placement'), 'chart-placement');
  expect(await inst(host, (c) => c.enableAutoIntervalOnBothAxis)).toBe(true);
  // the category axis got a computed interval instead of the default 1 step per label
  expect(await inst(host, (c) => c.primaryXAxis.visibleRange.interval)).toBeGreaterThanOrEqual(1);
});

test('stackLabels show the stack totals', async ({ app }) => {
  const host = chartHost(app.section('chart-stacklabels'), 'chart-stacklabels');
  expect(await inst(host, (c) => [c.stackLabels.visible, !!c.dataLabelModule])).toEqual([true, true]);
  const labels = host.locator('text[id*="_StackLabel"]');
  await expect(labels.first()).toBeAttached();
  // Jan: 35 + 20
  await expect(host.locator('text[id*="_StackLabel"]').filter({ hasText: '55!' })).toHaveCount(1);
});

test('rangeColorSettings color the points and the legend shows the ranges', async ({ app }) => {
  const host = chartHost(app.section('chart-rangecolor'), 'chart-rangecolor');
  expect(await inst(host, (c) => c.rangeColorSettings.length)).toBe(2);
  await expect(host.locator('text[id*="_chart_legend_text_"]')).toHaveText(['Low', 'High']);
  // profit 20 falls in 0-25, profit 30 in 25-100
  await expect(host.locator('[id$="_Series_0_Point_0"]').first()).toHaveAttribute('fill', '#ff0000');
  await expect(host.locator('[id$="_Series_0_Point_4"]').first()).toHaveAttribute('fill', '#00aa00');
});

test('logarithmic axis', async ({ app }) => {
  const host = chartHost(app.section('chart-axis-types'), 'chart-log');
  expect(await inst(host, (c) => [c.primaryYAxis.valueType, !!c.logarithmicModule])).toEqual(['Logarithmic', true]);
  await expect(host.locator('text[id*="_AxisLabel_"]').filter({ hasText: /^1000$/ })).toHaveCount(1);
});

test('date time axis', async ({ app }) => {
  const host = chartHost(app.section('chart-axis-types'), 'chart-date');
  expect(await inst(host, (c) => [c.primaryXAxis.valueType, !!c.dateTimeModule])).toEqual(['DateTime', true]);
  await expect(host.locator('text[id*="_AxisLabel_"]').filter({ hasText: /Jan 24/ })).toHaveCount(1);
});

test('strip lines and multi level labels', async ({ app }) => {
  const host = chartHost(app.section('chart-axis-types'), 'chart-strip');
  expect(await inst(host, (c) => [!!c.stripLineModule, !!c.multiLevelLabelModule])).toEqual([true, true]);
  await expect(host.locator('[id*="_stripline_"]').first()).toBeAttached();
  await expect(host.locator('text[id*="_Axis_MultiLevelLabel"]').filter({ hasText: 'Q1' })).toHaveCount(1);
  await expect(host.locator('text[id*="_Axis_MultiLevelLabel"]').filter({ hasText: 'Q2' })).toHaveCount(1);
});
