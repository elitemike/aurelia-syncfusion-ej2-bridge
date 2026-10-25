import { test, expect } from './fixtures';
import { widgetProp, widgetCall, hostOf, counter } from './visualHelpers';
import { Locator } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('treeMap'));

/** Syncfusion derives every svg element id from the host id */
const part = (map: Locator, suffix: string) => hostOf(map).locator(`[id$="${suffix}"]`);
/** The group element of a leaf (or header) item, found by its aria label */
const item = (map: Locator, label: string) => hostOf(map).locator(`g[aria-label="${label}"]`).last();
const rect = (map: Locator, label: string) => item(map, label).locator('path[id$="_RectPath"]');

test('default tree map renders leaves with labels, colours, title, border and background', async ({ page }) => {
  const tm = page.getByTestId('tm-basic');
  await expect(tm.locator('svg')).toHaveAttribute('width', '560');
  await expect(tm.locator('svg')).toHaveAttribute('height', '360');
  await expect(rect(tm, 'China')).toHaveAttribute('fill', '#c62828');
  await expect(rect(tm, 'France')).toHaveAttribute('fill', '#1565c0');
  await expect(rect(tm, 'China')).toHaveAttribute('stroke', '#ffffff');
  await expect(hostOf(tm).locator('g[aria-label] path[id$="_RectPath"]')).toHaveCount(9);
  await expect(item(tm, 'China').locator('text')).toHaveText('China');
  await expect(item(tm, 'China').locator('text')).toHaveAttribute('fill', '#ffffff');
  const border = part(tm, '_TreeMap_Border');
  await expect(border).toHaveAttribute('stroke', '#1565c0');
  await expect(border).toHaveAttribute('stroke-width', '2');
  await expect(border).toHaveAttribute('fill', '#f5f5f5');
  await expect(part(tm, '_TreeMap_title')).toHaveText('World population');
  await expect(part(tm, '_TreeMap_title')).toHaveAttribute('fill', '#b71c1c');
  await expect(part(tm, '_TreeMap_subtitle')).toHaveText('millions');
  await expect(hostOf(tm)).toHaveAttribute('aria-label', 'Population tree map');
  await expect(hostOf(tm)).toHaveAttribute('tabindex', '5');
  // the larger the population the larger the leaf
  const china = await rect(tm, 'China').boundingBox();
  const france = await rect(tm, 'France').boundingBox();
  expect(china.width * china.height).toBeGreaterThan(france.width * france.height * 5);
  // widget instance
  expect(await widgetProp(tm, 'width')).toBe('560');
  expect(await widgetProp(tm, 'height')).toBe('360');
  expect(await widgetProp(tm, 'weightValuePath')).toBe('Population');
  expect(await widgetProp(tm, 'colorValuePath')).toBe('Color');
  expect(await widgetProp(tm, 'background')).toBe('#f5f5f5');
  expect(await widgetProp(tm, 'theme')).toBe('Material3');
  expect(await widgetProp(tm, 'description')).toBe('Population tree map');
  expect(await widgetProp(tm, 'tabIndex')).toBe(5);
  expect(await widgetProp(tm, 'useGroupingSeparator')).toBe(true);
  expect(await widgetProp(tm, 'format')).toBe('n0');
  expect(await widgetCall(tm, w => w.margin.left)).toBe(10);
  expect(await widgetCall(tm, w => w.border.color)).toBe('#1565c0');
  expect(await widgetCall(tm, w => w.titleSettings.text)).toBe('World population');
  expect(await widgetCall(tm, w => w.dataSource.length)).toBe(9);
  expect(await widgetCall(tm, w => w.leafItemSettings.labelPath)).toBe('Country');
});

test('layoutType and renderDirection change how leaves are arranged', async ({ page }) => {
  const squarified = page.getByTestId('tm-squarified');
  const horizontal = page.getByTestId('tm-horizontal');
  const vertical = page.getByTestId('tm-vertical');
  const direction = page.getByTestId('tm-direction');
  await expect(rect(squarified, 'China')).toBeAttached();
  const sq = await rect(squarified, 'India').boundingBox();
  const h = await rect(horizontal, 'India').boundingBox();
  const v = await rect(vertical, 'India').boundingBox();
  // slice and dice horizontal lays leaves side by side (tall), vertical stacks them (wide)
  expect(h.height).toBeGreaterThan(h.width);
  expect(v.width).toBeGreaterThan(v.height);
  expect(`${sq.width}x${sq.height}`).not.toBe(`${h.width}x${h.height}`);
  expect(await widgetProp(squarified, 'layoutType')).toBe('Squarified');
  expect(await widgetProp(horizontal, 'layoutType')).toBe('SliceAndDiceHorizontal');
  expect(await widgetProp(vertical, 'layoutType')).toBe('SliceAndDiceVertical');
  // BottomRightTopLeft starts with the largest leaf at the bottom right instead of the top left
  await expect(rect(direction, 'China')).toBeAttached();
  const china = await rect(direction, 'China').boundingBox();
  const box = await hostOf(direction).locator('svg').boundingBox();
  expect(china.x + china.width).toBeGreaterThan(box.x + box.width * 0.5);
  expect(await widgetProp(direction, 'renderDirection')).toBe('BottomRightTopLeft');
});

test('levels group leaves under headers and the palette colours the groups', async ({ page }) => {
  const tm = page.getByTestId('tm-levels');
  for (const continent of ['Asia', 'Africa', 'Europe']) {
    await expect(item(tm, continent).first().locator('path[id$="_RectPath"]')).toBeAttached();
  }
  await expect(hostOf(tm).locator('g[aria-label="Asia"] text').first()).toHaveText('Asia');
  await expect(hostOf(tm).locator('g[aria-label="Asia"] path').first()).toHaveAttribute('fill', '#3949ab');
  await expect(hostOf(tm).locator('g[aria-label="Africa"] path').first()).toHaveAttribute('fill', '#00897b');
  await expect(hostOf(tm).locator('g[aria-label="Europe"] path').first()).toHaveAttribute('fill', '#f4511e');
  expect(await widgetProp(tm, 'palette')).toEqual(['#3949ab', '#00897b', '#f4511e']);
  expect(await widgetCall(tm, w => w.levels.length)).toBe(2);
  expect(await widgetCall(tm, w => w.levels[0].groupPath)).toBe('Continent');
  expect(await widgetCall(tm, w => w.levels[0].headerHeight)).toBe(22);
});

test('range and equal colour mappings colour the leaves', async ({ page }) => {
  const range = page.getByTestId('tm-range');
  const equal = page.getByTestId('tm-equal');
  // Density: China 147 (medium), India 428 (dense), Russia 9 (sparse)
  await expect(rect(range, 'China')).toHaveAttribute('fill', '#fb8c00');
  await expect(rect(range, 'India')).toHaveAttribute('fill', '#e53935');
  await expect(rect(range, 'Russia')).toHaveAttribute('fill', '#43a047');
  await expect(rect(equal, 'China')).toHaveAttribute('fill', '#5e35b1');
  await expect(rect(equal, 'Germany')).toHaveAttribute('fill', '#00acc1');
  await expect(rect(equal, 'Egypt')).toHaveAttribute('fill', '#fb8c00');
  expect(await widgetProp(range, 'rangeColorValuePath')).toBe('Density');
  expect(await widgetProp(equal, 'equalColorValuePath')).toBe('Continent');
});

test('labelTemplate renders custom HTML for every leaf', async ({ page }) => {
  const tm = page.getByTestId('tm-template');
  await expect(tm.locator('.tm-label')).toHaveCount(9);
  await expect(tm.locator('.tm-label').first()).toHaveText(/!$/);
  await expect(rect(tm, 'China')).toHaveAttribute('fill', '#37474f');
});

test('drill down: clicking a group drills in, the breadcrumb leads back', async ({ page, app }) => {
  const section = app.section('tm-drill');
  const tm = section.getByTestId('tm-drill');
  expect(await widgetProp(tm, 'enableDrillDown')).toBe(true);
  expect(await widgetProp(tm, 'drillDownView')).toBe(true);
  expect(await widgetProp(tm, 'enableBreadcrumb')).toBe(true);
  expect(await widgetProp(tm, 'breadcrumbConnector')).toBe(' / ');
  await expect(item(tm, 'Europe')).toBeAttached();
  await item(tm, 'Europe').click();
  await expect(section.getByTestId('tm-ev-drillStart')).not.toHaveText('0');
  await expect(section.getByTestId('tm-ev-drillEnd')).not.toHaveText('0');
  // the Europe countries are on screen, the other continents are gone
  await expect(item(tm, 'Germany')).toBeAttached();
  await expect(hostOf(tm).locator('g[aria-label="China"]')).toHaveCount(0);
  // the breadcrumb is drawn as svg text, clicking it goes back up
  const crumb = hostOf(tm).locator('svg text').filter({ hasText: /^\[-\] Europe$/ });
  await expect(crumb).toBeAttached();
  await crumb.click();
  await expect(item(tm, 'Asia')).toBeAttached();
  await expect(item(tm, 'Africa')).toBeAttached();
});

test('initialDrillDown starts the tree map drilled into a group', async ({ page }) => {
  const tm = page.getByTestId('tm-drill-initial');
  await expect(item(tm, 'China')).toBeAttached();
  await expect(item(tm, 'India')).toBeAttached();
  await expect(hostOf(tm).locator('g[aria-label="Germany"]')).toHaveCount(0);
  expect(await widgetCall(tm, w => w.initialDrillDown.groupName)).toBe('Asia');
  expect(await widgetCall(tm, w => w.initialDrillDown.groupIndex)).toBe(0);
});

test('legend lists the colour mapping and raises legendRendering and legendItemRendering', async ({ app }) => {
  const section = app.section('tm-legend');
  const tm = section.getByTestId('tm-legend');
  await expect(part(tm, '_Legend_Text_Index_0')).toHaveText('Sparse');
  await expect(part(tm, '_Legend_Text_Index_1')).toHaveText('Medium');
  await expect(part(tm, '_Legend_Text_Index_2')).toHaveText('Dense');
  await expect(part(tm, '_Legend_Shape_Index_0')).toHaveAttribute('fill', '#43a047');
  await expect(part(tm, '_Legend_Shape_Index_2')).toHaveAttribute('fill', '#e53935');
  await expect(part(tm, '_Legend_Border')).toHaveAttribute('fill', '#fafafa');
  await expect(part(tm, '_LegendTitle')).toHaveText('Density');
  expect(await widgetCall(tm, w => w.legendSettings.visible)).toBe(true);
  expect(await widgetCall(tm, w => w.legendSettings.position)).toBe('Bottom');
  expect(await counter(section, 'tm-ev-legendRendering')).toBeGreaterThan(0);
  expect(await counter(section, 'tm-ev-legendItemRendering')).toBeGreaterThanOrEqual(3);
});

test('hover highlights and shows a tooltip, click selects, mouse events are raised', async ({ page, app }) => {
  const section = app.section('tm-interaction');
  const tm = section.getByTestId('tm-interaction');
  expect(await counter(section, 'tm-ev-itemRendering')).toBeGreaterThanOrEqual(9);
  const china = rect(tm, 'China');
  await china.scrollIntoViewIfNeeded();
  const box = await china.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x - 10, y - 10);
  await page.mouse.move(x, y);
  await expect.poll(() => counter(section, 'tm-ev-mouseMove')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'tm-ev-itemMove')).toBeGreaterThan(0);
  // highlight
  await expect.poll(() => counter(section, 'tm-ev-itemHighlight')).toBeGreaterThan(0);
  await expect(china).toHaveAttribute('fill', '#ffd54f');
  // tooltip
  await expect(section.getByTestId('tm-tooltip-text')).toHaveText('China');
  expect(await counter(section, 'tm-ev-tooltipRendering')).toBeGreaterThan(0);
  await expect(page.locator('[id*="ooltip"]').filter({ hasText: 'China' }).first()).toBeAttached();
  // click selects
  await page.mouse.down();
  await page.mouse.up();
  await expect.poll(() => counter(section, 'tm-ev-itemClick')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'tm-ev-click')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'tm-ev-itemSelected')).toBeGreaterThan(0);
  await expect(section.getByTestId('tm-selected-text')).toHaveText('China');
  // double and right click
  await page.mouse.dblclick(x, y);
  await expect.poll(() => counter(section, 'tm-ev-doubleClick')).toBeGreaterThan(0);
  await page.mouse.click(x, y, { button: 'right' });
  await expect.poll(() => counter(section, 'tm-ev-rightClick')).toBeGreaterThan(0);
  expect(await widgetCall(tm, w => w.highlightSettings.enable)).toBe(true);
  expect(await widgetCall(tm, w => w.selectionSettings.enable)).toBe(true);
  expect(await widgetCall(tm, w => w.selectionSettings.fill)).toBe('#80cbc4');
  expect(await widgetCall(tm, w => w.tooltipSettings.visible)).toBe(true);
});

test('dataSource as a DataManager is filtered by the query', async ({ page }) => {
  const tm = page.getByTestId('tm-query');
  await expect(item(tm, 'Germany')).toBeAttached();
  await expect(item(tm, 'France')).toBeAttached();
  await expect(item(tm, 'Russia')).toBeAttached();
  await expect(hostOf(tm).locator('g[aria-label="China"]')).toHaveCount(0);
  expect(await widgetCall(tm, w => w.query.queries.length)).toBe(1);
  expect(await widgetProp(tm, 'enableHtmlSanitizer')).toBe(true);
});

test('load and loaded are raised on creation', async ({ app }) => {
  const section = app.section('tm-events');
  await expect(section.getByTestId('tm-ev-load')).toHaveText('1');
  await expect(section.getByTestId('tm-ev-loaded')).toHaveText('1');
});

test('resize is raised when the viewport changes a percentage sized tree map', async ({ page, app }) => {
  const section = app.section('tm-events');
  expect(await counter(section, 'tm-ev-resize')).toBe(0);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect.poll(() => counter(section, 'tm-ev-resize'), { timeout: 10000 }).toBeGreaterThan(0);
});

test('beforePrint is raised by print and can cancel it', async ({ app }) => {
  const section = app.section('tm-events');
  const tm = section.getByTestId('tm-events');
  expect(await widgetProp(tm, 'allowPrint')).toBe(true);
  await widgetCall(tm, w => w.print());
  await expect(section.getByTestId('tm-ev-beforePrint')).toHaveText('1');
});

test('image and pdf export are available', async ({ page, app }) => {
  const tm = app.section('tm-export').getByTestId('tm-export');
  expect(await widgetProp(tm, 'allowImageExport')).toBe(true);
  expect(await widgetProp(tm, 'allowPdfExport')).toBe(true);
  const png = page.waitForEvent('download');
  await widgetCall(tm, w => { w.export('PNG', 'treemap'); });
  expect((await png).suggestedFilename()).toBe('treemap.png');
  const pdf = page.waitForEvent('download');
  await widgetCall(tm, w => { w.export('PDF', 'treemap'); });
  expect((await pdf).suggestedFilename()).toBe('treemap.pdf');
});

test('width, data, background, theme, layout and title follow the view-model', async ({ page }) => {
  const tm = page.getByTestId('tm-dynamic');
  await expect(hostOf(tm).locator('g[aria-label] path[id$="_RectPath"]')).toHaveCount(3);
  await expect(part(tm, '_TreeMap_title')).toHaveText('First title');
  await page.getByTestId('tm-dyn-change').click();
  await expect(hostOf(tm).locator('g[aria-label] path[id$="_RectPath"]')).toHaveCount(6);
  await expect(part(tm, '_TreeMap_title')).toHaveText('Second title');
  await expect(part(tm, '_TreeMap_Border')).toHaveAttribute('fill', '#ffe0b2');
  await expect(tm.locator('svg')).toHaveAttribute('width', '540');
  await expect(hostOf(tm).locator('[id$="_TreeMap_SliceAndDiceHorizontal_Layout"]')).toBeAttached();
  expect(await widgetProp(tm, 'theme')).toBe('Bootstrap5Dark');
  expect(await widgetProp(tm, 'layoutType')).toBe('SliceAndDiceHorizontal');
  expect(await widgetProp(tm, 'width')).toBe('540');
  expect(await widgetProp(tm, 'background')).toBe('#ffe0b2');
});
