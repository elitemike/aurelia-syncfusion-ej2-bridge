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
