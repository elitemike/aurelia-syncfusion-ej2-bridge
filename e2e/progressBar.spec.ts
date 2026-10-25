import { test, expect } from './fixtures';
import { widgetProp, widgetCall, hostOf, counter, moveOver, clickOver } from './visualHelpers';

test.beforeEach(async ({ app }) => app.open('progressBar'));

/** Syncfusion derives every svg element id from the host id */
const part = (bar: import('@playwright/test').Locator, suffix: string) => hostOf(bar).locator(`[id$="_${suffix}"]`);

test('linear bar renders track, progress, label and aria values', async ({ page }) => {
  const bar = page.getByTestId('pb-linear');
  await expect(hostOf(bar)).toHaveAttribute('role', 'progressbar');
  await expect(hostOf(bar)).toHaveAttribute('aria-valuenow', '60');
  await expect(hostOf(bar)).toHaveAttribute('aria-valuemin', '0');
  await expect(hostOf(bar)).toHaveAttribute('aria-valuemax', '100');
  await expect(part(bar, 'Lineartrack')).toHaveAttribute('stroke', '#e0e0e0');
  await expect(part(bar, 'Lineartrack')).toHaveAttribute('stroke-width', '24');
  await expect(part(bar, 'Linearprogress')).toHaveAttribute('stroke', '#2e7d32');
  await expect(part(bar, 'Linearprogress')).toHaveAttribute('stroke-width', '24');
  await expect(part(bar, 'linearLabel')).toHaveText('60%');
  // labelStyle and labelOnTrack
  await expect(part(bar, 'linearLabel')).toHaveAttribute('fill', '#ffffff');
  await expect(part(bar, 'linearLabel')).toHaveAttribute('font-size', '14px');
  await expect(part(bar, 'linearLabel')).toHaveAttribute('font-weight', 'bold');
  expect(await widgetProp(bar, 'type')).toBe('Linear');
  expect(await widgetProp(bar, 'value')).toBe(60);
  expect(await widgetProp(bar, 'minimum')).toBe(0);
  expect(await widgetProp(bar, 'maximum')).toBe(100);
  expect(await widgetProp(bar, 'height')).toBe('60');
  expect(await widgetProp(bar, 'width')).toBe('400');
  expect(await widgetProp(bar, 'trackThickness')).toBe(24);
  expect(await widgetProp(bar, 'progressThickness')).toBe(24);
  expect(await widgetProp(bar, 'trackColor')).toBe('#e0e0e0');
  expect(await widgetProp(bar, 'progressColor')).toBe('#2e7d32');
  expect(await widgetProp(bar, 'showProgressValue')).toBe(true);
  expect(await widgetProp(bar, 'labelOnTrack')).toBe(true);
  expect(await widgetCall(bar, w => w.labelStyle.color)).toBe('#ffffff');
  expect(await widgetCall(bar, w => w.animation.enable)).toBe(false);
  await expect(bar.locator('svg')).toHaveAttribute('width', '400');
});

test('striped, active, gradient and rounded styles', async ({ page }) => {
  const striped = page.getByTestId('pb-striped');
  await expect(part(striped, 'Linearprogress')).toHaveAttribute('stroke', /url\(#.*LinearStriped\)/);
  await expect(part(striped, 'LinearStriped')).toBeAttached();
  expect(await widgetProp(striped, 'isStriped')).toBe(true);

  const active = page.getByTestId('pb-active');
  await expect(part(active, 'LinearActiveProgress')).toBeAttached();
  expect(await widgetProp(active, 'isActive')).toBe(true);

  const gradient = page.getByTestId('pb-gradient');
  await expect(part(gradient, 'LinearRange_0')).toHaveAttribute('stroke', 'url(#lineRangeGrad_0)');
  await expect(gradient.locator('linearGradient')).toHaveCount(3);
  expect(await widgetProp(gradient, 'isGradient')).toBe(true);

  const rounded = page.getByTestId('pb-rounded');
  await expect(part(rounded, 'Linearprogress')).toHaveAttribute('stroke-linecap', 'round');
  expect(await widgetProp(rounded, 'cornerRadius')).toBe('Round');
});

test('secondaryProgress draws a buffer bar with its own color and thickness', async ({ page }) => {
  const bar = page.getByTestId('pb-secondary');
  await expect(part(bar, 'Linearbuffer')).toHaveAttribute('stroke', '#ffa000');
  await expect(part(bar, 'Linearbuffer')).toHaveAttribute('stroke-width', '8');
  await expect(part(bar, 'Linearprogress')).toHaveAttribute('stroke-width', '12');
  expect(await widgetProp(bar, 'secondaryProgress')).toBe(70);
  expect(await widgetProp(bar, 'secondaryProgressColor')).toBe('#ffa000');
  expect(await widgetProp(bar, 'secondaryProgressThickness')).toBe(8);
});

test('progress segments split the bar with gaps', async ({ page }) => {
  const bar = page.getByTestId('pb-segments');
  const segments = bar.locator('[id*="_LinearProgressSegment"][id$="0"], [id*="_LinearProgressSegment"][id$="1"], [id*="_LinearProgressSegment"][id$="2"], [id*="_LinearProgressSegment"][id$="3"], [id*="_LinearProgressSegment"][id$="4"]').filter({ has: bar.page().locator('xpath=self::path') });
  await expect(bar.locator('path[id*="_LinearProgressSegment"]')).toHaveCount(5);
  const colors = await bar.locator('path[id*="_LinearProgressSegment"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('stroke')));
  expect(colors).toEqual(['#1b5e20', '#388e3c', '#66bb6a', '#a5d6a7', '#c8e6c9']);
  void segments;
  expect(await widgetProp(bar, 'enableProgressSegments')).toBe(true);
  expect(await widgetProp(bar, 'segmentCount')).toBe(5);
  expect(await widgetProp(bar, 'gapWidth')).toBe(6);
  expect(await widgetProp(bar, 'segmentColor')).toEqual(['#1b5e20', '#388e3c', '#66bb6a', '#a5d6a7', '#c8e6c9']);
});

test('indeterminate bar animates without a value', async ({ page }) => {
  const bar = page.getByTestId('pb-indeterminate');
  await expect(bar.locator('clipPath rect[e-animate="true"]')).toBeAttached();
  expect(await widgetProp(bar, 'isIndeterminate')).toBe(true);
});

test('role and theme pick the bar colors', async ({ page }) => {
  const success = page.getByTestId('pb-role-success');
  const danger = page.getByTestId('pb-role-danger');
  const successColor = await part(success, 'Linearprogress').getAttribute('stroke');
  const dangerColor = await part(danger, 'Linearprogress').getAttribute('stroke');
  expect(successColor).not.toBe(dangerColor);
  expect(await widgetProp(success, 'role')).toBe('Success');
  expect(await widgetProp(danger, 'role')).toBe('Danger');
  expect(await widgetProp(success, 'theme')).toBe('Material3');
  expect(await widgetProp(danger, 'theme')).toBe('Tailwind');
});

test('circular bar honours angles, radius, margin and pie mode', async ({ page }) => {
  const circular = page.getByTestId('pb-circular');
  await expect(part(circular, 'Circulartrack')).toHaveAttribute('stroke-width', '12');
  await expect(part(circular, 'circularLabel')).toHaveText('70%');
  expect(await widgetProp(circular, 'type')).toBe('Circular');
  expect(await widgetProp(circular, 'startAngle')).toBe(0);
  expect(await widgetProp(circular, 'endAngle')).toBe(360);
  expect(await widgetProp(circular, 'radius')).toBe('90%');
  expect(await widgetProp(circular, 'innerRadius')).toBe('70%');
  expect(await widgetCall(circular, w => w.margin.left)).toBe(5);

  const semi = page.getByTestId('pb-semi');
  expect(await widgetProp(semi, 'startAngle')).toBe(240);
  expect(await widgetProp(semi, 'endAngle')).toBe(120);
  const fullPath = await part(circular, 'Circulartrack').getAttribute('d');
  const semiPath = await part(semi, 'Circulartrack').getAttribute('d');
  expect(semiPath).not.toBe(fullPath);

  const pie = page.getByTestId('pb-pie');
  await expect(part(pie, 'Circularprogress')).toHaveAttribute('fill', '#0078D6');
  expect(await widgetProp(pie, 'enablePieProgress')).toBe(true);
});

test('annotations place custom content inside the circular bar', async ({ page }) => {
  const bar = page.getByTestId('pb-annotations');
  await expect(bar.locator('.pb-annotation')).toHaveText('65%');
  expect(await widgetCall(bar, w => w.annotations[0].content)).toContain('pb-annotation');
});

test('rangeColors color the bar by value range', async ({ page }) => {
  const low = page.getByTestId('pb-range-low');
  const high = page.getByTestId('pb-range-high');
  await expect(part(low, 'LinearRange_0')).toHaveAttribute('stroke', '#d32f2f');
  await expect(part(high, 'LinearRange_2')).toHaveAttribute('stroke', '#388e3c');
  expect(await widgetCall(low, w => w.rangeColors.length)).toBe(3);
  expect(await widgetCall(high, w => w.rangeColors[1].color)).toBe('#fbc02d');
});

test('tooltip shows the formatted value on hover and raises tooltipRender', async ({ page, app }) => {
  const section = app.section('pb-tooltip');
  const bar = section.getByTestId('pb-tooltip');
  expect(await widgetCall(bar, w => w.tooltip.enable)).toBe(true);
  await moveOver(part(bar, 'Linearprogress'));
  await expect(section.getByTestId('pb-tooltip-text')).toHaveText('Progress 45%');
  expect(await counter(section, 'pb-tooltip-count')).toBeGreaterThan(0);
  await expect(page.locator('[id$="_tooltip"] text, [id$="_tooltip"]').filter({ hasText: 'Progress 45%' }).first()).toBeVisible();
});

test('properties follow the view-model', async ({ page }) => {
  const bar = page.getByTestId('pb-dynamic');
  await expect(part(bar, 'Linearprogress')).toHaveAttribute('stroke', '#1976d2');
  await expect(hostOf(bar)).toHaveAttribute('aria-valuenow', '30');
  await page.getByTestId('pb-dyn-change').click();
  await expect(part(bar, 'Circularprogress')).toHaveAttribute('stroke', '#c62828');
  await expect(part(bar, 'Circulartrack')).toHaveAttribute('stroke', '#ffcdd2');
  expect(await widgetProp(bar, 'type')).toBe('Circular');
  expect(await widgetProp(bar, 'value')).toBe(80);
  expect(await widgetProp(bar, 'trackColor')).toBe('#ffcdd2');
  expect(await widgetProp(bar, 'progressColor')).toBe('#c62828');
});

test('load, loaded and textRender are raised on creation', async ({ app }) => {
  const section = app.section('pb-events');
  await expect(section.getByTestId('pb-ev-load')).toHaveText('1');
  await expect(section.getByTestId('pb-ev-loaded')).toHaveText('1');
  expect(await counter(section, 'pb-ev-textRender')).toBeGreaterThan(0);
});

test('value change raises valueChanged, animationComplete and progressCompleted, textRender rewrites the label', async ({ app }) => {
  const section = app.section('pb-events');
  const bar = section.getByTestId('pb-events');
  await section.getByTestId('pb-half').click();
  await expect(section.getByTestId('pb-ev-valueChanged')).not.toHaveText('0');
  await expect(section.getByTestId('pb-ev-animationComplete')).not.toHaveText('0');
  await expect(section.getByTestId('pb-ev-progressCompleted')).toHaveText('0');
  await section.getByTestId('pb-complete').click();
  await expect(section.getByTestId('pb-ev-progressCompleted')).toHaveText('1');
  await expect(section.getByTestId('pb-ev-value')).toHaveText('100');
  expect(await widgetProp(bar, 'value')).toBe(100);
  await expect(part(bar, 'linearLabel')).toHaveText('Done');
});

test('mouse events are raised with the hovered element id', async ({ app }) => {
  const section = app.section('pb-events');
  const bar = section.getByTestId('pb-events');
  const target = part(bar, 'Lineartrack');
  await moveOver(target);
  await expect.poll(() => counter(section, 'pb-ev-mouseMove')).toBeGreaterThan(0);
  await expect(section.getByTestId('pb-ev-target')).toContainText('Lineartrack');
  await clickOver(target);
  await expect.poll(() => counter(section, 'pb-ev-mouseDown')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'pb-ev-mouseUp')).toBeGreaterThan(0);
  await expect.poll(() => counter(section, 'pb-ev-mouseClick')).toBeGreaterThan(0);
  await app.page.mouse.move(2, 2);
  await expect.poll(() => counter(section, 'pb-ev-mouseLeave')).toBeGreaterThan(0);
});
