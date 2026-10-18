import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('accordion'));

test('renders items with the expanded one open', async ({ app }) => {
  const section = app.section('acc-items');
  await expect(section.locator('.e-acrdn-item')).toHaveCount(3);
  await expect(section.locator('.e-acrdn-item.e-active')).toHaveCount(1);
  await expect(section.locator('.e-acrdn-item.e-active')).toContainText('ASP.NET');
});

test('single mode collapses the previous pane', async ({ app }) => {
  const section = app.section('acc-items');
  await section.locator('.e-acrdn-header', { hasText: 'JavaScript' }).click();
  await expect(section.locator('.e-acrdn-item.e-active')).toHaveCount(1);
  await expect(section.locator('.e-acrdn-item.e-active')).toContainText('JavaScript');
});

test('expanding and expanded events', async ({ app }) => {
  const section = app.section('acc-items');
  await section.locator('.e-acrdn-header', { hasText: 'ASP.NET MVC' }).click();
  await expect(section.getByTestId('acc-expanding')).not.toHaveText('0');
  await expect(section.getByTestId('acc-expanded')).not.toHaveText('0');
  await expect(section.getByTestId('acc-last')).toHaveText('ASP.NET MVC');
});

test('expandMode binding allows several open panes', async ({ app }) => {
  const section = app.section('acc-items');
  await section.getByTestId('acc-multiple').click();
  await section.locator('.e-acrdn-header', { hasText: 'JavaScript' }).click();
  await expect(section.locator('.e-acrdn-item.e-active')).toHaveCount(2);
});

test('expandedIndices opens the listed panes', async ({ app }) => {
  const section = app.section('acc-indices');
  await expect(section.locator('.e-acrdn-item.e-active')).toHaveCount(2);
  await expect(section.locator('.e-acrdn-item').nth(0)).not.toHaveClass(/e-active/);
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('acc-lifecycle');
  await expect(section.locator('.e-accordion')).toHaveCount(1);
  await section.getByTestId('acc-toggle').click();
  await expect(section.locator('.e-accordion')).toHaveCount(0);
  await section.getByTestId('acc-toggle').click();
  await expect(section.locator('.e-accordion .e-acrdn-item')).toHaveCount(3);
});
