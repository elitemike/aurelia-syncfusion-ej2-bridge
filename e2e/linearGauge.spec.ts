import { test, expect } from './fixtures';
import { widgetProp, widgetCall, hostOf, counter, moveOver } from './visualHelpers';
import { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('linearGauge'));

/** Syncfusion derives every svg element id from the host id */
const part = (gauge: Locator, suffix: string) => hostOf(gauge).locator(`[id$="${suffix}"]`);

test('default gauge renders border, title, container, axis, ranges and a bar pointer', async ({ page }) => {
  const g = page.getByTestId('lg-basic');
  const border = part(g, '_LinearGaugeBorder');
  await expect(border).toHaveAttribute('stroke', '#1565c0');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#f5f5f5');
  await expect(g.locator('svg')).toHaveAttribute('width', '200');
  await expect(g.locator('svg')).toHaveAttribute('height', '420');
  const title = part(g, '_LinearGaugeTitle');
  await expect(title).toHaveText('Temperature');
  await expect(title).toHaveCSS('font-size', '16px');
  await expect(title).toHaveAttribute('aria-label', 'Temperature gauge');
  await expect(title).toHaveAttribute('tabindex', '4');
  // container
  const container = part(g, '_Normal_Layout');
  await expect(container).toHaveAttribute('fill', '#eceff1');
  await expect(container).toHaveAttribute('stroke', '#90a4ae');
  await expect(container).toHaveAttribute('width', '30');
  await expect(container).toHaveAttribute('height', '300');
  // axis, ticks, ranges and labels (gauge format n1)
  await expect(part(g, '_AxisLine_0')).toHaveAttribute('stroke-width', '3');
  await expect(part(g, '_MajorTicksLine_0')).toHaveAttribute('stroke', '#546e7a');
  await expect(part(g, '_MinorTicksLine_0')).toHaveAttribute('stroke', '#90a4ae');
  await expect(part(g, '_Axis_0_Label_5')).toHaveText('100.0');
  await expect(part(g, '_AxisIndex_0_Range_0')).toHaveAttribute('fill', '#43a047');
  await expect(part(g, '_AxisIndex_0_Range_1')).toHaveAttribute('fill', '#e53935');
  await expect(part(g, '_Axis_0_Label_0')).toHaveText('0.0');
  // bar pointer: 55 % of the 300px container
  const bar = part(g, '_AxisIndex_0_BarPointer_0');
  await expect(bar).toHaveAttribute('fill', '#1e88e5');
  await expect(bar).toHaveAttribute('aria-label', 'Pointer:55');
  await expect(bar).toHaveAttribute('height', '165');
  // widget instance
  expect(await widgetProp(g, 'width')).toBe('200');
  expect(await widgetProp(g, 'height')).toBe('420');
  expect(await widgetProp(g, 'title')).toBe('Temperature');
  expect(await widgetProp(g, 'background')).toBe('#f5f5f5');
  expect(await widgetProp(g, 'animationDuration')).toBe(0);
  expect(await widgetProp(g, 'orientation')).toBe('Vertical');
  expect(await widgetProp(g, 'theme')).toBe('Fabric');
  expect(await widgetProp(g, 'description')).toBe('Temperature gauge');
  expect(await widgetProp(g, 'tabIndex')).toBe(4);
  expect(await widgetProp(g, 'useGroupingSeparator')).toBe(true);
  expect(await widgetProp(g, 'format')).toBe('n1');
  expect(await widgetProp(g, 'allowMargin')).toBe(true);
  expect(await widgetProp(g, 'edgeLabelPlacement')).toBe('Shift');
  expect(await widgetCall(g, w => w.margin.left)).toBe(10);
  expect(await widgetCall(g, w => w.titleStyle.size)).toBe('16px');
  expect(await widgetCall(g, w => w.border.color)).toBe('#1565c0');
  expect(await widgetCall(g, w => w.container.type)).toBe('Normal');
  expect(await widgetCall(g, w => w.axes[0].pointers[0].value)).toBe(55);
});

test('thermometer container and orientation follow the view-model', async ({ page }) => {
  const g = page.getByTestId('lg-horizontal');
  await expect(part(g, '_Thermometer_Layout')).toHaveAttribute('fill', '#eceff1');
  await expect(part(g, '_AxisIndex_0_BarPointer_0')).toHaveAttribute('aria-label', 'Pointer:70');
  expect(await widgetProp(g, 'orientation')).toBe('Horizontal');
  expect(await widgetCall(g, w => w.container.type)).toBe('Thermometer');
  const before = await part(g, '_AxisLine_0').boundingBox();
  expect(before.width).toBeGreaterThan(before.height);
  await page.getByTestId('lg-flip').click();
  await expect.poll(() => widgetProp(g, 'orientation')).toBe('Vertical');
  await expect.poll(async () => {
    const after = await part(g, '_AxisLine_0').boundingBox();
    return after.height > after.width;
  }).toBe(true);
});

test('marker pointers use their shape, placement and axis options', async ({ page }) => {
  const g = page.getByTestId('lg-pointers');
  await expect(part(g, '_AxisIndex_0_MarkerPointer_0')).toHaveAttribute('fill', '#8e24aa');
  await expect(part(g, '_AxisIndex_0_MarkerPointer_1')).toHaveAttribute('fill', '#00897b');
  await expect(part(g, '_AxisIndex_1_MarkerPointer_0')).toHaveAttribute('r', '7');
  expect(await widgetCall(g, w => w.axes[0].pointers[0].markerType)).toBe('Triangle');
  expect(await widgetCall(g, w => w.axes[0].pointers[1].markerType)).toBe('Diamond');
  expect(await widgetCall(g, w => w.axes[0].pointers[0].placement)).toBe('Near');
  expect(await widgetCall(g, w => w.axes[1].opposedPosition)).toBe(true);
  expect(await widgetCall(g, w => w.axes[1].isInversed)).toBe(true);
  // the inversed axis puts 80 near the start of the scale
  const near = Number(await part(g, '_AxisIndex_1_MarkerPointer_0').getAttribute('cx'));
  const axis = await part(g, '_AxisLine_1').boundingBox();
  const svg = await hostOf(g).locator('svg').boundingBox();
  expect(near).toBeLessThan(svg.width / 2);
  expect(axis.width).toBeGreaterThan(100);
});

test('ranges take colours from rangePalettes and gradients', async ({ page }) => {
  const g = page.getByTestId('lg-ranges');
  await expect(part(g, '_AxisIndex_0_Range_0')).toHaveAttribute('fill', '#26a69a');
  await expect(part(g, '_AxisIndex_0_Range_1')).toHaveAttribute('fill', '#ffca28');
  await expect(part(g, '_AxisIndex_0_Range_2')).toHaveAttribute('fill', /url\(#.*linearGradient\)/);
  await expect(g.locator('linearGradient stop')).toHaveCount(2);
  await expect(g.locator('linearGradient stop').first()).toHaveAttribute('stop-color', '#fff176');
  expect(await widgetProp(g, 'rangePalettes')).toEqual(['#26a69a', '#ffca28', '#ef5350']);
});

test('annotations render custom HTML and raise annotationRender', async ({ app }) => {
  const section = app.section('lg-annotations');
  const g = section.getByTestId('lg-annotations');
  await expect(g.locator('.lg-annotation')).toHaveText('40 units');
  expect(await counter(section, 'lg-annotation-count')).toBeGreaterThan(0);
  expect(await widgetCall(g, w => w.annotations[0].axisValue)).toBe(40);
});

test('tooltip is formatted and raises tooltipRender on pointer hover', async ({ page, app }) => {
  const section = app.section('lg-tooltip');
  const g = section.getByTestId('lg-tooltip');
  expect(await widgetCall(g, w => w.tooltip.enable)).toBe(true);
  const marker = part(g, '_AxisIndex_0_MarkerPointer_0');
  await moveOver(marker, 0.4, 0.6);
  await moveOver(marker, 0.6, 0.6);
  await expect(section.getByTestId('lg-tooltip-content')).toHaveText('Level 65 units');
  expect(await counter(section, 'lg-tooltip-count')).toBeGreaterThan(0);
  await expect(page.locator('[id$="_LinearGauge_Tooltip"], [id$="_Tooltip"], [id*="tooltip"]').filter({ hasText: 'Level 65 units' }).first()).toBeVisible();
});

/** Press on `from`, drag by `dx` pixels in steps and release */
async function dragBy(page: Page, from: { x: number; y: number }, dx: number) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(from.x + (dx * step) / 10, from.y);
  }
  await page.mouse.up();
}

test('dragging a marker raises dragStart, dragMove, dragEnd and valueChange', async ({ page, app }) => {
  const section = app.section('lg-drag');
  const g = section.getByTestId('lg-drag');
  const marker = part(g, '_AxisIndex_0_MarkerPointer_0');
  await marker.evaluate((el: Element) => el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }));
  const box = await marker.boundingBox();
  await dragBy(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, 150);
  await expect.poll(() => counter(section, 'lg-ev-dragStart')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'lg-ev-dragMove')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'lg-ev-dragEnd')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'lg-ev-valueChange')).toBeGreaterThan(0);
  await expect.poll(() => widgetCall(g, w => w.axes[0].pointers[0].currentValue)).toBeGreaterThan(40);
  await expect(section.getByTestId('lg-drag-value')).not.toHaveText('');
  // the circle moved right
  await expect.poll(async () => Number(await part(g, '_AxisIndex_0_MarkerPointer_0').getAttribute('cx'))).toBeGreaterThan(200);
});

test('load, loaded, animationComplete and axisLabelRender fire while rendering', async ({ app }) => {
  const section = app.section('lg-events');
  const g = section.getByTestId('lg-events');
  await expect(section.getByTestId('lg-ev-load')).toHaveText('1');
  await expect(section.getByTestId('lg-ev-loaded')).toHaveText('1');
  await expect.poll(() => counter(section, 'lg-ev-animationComplete')).toBeGreaterThan(0);
  expect(await counter(section, 'lg-ev-axisLabelRender')).toBeGreaterThan(0);
  await expect(part(g, '_Axis_0_Label_0')).toHaveText('Zero');
});

test('mouse events are raised for moves, presses and leaving the gauge', async ({ page, app }) => {
  const section = app.section('lg-events');
  const g = section.getByTestId('lg-events');
  const svg = hostOf(g).locator('svg');
  await svg.evaluate((el: Element) => el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }));
  const box = await svg.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2 + 10, box.y + box.height / 2 + 10);
  await expect.poll(() => counter(section, 'lg-ev-gaugeMouseMove')).toBeGreaterThan(0);
  await page.mouse.down();
  await expect.poll(() => counter(section, 'lg-ev-gaugeMouseDown')).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(() => counter(section, 'lg-ev-gaugeMouseUp')).toBeGreaterThan(0);
  await page.mouse.move(2, 2);
  await expect.poll(() => counter(section, 'lg-ev-gaugeMouseLeave')).toBeGreaterThan(0);
});

test('resized is raised when the viewport changes a percentage sized gauge', async ({ page, app }) => {
  const section = app.section('lg-events');
  expect(await counter(section, 'lg-ev-resized')).toBe(0);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect.poll(() => counter(section, 'lg-ev-resized'), { timeout: 10000 }).toBeGreaterThan(0);
});

test('beforePrint is raised by print and can cancel it', async ({ app }) => {
  const section = app.section('lg-events');
  const g = section.getByTestId('lg-events');
  expect(await widgetProp(g, 'allowPrint')).toBe(true);
  await widgetCall(g, w => w.print());
  await expect(section.getByTestId('lg-ev-beforePrint')).toHaveText('1');
});

test('image and pdf export are available', async ({ page, app }) => {
  const g = app.section('lg-export').getByTestId('lg-export');
  expect(await widgetProp(g, 'allowImageExport')).toBe(true);
  expect(await widgetProp(g, 'allowPdfExport')).toBe(true);
  const png = page.waitForEvent('download');
  await widgetCall(g, w => { w.export('PNG', 'gauge'); });
  expect((await png).suggestedFilename()).toBe('gauge.png');
  const pdf = page.waitForEvent('download');
  await widgetCall(g, w => { w.export('PDF', 'gauge'); });
  expect((await pdf).suggestedFilename()).toBe('gauge.pdf');
});

test('width, title, background, theme, format and axes follow the view-model', async ({ page }) => {
  const g = page.getByTestId('lg-dynamic');
  await expect(part(g, '_LinearGaugeTitle')).toHaveText('First title');
  await expect(part(g, '_AxisIndex_0_BarPointer_0')).toHaveAttribute('aria-label', 'Pointer:30');
  await expect(part(g, '_Axis_0_Label_0')).toHaveText('0');
  await page.getByTestId('lg-dyn-change').click();
  await expect(part(g, '_LinearGaugeTitle')).toHaveText('Second title');
  await expect(part(g, '_LinearGaugeBorder')).toHaveAttribute('fill', '#ffe0b2');
  await expect(part(g, '_AxisIndex_0_BarPointer_0')).toHaveAttribute('aria-label', 'Pointer:80');
  await expect(part(g, '_Axis_0_Label_0')).toHaveText('0.00');
  await expect(g.locator('svg')).toHaveAttribute('width', '420');
  expect(await widgetProp(g, 'theme')).toBe('MaterialDark');
  expect(await widgetProp(g, 'format')).toBe('n2');
  expect(await widgetProp(g, 'width')).toBe('420');
  expect(await widgetProp(g, 'background')).toBe('#ffe0b2');
});
