import { test, expect } from './fixtures';
import { host, inst, hostId, eventCount, eventLast, center } from './vizHelpers';

test.beforeEach(async ({ app }) => app.open('heatMap'));

const STORE = '__heatMapEvents';
const fired = (page, name: string) => expect.poll(() => eventCount(page, STORE, name), { message: name }).toBeGreaterThan(0);

/** Cell rects and labels of a heat map, located through the host id. */
async function parts(section, testId: string) {
  const el = host(section, testId);
  const id = await hostId(el);
  return {
    el, id,
    rects: el.locator(`[id^="${id}_HeatMapRect_"]`),
    labels: el.locator(`[id^="${id}_HeatMapRectLabels_"]`),
    xLabels: el.locator(`[id^="${id}_XAxis_Label"]`),
    yLabels: el.locator(`[id^="${id}_YAxis_Label"]`)
  };
}

test.describe('default sample', () => {
  test('renders the cells, axis labels, titles and cell labels from the bound data', async ({ app }) => {
    const p = await parts(app.section('hm-basic'), 'hm-basic');
    await expect(p.rects).toHaveCount(24);
    await expect(p.xLabels).toHaveText(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
    await expect(p.yLabels).toHaveText(['2021', '2022', '2023', '2024']);
    await expect(p.el.locator(`#${p.id}_HeatmapTitle`)).toHaveText('Monthly sales');
    await expect(p.el.locator(`#${p.id}_XAxisTitle`)).toHaveText('Months');
    await expect(p.el.locator(`#${p.id}_YAxisTitle`)).toHaveText('Years');
    await expect(p.labels).toHaveCount(24);
    expect(await inst(p.el, w => [w.dataSource.length, w.theme, w.margin.left, w.titleSettings.text])).toEqual([6, 'Material', 10, 'Monthly sales']);
  });

  test('cellSettings: border, radius, label format and text style', async ({ app }) => {
    const p = await parts(app.section('hm-basic'), 'hm-basic');
    const rect = p.rects.first();
    await expect(rect).toHaveAttribute('stroke', '#ffffff');
    await expect(rect).toHaveAttribute('stroke-width', '1');
    await expect(rect).toHaveAttribute('rx', '4');
    await expect(p.labels.first()).toHaveText(/^\d+$/);
    expect(await inst(p.el, w => [w.cellSettings.showLabel, w.cellSettings.format, w.cellSettings.textStyle.size])).toEqual([true, '{value}', '12px']);
  });

  test('legend is drawn with gradient labels', async ({ app }) => {
    const p = await parts(app.section('hm-basic'), 'hm-basic');
    await expect(p.el.locator(`#${p.id}_Gradient_Legend`)).toBeAttached();
    await expect(p.el.locator(`[id^="${p.id}_Legend_Label"]`).first()).toBeAttached();
    await expect(p.el.locator(`#${p.id}_Heatmap_LegendLabel`)).toBeAttached();
    expect(await inst(p.el, w => [w.legendSettings.position, w.legendSettings.title.text, w.legendSettings.showGradientPointer])).toEqual(['Right', 'Sales', true]);
  });

  test('load, loaded, created, cellRender and legendRender events', async ({ app, page }) => {
    const section = app.section('hm-basic');
    for (const id of ['hm-load', 'hm-loaded', 'hm-created', 'hm-cell-render', 'hm-legend-render']) {
      await expect(section.getByTestId(id)).not.toHaveText('0');
    }
    await fired(page, 'cellRender');
    expect(await eventLast(page, STORE, 'cellRender')).toMatchObject({ xLabel: expect.any(String), yLabel: expect.any(String), cellColor: expect.any(String) });
    expect(await eventLast(page, STORE, 'legendRender')).toMatchObject({ text: expect.any(String) });
  });
});

test.describe('palette', () => {
  test('gradient palette per row colors the cells between min and max', async ({ app }) => {
    const p = await parts(app.section('hm-palette'), 'hm-gradient-row');
    await expect(p.rects).toHaveCount(24);
    const fills = await p.rects.evaluateAll(rs => rs.map(r => r.getAttribute('fill')));
    expect(new Set(fills).size).toBeGreaterThan(3);
    expect(await inst(p.el, w => [w.paletteSettings.type, w.paletteSettings.colorGradientMode, w.paletteSettings.fillColor.maxColor]))
      .toEqual(['Gradient', 'Row', '#0d47a1']);
    // a hidden legend leaves no legend elements behind
    await expect(p.el.locator(`#${p.id}_Heatmap_Legend`)).toHaveCount(0);
    expect(await inst(p.el, w => w.legendSettings.visible)).toBe(false);
  });

  test('fixed palette: range colors, empty cell color and legend', async ({ app }) => {
    const p = await parts(app.section('hm-palette'), 'hm-fixed');
    const fills = await p.rects.evaluateAll(rs => rs.map(r => r.getAttribute('fill')));
    expect(fills).toEqual(expect.arrayContaining(['#2e7d32', '#c62828', '#dddddd']));
    expect(fills.filter(f => f === '#dddddd')).toHaveLength(4); // the four null cells
    await expect(p.el.locator(`[id^="${p.id}_Legend_Label"]`)).toHaveText(['Low', 'Medium', 'High']);
    expect(await inst(p.el, w => [w.legendSettings.position, w.legendSettings.alignment, w.legendSettings.enableSmartLegend,
      w.legendSettings.height, w.legendSettings.width])).toEqual(['Bottom', 'Center', false, '30px', '60%']);
  });
});

test.describe('cell types', () => {
  test('bubble cells render circles sized and colored by the data', async ({ app }) => {
    const p = await parts(app.section('hm-cells'), 'hm-bubble');
    await expect(p.el.locator(`circle[id^="${p.id}_HeatMapRect_"]`)).toHaveCount(12);
    const radii = await p.el.locator('circle[id*="_HeatMapRect_"]').evaluateAll(cs => cs.map(c => c.getAttribute('r')));
    expect(new Set(radii).size).toBeGreaterThan(2);
    const fills = await p.el.locator('circle[id*="_HeatMapRect_"]').evaluateAll(cs => cs.map(c => c.getAttribute('fill')));
    expect(new Set(fills).size).toBeGreaterThan(2);
    expect(await inst(p.el, w => [w.cellSettings.tileType, w.cellSettings.bubbleType, w.cellSettings.bubbleSize.minimum, w.cellSettings.bubbleSize.maximum]))
      .toEqual(['Bubble', 'SizeAndColor', '20%', '90%']);
  });

  test('bubble cells sized only, optionally inversed', async ({ app }) => {
    const p = await parts(app.section('hm-cells'), 'hm-bubble-size');
    await expect(p.el.locator(`circle[id^="${p.id}_HeatMapRect_"]`)).toHaveCount(12);
    expect(await inst(p.el, w => [w.cellSettings.bubbleType, w.cellSettings.isInversedBubbleSize])).toEqual(['Size', true]);
    // inverse sizes: the largest value gets the smallest circle, compare with the non inversed heat map
    const inversed = await p.el.locator('circle[id*="_HeatMapRect_"]').evaluateAll(cs => cs.map(c => Number(c.getAttribute('r'))));
    expect(Math.max(...inversed)).toBeGreaterThan(Math.min(...inversed));
  });

  test('enableCellHighlighting dims the other cells under the pointer', async ({ app, page }) => {
    const p = await parts(app.section('hm-cells'), 'hm-highlight');
    expect(await inst(p.el, w => w.cellSettings.enableCellHighlighting)).toBe(true);
    const { x, y } = await center(p.rects.nth(7));
    await page.mouse.move(x - 10, y);
    await page.mouse.move(x, y, { steps: 3 });
    await expect.poll(async () => (await p.rects.evaluateAll(rs => rs.map(r => r.getAttribute('opacity')))).filter(o => o !== '1').length)
      .toBeGreaterThan(0);
  });
});

test.describe('axes', () => {
  test('opposed position, rotation, inversed order, label style and border', async ({ app }) => {
    const p = await parts(app.section('hm-axes'), 'hm-axis-look');
    // inversed axis draws the first label at the far end
    const jan = await p.xLabels.filter({ hasText: 'Jan' }).boundingBox();
    const jun = await p.xLabels.filter({ hasText: 'Jun' }).boundingBox();
    expect(jan.x).toBeGreaterThan(jun.x);
    // opposed x axis: labels sit above the cells
    const label = await p.xLabels.first().boundingBox();
    const rect = await p.rects.first().boundingBox();
    expect(label.y).toBeLessThan(rect.y);
    await expect(p.xLabels.first()).toHaveAttribute('transform', /rotate\(/);
    await expect(p.yLabels.first()).toHaveAttribute('fill', '#cc3300');
    await expect(p.el.locator(`#${p.id}_XAxisTitle`)).toHaveText('Opposed, rotated, inversed');
    await expect(p.el.locator(`[id*="YAxisLabelBorder"] path, [id*="YAxisLabelBorder"] rect`).first()).toHaveAttribute('stroke', '#336699');
    expect(await inst(p.el, w => [w.xAxis.opposedPosition, w.xAxis.labelRotation, w.xAxis.isInversed, w.yAxis.border.type]))
      .toEqual([true, 45, true, 'Rectangle']);
  });

  test('multi level labels draw their categories', async ({ app }) => {
    const p = await parts(app.section('hm-axes'), 'hm-axis-multi');
    await expect(p.el.locator('text', { hasText: /^Q1$/ })).toBeAttached();
    await expect(p.el.locator('text', { hasText: /^Q2$/ })).toBeAttached();
    expect(await inst(p.el, w => w.xAxis.multiLevelLabels[0].categories.length)).toBe(2);
  });

  test('enableTrim shortens labels beyond maxLabelLength', async ({ app }) => {
    const p = await parts(app.section('hm-axes'), 'hm-axis-trim');
    await expect(p.xLabels.first()).toContainText('...');
    expect((await p.xLabels.first().textContent()).length).toBeLessThan('A very long label one'.length);
    expect(await inst(p.el, w => [w.xAxis.enableTrim, w.xAxis.maxLabelLength])).toEqual([true, 6]);
  });
});

test.describe('data adaptors', () => {
  test('Table adaptor maps json records to cells', async ({ app }) => {
    const p = await parts(app.section('hm-adaptor'), 'hm-table');
    await expect(p.rects).toHaveCount(9);
    await expect(p.labels.first()).toHaveText(/^\d+$/);
    const values = (await p.labels.allTextContents()).map(Number).sort((a, b) => a - b);
    expect(values).toEqual([10, 15, 20, 20, 25, 30, 30, 35, 40]);
    expect(await inst(p.el, w => [w.dataSourceSettings.adaptorType, w.dataSourceSettings.isJsonData, w.dataSourceSettings.xDataMapping]))
      .toEqual(['Table', true, 'Year']);
  });

  test('Cell adaptor maps one record per cell', async ({ app }) => {
    const p = await parts(app.section('hm-adaptor'), 'hm-cell');
    await expect(p.rects).toHaveCount(4);
    const values = (await p.labels.allTextContents()).map(Number).sort((a, b) => a - b);
    expect(values).toEqual([10, 20, 30, 40]);
    expect(await inst(p.el, w => [w.dataSourceSettings.adaptorType, w.dataSourceSettings.yDataMapping, w.dataSourceSettings.valueMapping]))
      .toEqual(['Cell', 'Year', 'Sales']);
  });
});

test.describe('interaction', () => {
  test('tooltip shows on hover and raises tooltipRender with the cell values', async ({ app, page }) => {
    const section = app.section('hm-interaction');
    const p = await parts(section, 'hm-tooltip');
    const { x, y } = await center(p.rects.nth(5));
    await page.mouse.move(x - 10, y);
    await page.mouse.move(x, y, { steps: 4 });
    await expect(section.getByTestId('hm-tooltip-text')).toHaveText(/^[A-Za-z]{3}\/\d{4}=\d+$/);
    const tip = p.el.locator(`#${p.id}Celltooltipcontainer`);
    await expect(tip).toBeVisible();
    expect(await inst(p.el, w => [w.showTooltip, w.tooltipSettings.fill, w.tooltipSettings.border.color])).toEqual([true, '#222222', '#ffffff']);
    await fired(page, 'tooltipRender');
  });

  test('cellClick and cellDoubleClick carry the cell labels and value', async ({ app, page }) => {
    const section = app.section('hm-interaction');
    const p = await parts(section, 'hm-tooltip');
    const { x, y } = await center(p.rects.nth(0));
    await page.mouse.click(x, y);
    await expect(section.getByTestId('hm-clicked')).toHaveText(/^[A-Za-z]{3}\/\d{4}=\d+$/);
    await page.mouse.dblclick(x, y);
    await expect(section.getByTestId('hm-double-clicked')).toHaveText(/^[A-Za-z]{3}\/\d{4}=\d+$/);
    await fired(page, 'cellClick');
    await fired(page, 'cellDoubleClick');
  });

  test('allowSelection selects clicked cells and raises cellSelected', async ({ app }) => {
    const section = app.section('hm-interaction');
    const p = await parts(section, 'hm-select');
    expect(await inst(p.el, w => [w.allowSelection, w.enableMultiSelect])).toEqual([true, false]);
    const first = await center(p.rects.nth(2));
    await section.page().mouse.click(first.x, first.y);
    await expect(section.getByTestId('hm-selected-count')).not.toHaveText('0');
    await expect(section.getByTestId('hm-selected')).toHaveText('1');
    // the selected cell is marked, the others are dimmed
    await expect(p.el.locator(`[id^="${p.id}_HeatMapRect_"][class*="selected"], [id^="${p.id}_HeatMapRect_"].e-heatmap-selection`).first()).toBeAttached();
  });

  test('custom tooltip template, enableHtmlSanitizer off keeps the markup', async ({ app, page }) => {
    const p = await parts(app.section('hm-interaction'), 'hm-html');
    const { x, y } = await center(p.rects.nth(3));
    await page.mouse.move(x - 10, y);
    await page.mouse.move(x, y, { steps: 4 });
    await expect(p.el.locator('.hm-tip')).toBeVisible();
    expect(await inst(p.el, w => [w.enableHtmlSanitizer, w.tooltipSettings.template.indexOf('hm-tip') > 0])).toEqual([false, true]);
  });
});

test.describe('rendering', () => {
  test('canvas rendering mode draws into a canvas, backgroundColor and theme apply', async ({ app }) => {
    const section = app.section('hm-render');
    const el = host(section, 'hm-canvas');
    const id = await hostId(el);
    await expect(el.locator(`canvas#${id}_canvas`)).toBeVisible();
    await expect(el.locator('svg')).toHaveCount(0);
    expect(await inst(el, w => [w.renderingMode, w.backgroundColor, w.theme, w.width, w.height])).toEqual(['Canvas', '#fffbe6', 'Bootstrap5', '80%', '220px']);
    // the canvas paints the background color in its corner
    const pixel = await el.locator('canvas').evaluate((c: HTMLCanvasElement) => Array.from(c.getContext('2d').getImageData(2, 2, 1, 1).data));
    expect(pixel.slice(0, 3)).toEqual([255, 251, 230]);
  });

  test('resized is raised when the window width changes', async ({ app, page }) => {
    await fired(page, 'loaded');
    const section = app.section('hm-render');
    await page.setViewportSize({ width: 800, height: 700 });
    await expect.poll(() => eventCount(page, STORE, 'resized')).toBeGreaterThan(0);
    await expect(section.getByTestId('hm-resized')).not.toHaveText('0');
    expect(await eventLast(page, STORE, 'resized')).toBeTruthy();
  });
});

test('model to widget: data, background, tooltip flag, mode, theme and height follow the view-model', async ({ app }) => {
  const section = app.section('hm-dynamic');
  const p = await parts(section, 'hm-dynamic');
  const labelsBefore = await p.labels.count();
  expect(labelsBefore).toBeGreaterThan(0);
  const el = p.el;
  await section.getByTestId('hm-paint').click();
  expect(await inst(el, w => w.backgroundColor)).toBe('#fff8e1');
  await expect(el.locator(`#${p.id}_HeatmapBorder`)).toHaveAttribute('fill', '#fff8e1');
  await section.getByTestId('hm-no-tooltip').click();
  await expect.poll(() => inst(el, w => w.showTooltip)).toBe(false);
  await section.getByTestId('hm-shrink').click();
  await expect(el.locator(`#${p.id}_svg`)).toHaveAttribute('height', '200');
  await section.getByTestId('hm-dark').click();
  await expect.poll(() => inst(el, w => w.theme)).toBe('Bootstrap5Dark');
  await section.getByTestId('hm-swap').click();
  await expect.poll(() => inst(el, w => w.dataSource[0][0])).toBe(70);
  await expect.poll(async () => (await p.labels.allTextContents()).includes('70')).toBe(true);
  await section.getByTestId('hm-canvas-mode').click();
  await expect(el.locator('canvas')).toBeVisible();
  expect(await inst(el, w => w.renderingMode)).toBe('Canvas');
});
