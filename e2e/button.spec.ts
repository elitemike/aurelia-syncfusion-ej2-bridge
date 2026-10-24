import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('button'));

test('renders a Syncfusion button', async ({ app }) => {
  const btn = app.section('button-default').getByRole('button', { name: 'My Button' });
  await expect(btn).toHaveClass(/e-btn/);
});

test('click event is re-dispatched', async ({ app }) => {
  const section = app.section('button-click');
  await section.getByRole('button', { name: 'Click me' }).click();
  await section.getByRole('button', { name: 'Click me' }).click();
  await expect(section.getByTestId('btn-click-count')).toHaveText('2');
});

test('bound properties update the widget', async ({ app, page }) => {
  const section = app.section('button-properties');
  const btn = section.getByRole('button', { name: 'Bound' });
  await expect(btn).toBeEnabled();
  await section.getByTestId('chk-disabled').check();
  await expect(btn).toBeDisabled();
  await section.getByTestId('chk-disabled').uncheck();
  await section.getByTestId('chk-primary').check();
  await expect(btn).toHaveClass(/e-primary/);
});

test('icon is rendered', async ({ app }) => {
  await expect(app.section('button-icon').locator('.e-btn-icon.e-add.e-icon-right')).toBeAttached();
});

test('content, cssClass and enableRtl', async ({ app }) => {
  const section = app.section('button-content');
  const btn = section.locator('button.e-btn');
  await expect(btn.locator('.btn-bold')).toHaveText('Bold');
  await expect(btn).toContainText('content');
  await expect(btn).toHaveClass(/btn-custom/);
  await expect(btn).not.toHaveClass(/e-rtl/);
  await section.getByTestId('btn-rtl').check();
  await expect(btn).toHaveClass(/e-rtl/);
  await section.getByTestId('btn-content-change').click();
  await expect(btn).toHaveText('Updated content');
  await section.getByTestId('btn-css-change').click();
  await expect(btn).toHaveClass(/btn-custom-two/);
});

test('created is raised once and enableHtmlSanitizer reaches the widget', async ({ app, page }) => {
  await expect(app.section('button-content').getByTestId('btn-created')).toHaveText('1');
  const sanitize = await page.evaluate(
    () => (document.querySelector('[data-testid="btn-content"]') as any).au['ej2-button'].viewModel.widget.enableHtmlSanitizer);
  expect(sanitize).toBe(false);
});

test('enableRepeat raises clicked repeatedly while held, stops on release', async ({ app, page }) => {
  const section = app.section('button-repeat');
  const btn = section.getByRole('button', { name: 'Hold me' });
  await btn.scrollIntoViewIfNeeded();
  const box = await btn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => Number(await section.getByTestId('btn-repeats').textContent())).toBeGreaterThanOrEqual(3);
  await page.mouse.up();
  await expect(section.getByTestId('btn-clicked')).not.toHaveText('0');
  const settled = await section.getByTestId('btn-clicked').textContent();
  // no further repeats once the button is released
  await expect.poll(async () => section.getByTestId('btn-clicked').textContent(), { timeout: 1000 }).toBe(settled);
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('button-lifecycle');
  const btn = section.getByRole('button', { name: 'I come and go' });
  await expect(btn).toBeVisible();
  await section.getByRole('button', { name: 'Toggle' }).click();
  await expect(btn).toHaveCount(0);
  await section.getByRole('button', { name: 'Toggle' }).click();
  await expect(btn).toHaveClass(/e-btn/);
});
