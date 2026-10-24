import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('skeleton'));

test('default: text shape, wave effect, label and css class', async ({ app }) => {
  const section = app.section('skeleton-default');
  const el = section.getByTestId('sk-default').locator('div[role=alert]');
  await expect(el).toHaveClass(/e-skeleton-text/);
  await expect(el).toHaveClass(/e-shimmer-wave/);
  await expect(el).toHaveClass(/sk-default-class/);
  await expect(el).toHaveAttribute('aria-label', 'Loading content');
  await expect(el).toHaveAttribute('aria-busy', 'true');
  // a text skeleton without a width fills its container
  const box = await el.boundingBox();
  const parent = await section.getByTestId('sk-default').boundingBox();
  expect(box.width).toBeGreaterThan(parent.width - 2);
});

test('shapes: circle and square keep the width as height, rectangle and text use both', async ({ app }) => {
  const section = app.section('skeleton-shapes');
  const circle = section.getByTestId('sk-circle').locator('div[role=alert]');
  await expect(circle).toHaveClass(/e-skeleton-circle/);
  await expect(circle).toHaveCSS('width', '50px');
  await expect(circle).toHaveCSS('height', '50px');
  const square = section.getByTestId('sk-square').locator('div[role=alert]');
  await expect(square).toHaveClass(/e-skeleton-square/);
  await expect(square).toHaveCSS('height', '50px');
  const rectangle = section.getByTestId('sk-rectangle').locator('div[role=alert]');
  await expect(rectangle).toHaveClass(/e-skeleton-rectangle/);
  await expect(rectangle).toHaveCSS('width', '120px');
  await expect(rectangle).toHaveCSS('height', '40px');
  const text = section.getByTestId('sk-text').locator('div[role=alert]');
  await expect(text).toHaveClass(/e-skeleton-text/);
  await expect(text).toHaveCSS('width', '200px');
  await expect(text).toHaveCSS('height', '16px');
});

test('shimmer effects', async ({ app }) => {
  const section = app.section('skeleton-effects');
  await expect(section.getByTestId('sk-wave').locator('div[role=alert]')).toHaveClass(/e-shimmer-wave/);
  await expect(section.getByTestId('sk-pulse').locator('div[role=alert]')).toHaveClass(/e-shimmer-pulse/);
  await expect(section.getByTestId('sk-fade').locator('div[role=alert]')).toHaveClass(/e-shimmer-fade/);
  await expect(section.getByTestId('sk-none').locator('div[role=alert]')).not.toHaveClass(/e-shimmer-/);
  expect(await widgetProp(section.getByTestId('sk-none'), 'shimmerEffect')).toBe('None');
});

test('bound properties follow the view-model', async ({ app }) => {
  const section = app.section('skeleton-bound');
  const el = section.getByTestId('sk-bound').locator('div[role=alert]');
  await expect(el).toHaveCSS('width', '100px');
  await expect(el).toHaveClass(/e-skeleton-text/);
  await expect(el).toHaveClass(/sk-one/);
  await section.getByTestId('sk-size').click();
  await expect(el).toHaveCSS('width', '300px');
  await expect(el).toHaveCSS('height', '40px');
  await section.getByTestId('sk-shape').click();
  await expect(el).toHaveClass(/e-skeleton-rectangle/);
  await expect(el).not.toHaveClass(/e-skeleton-text/);
  await section.getByTestId('sk-effect').click();
  await expect(el).toHaveClass(/e-shimmer-pulse/);
  await expect(el).not.toHaveClass(/e-shimmer-wave/);
  await section.getByTestId('sk-label').click();
  await expect(el).toHaveAttribute('aria-label', 'Still loading');
  await section.getByTestId('sk-css').click();
  await expect(el).toHaveClass(/sk-two/);
  await expect(el).not.toHaveClass(/sk-one/);
  await section.getByTestId('sk-chk-visible').uncheck();
  await expect(el).toHaveClass(/e-visible-none/);
  await expect(el).toBeHidden();
  await section.getByTestId('sk-chk-visible').check();
  await expect(el).toBeVisible();
});

test('card layout combines a circle and text lines', async ({ app }) => {
  const card = app.section('skeleton-card').getByTestId('sk-card');
  await expect(card.locator('.sk-card-avatar')).toHaveClass(/e-skeleton-circle/);
  await expect(card.locator('.sk-card-line')).toHaveCount(3);
  await expect(card.locator('.sk-card-line').first()).toHaveClass(/e-skeleton-text/);
});
