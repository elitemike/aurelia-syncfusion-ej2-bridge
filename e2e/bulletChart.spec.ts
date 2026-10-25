import { test, expect } from './fixtures';
import { chartHost, inst, eventCount, eventLast, center } from './chartFamilyHelpers';

test.beforeEach(async ({ app }) => app.open('bulletChart'));

const main = (app) => chartHost(app.section('bullet-main'), 'bullet-main');
const click = (app, id: string) => app.section('bullet-main').getByTestId(id).click();
const feature = (host) => host.locator('[id$="_svg_FeatureMeasure_0"]');
const target = (host) => host.locator('[id$="_svg_ComparativeMeasure_0"]');
const labels = (host) => host.locator('text[id*="_svg_AxisLabel_"]');
const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);

test('default sample renders ranges, value bar, target, ticks, labels and legend', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
  await expect(host.locator('[id*="_svg_range_"]')).toHaveCount(3);
  await expect(feature(host)).toBeVisible();
  await expect(target(host)).toBeAttached();
  await expect(labels(host)).toHaveText(['0K', '50K', '100K', '150K', '200K', '250K', '300K']);
  await expect(host.locator('[id*="_chart_legend_text_"]').nth(0)).toHaveText('Low');
  await expect(host.locator('[id*="_chart_legend_text_"]').nth(1)).toHaveText('Average');
  await expect(host.locator('[id*="_chart_legend_text_"]').nth(2)).toHaveText('High');
  // each wrapper instance has its own host id, so every chart on the page renders into its own element
  const ids = await app.page.locator('.e-bulletchart').evaluateAll((els) => els.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test('width and height reach the widget and the svg', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('height', '110');
  expect(await inst(host, (c) => [c.width, c.height])).toEqual(['90%', '110']);
});

test('title and subtitle with their styles, title follows the view-model', async ({ app }) => {
  const host = main(app);
  const title = host.locator('[id$="_BulletChartTitle"]');
  await expect(title).toHaveText('Revenue YTD');
  await expect(title).toHaveAttribute('font-size', '16px');
  await expect(title).toHaveAttribute('fill', '#112233');
  const sub = host.locator('[id$="_BulletChartSubTitle"]');
  await expect(sub).toHaveText('$ in Thousands');
  await expect(sub).toHaveAttribute('font-size', '11px');
  await expect(sub).toHaveAttribute('fill', '#556677');
  await click(app, 'bullet-title');
  await expect(title).toHaveText('Sales YTD');
});

test('minimum, maximum, interval and minorTicksPerInterval shape the axis', async ({ app }) => {
  const host = main(app);
  await expect(labels(host)).toHaveCount(7);
  await expect(host.locator('line[id*="_svg_MajorTickLine_"]')).toHaveCount(7 + 24);
  expect(await inst(host, (c) => [c.minimum, c.maximum, c.interval, c.minorTicksPerInterval])).toEqual([0, 300, 50, 4]);
  await click(app, 'bullet-max');
  await expect(labels(host)).toHaveCount(5);
  expect(await inst(host, (c) => [c.maximum, c.interval])).toEqual([400, 100]);
});

test('labelFormat formats the axis labels and follows the view-model', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('[id$="_svg_AxisLabel_50"]')).toHaveText('50K');
  await click(app, 'bullet-format');
  await expect(host.locator('[id$="_svg_AxisLabel_50"]')).toHaveText('50%');
});

test('ranges are drawn with their colors', async ({ app }) => {
  const host = main(app);
  await expect(host.locator('[id$="_svg_range_0"]')).toHaveAttribute('fill', '#f7c6c6');
  await expect(host.locator('[id$="_svg_range_1"]')).toHaveAttribute('fill', '#f7e3a1');
  await expect(host.locator('[id$="_svg_range_2"]')).toHaveAttribute('fill', '#b7e3b0');
  await expect(host.locator('[id*="_chart_legend_text_"]').first()).toHaveText('Low');
});

test('dataSource, valueField and targetField drive the value bar and target', async ({ app }) => {
  const host = main(app);
  await expect(feature(host)).toHaveAttribute('aria-label', /value: 270, target: 250/);
  const before = Number(await feature(host).getAttribute('width'));
  const targetBefore = Number(await target(host).getAttribute('x1'));
  await click(app, 'bullet-data');
  await expect(feature(host)).toHaveAttribute('aria-label', /value: 120, target: 180/);
  expect(Number(await feature(host).getAttribute('width'))).toBeLessThan(before);
  expect(Number(await target(host).getAttribute('x1'))).toBeLessThan(targetBefore);
});

test('valueFill, valueHeight, targetWidth and targetColor style the bars', async ({ app }) => {
  const host = main(app);
  await expect(feature(host)).toHaveAttribute('fill', '#1f4e79');
  await expect(feature(host)).toHaveAttribute('height', '10');
  await expect(target(host)).toHaveAttribute('stroke', '#c0392b');
  await expect(target(host)).toHaveAttribute('stroke-width', '4');
  await click(app, 'bullet-fill');
  await expect(feature(host)).toHaveAttribute('fill', '#00aa66');
  await click(app, 'bullet-target');
  await expect(target(host)).toHaveAttribute('stroke', '#8e44ad');
  await expect(target(host)).toHaveAttribute('stroke-width', '6');
  await expect(feature(host)).toHaveAttribute('height', '16');
});

test('targetTypes: the Rect target is a line, Circle in the target sample is a circle', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => c.targetTypes)).toEqual(['Rect']);
  await expect(host.locator('line[id$="_svg_ComparativeMeasure_0"]')).toHaveCount(1);
  const dots = chartHost(app.section('bullet-targets'), 'bullet-targets');
  expect(await inst(dots, (c) => c.targetTypes)).toEqual(['Circle', 'Cross']);
  await expect(dots.locator('circle[id*="_svg_ComparativeMeasure_"]')).toHaveCount(3);
});

test('orientation Vertical lays the axis out vertically', async ({ app }) => {
  const host = main(app);
  const lengthBefore = Number(await feature(host).getAttribute('width'));
  await click(app, 'bullet-orientation');
  await expect.poll(() => inst(host, (c) => c.orientation)).toBe('Vertical');
  await expect.poll(async () => Number(await feature(host).getAttribute('height'))).toBeGreaterThan(lengthBefore / 10);
  await expect(feature(host)).toHaveAttribute('width', '10');
  await expect(host.locator('svg[id$="_svg"]')).toHaveAttribute('width', '160');
});

test('type Dot draws the value as a dot', async ({ app }) => {
  const host = main(app);
  await expect(feature(host)).not.toHaveAttribute('width', '6');
  await click(app, 'bullet-type');
  await expect(feature(host)).toHaveAttribute('width', '6');
});

test('labelPosition, tickPosition and titlePosition move the elements', async ({ app }) => {
  const host = main(app);
  const labelY = async () => Number(await host.locator('[id$="_svg_AxisLabel_50"]').getAttribute('y'));
  const tickY = async () => Number(await host.locator('[id$="_svg_MajorTickLine_50"]').getAttribute('y2'));
  const titleX = async () => Number(await host.locator('[id$="_BulletChartTitle"]').getAttribute('x'));
  const [l0, t0, x0] = [await labelY(), await tickY(), await titleX()];
  await click(app, 'bullet-positions');
  await expect.poll(labelY).not.toBe(l0);
  await expect.poll(tickY).not.toBe(t0);
  await expect.poll(titleX).not.toBe(x0);
  expect(await inst(host, (c) => [c.labelPosition, c.tickPosition, c.titlePosition])).toEqual(['Inside', 'Inside', 'Left']);
});

test('opposedPosition moves the axis to the other side', async ({ app }) => {
  const host = main(app);
  const labelY = async () => Number(await host.locator('[id$="_svg_AxisLabel_50"]').getAttribute('y'));
  const before = await labelY();
  await click(app, 'bullet-opposed');
  await expect.poll(labelY).not.toBe(before);
  expect(await inst(host, (c) => c.opposedPosition)).toBe(true);
});

test('enableGroupSeparator groups thousands in the axis labels', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => c.enableGroupSeparator)).toBe(false);
  await click(app, 'bullet-group');
  await expect.poll(() => inst(host, (c) => c.enableGroupSeparator)).toBe(true);
  const group = chartHost(app.section('bullet-group'), 'bullet-group');
  await expect(group.locator('[id$="_svg_AxisLabel_1000"]')).toHaveText('1,000');
  await expect(group.locator('[id$="_svg_AxisLabel_5000"]')).toHaveText('5,000');
});

test('tabIndex, tick lines and label style are applied', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => c.tabIndex)).toBe(3);
  await expect(host.locator('[id$="_svg_MajorTickLine_50"]')).toHaveAttribute('stroke', '#222222');
  await expect(host.locator('[id$="_svg_MajorTickLine_50"]')).toHaveAttribute('stroke-width', '2');
  await expect(host.locator('[id$="_svg_MajorTickLine_01"]')).toHaveAttribute('stroke', '#888888');
  await expect(host.locator('[id$="_svg_MajorTickLine_01"]')).toHaveAttribute('stroke-width', '1');
  const label = host.locator('[id$="_svg_AxisLabel_50"]');
  await expect(label).toHaveAttribute('font-size', '13px');
  await expect(label).toHaveAttribute('fill', '#333333');
  await expect(label).toHaveAttribute('font-weight', '600');
});

test('tooltip shows when hovering the value bar', async ({ app, page }) => {
  const host = main(app);
  const p = await center(feature(host));
  await page.mouse.move(p.x - 30, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await expect(page.locator('[id$="_tooltip"]').filter({ hasText: '270' }).first()).toBeVisible();
});

test('legendSettings: legend entries sit below the chart', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => c.legendSettings.visible)).toBe(true);
  expect(await inst(host, (c) => c.legendSettings.position)).toBe('Bottom');
  const legendY = Number(await host.locator('[id$="_chart_legend_text_0"]').getAttribute('y'));
  const labelY = Number(await host.locator('[id$="_svg_AxisLabel_50"]').getAttribute('y'));
  expect(legendY).toBeGreaterThan(labelY);
});

test('data binding with categories: query takes three rows with category labels', async ({ app }) => {
  const host = chartHost(app.section('bullet-multiple'), 'bullet-multiple');
  await expect(host.locator('[id*="_svg_FeatureMeasure_"]')).toHaveCount(3);
  await expect(host.locator('text[id*="_svg_Category"], text[id$="_Category_0"], text:text-is("Revenue")').first()).toBeVisible();
  await expect(host.locator('text:text-is("Expenses")')).toBeVisible();
  await expect(host.locator('text:text-is("Profit")')).toBeVisible();
  await expect(host.locator('text:text-is("Orders")')).toHaveCount(0);
  await expect(host.locator('text:text-is("Revenue")')).toHaveAttribute('font-size', '14px');
  await expect(host.locator('text:text-is("Revenue")')).toHaveAttribute('fill', '#1b4f72');
  await expect(host.locator('text:text-is("Business metrics")')).toBeVisible();
});

test('vertical orientation sample with opposed axis', async ({ app }) => {
  const host = chartHost(app.section('bullet-vertical'), 'bullet-vertical');
  await expect(host.locator('[id$="_svg_FeatureMeasure_0"]')).toHaveAttribute('width', '10');
  expect(await inst(host, (c) => [c.orientation, c.opposedPosition])).toEqual(['Vertical', true]);
  await expect(host.locator('[id$="_svg_AxisLabel_20"]')).toBeVisible();
  await expect(host.locator('text:text-is("Score")')).toBeVisible();
});

test('customization: theme, border, margin, animation, valueBorder and dataLabel', async ({ app }) => {
  const section = app.section('bullet-look');
  const host = chartHost(section, 'bullet-look');
  await expect(host.locator('[id$="_ChartBorder"]')).toHaveAttribute('stroke', '#2c3e50');
  await expect(host.locator('[id$="_ChartBorder"]')).toHaveAttribute('stroke-width', '2');
  await expect(host.locator('[id$="_svg_FeatureMeasure_0"]')).toHaveAttribute('stroke', '#e67e22');
  await expect(host.locator('[id$="_svg_FeatureMeasure_0"]')).toHaveAttribute('stroke-width', '2');
  await expect(host.locator('[id$="_DataLabel_0"]')).toHaveText('270');
  await expect(host.locator('[id$="_DataLabel_0"]')).toHaveAttribute('font-size', '14px');
  expect(await inst(host, (c) => [c.theme, c.animation.enable])).toEqual(['Material', false]);
  const x0 = Number(await host.locator('[id$="_svg_range_0"]').getAttribute('x'));
  await section.getByTestId('bullet-margin').click();
  await expect.poll(async () => Number(await host.locator('[id$="_svg_range_0"]').getAttribute('x'))).toBeGreaterThan(x0);
  await section.getByTestId('bullet-border').click();
  await expect(host.locator('[id$="_ChartBorder"]')).toHaveAttribute('stroke', '#c0392b');
  await section.getByTestId('bullet-theme').click();
  await expect.poll(() => inst(host, (c) => c.theme)).toBe('Bootstrap5Dark');
  await expect(host.locator('[id$="_ChartBorder"]')).not.toHaveAttribute('fill', '#FFFFFF');
});

test('events: load, loaded, legendRender, tooltipRender, mouse click and beforePrint', async ({ app, page }) => {
  const section = app.section('bullet-events');
  const host = chartHost(section, 'bullet-events');
  await fired(page, 'load');
  await fired(page, 'loaded');
  await fired(page, 'legendRender');
  // the legendRender handler renames the first legend entry
  await expect(host.locator('text:text-is("Poor")')).toBeVisible();
  const bar = host.locator('[id$="_svg_FeatureMeasure_0"]');
  const p = await center(bar);
  await page.mouse.move(p.x - 30, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await fired(page, 'tooltipRender');
  await page.mouse.click(p.x, p.y);
  await fired(page, 'bulletChartMouseClick');
  expect(await eventLast(page, 'bulletChartMouseClick')).toMatchObject({ type: expect.anything() });
  await section.getByTestId('bullet-print').click();
  await fired(page, 'beforePrint');
});
