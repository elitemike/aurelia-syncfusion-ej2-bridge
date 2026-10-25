import { test, expect } from './fixtures';
import { chartHost, inst, eventCount, eventLast, hitPoint } from './chartFamilyHelpers';

test.beforeEach(async ({ app }) => app.open('circularChart3D'));

const main = (app) => chartHost(app.section('cc3d-main'), 'cc3d-main');
const click = (app, id: string) => app.section('cc3d-main').getByTestId(id).click();
const svg = (host) => host.locator('svg[id$="_svg"]');
const faces = (host, p = 0) => host.locator(`[id*="-region-series-0-point-${p}"]`);
const fired = (page, name: string) => expect.poll(() => eventCount(page, name), { message: name }).toBeGreaterThan(0);
const pointFace = (p: number) => `[id*="-region-series-0-point-${p}"]`;

test('default sample renders five slices, data labels and legend', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toBeVisible();
  for (let p = 0; p < 5; p++) { await expect(faces(host, p).first()).toBeAttached(); }
  await expect(faces(host, 5)).toHaveCount(0);
  await expect(host.locator('text[id*="-data-label-text-"]')).toHaveText(['37%', '27%', '14%', '12%', '10%']);
  await expect(host.locator('[id*="_chart_legend_text_"]')).toHaveText(['Chrome', 'Safari', 'Edge', 'Firefox', 'Other']);
  const ids = await app.page.locator('.e-circularchart3d').evaluateAll((els) => els.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(await inst(host, (c) => [c.dataSource.length, c.series.length])).toEqual([5, 1]);
});

test('width and height are applied and follow the view-model', async ({ app }) => {
  const host = main(app);
  await expect(svg(host)).toHaveAttribute('height', '380');
  await click(app, 'cc3d-size');
  await expect(svg(host)).toHaveAttribute('width', '520');
  await expect(svg(host)).toHaveAttribute('height', '300');
});

test('title, subTitle and their styles', async ({ app }) => {
  const host = main(app);
  const title = host.locator('[id$="-title"]').first();
  await expect(title).toHaveText('Browser share');
  await expect(title).toHaveAttribute('font-size', '18px');
  await expect(title).toHaveAttribute('fill', '#1b3a57');
  const sub = host.locator('[id$="-sub-title"]');
  await expect(sub).toHaveText('Percent of users');
  await expect(sub).toHaveAttribute('fill', '#667788');
  await click(app, 'cc3d-title');
  await expect(title).toHaveText('Market share');
  await expect(sub).toHaveText('Updated');
  await click(app, 'cc3d-styles');
  await expect(title).toHaveAttribute('font-size', '26px');
  await expect(title).toHaveAttribute('fill', '#c0392b');
  await expect(sub).toHaveAttribute('font-size', '16px');
  await expect(host.locator('[id$="-border"]').first()).toHaveAttribute('stroke', '#e67e22');
});

test('border, background and backgroundImage', async ({ app }) => {
  const host = main(app);
  const border = host.locator('[id$="-border"]').first();
  await expect(border).toHaveAttribute('stroke', '#34495e');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#f8fbff');
  await expect(host.locator('image[id$="-background"]')).toHaveAttribute('href', /data:image\/png;base64/);
  await click(app, 'cc3d-background');
  await expect(host.locator('[id$="-border"]').first()).toHaveAttribute('fill', '#fff3e0');
});

test('theme restyles the chart', async ({ app }) => {
  const host = main(app);
  const fill = () => host.locator('text[id*="-data-label-text-0"]').getAttribute('fill');
  const title = () => host.locator('[id$="-title"]').first().getAttribute('fill');
  const before = [await fill(), await title()];
  await click(app, 'cc3d-theme');
  await expect.poll(() => inst(host, (c) => c.theme)).toBe('Bootstrap5Dark');
  await expect.poll(async () => [await fill(), await title()]).not.toEqual(before);
});

test('depth, tilt and rotation reshape the scene', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => [c.depth, c.tilt, c.rotation])).toEqual([80, -30, 0]);
  const d = () => faces(host, 0).first().getAttribute('d');
  const before = await d();
  await click(app, 'cc3d-angles');
  await expect.poll(d).not.toBe(before);
  expect(await inst(host, (c) => [c.depth, c.tilt, c.rotation])).toEqual([40, -10, 90]);
});

test('enableRotation lets the user rotate the pie by dragging', async ({ app, page }) => {
  const host = main(app);
  const p = await hitPoint(host, pointFace(0));
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x + 70, p.y + 15, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => inst(host, (c) => c.rotation)).not.toBe(0);
  await click(app, 'cc3d-norotation');
  await expect.poll(() => inst(host, (c) => c.enableRotation)).toBe(false);
  const rotation = await inst(host, (c) => c.rotation);
  const q = await hitPoint(host, pointFace(0));
  await page.mouse.move(q.x, q.y);
  await page.mouse.down();
  await page.mouse.move(q.x - 70, q.y - 15, { steps: 8 });
  await page.mouse.up();
  expect(await inst(host, (c) => c.rotation)).toBe(rotation);
});

test('margin moves the plot', async ({ app }) => {
  const host = main(app);
  const x = async () => Number(await host.locator('text[id*="-data-label-text-0"]').getAttribute('x'));
  const before = await x();
  await click(app, 'cc3d-margin');
  await expect.poll(x).not.toBe(before);
});

test('legendSettings moves the legend', async ({ app }) => {
  const host = main(app);
  const box = async () => host.locator('[id$="_chart_legend_element"]').boundingBox();
  const before = await box();
  await click(app, 'cc3d-legend');
  await expect.poll(async () => (await box()).y).toBeGreaterThan(before.y);
  expect(await inst(host, (c) => c.legendSettings.position)).toBe('Bottom');
});

test('tooltip shows the formatted slice on hover', async ({ app, page }) => {
  const host = main(app);
  const p = await hitPoint(host, pointFace(1));
  await page.mouse.move(p.x - 10, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await expect(page.locator('[id$="_tooltip"]').filter({ hasText: /Safari.*27/ }).first()).toBeVisible();
  await click(app, 'cc3d-tooltip');
  expect(await inst(host, (c) => c.tooltip.format)).toBe('Share ${point.y}');
});

test('series follows the view-model', async ({ app }) => {
  const host = main(app);
  await click(app, 'cc3d-series');
  // (Syncfusion leaves the labels of the removed slices behind, so only the first three are compared)
  for (const [i, text] of ['37%', '27%', '14%'].entries()) {
    await expect(host.locator(`text[id$="-data-label-text-${i}"]`)).toHaveText(text);
  }
  expect(await inst(host, (c) => [c.series[0].name, c.series[0].radius])).toEqual(['Top three', '70%']);
});

test('enableAnimation, enableExport and useGroupingSeparator reach the widget', async ({ app }) => {
  const host = main(app);
  expect(await inst(host, (c) => [c.enableAnimation, c.enableExport, c.useGroupingSeparator])).toEqual([false, true, true]);
  await click(app, 'cc3d-grouping');
  await expect.poll(() => inst(host, (c) => c.useGroupingSeparator)).toBe(false);
});

test('doughnut sample', async ({ app }) => {
  const host = chartHost(app.section('cc3d-doughnut'), 'cc3d-doughnut');
  expect(await inst(host, (c) => c.series[0].innerRadius)).toBe('40%');
  const pie = chartHost(app.section('cc3d-explode-all'), 'cc3d-explode-all');
  await expect(faces(host, 0).first()).toBeAttached();
  // the ring has an inner wall, so a slice has more faces than the same slice of a full pie
  expect(await faces(host, 0).count()).toBeGreaterThan(await faces(pie, 0).count());
});

test('exploding samples', async ({ app }) => {
  const one = chartHost(app.section('cc3d-explode'), 'cc3d-explode');
  expect(await inst(one, (c) => [c.series[0].explode, c.series[0].explodeIndex, c.series[0].explodeOffset])).toEqual([true, 1, '15%']);
  await expect(faces(one, 1).first()).toBeAttached();
  const all = chartHost(app.section('cc3d-explode-all'), 'cc3d-explode-all');
  expect(await inst(all, (c) => [c.series[0].explodeAll, c.series[0].explodeOffset])).toEqual([true, '8%']);
  await expect(faces(all, 4).first()).toBeAttached();
});

test('selection and highlight: selectedDataIndexes, selectionMode, isMultiSelect, patterns, highlight', async ({ app, page }) => {
  const section = app.section('cc3d-selection');
  const host = chartHost(section, 'cc3d-selection');
  const face = (p: number) => faces(host, p).first();
  await expect(face(1)).toHaveClass(/_ej2_chart_selection_series_0/);
  await expect(face(0)).toHaveClass(/_ej2_deselected/);
  const p = await hitPoint(host, pointFace(2));
  await page.mouse.click(p.x, p.y);
  await expect(face(2)).toHaveClass(/_ej2_chart_selection_series_0/);
  await section.getByTestId('cc3d-sel-indexes').click();
  await expect(face(3)).toHaveClass(/_ej2_chart_selection_series_0/);
  await section.getByTestId('cc3d-sel-multi').click();
  await expect.poll(() => inst(host, (c) => c.isMultiSelect)).toBe(true);
  await section.getByTestId('cc3d-sel-patterns').click();
  expect(await inst(host, (c) => [c.selectionPattern, c.highlightPattern])).toEqual(['DiagonalForward', 'Dots']);
  await section.getByTestId('cc3d-sel-highlight').click();
  expect(await inst(host, (c) => [c.highlightMode, c.highlightColor])).toEqual(['Point', '#ff5722']);
  const q = await hitPoint(host, pointFace(0));
  await page.mouse.move(q.x - 8, q.y);
  await page.mouse.move(q.x, q.y, { steps: 4 });
  await expect(face(0)).toHaveClass(/highlight|selection/);
  expect(await inst(host, (c) => c.legendSettings.enableHighlight)).toBe(false);
});

test('events: rendering, mouse, point, legend, selection, export, print and resize', async ({ app, page }) => {
  const section = app.section('cc3d-events');
  const host = chartHost(section, 'cc3d-events');
  for (const name of ['load', 'loaded', 'pointRender', 'seriesRender', 'textRender', 'legendRender']) {
    await fired(page, name);
  }
  const p = await hitPoint(host, pointFace(2));
  await page.mouse.move(p.x - 10, p.y);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await fired(page, 'circularChart3DMouseMove');
  await fired(page, 'pointMove');
  await fired(page, 'tooltipRender');
  await page.mouse.down();
  await fired(page, 'circularChart3DMouseDown');
  await page.mouse.up();
  await fired(page, 'circularChart3DMouseUp');
  await fired(page, 'circularChart3DMouseClick');
  await fired(page, 'pointClick');
  await fired(page, 'selectionComplete');
  expect(await eventLast(page, 'pointClick')).not.toBeNull();
  await host.locator('[id*="_chart_legend_text_0"]').click();
  await fired(page, 'legendClick');
  await page.mouse.move(2, 2, { steps: 5 });
  await fired(page, 'circularChart3DMouseLeave');
  await section.getByTestId('cc3d-print').click();
  await fired(page, 'beforePrint');
  const download = page.waitForEvent('download');
  await section.getByTestId('cc3d-export').click();
  await fired(page, 'beforeExport');
  await download;
  await fired(page, 'afterExport');
  await page.setViewportSize({ width: 900, height: 700 });
  await fired(page, 'beforeResize');
  await fired(page, 'resized');
});
