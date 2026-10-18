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

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('pb-lifecycle');
  await expect(section.locator('.e-progress-btn')).toHaveCount(1);
  await section.getByTestId('pb-toggle').click();
  await expect(section.locator('.e-progress-btn')).toHaveCount(0);
  await section.getByTestId('pb-toggle').click();
  await expect(section.locator('.e-progress-btn')).toHaveCount(1);
});
