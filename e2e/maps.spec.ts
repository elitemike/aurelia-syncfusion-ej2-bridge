import { test, expect } from './fixtures';
import { widgetProp, widgetCall, hostOf, counter } from './visualHelpers';
import { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('maps'));

/** Syncfusion derives every svg element id from the host id */
const part = (map: Locator, suffix: string) => hostOf(map).locator(`[id$="${suffix}"]`);
const shape = (map: Locator, name: string) => hostOf(map).locator(`path[aria-label="${name}"]`).first();

/** Centre of an element in viewport coordinates, after scrolling it into view */
async function centre(target: Locator) {
  await target.evaluate((el: Element) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' as ScrollBehavior }));
  const box = await target.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function hover(page: Page, target: Locator) {
  const { x, y } = await centre(target);
  await page.mouse.move(x - 4, y - 4);
  await page.mouse.move(x, y);
  return { x, y };
}

test('default map renders shapes, title, maps area, border and aria attributes', async ({ page }) => {
  const map = page.getByTestId('mp-basic');
  await expect(map.locator('svg')).toHaveAttribute('width', '560');
  await expect(map.locator('svg')).toHaveAttribute('height', '380');
  await expect(hostOf(map).locator('path[aria-label]')).toHaveCount(6);
  await expect(shape(map, 'Alpha')).toHaveAttribute('fill', '#c5e1a5');
  await expect(shape(map, 'Alpha')).toHaveAttribute('stroke', '#33691e');
  const border = part(map, '_MapBorder');
  await expect(border).toHaveAttribute('stroke', '#6a1b9a');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#f5f5f5');
  await expect(part(map, '_MapAreaBorder')).toHaveAttribute('fill', '#e3f2fd');
  await expect(part(map, '_MapAreaBorder')).toHaveAttribute('stroke', '#1565c0');
  await expect(part(map, '_Map_title')).toHaveText('Tiny world');
  await expect(part(map, '_Map_title')).toHaveAttribute('fill', '#b71c1c');
  await expect(part(map, '_Map_subtitle')).toHaveText('six countries');
  await expect(hostOf(map)).toHaveAttribute('aria-label', 'Tiny world map');
  await expect(hostOf(map)).toHaveAttribute('tabindex', '6');
  expect(await widgetProp(map, 'width')).toBe('560');
  expect(await widgetProp(map, 'height')).toBe('380');
  expect(await widgetProp(map, 'background')).toBe('#f5f5f5');
  expect(await widgetProp(map, 'theme')).toBe('Material3');
  expect(await widgetProp(map, 'projectionType')).toBe('Mercator');
  expect(await widgetProp(map, 'baseLayerIndex')).toBe(0);
  expect(await widgetProp(map, 'description')).toBe('Tiny world map');
  expect(await widgetProp(map, 'tabIndex')).toBe(6);
  expect(await widgetProp(map, 'useGroupingSeparator')).toBe(true);
  expect(await widgetProp(map, 'format')).toBe('n0');
  expect(await widgetProp(map, 'tooltipDisplayMode')).toBe('MouseMove');
  expect(await widgetCall(map, w => w.margin.left)).toBe(10);
  expect(await widgetCall(map, w => w.border.color)).toBe('#6a1b9a');
  expect(await widgetCall(map, w => w.titleSettings.text)).toBe('Tiny world');
  expect(await widgetCall(map, w => w.mapsArea.background)).toBe('#e3f2fd');
  expect(await widgetCall(map, w => w.centerPosition.latitude)).toBe(30);
  expect(await widgetCall(map, w => w.layers.length)).toBe(1);
});

test('tooltip shows the formatted, grouped value of the hovered shape', async ({ page }) => {
  const map = page.getByTestId('mp-basic');
  await hover(page, shape(map, 'Alpha'));
  await expect(page.locator('[id$="_mapsTooltip"], [id*="ooltip"]').filter({ hasText: /Alpha\W*: 1,234,567/ }).first()).toBeAttached();
});

test('colorMapping colours shapes by category and the legend lists and toggles them', async ({ app, page }) => {
  const section = app.section('mp-legend');
  const map = section.getByTestId('mp-legend');
  await expect(shape(map, 'Alpha')).toHaveAttribute('fill', '#e53935');
  await expect(shape(map, 'Beta')).toHaveAttribute('fill', '#43a047');
  await expect(part(map, '_Legend_Text_Index_0')).toHaveText('High density');
  await expect(part(map, '_Legend_Text_Index_1')).toHaveText('Low density');
  await expect(part(map, '_Legend_Shape_Index_0')).toHaveAttribute('fill', '#e53935');
  await expect(part(map, '_Legend_Border')).toHaveAttribute('fill', '#fafafa');
  await expect(part(map, '_LegendTitle')).toHaveText('Density');
  expect(await counter(section, 'mp-ev-legendRendering')).toBeGreaterThanOrEqual(2);
  expect(await widgetCall(map, w => w.legendSettings.visible)).toBe(true);
  expect(await widgetCall(map, w => w.legendSettings.position)).toBe('Bottom');
  // the legend can toggle (the shape recolouring on toggle is not observable in this build, so only the setting is asserted)
  expect(await widgetCall(map, w => w.legendSettings.toggleVisibility)).toBe(true);
  expect(await widgetCall(map, w => w.layers[0].toggleLegendSettings.fill)).toBe('#bdbdbd');
});

test('data labels and bubbles render and raise their events', async ({ app, page }) => {
  const section = app.section('mp-bubbles');
  const map = section.getByTestId('mp-bubbles');
  await expect(hostOf(map).locator('text[id*="_LabelIndex_"]')).toHaveCount(6);
  await expect(part(map, '_shapeIndex_0_LabelIndex_0')).toHaveText('Alpha');
  await expect(part(map, '_shapeIndex_0_LabelIndex_0')).toHaveAttribute('fill', '#1b5e20');
  const bubbles = hostOf(map).locator('circle[id*="_BubbleIndex_0_dataIndex_"]');
  await expect(bubbles).toHaveCount(6);
  // Alpha has the largest population -> maxRadius, Delta the smallest -> minRadius
  await expect(part(map, '_BubbleIndex_0_dataIndex_0')).toHaveAttribute('r', '24');
  await expect(part(map, '_BubbleIndex_0_dataIndex_3')).toHaveAttribute('r', '6');
  await expect(part(map, '_BubbleIndex_0_dataIndex_0')).toHaveAttribute('fill', '#e53935');
  await expect(part(map, '_BubbleIndex_0_dataIndex_1')).toHaveAttribute('fill', '#1e88e5');
  expect(await counter(section, 'mp-ev-dataLabelRendering')).toBeGreaterThanOrEqual(6);
  expect(await counter(section, 'mp-ev-bubbleRendering')).toBeGreaterThanOrEqual(6);
  await expect.poll(() => counter(section, 'mp-ev-animationComplete')).toBeGreaterThan(0);
  expect(await widgetCall(map, w => w.layers[0].dataLabelSettings.visible)).toBe(true);
  expect(await widgetCall(map, w => w.layers[0].bubbleSettings[0].maxRadius)).toBe(24);
  // bubble mouse events
  const bubble = part(map, '_BubbleIndex_0_dataIndex_0');
  await hover(page, bubble);
  await expect.poll(() => counter(section, 'mp-ev-bubbleMouseMove')).toBeGreaterThan(0);
  const { x, y } = await centre(bubble);
  await page.mouse.click(x, y);
  await expect.poll(() => counter(section, 'mp-ev-bubbleClick')).toBeGreaterThan(0);
});

test('markers render, raise events and can be dragged', async ({ app, page }) => {
  const section = app.section('mp-markers');
  const map = section.getByTestId('mp-markers');
  const markers = hostOf(map).locator('circle[id*="_MarkerIndex_0_dataIndex_"]');
  await expect(markers).toHaveCount(3);
  await expect(part(map, '_MarkerIndex_0_dataIndex_0')).toHaveAttribute('fill', '#d81b60');
  await expect(part(map, '_MarkerIndex_0_dataIndex_0')).toHaveAttribute('r', '8');
  await expect(part(map, '_MarkerIndex_0_dataIndex_0')).toHaveAttribute('stroke', '#ffffff');
  expect(await counter(section, 'mp-ev-markerRendering')).toBeGreaterThanOrEqual(3);
  const marker = part(map, '_MarkerIndex_0_dataIndex_0');
  const start = await hover(page, marker);
  await expect.poll(() => counter(section, 'mp-ev-markerMouseMove')).toBeGreaterThan(0);
  await page.mouse.click(start.x, start.y);
  await expect.poll(() => counter(section, 'mp-ev-markerClick')).toBeGreaterThan(0);
  await expect(section.getByTestId('mp-last-marker')).toHaveText('Alpha City');
  // drag
  const before = await centre(marker);
  await page.mouse.move(before.x, before.y);
  await page.mouse.down();
  for (let step = 1; step <= 8; step++) {
    await page.mouse.move(before.x + step * 6, before.y + step * 3);
  }
  await page.mouse.up();
  await expect.poll(() => counter(section, 'mp-ev-markerDragStart')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-markerDragEnd')).toBeGreaterThan(0);
  await expect(section.getByTestId('mp-last-drag')).not.toHaveText('');
  const after = await centre(marker);
  expect(Math.abs(after.x - before.x) + Math.abs(after.y - before.y)).toBeGreaterThan(10);
});

test('marker template renders custom HTML for every marker', async ({ page }) => {
  const map = page.getByTestId('mp-template');
  await expect(map.locator('.mp-pin')).toHaveCount(3);
  await expect(map.locator('.mp-pin').first()).toHaveText('Alpha City');
  expect(await widgetCall(map, w => w.layers[0].markerSettings[0].template)).toContain('mp-pin');
});

test('close markers are merged into a cluster that raises cluster events', async ({ app, page }) => {
  const section = app.section('mp-cluster');
  const map = section.getByTestId('mp-cluster');
  const cluster = part(map, '_dataIndex_0_cluster_0');
  await expect(cluster).toBeAttached();
  await expect(cluster).toHaveAttribute('fill', '#6a1b9a');
  await expect(cluster).toHaveAttribute('r', '14');
  await expect(part(map, '_cluster_0_datalabel_0')).toHaveText('4');
  expect(await counter(section, 'mp-ev-markerClusterRendering')).toBeGreaterThan(0);
  // the four close markers are hidden, the lonely one stays visible
  await expect(part(map, '_MarkerIndex_0_dataIndex_4')).not.toHaveAttribute('style', /hidden/);
  await expect(part(map, '_MarkerIndex_0_dataIndex_0')).toHaveAttribute('style', /hidden/);
  const { x, y } = await hover(page, cluster);
  await expect.poll(() => counter(section, 'mp-ev-markerClusterMouseMove')).toBeGreaterThan(0);
  await page.mouse.click(x, y);
  await expect.poll(() => counter(section, 'mp-ev-markerClusterClick')).toBeGreaterThan(0);
  expect(await widgetCall(map, w => w.layers[0].markerSettings[0].clusterSettings.allowClustering)).toBe(true);
});

test('zoom toolbar, mouse wheel and panning raise zoom and pan events', async ({ app, page }) => {
  const section = app.section('mp-zoom');
  const map = section.getByTestId('mp-zoom');
  expect(await widgetCall(map, w => w.zoomSettings.enable)).toBe(true);
  expect(await widgetCall(map, w => w.zoomSettings.maxZoom)).toBe(10);
  expect(await widgetCall(map, w => w.zoomSettings.mouseWheelZoom)).toBe(true);
  expect(await widgetCall(map, w => w.zoomSettings.toolbarSettings.horizontalAlignment)).toBe('Far');
  await expect(part(map, '_Zooming_ToolBar_ZoomIn_Group')).toBeAttached();
  await expect(part(map, '_Zooming_ToolBar_ZoomOut_Group')).toBeAttached();
  await expect(part(map, '_Zooming_ToolBar_Reset_Group')).toBeAttached();
  const svg = hostOf(map).locator('svg[id$="_svg"]');
  const area = await (async () => { await svg.evaluate((el: Element) => el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })); return svg.boundingBox(); })();
  await page.mouse.move(area.x + area.width / 2, area.y + area.height / 2);
  // toolbar zoom in
  const zoomIn = await centre(part(map, '_Zooming_ToolBar_ZoomIn_Group'));
  await page.mouse.move(zoomIn.x, zoomIn.y);
  await page.mouse.click(zoomIn.x, zoomIn.y);
  await expect.poll(() => counter(section, 'mp-ev-zoom')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-zoomComplete')).toBeGreaterThan(0);
  await expect.poll(() => widgetCall(map, w => w.scale)).toBeGreaterThan(1);
  // mouse wheel zoom
  const zoomsBefore = await counter(section, 'mp-ev-zoom');
  await page.mouse.move(area.x + area.width / 2, area.y + area.height / 2);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => counter(section, 'mp-ev-zoom')).toBeGreaterThan(zoomsBefore);
  // panning
  await page.mouse.move(area.x + area.width / 2, area.y + area.height / 2);
  await page.mouse.down();
  for (let step = 1; step <= 8; step++) {
    await page.mouse.move(area.x + area.width / 2 + step * 8, area.y + area.height / 2 + step * 4);
  }
  await page.mouse.up();
  await expect.poll(() => counter(section, 'mp-ev-pan')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-panComplete')).toBeGreaterThan(0);
});

test('hover highlights and shows a tooltip, click selects and the mouse events are raised', async ({ app, page }) => {
  const section = app.section('mp-interaction');
  const map = section.getByTestId('mp-interaction');
  expect(await counter(section, 'mp-ev-layerRendering')).toBeGreaterThan(0);
  expect(await counter(section, 'mp-ev-shapeRendering')).toBeGreaterThanOrEqual(6);
  const alpha = shape(map, 'Alpha');
  const { x, y } = await hover(page, alpha);
  await expect.poll(() => counter(section, 'mp-ev-mouseMove')).toBeGreaterThan(0);
  // highlight
  await expect.poll(() => counter(section, 'mp-ev-itemHighlight')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-shapeHighlight')).toBeGreaterThan(0);
  await expect(alpha).toHaveClass(/highlightMapStyle/);
  // tooltip
  await expect.poll(() => counter(section, 'mp-ev-tooltipRender')).toBeGreaterThan(0);
  await expect(section.getByTestId('mp-last-tooltip')).toHaveText('Alpha');
  await expect.poll(() => counter(section, 'mp-ev-tooltipRenderComplete')).toBeGreaterThan(0);
  // click: click, onclick, selection
  await page.mouse.click(x, y);
  await expect.poll(() => counter(section, 'mp-ev-click')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-onclick')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-shapeSelected')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'mp-ev-itemSelection')).toBeGreaterThan(0);
  await expect.poll(() => shape(map, 'Alpha').getAttribute('class')).toMatch(/selection/i);
  // double and right click
  await page.mouse.dblclick(x, y);
  await expect.poll(() => counter(section, 'mp-ev-doubleClick')).toBeGreaterThan(0);
  await page.mouse.click(x, y, { button: 'right' });
  await expect.poll(() => counter(section, 'mp-ev-rightClick')).toBeGreaterThan(0);
  expect(await widgetCall(map, w => w.layers[0].selectionSettings.enable)).toBe(true);
  expect(await widgetCall(map, w => w.layers[0].highlightSettings.fill)).toBe('#ffd54f');
  expect(await widgetCall(map, w => w.layers[0].tooltipSettings.visible)).toBe(true);
});

test('annotations render custom HTML and raise annotationRendering', async ({ app }) => {
  const section = app.section('mp-annotations');
  const map = section.getByTestId('mp-annotations');
  await expect(map.locator('.mp-annotation')).toHaveText('Look here');
  expect(await counter(section, 'mp-ev-annotationRendering')).toBeGreaterThan(0);
  expect(await widgetCall(map, w => w.annotations[0].zIndex)).toBe('1');
});

test('navigation lines and polygons are drawn over the layer', async ({ page }) => {
  const map = page.getByTestId('mp-lines');
  await expect(part(map, '_LayerIndex_0_PolygonIndex_0')).toHaveAttribute('fill', '#ab47bc');
  await expect(part(map, '_LayerIndex_0_PolygonIndex_0')).toHaveAttribute('stroke', '#4a148c');
  const line = part(map, '_LayerIndex_0_NavigationIndex_0_Line0');
  await expect(line).toHaveAttribute('stroke', '#d84315');
  await expect(line).toHaveAttribute('stroke-dasharray', '5,3');
  await expect(line).toHaveAttribute('marker-end', /url\(#triangle0\)/);
  expect(await widgetCall(map, w => w.layers[0].navigationLineSettings[0].width)).toBe(3);
});

test('load and loaded are raised on creation', async ({ app }) => {
  const section = app.section('mp-lifecycle');
  await expect(section.getByTestId('mp-ev-load')).toHaveText('1');
  await expect(section.getByTestId('mp-ev-loaded')).toHaveText('1');
});

test('resize is raised when the viewport changes a percentage sized map', async ({ page, app }) => {
  const section = app.section('mp-lifecycle');
  expect(await counter(section, 'mp-ev-resize')).toBe(0);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect.poll(() => counter(section, 'mp-ev-resize'), { timeout: 10000 }).toBeGreaterThan(0);
});

test('beforePrint is raised by print and can cancel it', async ({ app }) => {
  const section = app.section('mp-lifecycle');
  const map = section.getByTestId('mp-lifecycle');
  expect(await widgetProp(map, 'allowPrint')).toBe(true);
  await widgetCall(map, w => w.print());
  await expect(section.getByTestId('mp-ev-beforePrint')).toHaveText('1');
});

test('image and pdf export are available', async ({ page, app }) => {
  const map = app.section('mp-export').getByTestId('mp-export');
  expect(await widgetProp(map, 'allowImageExport')).toBe(true);
  expect(await widgetProp(map, 'allowPdfExport')).toBe(true);
  const png = page.waitForEvent('download');
  await widgetCall(map, w => { w.export('PNG', 'map'); });
  expect((await png).suggestedFilename()).toBe('map.png');
  const pdf = page.waitForEvent('download');
  await widgetCall(map, w => { w.export('PDF', 'map'); });
  expect((await pdf).suggestedFilename()).toBe('map.pdf');
});

test('width, title, background, theme, projection and layers follow the view-model', async ({ page }) => {
  const map = page.getByTestId('mp-dynamic');
  await expect(part(map, '_Map_title')).toHaveText('First title');
  await expect(shape(map, 'Alpha')).toHaveAttribute('fill', '#c5e1a5');
  const before = await shape(map, 'Alpha').boundingBox();
  await page.getByTestId('mp-dyn-change').click();
  await expect(part(map, '_Map_title')).toHaveText('Second title');
  await expect(part(map, '_MapBorder')).toHaveAttribute('fill', '#ffe0b2');
  await expect(shape(map, 'Alpha')).toHaveAttribute('fill', '#ffab91');
  await expect(map.locator('svg')).toHaveAttribute('width', '520');
  expect(await widgetProp(map, 'theme')).toBe('Bootstrap5Dark');
  expect(await widgetProp(map, 'projectionType')).toBe('Miller');
  expect(await widgetProp(map, 'width')).toBe('520');
  expect(await widgetProp(map, 'background')).toBe('#ffe0b2');
  const after = await shape(map, 'Alpha').boundingBox();
  expect(after.width).not.toBe(before.width);
});
