import { test, expect } from './fixtures';
import { host, inst, hostId, eventCount, eventLast, center } from './vizHelpers';

test.beforeEach(async ({ app }) => app.open('rangeNavigator'));

const STORE = '__rangeNavigatorEvents';
const fired = (page, name: string) => expect.poll(() => eventCount(page, STORE, name), { message: name }).toBeGreaterThan(0);
const DAY = 24 * 3600 * 1000;

/** Parts of a range navigator located through the host id. */
async function parts(section, testId: string) {
  const el = host(section, testId);
  const id = await hostId(el);
  const part = (suffix: string) => el.locator(`[id="${id}${suffix}"]`);
  return {
    el, id, part,
    svg: part('_svg'),
    labels: el.locator(`text[id^="${id}_AxisLabel_"]`),
    leftThumb: part('_LeftSlider_ThumpSymbol'),
    rightThumb: part('_RightSlider_ThumpSymbol'),
    selected: part('_SelectedArea'),
    range: () => inst(el, w => [w.startValue, w.endValue])
  };
}

/** Drag from the center of a locator by dx pixels with the real mouse, optionally releasing later. */
async function drag(page, locator, dx: number, release = true) {
  const { x, y } = await center(locator);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx / 2, y, { steps: 5 });
  await page.mouse.move(x + dx, y, { steps: 5 });
  if (release) { await page.mouse.up(); }
  return { x: x + dx, y };
}

test.describe('default sample', () => {
  test('renders the series, axis labels, thumbs and the initial selection', async ({ app }) => {
    const p = await parts(app.section('rn-basic'), 'rn-basic');
    await expect(p.part('_Series_0')).toBeAttached();
    await expect(p.part('_Series_0')).toHaveAttribute('fill', '#336699');
    await expect(p.part('_Series_border_0')).toHaveAttribute('stroke', '#264b73');
    expect(await p.labels.count()).toBeGreaterThan(3);
    await expect(p.leftThumb).toBeAttached();
    await expect(p.rightThumb).toBeAttached();
    await expect(p.svg).toHaveAttribute('height', '120');
    expect(await inst(p.el, w => [w.valueType, w.series[0].type, w.series[0].opacity, w.series[0].width, w.xName, w.yName, w.dataSource.length, w.height]))
      .toEqual(['DateTime', 'Area', 0.6, 2, 'x', 'y', 120, '120px']);
    const [start, end] = await p.range();
    expect(new Date(start).getMonth()).toBe(1); // Feb 10
    expect(new Date(end).getMonth()).toBe(2); // Mar 10
  });

  test('tooltip with displayMode Always follows the thumbs and uses the format', async ({ app }) => {
    const p = await parts(app.section('rn-basic'), 'rn-basic');
    await expect(p.part('_leftTooltip_text')).toHaveText('Feb 10');
    await expect(p.part('_rightTooltip_text')).toHaveText('Mar 10');
    expect(await inst(p.el, w => [w.tooltip.enable, w.tooltip.displayMode, w.tooltip.format, w.tooltip.fill, w.tooltip.opacity, w.tooltip.border.color]))
      .toEqual([true, 'Always', 'MMM dd', '#222222', 0.9, '#ffffff']);
    await expect(p.part('_leftTooltip_path')).toHaveAttribute('fill', '#222222');
  });

  test('two-way value: model to view', async ({ app }) => {
    const section = app.section('rn-basic');
    const p = await parts(section, 'rn-basic');
    await expect(section.getByTestId('rn-value-out')).toHaveText('2024-02-10..2024-03-10');
    await section.getByTestId('rn-set-value').click();
    await expect.poll(async () => new Date((await p.range())[0]).getDate()).toBe(5);
    await expect(p.part('_leftTooltip_text')).toHaveText('Jan 05');
    await expect(p.part('_rightTooltip_text')).toHaveText('Jan 25');
    expect(await inst(p.el, w => w.value.map(v => new Date(v).getDate()))).toEqual([5, 25]);
  });

  test('two-way value: dragging a thumb updates the view-model and raises changed', async ({ app, page }) => {
    const section = app.section('rn-basic');
    const p = await parts(section, 'rn-basic');
    const [before] = await p.range();
    await drag(page, p.leftThumb, -80);
    await expect.poll(async () => (await p.range())[0]).toBeLessThan(before - 5 * DAY);
    await expect(section.getByTestId('rn-changed-count')).not.toHaveText('0');
    await expect(section.getByTestId('rn-value-out')).not.toHaveText('2024-02-10..2024-03-10');
    // the view-model value mirrors the widget
    const [start, end] = await p.range();
    await expect(section.getByTestId('rn-value-out'))
      .toHaveText(`${new Date(start).toISOString().slice(0, 10)}..${new Date(end).toISOString().slice(0, 10)}`);
    expect(await eventLast(page, STORE, 'changed')).toMatchObject({ zoomFactor: expect.any(Number), zoomPosition: expect.any(Number) });
    await expect(section.getByTestId('rn-changed-out')).toHaveText(/^\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}$/);
  });

  test('dragging the selected region moves both thumbs', async ({ app, page }) => {
    const section = app.section('rn-basic');
    const p = await parts(section, 'rn-basic');
    const [s0, e0] = await p.range();
    await drag(page, p.selected, 60);
    await expect.poll(async () => (await p.range())[0]).toBeGreaterThan(s0 + 3 * DAY);
    const [s1, e1] = await p.range();
    expect(Math.abs((e1 - s1) - (e0 - s0))).toBeLessThan(DAY);
  });

  test('load, loaded, labelRender and tooltipRender events', async ({ app, page }) => {
    const section = app.section('rn-basic');
    for (const id of ['rn-load', 'rn-loaded', 'rn-label-render', 'rn-tooltip-render']) {
      await expect(section.getByTestId(id)).not.toHaveText('0');
    }
    expect(await eventLast(page, STORE, 'labelRender')).toMatchObject({ text: expect.any(String) });
    // labelRender rewrote the first label
    const p = await parts(section, 'rn-basic');
    await expect(p.labels.first()).toHaveText('First week');
    await expect(section.getByTestId('rn-tooltip-text')).not.toHaveText('');
  });

  test('selectorRender is bound, Syncfusion never raises it so only the listener wiring is checked', async ({ app, page }) => {
    const p = await parts(app.section('rn-basic'), 'rn-basic');
    expect(await inst(p.el, w => typeof w.addEventListener === 'function' && 'selectorRender' in w)).toBe(true);
    expect(await eventCount(page, STORE, 'selectorRender')).toBe(0);
  });
});

test.describe('series types and axes', () => {
  test('Column series draws one path per point, numeric axis with minimum, maximum and interval', async ({ app }) => {
    const section = app.section('rn-types');
    const p = await parts(section, 'rn-column');
    await expect(p.el.locator(`[id^="${p.id}_Series_0_Point_"]`)).toHaveCount(50);
    expect(await inst(p.el, w => [w.valueType, w.minimum, w.maximum, w.interval, w.series[0].type])).toEqual(['Double', 0, 49, 7, 'Column']);
    await expect(p.labels.filter({ hasText: /^14$/ })).toHaveCount(1);
    await expect(p.labels.filter({ hasText: /^7$/ })).toHaveCount(1);
  });

  test('numeric two-way value follows the thumbs', async ({ app, page }) => {
    const section = app.section('rn-types');
    const p = await parts(section, 'rn-column');
    await expect(section.getByTestId('rn-numeric-out')).toHaveText('10..30');
    await drag(page, p.rightThumb, 60);
    await expect.poll(async () => Number((await section.getByTestId('rn-numeric-out').textContent()).split('..')[1])).toBeGreaterThan(32);
    expect((await p.range())[1]).toBeGreaterThan(32);
  });

  test('StepLine, Spline and SplineArea series render', async ({ app }) => {
    const section = app.section('rn-types');
    for (const [id, type] of [['rn-step', 'StepLine'], ['rn-spline', 'Spline'], ['rn-spline-area', 'SplineArea']]) {
      const p = await parts(section, id);
      await expect(p.part('_Series_0')).toBeAttached();
      expect(await inst(p.el, w => w.series[0].type)).toBe(type);
    }
    await expect((await parts(section, 'rn-step')).part('_Series_0')).toHaveAttribute('stroke', '#ef5350');
    await expect((await parts(section, 'rn-step')).part('_Series_0')).toHaveAttribute('stroke-dasharray', '4,2');
    await expect((await parts(section, 'rn-spline')).part('_Series_0')).toHaveAttribute('stroke', '#5c6bc0');
    await expect((await parts(section, 'rn-spline-area')).part('_Series_0')).toHaveAttribute('fill', '#ffa726');
  });

  test('a series can bring its own dataSource, xName and yName', async ({ app }) => {
    const p = await parts(app.section('rn-types'), 'rn-own-data');
    await expect(p.part('_Series_0')).toBeAttached();
    await expect(p.part('_Series_0')).toHaveAttribute('fill', '#00897b');
    expect(await inst(p.el, w => [w.series[0].xName, w.series[0].yName, w.series[0].dataSource.length])).toEqual(['x', 'y', 120]);
  });

  test('logarithmic axis with logBase', async ({ app }) => {
    const p = await parts(app.section('rn-types'), 'rn-log');
    await expect(p.part('_Series_0')).toBeAttached();
    expect(await inst(p.el, w => [w.valueType, w.logBase])).toEqual(['Logarithmic', 10]);
    const texts = await p.labels.allTextContents();
    expect(texts).toEqual(expect.arrayContaining(['10', '100', '1000']));
  });
});

test('query limits the rows taken from a DataManager', async ({ app }) => {
  const p = await parts(app.section('rn-data'), 'rn-query');
  await expect(p.part('_Series_0')).toBeAttached();
  const days = await inst(p.el, w => (w.chartSeries.xAxis.actualRange.max - w.chartSeries.xAxis.actualRange.min) / 86400000);
  expect(Math.round(days)).toBe(29);
  expect(await inst(p.el, w => w.query.queries[0].fn)).toBe('onTake');
});

test.describe('period selector', () => {
  test('renders the period buttons and selects the configured period', async ({ app }) => {
    const p = await parts(app.section('rn-period'), 'rn-period');
    const buttons = p.el.locator('[id*="e-tbr-btn_"]');
    await expect(buttons).toHaveCount(3);
    await expect(buttons.nth(0)).toContainText('1M');
    await expect(buttons.nth(2)).toContainText('All');
    expect(await inst(p.el, w => [w.periodSelectorSettings.position, w.periodSelectorSettings.height, w.periodSelectorSettings.periods.length])).toEqual(['Bottom', 43, 3]);
    // the 2M period is selected: the selection spans about two months of the end of the data
    const [start, end] = await p.range();
    expect(Math.round((end - start) / DAY)).toBeGreaterThanOrEqual(58);
    expect(Math.round((end - start) / DAY)).toBeLessThanOrEqual(62);
  });

  test('clicking a period changes the selection and reports selectedPeriod', async ({ app }) => {
    const section = app.section('rn-period');
    const p = await parts(section, 'rn-period');
    await p.el.locator('[id*="e-tbr-btn_0"]').click();
    await expect(section.getByTestId('rn-period-out')).toHaveText('1M');
    await expect.poll(async () => { const [s, e] = await p.range(); return Math.round((e - s) / DAY); }).toBeLessThanOrEqual(32);
    await p.el.locator('[id*="e-tbr-btn_2"]').click();
    await expect(section.getByTestId('rn-period-out')).toHaveText('All');
    await expect.poll(async () => { const [s, e] = await p.range(); return Math.round((e - s) / DAY); }).toBeGreaterThanOrEqual(118);
  });
});

test.describe('lightweight and disabled', () => {
  test('without a series only the axis and the thumbs are drawn', async ({ app }) => {
    const p = await parts(app.section('rn-lightweight'), 'rn-light');
    await expect(p.part('_Series_0')).toHaveCount(0);
    await expect(p.leftThumb).toBeAttached();
    expect(await inst(p.el, w => [w.series.length, w.minimum, w.maximum, w.interval, w.tooltip.enable])).toEqual([0, 0, 100, 10, true]);
    await expect(p.labels.filter({ hasText: /^50$/ })).toHaveCount(1);
  });

  test('disableRangeSelector hides the selector and blocks dragging', async ({ app, page }) => {
    const p = await parts(app.section('rn-lightweight'), 'rn-disabled');
    expect(await inst(p.el, w => w.disableRangeSelector)).toBe(true);
    await expect(p.part('_Series_0_Point_0')).toBeAttached();
    const before = await p.range();
    await drag(page, p.rightThumb, 60).catch(() => undefined);
    expect(await p.range()).toEqual(before);
  });
});

test.describe('customization', () => {
  test('thumb, region, label, grid line, tick line, border, background and margin styles', async ({ app }) => {
    const p = await parts(app.section('rn-look'), 'rn-look');
    await expect(p.leftThumb).toHaveAttribute('fill', '#ffcc00');
    await expect(p.leftThumb).toHaveAttribute('stroke', '#aa7700');
    await expect(p.part('_SelectedArea')).toHaveAttribute('fill', '#c8e6c9');
    await expect(p.part('_leftUnSelectedArea')).toHaveAttribute('fill', '#eeeeee');
    const label = p.labels.first();
    await expect(label).toHaveAttribute('fill', '#aa0000');
    await expect(label).toHaveAttribute('font-family', 'Georgia');
    await expect(label).toHaveAttribute('font-weight', '700');
    await expect(p.part('_MajorGridLine')).toHaveAttribute('stroke', '#cc3300');
    await expect(p.part('_MajorGridLine')).toHaveAttribute('stroke-width', '2');
    await expect(p.part('_MajorTickLine')).toHaveAttribute('stroke', '#336699');
    await expect(p.part('_MajorTickLine')).toHaveAttribute('stroke-width', '3');
    await expect(p.part('_SeriesBorder')).toHaveAttribute('stroke', '#cc3300');
    await expect(p.part('_SeriesBorder')).toHaveAttribute('stroke-width', '2');
    await expect(p.part('_ChartBorder')).toHaveAttribute('fill', '#f1f8e9');
    expect(await inst(p.el, w => [w.theme, w.margin.left, w.margin.top, w.navigatorStyleSettings.thumb.type, w.navigatorBorder.width, w.background]))
      .toEqual(['Bootstrap5', 20, 10, 'Rectangle', 2, '#f1f8e9']);
    const chart = await p.part('_Series_0').boundingBox();
    const svg = await p.svg.boundingBox();
    expect(chart.x - svg.x).toBeGreaterThanOrEqual(19);
  });

  test('enableDeferredUpdate raises changed only after the pointer is released', async ({ app, page }) => {
    const section = app.section('rn-look');
    const p = await parts(section, 'rn-look');
    expect(await inst(p.el, w => [w.enableDeferredUpdate, w.allowSnapping, w.allowIntervalData, w.animationDuration])).toEqual([true, true, false, 0]);
    const before = await eventCount(page, STORE, 'changed');
    const { x, y } = await drag(page, p.rightThumb, -60, false);
    expect(await eventCount(page, STORE, 'changed')).toBe(before);
    await page.mouse.up();
    await expect.poll(() => eventCount(page, STORE, 'changed')).toBeGreaterThan(before);
    expect(x).toBeGreaterThan(0);
    expect(y).toBeGreaterThan(0);
  });

  test('allowSnapping snaps the selection to the axis interval', async ({ app, page }) => {
    const p = await parts(app.section('rn-look'), 'rn-look');
    await drag(page, p.rightThumb, -37);
    await expect.poll(async () => eventCount(page, STORE, 'changed')).toBeGreaterThan(0);
    const [start, end] = await p.range();
    // snapped values land on whole days
    expect((end - new Date(end).setHours(0, 0, 0, 0)) % DAY).toBeLessThan(1000);
    expect(start).toBeLessThan(end);
  });

  test('label options: interval, format, position, placement, ticks, intersect action, skeleton and grouping', async ({ app }) => {
    const p = await parts(app.section('rn-look'), 'rn-labels');
    expect(await inst(p.el, w => [w.interval, w.intervalType, w.labelFormat, w.labelPosition, w.labelPlacement, w.tickPosition,
      w.labelIntersectAction, w.skeleton, w.skeletonType, w.secondaryLabelAlignment, w.enableGrouping, w.groupBy, w.useGroupingSeparator]))
      .toEqual([15, 'Days', 'MMM dd', 'Inside', 'OnTicks', 'Inside', 'Rotate45', 'yMMM', 'Date', 'Near', true, 'Months', true]);
    const first = await p.labels.first().textContent();
    expect(first).toMatch(/^[A-Z][a-z]{2} \d{2}$/);
    // enableGrouping draws a second level of labels (the months)
    await expect(p.part('_SecondLevelAxisLabels').locator('text').first()).toBeAttached();
    expect(await inst(p.el, w => [new Date(w.minimum).getTime(), new Date(w.maximum).getTime()])).toEqual([new Date(2024, 0, 1).getTime(), new Date(2024, 0, 1).getTime() + 119 * DAY]);
  });
});

test.describe('resize and print', () => {
  test('beforeResize and resized are raised when the window changes size', async ({ app, page }) => {
    const section = app.section('rn-resize');
    await fired(page, 'loaded');
    await page.setViewportSize({ width: 800, height: 700 });
    await expect(section.getByTestId('rn-before-resize')).not.toHaveText('0');
    await expect(section.getByTestId('rn-resized')).not.toHaveText('0');
    await expect(section.getByTestId('rn-resized-width')).toHaveText(/^\d+$/);
  });

  test('print raises beforePrint and the handler can cancel it', async ({ app }) => {
    const section = app.section('rn-resize');
    await section.getByTestId('rn-print').click();
    await expect(section.getByTestId('rn-before-print')).toHaveText('1');
  });
});

test('model to widget: data, theme, background, width and disableRangeSelector follow the view-model', async ({ app }) => {
  const section = app.section('rn-dynamic');
  const p = await parts(section, 'rn-dynamic');
  const days = () => inst(p.el, w => Math.round((w.chartSeries.xAxis.actualRange.max - w.chartSeries.xAxis.actualRange.min) / 86400000));
  expect(await days()).toBe(119);
  await section.getByTestId('rn-swap').click();
  await expect.poll(days).toBe(59);
  await section.getByTestId('rn-paint').click();
  await expect(p.part('_ChartBorder')).toHaveAttribute('fill', '#fff8e1');
  await section.getByTestId('rn-dark').click();
  await expect.poll(() => inst(p.el, w => w.theme)).toBe('Bootstrap5Dark');
  await section.getByTestId('rn-narrow').click();
  await expect(p.part('_svg')).toHaveAttribute('width', '400');
  await section.getByTestId('rn-disable').click();
  await expect.poll(() => inst(p.el, w => w.disableRangeSelector)).toBe(true);
});
