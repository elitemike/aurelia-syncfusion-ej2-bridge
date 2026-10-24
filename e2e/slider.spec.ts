import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('slider'));

test('initial value and keyboard change', async ({ app }) => {
  const section = app.section('sl-default');
  const handle = section.locator('[role=slider]');
  await expect(handle).toHaveAttribute('aria-valuenow', '40');
  await handle.focus();
  await handle.press('ArrowRight');
  await expect(section.getByTestId('sl-value-out')).toHaveText('50');
  await expect(section.getByTestId('sl-changed')).not.toHaveText('0');
});

test('model to view', async ({ app }) => {
  const section = app.section('sl-default');
  await section.getByTestId('sl-set').click();
  await expect(section.locator('.e-handle')).toHaveAttribute('aria-valuenow', '80');
});

test('click on the track moves the handle', async ({ app }) => {
  const section = app.section('sl-default');
  const track = section.locator('.e-slider');
  const box = await track.boundingBox();
  await section.page().mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  await expect(section.getByTestId('sl-value-out')).toHaveText('90');
});

test('range slider binds an array', async ({ app }) => {
  const section = app.section('sl-range');
  await expect(section.locator('.e-handle')).toHaveCount(2);
  const second = section.locator('.e-handle-second');
  await second.click(); // makes it the active handle for the keyboard
  await second.press('ArrowLeft');
  await expect(section.getByTestId('sl-range-out')).toHaveText('30-69');
});

test('ticks are rendered', async ({ app }) => {
  await expect(app.section('sl-ticks').locator('.e-scale')).toBeVisible();
});

test('created, renderingTicks and renderedTicks events', async ({ app }) => {
  const section = app.section('sl-events');
  await expect(section.getByTestId('sl-created')).toHaveText('1');
  await expect(section.getByTestId('sl-rendering-ticks')).not.toHaveText('0');
  await expect(section.getByTestId('sl-rendered-ticks')).not.toHaveText('0');
});

test('change and tooltipChange events carry the new value', async ({ app }) => {
  const section = app.section('sl-events');
  const handle = section.locator('[role=slider]');
  await handle.focus();
  await handle.press('ArrowRight');
  await expect(section.getByTestId('sl-change-value')).toHaveText('40');
  await expect(section.getByTestId('sl-change-count')).not.toHaveText('0');
  await expect(section.getByTestId('sl-tooltip-text')).toHaveText('40');
});

test('showButtons renders buttons that step the value', async ({ app }) => {
  const section = app.section('sl-more');
  await expect(section.locator('.e-slider-button')).toHaveCount(2);
  await section.locator('.e-slider-button').first().click();
  await expect(section.getByTestId('sl-more-out')).toHaveText('40');
  await section.locator('.e-slider-button').last().click();
  await section.locator('.e-slider-button').last().click();
  await expect(section.getByTestId('sl-more-out')).toHaveText('60');
});

test('limits keep the handle inside the allowed range', async ({ app }) => {
  const section = app.section('sl-more');
  await expect(section.locator('.e-limits')).toHaveCount(1);
  const handle = section.locator('[role=slider]');
  await handle.focus();
  await handle.press('Home');
  await expect(section.getByTestId('sl-more-out')).toHaveText('20');
  await handle.press('End');
  await expect(section.getByTestId('sl-more-out')).toHaveText('80');
});

test('colorRange renders coloured track segments', async ({ app }) => {
  const segments = app.section('sl-more').locator('.e-slider-track > div');
  await expect(segments).toHaveCount(2);
  await expect(segments.first()).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  await expect(segments.last()).toHaveCSS('background-color', 'rgb(0, 170, 0)');
});

test('cssClass, enableAnimation and enableHtmlSanitizer reach the widget', async ({ app, page }) => {
  const section = app.section('sl-more');
  await expect(section.locator('.sl-custom').first()).toBeAttached();
  const widget = (prop: string) => page.evaluate(
    (p) => (document.querySelector('[data-testid="sl-more"]') as any).au['ej2-slider'].viewModel.widget[p], prop);
  expect(await widget('enableAnimation')).toBe(false);
  expect(await widget('enableHtmlSanitizer')).toBe(false);
});

test('enabled follows the view-model', async ({ app }) => {
  const section = app.section('sl-more');
  await expect(section.locator('.e-slider-container')).not.toHaveClass(/e-disabled/);
  await section.getByTestId('sl-enabled').uncheck();
  await expect(section.locator('.e-slider-container')).toHaveClass(/e-disabled/);
});

test('customValues map the index to labels', async ({ app }) => {
  const section = app.section('sl-custom');
  const handle = section.locator('[role=slider]');
  await expect(handle).toHaveAttribute('aria-valuetext', 'M');
  await handle.focus();
  await handle.press('ArrowRight');
  await expect(handle).toHaveAttribute('aria-valuetext', 'L');
  await expect(section.getByTestId('sl-custom-out')).toHaveText('3');
});

test('vertical orientation and readonly', async ({ app }) => {
  const section = app.section('sl-vertical');
  await expect(section.locator('.e-slider-container')).toHaveClass(/e-vertical/);
  await section.locator('.e-handle').focus();
  await section.locator('.e-handle').press('ArrowUp');
  await expect(section.locator('.e-handle')).toHaveAttribute('aria-valuenow', '50');
});
