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

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('button-lifecycle');
  const btn = section.getByRole('button', { name: 'I come and go' });
  await expect(btn).toBeVisible();
  await section.getByRole('button', { name: 'Toggle' }).click();
  await expect(btn).toHaveCount(0);
  await section.getByRole('button', { name: 'Toggle' }).click();
  await expect(btn).toHaveClass(/e-btn/);
});
