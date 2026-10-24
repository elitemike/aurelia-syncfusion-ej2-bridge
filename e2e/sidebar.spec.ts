import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('sidebar'));

test('starts closed', async ({ app }) => {
  const section = app.section('sb-main');
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-close/);
  await expect(section.getByTestId('sb-open-out')).toHaveText('false');
});

test('isOpen model to view with events', async ({ app }) => {
  const section = app.section('sb-main');
  await section.getByTestId('sb-open').click();
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-open/);
  await expect(section.getByTestId('sb-content')).toBeVisible();
  await expect(section.getByTestId('sb-opened')).toHaveText('1');
  await section.getByTestId('sb-close').click();
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-close/);
  await expect(section.getByTestId('sb-closed')).toHaveText('1');
});

test('isOpen view to model when toggled through the widget api', async ({ app }) => {
  const section = app.section('sb-main');
  await section.getByTestId('sb-api').click();
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-open/);
  await expect(section.getByTestId('sb-open-out')).toHaveText('true');
  await section.getByTestId('sb-api').click();
  await expect(section.getByTestId('sb-open-out')).toHaveText('false');
});

test('width option', async ({ app }) => {
  const section = app.section('sb-main');
  await section.getByTestId('sb-open').click();
  await expect.poll(async () => (await section.locator('.e-sidebar').boundingBox()).width).toBeCloseTo(160, 0);
});

test('dock keeps a strip visible while closed', async ({ app }) => {
  const sidebar = app.section('sb-dock').locator('.e-sidebar');
  await expect(sidebar).toHaveClass(/e-dock/);
  await expect.poll(async () => (await sidebar.boundingBox()).width).toBeCloseTo(50, 0);
});

test('change event fires when the sidebar opens and closes', async ({ app }) => {
  const section = app.section('sb-main');
  await expect(section.getByTestId('sb-changed')).toHaveText('0');
  await section.getByTestId('sb-open').click();
  await expect(section.getByTestId('sb-changed')).toHaveText('1');
  await section.getByTestId('sb-close').click();
  await expect(section.getByTestId('sb-changed')).toHaveText('2');
});

test('position, height, zIndex, animate and enableGestures reach the widget', async ({ app, page }) => {
  const section = app.section('sb-options');
  const sidebar = section.locator('.e-sidebar');
  await expect(sidebar).toHaveClass(/e-right/);
  await expect(sidebar).toHaveCSS('z-index', '2500');
  const w = () => page.evaluate(() => {
    const x = (document.querySelector('[data-testid="sb-options"]') as any).au['ej2-sidebar'].viewModel.widget;
    return { height: x.height, animate: x.animate, gestures: x.enableGestures, backdrop: x.showBackdrop, docClick: x.closeOnDocumentClick };
  });
  expect(await w()).toEqual({ height: '150px', animate: false, gestures: false, backdrop: true, docClick: true });
  // model to view for position
  await section.getByTestId('sb-opt-left').click();
  await expect(sidebar).toHaveClass(/e-left/);
});

test('showBackdrop and closeOnDocumentClick', async ({ app }) => {
  const section = app.section('sb-options');
  await section.getByTestId('sb-opt-open').click();
  await expect(section.getByTestId('sb-opt-out')).toHaveText('true');
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-open/);
  await expect(app.page.locator('.e-sidebar-overlay')).toBeVisible();
  // click on the main area outside of the sidebar (document click) closes it
  await section.getByTestId('sb-opt-main').click({ position: { x: 5, y: 5 }, force: true });
  await expect(section.getByTestId('sb-opt-out')).toHaveText('false');
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-close/);
});

test('mediaQuery opens the sidebar while it matches', async ({ app, page }) => {
  const section = app.section('sb-media');
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-open/);
  await expect(section.getByTestId('sb-media-out')).toHaveText('true');
  expect(await page.evaluate(() => (document.querySelector('[data-testid="sb-media"]') as any).au['ej2-sidebar'].viewModel.widget.mediaQuery)).toBe('(min-width: 600px)');
  await page.setViewportSize({ width: 400, height: 800 });
  await expect(section.locator('.e-sidebar')).toHaveClass(/e-close/);
  await expect(section.getByTestId('sb-media-out')).toHaveText('false');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('sb-lifecycle');
  await expect(section.getByTestId('sb-created')).toHaveText('1');
  await section.getByTestId('sb-life-toggle').click();
  await expect(section.getByTestId('sb-destroyed')).toHaveText('1');
  await section.getByTestId('sb-life-toggle').click();
  await expect(section.getByTestId('sb-created')).toHaveText('2');
});
