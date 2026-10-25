import { test, expect } from './fixtures';
import { chartHost, inst, eventCount, eventLast, center } from './chartFamilyHelpers';

test.beforeEach(async ({ app }) => app.open('smithchart'));

const main = (app) => chartHost(app.section('smith-main'), 'smith-main');
const click = (app, id: string) => app.section('smith-main').getByTestId(id).click();
const svg = (host) => host.locator('svg[id$="_svg"]');
const attr = async (loc, name: string) => Number(await loc.getAttribute(name));
const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);
const gridPath = (host) => host.locator('path[id$="_horizontalAxisMajorGridLines"]');

test('default sample renders axes, two series with markers, title and legend', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toBeVisible();
  await expect(host.locator('path[id$="_series0_points"]')).toBeAttached();
  await expect(host.locator('path[id$="_series1_points"]')).toBeAttached();
  await expect(host.locator('[id*="_Series0_Points"][id*="_Marker"]')).toHaveCount(12);
  await expect(host.locator('[id*="_Series1_Points"][id*="_Marker"]')).toHaveCount(12);
  await expect(host.locator('[id*="_LegendItemText"]')).toHaveText(['Transmission1', 'Transmission2']);
  await expect(host.locator('text[id$="_HLabel_1"]')).toHaveText('0.2');
  // each wrapper instance has its own host id so every chart renders into its own element
  const ids = await app.page.locator('.e-smithchart').evaluateAll((els) => els.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(await inst(host, (c) => c.series.length)).toBe(2);
});

test('renderType switches between impedance and admittance', async ({ app }) => {
  const host = main(app);
  const before = await gridPath(host).getAttribute('d');
  expect(await inst(host, (c) => c.renderType)).toBe('Impedance');
  await click(app, 'smith-admittance');
  await expect.poll(() => inst(host, (c) => c.renderType)).toBe('Admittance');
  await expect.poll(() => gridPath(host).getAttribute('d')).not.toBe(before);
});

test('width and height are applied and follow the view-model', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toHaveAttribute('width', '600');
  await expect(svg(host)).toHaveAttribute('height', '420');
  await click(app, 'smith-size');
  await expect(svg(host)).toHaveAttribute('width', '480');
  await expect(svg(host)).toHaveAttribute('height', '360');
});

test('theme restyles the chart', async ({ app }) => {
  const host = main(app);
  const title = host.locator('text[id$="_Smithchart_title"]').first();
  await expect(title).toHaveAttribute('fill', 'rgba(0, 0, 0, 1)');
  expect(await inst(host, (c) => c.theme)).toBe('Material');
  await click(app, 'smith-theme');
  await expect.poll(() => inst(host, (c) => c.theme)).toBe('Bootstrap5Dark');
  await expect(title).not.toHaveAttribute('fill', 'rgba(0, 0, 0, 1)');
});

test('margin, radius and elementSpacing change the layout', async ({ app }) => {
  const host = main(app);
  const d0 = await gridPath(host).getAttribute('d');
  await click(app, 'smith-margin');
  await expect.poll(() => gridPath(host).getAttribute('d')).not.toBe(d0);
  const d1 = await gridPath(host).getAttribute('d');
  await click(app, 'smith-radius');
  await expect.poll(() => gridPath(host).getAttribute('d')).not.toBe(d1);
  const d2 = await gridPath(host).getAttribute('d');
  await click(app, 'smith-spacing');
  await expect.poll(() => gridPath(host).getAttribute('d')).not.toBe(d2);
  expect(await inst(host, (c) => [c.margin.left, c.radius, c.elementSpacing])).toEqual([40, 0.6, 30]);
});

test('font, border and background are applied', async ({ app }) => {
  const host = main(app);
  // font is used to measure the title block, a bigger font moves the plot
  expect(await inst(host, (c) => [c.font.size, c.font.color])).toEqual(['13px', '#223344']);
  const d0 = await gridPath(host).getAttribute('d');
  const border = host.locator('rect[id$="_SmithchartBorder"]').last();
  await expect(border).toHaveAttribute('stroke', '#34495e');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#fbfbfb');
  await click(app, 'smith-font');
  await expect.poll(() => inst(host, (c) => c.font.size)).toBe('18px');
  await expect.poll(() => gridPath(host).getAttribute('d')).not.toBe(d0);
  await click(app, 'smith-border');
  await expect(border).toHaveAttribute('stroke', '#c0392b');
  await click(app, 'smith-background');
  await expect(border).toHaveAttribute('fill', '#e8f5e9');
});

test('title and subtitle follow the view-model', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('text[id$="_Smithchart_title"]').first()).toHaveText('Transmission lines');
  await expect(host.locator('text[id$="_Smithchart_title"]').nth(1)).toHaveText('Resistance and reactance');
  await click(app, 'smith-title');
  await expect(host.locator('text[id$="_Smithchart_title"]').first()).toHaveText('Updated title');
  await expect(host.locator('text[id$="_Smithchart_title"]').nth(1)).toHaveText('Updated subtitle');
});

test('series follows the view-model', async ({ app }) => {
  const host = main(app);
  await click(app, 'smith-series');
  await expect(host.locator('path[id$="_series1_points"]')).toHaveCount(0);
  await expect(host.locator('[id*="_LegendItemText"]')).toHaveText(['Only line']);
});

test('legendSettings moves the legend', async ({ app }) => {
  const host = main(app);
  const y = async () => (await host.locator('rect[id$="_svg_legendRect"]').boundingBox()).y;
  const before = await y();
  expect(before).toBeGreaterThan((await svg(host).boundingBox()).y + 200);
  await click(app, 'smith-legend');
  await expect.poll(y).toBeLessThan(before);
  expect(await inst(host, (c) => [c.legendSettings.position, c.legendSettings.shape])).toEqual(['Top', 'Rectangle']);
});

test('horizontalAxis and radialAxis customize grid lines', async ({ app }) => {
  const host = main(app);
  await expect(gridPath(host)).toHaveAttribute('stroke', '#bbbbbb');
  await expect(host.locator('path[id$="_horizontalAxisMinorGridLines"]')).toBeAttached();
  await expect(host.locator('path[id$="_radialAxisMajorGridLines"]')).toHaveAttribute('stroke', '#bbbbbb');
  await click(app, 'smith-axes');
  await expect(gridPath(host)).toHaveAttribute('stroke', '#e74c3c');
  await expect(host.locator('path[id$="_radialAxisMajorGridLines"]')).toHaveAttribute('stroke', '#e74c3c');
  await expect(host.locator('path[id$="_horizontalAxisMinorGridLines"]')).toHaveCount(0);
  expect(await inst(host, (c) => c.radialAxis.labelPosition)).toBe('Inside');
});

test('admittance sample', async ({ app }) => {
  const host = chartHost(app.section('smith-admittance'), 'smith-admittance');
  expect(await inst(host, (c) => c.renderType)).toBe('Admittance');
  await expect(host.locator('path[id$="_series0_points"]')).toBeAttached();
  await expect(host.locator('text[id$="_Smithchart_title"]').first()).toHaveText('Admittance chart');
});

test('markers and data labels sample', async ({ app }) => {
  const host = chartHost(app.section('smith-labels'), 'smith-labels');
  await expect(host.locator('[id*="_Series0_Points"][id*="_Marker"]')).toHaveCount(6);
  await expect(host.locator('[id*="DataLabel"], [id*="_Series0_Points0_Marker0_Label"], [id*="datalabel" i]').first()).toBeAttached();
});

test('legend sample: entries on the right with toggleVisibility', async ({ app }) => {
  const host = chartHost(app.section('smith-legend'), 'smith-legend');
  await expect(host.locator('[id*="_LegendItemText"]')).toHaveText(['Line A', 'Line B']);
  expect(await inst(host, (c) => [c.legendSettings.position, c.legendSettings.toggleVisibility])).toEqual(['Right', true]);
  const legendX = (await host.locator('rect[id$="_svg_legendRect"]').boundingBox()).x;
  const plotX = (await host.locator('path[id$="_horizontalAxisLine"]').boundingBox()).x;
  expect(legendX).toBeGreaterThan(plotX);
  // Syncfusion only toggles a series on click when the host id is literally 'container' (hard coded in
  // Smithchart.smithchartOnClick), the bridge gives every host a unique id, so the click must at least be harmless
  await host.locator('[id$="_LegendItemText1"]').click();
  await expect(host.locator('g[id$="_svg_seriesCollection0"]')).toHaveAttribute('visibility', 'visible');
});

test('events: rendering events, tooltip hover and beforePrint', async ({ app, page }) => {
  const section = app.section('smith-events');
  const host = chartHost(section, 'smith-events');
  for (const name of ['load', 'loaded', 'animationComplete', 'legendRender', 'titleRender', 'subtitleRender', 'textRender', 'axisLabelRender', 'seriesRender']) {
    await fired(page, name);
  }
  expect((await eventLast(page, 'axisLabelRender')).text).toBeDefined();
  const marker = host.locator('[id$="_Series0_Points2_Marker2"]');
  const p = await center(marker);
  await page.mouse.move(p.x - 30, p.y);
  await page.mouse.move(p.x, p.y, { steps: 5 });
  await fired(page, 'tooltipRender');
  await section.getByTestId('smith-print').click();
  await fired(page, 'beforePrint');
});
