import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('progressButton'));

test('renders a progress button', async ({ app }) => {
  await expect(app.section('pb-spinner').getByRole('button', { name: 'Save' })).toHaveClass(/e-progress-btn/);
});

test('click shows spinner and raises on-click, begin and end', async ({ app }) => {
  const section = app.section('pb-spinner');
  await section.getByRole('button', { name: 'Save' }).click();
  await expect(section.getByTestId('pb-clicks')).toHaveText('1');
  await expect(section.getByTestId('pb-begin')).toHaveText('1');
  await expect(section.locator('.e-spinner-pane')).toBeAttached();
  await expect(section.getByTestId('pb-end')).toHaveText('1');
});

test('start() via widget api drives the progress bar', async ({ app }) => {
  const section = app.section('pb-progress');
  await app.section('pb-progress').getByTestId('pb-start').click();
  await expect(section.locator('.e-progress-active')).toBeAttached();
  await expect(section.locator('.e-progress-active')).toHaveCount(0);
});

test('content, cssClass, isPrimary, enableProgress and spinSettings render', async ({ app }) => {
  const section = app.section('pb-props');
  const btn = section.locator('button.e-progress-btn');
  await expect(btn.locator('.e-btn-content')).toContainText('Submit');
  await expect(btn).toHaveClass(/pb-custom/);
  await expect(btn).toHaveClass(/e-primary/);
  await expect(btn).toHaveClass(/e-spin-right/);
  await expect(btn.locator('.e-progress')).toBeAttached();
  await section.getByTestId('pb-props-css').click();
  await expect(btn).toHaveClass(/pb-custom-two/);
});

test('iconCss and iconPosition', async ({ app }) => {
  await expect(app.section('pb-props').locator('.e-btn-icon.e-save.e-icon-right')).toBeAttached();
});

test('widget receives duration, animationSettings and enableHtmlSanitizer', async ({ app, page }) => {
  await expect(app.section('pb-props').locator('button.e-progress-btn')).toBeVisible();
  const state = await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="pb-props"]') as any).au['ej2-progress-button'].viewModel.widget;
    return { duration: w.duration, effect: w.animationSettings.effect, animDuration: w.animationSettings.duration,
      sanitizer: w.enableHtmlSanitizer, spinWidth: w.spinSettings.width };
  });
  expect(state).toEqual({ duration: 600, effect: 'SlideLeft', animDuration: 300, sanitizer: false, spinWidth: 20 });
});

test('isToggle reaches the widget', async ({ app, page }) => {
  // ProgressButton does not wire Button's toggle click handler on creation, so the state class cannot be observed.
  await expect(app.section('pb-props').locator('button.e-progress-btn')).toBeVisible();
  const isToggle = await page.evaluate(
    () => (document.querySelector('[data-testid="pb-props"]') as any).au['ej2-progress-button'].viewModel.widget.isToggle);
  expect(isToggle).toBe(true);
});

test('disabled follows the view-model', async ({ app }) => {
  const section = app.section('pb-props');
  await expect(section.locator('button.e-progress-btn')).toBeEnabled();
  await section.getByTestId('pb-props-disable').check();
  await expect(section.locator('button.e-progress-btn')).toBeDisabled();
});

test('created, begin, progress and end events follow a full progress cycle', async ({ app }) => {
  const section = app.section('pb-props');
  await expect(section.getByTestId('pb-props-created')).toHaveText('1');
  await section.locator('button.e-progress-btn').click();
  await expect(section.getByTestId('pb-props-begin')).toHaveText('1');
  await expect(section.getByTestId('pb-props-progress')).not.toHaveText('0');
  await expect(section.getByTestId('pb-props-percent')).not.toHaveText('');
  await expect(section.getByTestId('pb-props-end')).toHaveText('1');
  await expect(section.getByTestId('pb-props-fail')).toHaveText('0');
});

test('fail is raised when a begin listener throws', async ({ app, page }) => {
  const section = app.section('pb-props');
  await expect(section.getByTestId('pb-props-created')).toHaveText('1');
  await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="pb-props"]') as any).au['ej2-progress-button'].viewModel.widget;
    w.addEventListener('begin', () => { throw new Error('boom'); });
  });
  await section.locator('button.e-progress-btn').click();
  await expect(section.getByTestId('pb-props-fail')).toHaveText('1');
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('pb-lifecycle');
  await expect(section.locator('.e-progress-btn')).toHaveCount(1);
  await section.getByTestId('pb-toggle').click();
  await expect(section.locator('.e-progress-btn')).toHaveCount(0);
  await section.getByTestId('pb-toggle').click();
  await expect(section.locator('.e-progress-btn')).toHaveCount(1);
});
