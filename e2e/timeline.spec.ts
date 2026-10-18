import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('timeline'));

test('renders one item per entry', async ({ app }) => {
  const section = app.section('tl-bound');
  await expect(section.locator('.e-timeline-item')).toHaveCount(4);
  await expect(section.locator('.e-timeline-item').first()).toContainText('Ordered');
  await expect(section.locator('.e-timeline-item').last()).toContainText('Delivered');
});

test('orientation binding', async ({ app }) => {
  const section = app.section('tl-bound');
  await expect(section.locator('.e-timeline')).toHaveClass(/e-vertical/);
  await section.getByTestId('tl-horizontal').click();
  await expect(section.locator('.e-timeline')).toHaveClass(/e-horizontal/);
  await section.getByTestId('tl-vertical').click();
  await expect(section.locator('.e-timeline')).toHaveClass(/e-vertical/);
});

test('reverse binding toggles the reverse layout', async ({ app }) => {
  const section = app.section('tl-bound');
  await expect(section.locator('.e-timeline')).not.toHaveClass(/e-timeline-reverse/);
  await section.getByTestId('tl-reverse').check();
  await expect(section.locator('.e-timeline')).toHaveClass(/e-timeline-reverse/);
  await section.getByTestId('tl-reverse').uncheck();
  await expect(section.locator('.e-timeline')).not.toHaveClass(/e-timeline-reverse/);
});

test('dotCss and cssClass are applied', async ({ app }) => {
  const section = app.section('tl-css');
  await expect(section.locator('.e-timeline-item.completed')).toHaveCount(2);
  await expect(section.locator('.e-dot.state-progress')).toHaveCount(1);
});

test('align option', async ({ app }) => {
  await expect(app.section('tl-align').locator('.e-timeline')).toHaveClass(/e-align-after/);
});
