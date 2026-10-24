import { test, expect } from './fixtures';
import { chartHost, inst, eventCount, eventLast } from './chartHelpers';

test.beforeEach(async ({ app, page }) => {
  // WebMCP tools register on document.modelContext, give the page a recording stand-in before it loads
  await page.addInitScript(() => {
    (document as any).modelContext = { tools: [] as any[], registerTool(tool: any) { this.tools.push(tool); } };
  });
  await app.open('chart');
});

test('data labels and error bars bring their modules', async ({ app }) => {
  const labels = chartHost(app.section('chart-datalabel'), 'chart-datalabel');
  expect(await inst(labels, (c) => !!c.dataLabelModule)).toBe(true);
  await expect(labels.locator('text[id*="_Series_0_Point_"][id*="_Text_"]').first()).toBeAttached();
  await expect(labels.locator('text[id*="_Text_"]').filter({ hasText: /^35$/ })).toHaveCount(1);
  const errors = chartHost(app.section('chart-datalabel'), 'chart-errorbar');
  expect(await inst(errors, (c) => !!c.errorBarModule)).toBe(true);
  await expect(errors.locator('[id*="_ErrorBarGroup_"]').first()).toBeAttached();
});

test('annotations render their html content', async ({ app }) => {
  const host = chartHost(app.section('chart-annotations'), 'chart-annotations');
  expect(await inst(host, (c) => [c.annotations.length, !!c.annotationModule])).toEqual([1, true]);
  const note = host.locator('#chart-annotation-peak');
  await expect(note).toBeVisible();
  await expect(note).toHaveText('Peak');
});

test('technical indicators draw as extra series', async ({ app }) => {
  const host = chartHost(app.section('chart-indicators'), 'chart-indicators');
  expect(await inst(host, (c) => c.indicators.map((i) => i.type))).toEqual(['Sma', 'Ema', 'Tma', 'BollingerBands']);
  expect(await inst(host, (c) => [!!c.smaIndicatorModule, !!c.emaIndicatorModule, !!c.tmaIndicatorModule, !!c.bollingerBandsIndicatorModule])).toEqual([true, true, true, true]);
  // each indicator renders into its own svg group
  await expect(host.locator('[id*="_Indicator_"]').first()).toBeAttached();
  expect(await inst(host, (c) => c.indicators.every((i) => i.targetSeries && i.targetSeries.length > 0))).toBe(true);
  for (const i of [0, 1, 2, 3]) {
    await expect(host.locator(`[id*="_Indicator_${i}_"]`).first()).toBeAttached();
  }
});

test('macd indicator in its own row', async ({ app }) => {
  const host = chartHost(app.section('chart-indicators'), 'chart-macd');
  expect(await inst(host, (c) => [c.indicators[0].type, !!c.macdIndicatorModule])).toEqual(['Macd', true]);
  await expect(host.locator('[id*="_Indicator_"]').first()).toBeAttached();
});

test('trendlines are computed for the scatter series', async ({ app }) => {
  const host = chartHost(app.section('chart-trendlines'), 'chart-trendlines');
  expect(await inst(host, (c) => c.visibleSeries[0].trendlines.map((t) => t.type))).toEqual(['Linear', 'Polynomial']);
  expect(await inst(host, (c) => !!c.trendLineModule)).toBe(true);
  await expect(host.locator('[id*="_Series_0_TrendLine_0"]').first()).toBeAttached();
  await expect(host.locator('[id*="_Series_0_TrendLine_1"]').first()).toBeAttached();
  await expect(host.locator('text[id*="_chart_legend_text_"]').filter({ hasText: 'Linear trend' })).toHaveCount(1);
});

test('enableExport and allowExport load the export module that downloads the chart', async ({ app, page }) => {
  const host = chartHost(app.section('chart-export'), 'chart-export');
  expect(await inst(host, (c) => [c.enableExport, c.allowExport, !!c.exportModule])).toEqual([true, true, true]);
  const download = page.waitForEvent('download');
  await host.evaluate((el: any) => el.ej2_instances[0].exportModule.export('PNG', 'sales'));
  expect((await download).suggestedFilename()).toBe('sales.png');
});

test('enableWebMcp registers the chart tools named by webMcpSettings and raises beforeWebMcpToolExecute', async ({ app, page }) => {
  const host = chartHost(app.section('chart-webmcp'), 'chart-webmcp');
  expect(await inst(host, (c) => [c.enableWebMcp, c.webMcpSettings.name, !!c.webMcpChartModule])).toEqual([true, 'salesChart', true]);
  const names: string[] = await page.evaluate(() => (document as any).modelContext.tools.map((t: any) => t.name));
  expect(names.length).toBeGreaterThan(0);
  expect(names.every((n) => n.startsWith('salesChart_'))).toBe(true);
  expect(await eventCount(page, 'beforeWebMcpToolExecute')).toBe(0);
  await page.evaluate(() => {
    const tool = (document as any).modelContext.tools[0];
    return tool.execute({});
  });
  await expect.poll(() => eventCount(page, 'beforeWebMcpToolExecute')).toBeGreaterThan(0);
  expect(await eventLast(page, 'beforeWebMcpToolExecute')).toBeTruthy();
});
