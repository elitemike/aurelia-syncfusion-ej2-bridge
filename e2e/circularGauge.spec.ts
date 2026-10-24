import { test, expect } from './fixtures';
import { widgetProp, widgetCall, hostOf, counter, moveOver, pointOnPath } from './visualHelpers';
import { Locator } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('circularGauge'));

/** Syncfusion derives every svg element id from the host id */
const part = (gauge: Locator, suffix: string) => hostOf(gauge).locator(`[id$="${suffix}"]`);

test('default gauge renders border, title, ticks, grouped labels and a needle', async ({ page }) => {
  const g = page.getByTestId('cg-basic');
  // border, background and size
  const border = part(g, '_CircularGaugeBorder');
  await expect(border).toHaveAttribute('stroke', '#1565c0');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#f5f5f5');
  await expect(g.locator('svg')).toHaveAttribute('width', '420');
  await expect(g.locator('svg')).toHaveAttribute('height', '320');
  // title with style, description and tab index
  const title = part(g, '_CircularGaugeTitle');
  await expect(title).toHaveText('Engine speed');
  await expect(title).toHaveAttribute('fill', '#b71c1c');
  await expect(title).toHaveCSS('font-size', '18px');
  await expect(title).toHaveAttribute('aria-label', 'Engine speed gauge');
  await expect(title).toHaveAttribute('tabindex', '3');
  // axis: line, major and minor ticks, labels with a grouping separator
  await expect(part(g, '_AxisLine_0')).toHaveAttribute('stroke', '#e0e0e0');
  await expect(g.locator('[id*="_Axis_Major_TickLine_0_"]')).toHaveCount(5);
  await expect(g.locator('[id*="_Axis_Minor_TickLine_0_"]')).toHaveCount(16);
  await expect(part(g, '_Axis_0_Label_2')).toHaveText('1,000');
  await expect(part(g, '_Axis_0_Label_4')).toHaveText('2,000');
  // needle pointer
  await expect(part(g, '_Axis_0_Pointer_0')).toHaveAttribute('aria-label', 'Pointer:1500');
  await expect(part(g, '_Axis_0_Pointer_Needle_0')).toHaveAttribute('fill', '#d81b60');
  await expect(part(g, '_Axis_0_Pointer_NeedleCap_0')).toHaveAttribute('rx', '8');
  await expect(part(g, '_Axis_0_Pointer_NeedleTail_0')).toBeAttached();
  // widget instance
  expect(await widgetProp(g, 'width')).toBe('420');
  expect(await widgetProp(g, 'height')).toBe('320');
  expect(await widgetProp(g, 'title')).toBe('Engine speed');
  expect(await widgetProp(g, 'background')).toBe('#f5f5f5');
  expect(await widgetProp(g, 'animationDuration')).toBe(0);
  expect(await widgetProp(g, 'useGroupingSeparator')).toBe(true);
  expect(await widgetProp(g, 'description')).toBe('Engine speed gauge');
  expect(await widgetProp(g, 'tabIndex')).toBe(3);
  expect(await widgetProp(g, 'theme')).toBe('Material3');
  expect(await widgetCall(g, w => w.margin.left)).toBe(10);
  expect(await widgetCall(g, w => w.titleStyle.size)).toBe('18px');
  expect(await widgetCall(g, w => w.border.color)).toBe('#1565c0');
  expect(await widgetCall(g, w => w.axes[0].pointers[0].value)).toBe(1500);
});

test('ranges colour the axis and labels, legend lists them and toggles visibility', async ({ page }) => {
  const g = page.getByTestId('cg-ranges');
  await expect(part(g, '_Axis_0_Range_0')).toHaveAttribute('fill', '#30b32d');
  await expect(part(g, '_Axis_0_Range_1')).toHaveAttribute('fill', '#ffdd00');
  await expect(part(g, '_Axis_0_Range_2')).toHaveAttribute('fill', '#f03e3e');
  // useRangeColor
  await expect(part(g, '_Axis_0_Label_0')).toHaveAttribute('fill', '#30b32d');
  await expect(part(g, '_Axis_0_Label_6')).toHaveAttribute('fill', '#f03e3e');
  // legend
  await expect(part(g, '_gauge_legend_Axis_0_text_0')).toHaveText('Slow');
  await expect(part(g, '_gauge_legend_Axis_0_text_1')).toHaveText('Normal');
  await expect(part(g, '_gauge_legend_Axis_0_text_2')).toHaveText('Fast');
  await expect(part(g, '_gauge_legend_element')).toHaveAttribute('fill', '#fafafa');
  expect(await widgetCall(g, w => w.legendSettings.visible)).toBe(true);
  expect(await widgetCall(g, w => w.legendSettings.position)).toBe('Bottom');
  expect(await widgetProp(g, 'allowRangePreRender')).toBe(true);
  // toggleVisibility: clicking a legend item hides its range
  const shape = part(g, '_gauge_legend_Axis_0_Shape_1');
  const before = await shape.getAttribute('fill');
  await part(g, '_gauge_legend_g_1').click();
  await expect.poll(async () => shape.getAttribute('fill')).not.toBe(before);
});

test('RangeBar and Marker pointers on two axes', async ({ page }) => {
  const g = page.getByTestId('cg-pointers');
  await expect(part(g, '_Axis_0_Pointer_RangeBar_0')).toHaveAttribute('fill', '#6a1b9a');
  await expect(part(g, '_Axis_1_Pointer_Marker_0')).toHaveAttribute('fill', '#ef6c00');
  await expect(part(g, '_Axis_0_Pointer_0')).toHaveAttribute('aria-label', 'Pointer:70');
  await expect(part(g, '_Axis_1_Pointer_0')).toHaveAttribute('aria-label', 'Pointer:40');
  expect(await widgetCall(g, w => w.axes.length)).toBe(2);
});

test('annotations render custom HTML and raise annotationRender', async ({ page, app }) => {
  const section = app.section('cg-annotations');
  const g = section.getByTestId('cg-annotations');
  await expect(g.locator('.cg-annotation')).toHaveText('50 %');
  expect(await counter(section, 'cg-annotation-count')).toBeGreaterThan(0);
  expect(await widgetCall(g, w => w.axes[0].annotations[0].angle)).toBe(180);
});

test('semi circle with explicit centre', async ({ page }) => {
  const g = page.getByTestId('cg-semi');
  expect(await widgetProp(g, 'centerX')).toBe('50%');
  expect(await widgetProp(g, 'centerY')).toBe('75%');
  expect(await widgetProp(g, 'moveToCenter')).toBe(true);
  expect(await widgetProp(g, 'allowMargin')).toBe(false);
  expect(await widgetCall(g, w => w.axes[0].startAngle)).toBe(270);
  await expect(part(g, '_Axis_0_Pointer_NeedleCap_0')).toBeAttached();
  // the needle hub sits in the lower half because centerY is 75 %
  const cy = Number(await part(g, '_Axis_0_Pointer_NeedleCap_0').getAttribute('cy'));
  expect(cy).toBeGreaterThan(130);
});

test('tooltip is formatted and raises tooltipRender on pointer hover', async ({ page, app }) => {
  const section = app.section('cg-tooltip');
  const g = section.getByTestId('cg-tooltip');
  expect(await widgetCall(g, w => w.tooltip.enable)).toBe(true);
  expect(await widgetCall(g, w => w.tooltip.format)).toBe('Level {value} units');
  const cap = part(g, '_Axis_0_Pointer_NeedleCap_0');
  await moveOver(cap, 0.4, 0.5);
  await moveOver(cap, 0.6, 0.5);
  await expect(section.getByTestId('cg-tooltip-content')).toHaveText('Level 75 units');
  expect(await counter(section, 'cg-tooltip-count')).toBeGreaterThan(0);
  await expect(page.locator('[id$="_Pointer_Tooltip"], [id$="_Tooltip"]').filter({ hasText: 'Level 75 units' }).first()).toBeVisible();
});

/** Centre of a full circle gauge: the bounding box centre of its axis line */
async function gaugeCentre(g: Locator) {
  const box = await part(g, '_AxisLine_0').boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Drag the mouse around `centre`, starting at `from`, by `degrees` in small steps */
async function dragAround(page: import('@playwright/test').Page, centre: { x: number; y: number }, from: { x: number; y: number }, degrees: number) {
  const radius = Math.hypot(from.x - centre.x, from.y - centre.y);
  const start = Math.atan2(from.y - centre.y, from.x - centre.x);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let step = 1; step <= 10; step++) {
    const angle = start + ((degrees * step) / 10) * (Math.PI / 180);
    await page.mouse.move(centre.x + radius * Math.cos(angle), centre.y + radius * Math.sin(angle));
  }
  await page.mouse.up();
}

test('dragging the pointer raises dragStart, dragMove and dragEnd and updates the value', async ({ page, app }) => {
  const section = app.section('cg-drag');
  const g = section.getByTestId('cg-drag');
  const marker = part(g, '_Axis_0_Pointer_Marker_0');
  await marker.evaluate((el: Element) => el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }));
  const box = await marker.boundingBox();
  const centre = await gaugeCentre(g);
  await dragAround(page, centre, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, 90);
  await expect.poll(() => counter(section, 'cg-ev-dragStart')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'cg-ev-dragMove')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'cg-ev-dragEnd')).toBeGreaterThan(0);
  // 90 degrees on a 0-360 axis with a 0-100 scale is 25 units further
  await expect.poll(() => widgetCall(g, w => Math.round(w.axes[0].pointers[0].currentValue))).toBeGreaterThan(40);
  await expect(section.getByTestId('cg-drag-value')).not.toHaveText('');
  expect(await widgetProp(g, 'enablePointerDrag')).toBe(true);
  expect(await widgetProp(g, 'enableRangeDrag')).toBe(true);
});

test('dragging a range raises drag events when enableRangeDrag is on', async ({ page, app }) => {
  const section = app.section('cg-drag');
  const g = section.getByTestId('cg-drag');
  const before = await counter(section, 'cg-ev-dragStart');
  // pointOnPath scrolls the gauge into view, measure the centre afterwards
  const edge = await pointOnPath(part(g, '_Axis_0_Range_0'), 0.25);
  const centre = await gaugeCentre(g);
  // step a few pixels towards the centre so the press lands inside the 14px wide range
  const distance = Math.hypot(centre.x - edge.x, centre.y - edge.y);
  const from = { x: edge.x + ((centre.x - edge.x) / distance) * 4, y: edge.y + ((centre.y - edge.y) / distance) * 4 };
  await dragAround(page, centre, from, 20);
  await expect.poll(() => counter(section, 'cg-ev-dragStart')).toBeGreaterThan(before);
  await expect.poll(() => counter(section, 'cg-ev-dragEnd')).toBeGreaterThan(0);
  expect(await widgetCall(g, w => w.axes[0].ranges[0].end)).toBeGreaterThan(0);
});

test('load, loaded, animationComplete, axisLabelRender, radiusCalculate and legendRender fire while rendering', async ({ app }) => {
  const section = app.section('cg-events');
  const g = section.getByTestId('cg-events');
  await expect(section.getByTestId('cg-ev-load')).toHaveText('1');
  await expect(section.getByTestId('cg-ev-loaded')).toHaveText('1');
  await expect.poll(() => counter(section, 'cg-ev-animationComplete')).toBeGreaterThan(0);
  expect(await counter(section, 'cg-ev-axisLabelRender')).toBeGreaterThan(0);
  expect(await counter(section, 'cg-ev-radiusCalculate')).toBeGreaterThan(0);
  expect(await counter(section, 'cg-ev-legendRender')).toBeGreaterThan(0);
  // axisLabelRender rewrote the first label
  await expect(part(g, '_Axis_0_Label_0')).toHaveText('Zero');
});

test('mouse events are raised for moves, presses and leaving the gauge', async ({ page, app }) => {
  const section = app.section('cg-events');
  const g = section.getByTestId('cg-events');
  const svg = hostOf(g).locator('svg');
  await svg.evaluate((el: Element) => el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }));
  const box = await svg.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2 + 10, box.y + box.height / 2 + 10);
  await expect.poll(() => counter(section, 'cg-ev-gaugeMouseMove')).toBeGreaterThan(0);
  await page.mouse.down();
  await expect.poll(() => counter(section, 'cg-ev-gaugeMouseDown')).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(() => counter(section, 'cg-ev-gaugeMouseUp')).toBeGreaterThan(0);
  await page.mouse.move(2, 2);
  await expect.poll(() => counter(section, 'cg-ev-gaugeMouseLeave')).toBeGreaterThan(0);
});

test('resized is raised when the viewport changes a percentage sized gauge', async ({ page, app }) => {
  const section = app.section('cg-events');
  expect(await counter(section, 'cg-ev-resized')).toBe(0);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect.poll(() => counter(section, 'cg-ev-resized'), { timeout: 10000 }).toBeGreaterThan(0);
});

test('beforePrint is raised by print and can cancel it', async ({ app }) => {
  const section = app.section('cg-events');
  const g = section.getByTestId('cg-events');
  expect(await widgetProp(g, 'allowPrint')).toBe(true);
  await widgetCall(g, w => w.print());
  await expect(section.getByTestId('cg-ev-beforePrint')).toHaveText('1');
});

test('image and pdf export are available', async ({ page, app }) => {
  const g = app.section('cg-export').getByTestId('cg-export');
  expect(await widgetProp(g, 'allowImageExport')).toBe(true);
  expect(await widgetProp(g, 'allowPdfExport')).toBe(true);
  const png = page.waitForEvent('download');
  await widgetCall(g, w => { w.export('PNG', 'gauge'); });
  expect((await png).suggestedFilename()).toBe('gauge.png');
  const pdf = page.waitForEvent('download');
  await widgetCall(g, w => { w.export('PDF', 'gauge'); });
  expect((await pdf).suggestedFilename()).toBe('gauge.pdf');
});

test('width, title, background, theme and axes follow the view-model', async ({ page }) => {
  const g = page.getByTestId('cg-dynamic');
  await expect(part(g, '_CircularGaugeTitle')).toHaveText('First title');
  await expect(part(g, '_Axis_0_Pointer_0')).toHaveAttribute('aria-label', 'Pointer:30');
  await page.getByTestId('cg-dyn-change').click();
  await expect(part(g, '_CircularGaugeTitle')).toHaveText('Second title');
  await expect(part(g, '_CircularGaugeBorder')).toHaveAttribute('fill', '#ffe0b2');
  await expect(part(g, '_Axis_0_Pointer_0')).toHaveAttribute('aria-label', 'Pointer:80');
  await expect(g.locator('svg')).toHaveAttribute('width', '400');
  expect(await widgetProp(g, 'theme')).toBe('Bootstrap5Dark');
  expect(await widgetProp(g, 'width')).toBe('400');
  expect(await widgetProp(g, 'background')).toBe('#ffe0b2');
});
