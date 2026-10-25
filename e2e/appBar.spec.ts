import { test, expect } from './fixtures';
import { wrapperProp } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('appBar'));

test('renders a header with the projected content', async ({ app }) => {
  const bar = app.section('ab-default').locator('header.e-appbar');
  await expect(bar).toHaveClass(/e-light/);
  await expect(bar.locator('.ab-title')).toHaveText('Application');
  await expect(bar.locator('button')).toHaveCount(2);
});

test('projected content stays interactive', async ({ app }) => {
  const section = app.section('ab-default');
  await section.getByTestId('ab-menu').click();
  await expect(section.getByTestId('ab-clicks')).toHaveText('1');
});

test('created and destroyed events with if.bind', async ({ app }) => {
  const section = app.section('ab-default');
  await expect(section.getByTestId('ab-created')).toHaveText('1');
  await section.getByTestId('ab-toggle').click();
  await expect(section.locator('header.e-appbar')).toHaveCount(0);
  await expect(section.getByTestId('ab-destroyed')).toHaveText('1');
  await section.getByTestId('ab-toggle').click();
  await expect(section.getByTestId('ab-created')).toHaveText('2');
  await expect(section.locator('header.e-appbar .ab-title')).toHaveText('Application');
});

test('mode follows the view-model and changes the height', async ({ app }) => {
  const section = app.section('ab-mode');
  const bar = section.locator('header.e-appbar');
  const regular = (await bar.boundingBox()).height;
  await section.getByTestId('ab-prominent').click();
  await expect(bar).toHaveClass(/e-prominent/);
  await expect.poll(async () => (await bar.boundingBox()).height).toBeGreaterThan(regular);
  await section.getByTestId('ab-dense').click();
  await expect(bar).toHaveClass(/e-dense/);
  await expect.poll(async () => (await bar.boundingBox()).height).toBeLessThan(regular);
  await expect.poll(() => wrapperProp(section.getByTestId('ab-mode'), 'mode')).toBe('Dense');
});

test('colorMode follows the view-model', async ({ app }) => {
  const section = app.section('ab-mode');
  const bar = section.locator('header.e-appbar');
  await expect(bar).toHaveClass(/e-light/);
  await section.getByTestId('ab-dark').click();
  await expect(bar).toHaveClass(/e-dark/);
  await section.getByTestId('ab-primary').click();
  await expect(bar).toHaveClass(/e-primary/);
});

test('position and isSticky follow the view-model', async ({ app }) => {
  const section = app.section('ab-position');
  const bar = section.locator('header.e-appbar');
  await expect(bar).not.toHaveClass(/e-horizontal-bottom/);
  await expect(bar).not.toHaveClass(/e-sticky/);
  await section.getByTestId('ab-bottom').click();
  await expect(bar).toHaveClass(/e-horizontal-bottom/);
  await section.getByTestId('ab-stick').click();
  await expect(bar).toHaveClass(/e-sticky/);
  await expect.poll(() => wrapperProp(section.getByTestId('ab-position'), 'isSticky')).toBe(true);
});

test('cssClass and htmlAttributes follow the view-model', async ({ app }) => {
  const section = app.section('ab-custom');
  const bar = section.locator('header.e-appbar');
  await expect(bar).toHaveClass(/ab-one/);
  await expect(bar).toHaveAttribute('data-custom', 'yes');
  await expect(bar).toHaveAttribute('aria-label', 'Main navigation');
  await section.getByTestId('ab-restyle').click();
  await expect(bar).toHaveClass(/ab-two/);
  await expect(bar).not.toHaveClass(/ab-one/);
  await section.getByTestId('ab-attrs').click();
  await expect(bar).toHaveAttribute('data-custom', 'changed');
});
