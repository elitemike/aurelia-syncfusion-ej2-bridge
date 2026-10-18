import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('schedule'));

test('renders the bound week with its events', async ({ app }) => {
  const section = app.section('sch-week');
  await expect(section.locator('.e-schedule-toolbar .e-date-range')).toContainText('May 12 - 18, 2024');
  await expect(section.locator('.e-appointment')).toHaveCount(3);
  await expect(section.locator('.e-appointment', { hasText: 'Planning' })).toBeVisible();
});

test('view switching from the toolbar', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-toolbar-item.e-month').click();
  await expect(section.locator('.e-month-view')).toBeVisible();
  await section.locator('.e-toolbar-item.e-agenda').click();
  await expect(section.locator('.e-table-wrap.e-agenda-view')).toBeVisible();
});

test('navigation moves the date range', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-toolbar-item.e-next').click();
  await expect(section.locator('.e-date-range')).toContainText('May 19 - 25, 2024');
  await section.locator('.e-toolbar-item.e-prev').click();
  await expect(section.locator('.e-date-range')).toContainText('May 12 - 18, 2024');
});

test('eventClick event carries the appointment data', async ({ app }) => {
  const section = app.section('sch-week');
  await section.locator('.e-appointment', { hasText: 'Review' }).click();
  await expect(section.getByTestId('sch-clicked')).toHaveText('Review');
  await expect(section.getByTestId('sch-click-count')).toHaveText('1');
});

test('model configuration starts in month view', async ({ app }) => {
  const section = app.section('sch-model');
  await expect(section.locator('.e-month-view')).toBeVisible();
  await expect(section.locator('.e-appointment').first()).toBeVisible();
});

test('if.bind destroys and recreates the widget', async ({ app }) => {
  const section = app.section('sch-lifecycle');
  await expect(section.locator('.e-schedule')).toHaveCount(1);
  await section.getByTestId('sch-toggle').click();
  await expect(section.locator('.e-schedule')).toHaveCount(0);
  await section.getByTestId('sch-toggle').click();
  await expect(section.locator('.e-schedule')).toHaveCount(1);
});
