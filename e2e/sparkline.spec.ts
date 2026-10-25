import { test, expect } from './fixtures';
import { host, inst, hostId, eventCount, eventLast, center } from './vizHelpers';

test.beforeEach(async ({ app }) => app.open('sparkline'));

const STORE = '__sparklineEvents';
const fired = (page, name: string) => expect.poll(() => eventCount(page, STORE, name), { message: name }).toBeGreaterThan(0);

test('types: line, column, area, pie and win/loss render their own series elements', async ({ app }) => {
  const section = app.section('sp-types');
  const count = async (id: string, part: string) => {
    const el = host(section, id);
    const prefix = await hostId(el);
    return el.locator(`[id^="${prefix}_sparkline_${part}"]`).count();
  };
  await expect.poll(() => count('sp-line', 'line')).toBe(1);
  await expect.poll(() => count('sp-column', 'column_')).toBe(7);
  await expect.poll(() => count('sp-area', 'area')).toBeGreaterThan(0);
  await expect.poll(() => count('sp-pie', 'pie_')).toBe(7);
  await expect.poll(() => count('sp-winloss', 'winloss_')).toBe(12);
  expect(await inst(host(section, 'sp-column'), w => w.type)).toBe('Column');
  expect(await inst(host(section, 'sp-pie'), w => w.type)).toBe('Pie');
  expect(await inst(host(section, 'sp-winloss'), w => w.type)).toBe('WinLoss');
});

test('width and height size the svg', async ({ app }) => {
  const el = host(app.section('sp-types'), 'sp-line');
  const prefix = await hostId(el);
  await expect(el.locator(`#${prefix}_svg`)).toHaveAttribute('width', '150');
  await expect(el.locator(`#${prefix}_svg`)).toHaveAttribute('height', '60');
  expect(await inst(el, w => [w.width, w.height])).toEqual(['150px', '60px']);
});

test('pie slices use the palette', async ({ app }) => {
  const el = host(app.section('sp-types'), 'sp-pie');
  const prefix = await hostId(el);
  await expect(el.locator(`#${prefix}_sparkline_pie_0`)).toHaveAttribute('fill', '#e91e63');
  await expect(el.locator(`#${prefix}_sparkline_pie_2`)).toHaveAttribute('fill', '#3f51b5');
});

test('xName, yName and valueType map object data', async ({ app }) => {
  const section = app.section('sp-data');
  const category = host(section, 'sp-category');
  const prefix = await hostId(category);
  await expect(category.locator(`[id^="${prefix}_sparkline_column_"]`)).toHaveCount(6);
  expect(await inst(category, w => [w.valueType, w.xName, w.yName, w.useGroupingSeparator, w.format]))
    .toEqual(['Category', 'xval', 'yval', true, 'n']);
  const numeric = host(section, 'sp-numeric');
  await expect(numeric.locator(`[id$="_sparkline_line"]`)).toHaveCount(1);
  expect(await inst(numeric, w => w.valueType)).toBe('Numeric');
  const dates = host(section, 'sp-datetime');
  await expect(dates.locator(`[id$="_sparkline_line"]`)).toHaveCount(1);
  expect(await inst(dates, w => w.valueType)).toBe('DateTime');
});

test('query limits the data taken from the DataManager', async ({ app }) => {
  const el = host(app.section('sp-data'), 'sp-query');
  const prefix = await hostId(el);
  await expect(el.locator(`[id^="${prefix}_sparkline_column_"]`)).toHaveCount(3);
  expect(await inst(el, w => w.query.queries.length)).toBe(1);
});

test('fill, lineWidth, opacity, padding, rangePadding and theme', async ({ app }) => {
  const el = host(app.section('sp-look'), 'sp-fill');
  const line = el.locator('[id$="_sparkline_line"]');
  await expect(line).toHaveAttribute('stroke', '#cc3300');
  await expect(line).toHaveAttribute('stroke-width', '3');
  await expect(line).toHaveAttribute('opacity', '0.5');
  expect(await inst(el, w => [w.padding.left, w.padding.top, w.rangePadding, w.theme]))
    .toEqual([10, 6, 'Additional', 'Bootstrap5']);
});

test('point colors and border style the columns', async ({ app }) => {
  const el = host(app.section('sp-look'), 'sp-colors');
  const prefix = await hostId(el);
  const fill = (i: number) => el.locator(`#${prefix}_sparkline_column_${i}`).getAttribute('fill');
  // start, negative, high, low, high (tie of the highest value), tie... the colors come from the data order
  await expect.poll(() => fill(0)).toBe('#0000ff'); // start point
  await expect.poll(() => fill(1)).toBe('#880088'); // negative point
  await expect.poll(() => fill(2)).toBe('#00aa00'); // high point
  await expect.poll(() => fill(3)).toBe('#aa0000'); // low point
  await expect.poll(() => fill(6)).toBe('#00aa00'); // end point is also a high value, high wins
  await expect(el.locator(`#${prefix}_sparkline_column_2`)).toHaveAttribute('stroke', '#cc3300');
  await expect(el.locator(`#${prefix}_sparkline_column_2`)).toHaveAttribute('stroke-width', '2');
  expect(await inst(el, w => [w.highPointColor, w.lowPointColor, w.startPointColor, w.endPointColor, w.negativePointColor,
    w.tiePointColor, w.border.color])).toEqual(['#00aa00', '#aa0000', '#0000ff', '#ffaa00', '#880088', '#222222', '#cc3300']);
});

test('markers and data labels with their rendering events', async ({ app, page }) => {
  const el = host(app.section('sp-features'), 'sp-marker');
  const prefix = await hostId(el);
  await expect(el.locator(`[id^="${prefix}_sparkline_marker_"]:not([id$="_g"])`)).toHaveCount(7);
  await expect(el.locator(`#${prefix}_sparkline_marker_0`)).toHaveAttribute('fill', '#336699');
  await expect(el.locator(`[id^="${prefix}_sparkline_label_text_"]`)).toHaveCount(2); // high and low
  await fired(page, 'markerRendering');
  await fired(page, 'dataLabelRendering');
  expect((await eventLast(page, STORE, 'markerRendering')).pointIndex).toBeGreaterThanOrEqual(0);
});

test('axis line, range band and container area', async ({ app, page }) => {
  const el = host(app.section('sp-features'), 'sp-axis');
  const prefix = await hostId(el);
  await expect(el.locator(`#${prefix}_Sparkline_XAxis`)).toHaveAttribute('stroke', '#cc3300');
  await expect(el.locator(`#${prefix}_rangeBand_0`)).toHaveAttribute('fill', '#ffcc66');
  await expect(el.locator(`#${prefix}_SparklineBorder`)).toHaveAttribute('stroke', '#336699');
  expect(await inst(el, w => [w.axisSettings.maxY, w.rangeBandSettings.length, w.containerArea.background]))
    .toEqual([10, 1, '#eef6ff']);
  await fired(page, 'axisRendering');
});

test('tooltip and track line with tooltipInitialize', async ({ app, page }) => {
  const el = host(app.section('sp-tooltip'), 'sp-tooltip');
  const prefix = await hostId(el);
  const svg = el.locator(`#${prefix}_svg`);
  const { x, y } = await center(svg);
  await page.mouse.move(x - 20, y);
  await page.mouse.move(x, y, { steps: 4 });
  await expect(page.locator(`#${prefix}_sparkline_tooltip_div`)).toBeVisible();
  await expect(page.locator(`#${prefix}_sparkline_tooltip_div`)).toContainText(' : ');
  await expect(el.locator(`#${prefix}_sparkline_tracker`)).toHaveAttribute('stroke-width', '2');
  await fired(page, 'tooltipInitialize');
  expect(await inst(el, w => [w.tooltipSettings.visible, w.tooltipSettings.trackLineSettings.visible])).toEqual([true, true]);
});

test('load, loaded, rendering, mouse and click events', async ({ app, page }) => {
  const section = app.section('sp-events');
  await expect(section.getByTestId('sp-load-count')).not.toHaveText('0');
  await expect(section.getByTestId('sp-loaded-count')).not.toHaveText('0');
  await fired(page, 'seriesRendering');
  await fired(page, 'pointRendering');
  const el = host(section, 'sp-events');
  const prefix = await hostId(el);
  const column = el.locator(`#${prefix}_sparkline_column_3`);
  const { x, y } = await center(column);
  await page.mouse.move(x - 30, y);
  await page.mouse.move(x, y, { steps: 4 });
  await expect(section.getByTestId('sp-moves')).not.toHaveText('0');
  await expect(section.getByTestId('sp-point-moves')).not.toHaveText('0');
  await page.mouse.click(x, y);
  await expect(section.getByTestId('sp-clicks')).not.toHaveText('0');
  await expect(section.getByTestId('sp-point-clicks')).not.toHaveText('0');
  await expect(section.getByTestId('sp-point-info')).toHaveText('3');
});

test('resize is raised when the window changes size', async ({ app, page }) => {
  await fired(page, 'loaded');
  await page.setViewportSize({ width: 700, height: 700 });
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(app.section('sp-events').getByTestId('sp-events')).toBeVisible();
  await fired(page, 'resize');
});

test('model to widget: type, fill and width follow the view-model', async ({ app }) => {
  const section = app.section('sp-dynamic');
  const el = host(section, 'sp-dynamic');
  const prefix = await hostId(el);
  await expect(el.locator(`#${prefix}_sparkline_line`)).toHaveAttribute('stroke', '#336699');
  await section.getByTestId('sp-switch').click();
  await expect(el.locator(`[id^="${prefix}_sparkline_column_"]`)).toHaveCount(7);
  expect(await inst(el, w => w.type)).toBe('Column');
  await section.getByTestId('sp-set-fill').click();
  await expect(el.locator(`#${prefix}_sparkline_column_0`)).toHaveAttribute('fill', '#ff0000');
  await section.getByTestId('sp-set-width').click();
  await expect(el.locator(`#${prefix}_svg`)).toHaveAttribute('width', '200');
});
