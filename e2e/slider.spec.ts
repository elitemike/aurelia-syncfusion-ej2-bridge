import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('slider'));

test('initial value and keyboard change', async ({ app }) => {
  const section = app.section('sl-default');
  const handle = section.locator('.e-handle');
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

test('vertical orientation and readonly', async ({ app }) => {
  const section = app.section('sl-vertical');
  await expect(section.locator('.e-slider-container')).toHaveClass(/e-vertical/);
  await section.locator('.e-handle').focus();
  await section.locator('.e-handle').press('ArrowUp');
  await expect(section.locator('.e-handle')).toHaveAttribute('aria-valuenow', '50');
});
