import { Locator } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('calendar'));

/** A day of the displayed month. */
function day(scope: Locator, n: number) {
  return scope.locator('td.e-cell:not(.e-other-month)', { has: scope.page().locator(`span:text-is("${n}")`) });
}

test('two-way value: view to model, change and created events', async ({ app }) => {
  const section = app.section('cal-value');
  await expect(section.getByTestId('cal-created')).toHaveText('1');
  await expect(day(section, 15)).toHaveClass(/e-selected/);
  await day(section, 20).click();
  await expect(section.getByTestId('cal-value-out')).toHaveText('2024-05-20');
  await expect(section.getByTestId('cal-change-count')).toHaveText('1');
  await expect(section.getByTestId('cal-interacted')).toHaveText('true');
  await expect(day(section, 20)).toHaveClass(/e-selected/);
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('cal-value');
  await section.getByTestId('cal-set').click();
  await expect(section.locator('.e-day.e-title')).toHaveText('June 2024');
  await expect(day(section, 20)).toHaveClass(/e-selected/);
  await expect(section.getByTestId('cal-value-out')).toHaveText('2024-06-20');
});

test('navigated is raised when the view or month changes', async ({ app }) => {
  const section = app.section('cal-value');
  await section.locator('.e-header .e-next').click();
  await expect(section.getByTestId('cal-navigations')).toHaveText('1');
  await expect(section.getByTestId('cal-navigated')).toHaveText('Month');
  await section.locator('.e-day.e-title').click();
  await expect(section.getByTestId('cal-navigated')).toHaveText('Year');
});

test('multiple selection with two-way values', async ({ app }) => {
  const section = app.section('cal-multi');
  expect(await widgetProp(section.getByTestId('cal-multi'), 'isMultiSelection')).toBe(true);
  await expect(section.locator('td.e-selected')).toHaveCount(2);
  await day(section, 10).click();
  await expect(section.locator('td.e-selected')).toHaveCount(3);
  await expect(section.getByTestId('cal-multi-out')).toHaveText('2024-05-03,2024-05-04,2024-05-10');
  await section.getByTestId('cal-multi-set').click();
  await expect(section.getByTestId('cal-multi-out')).toHaveText('2024-05-10,2024-05-11,2024-05-12');
  await expect(section.locator('td.e-selected')).toHaveCount(3);
  await expect(day(section, 12)).toHaveClass(/e-selected/);
});

test('min, max, enabled and cssClass', async ({ app }) => {
  const section = app.section('cal-range');
  const host = section.getByTestId('cal-range');
  await expect(section.locator('td.e-cell.e-disabled:not(.e-other-month)')).toHaveCount(10);
  await expect(section.locator('.e-calendar')).toHaveClass(/cal-custom/);
  await section.getByTestId('cal-range-change').click();
  await expect(section.locator('td.e-cell.e-disabled:not(.e-other-month)')).toHaveCount(20);
  await expect(section.locator('.e-calendar')).toHaveClass(/cal-custom-two/);
  expect(await widgetProps(host, ['min', 'max'])).toEqual({ min: new Date(2024, 4, 10).toISOString(), max: new Date(2024, 4, 20).toISOString() });
  await expect(section.locator('.e-calendar')).not.toHaveClass(/e-disabled/);
  await section.getByTestId('cal-disable').click();
  await expect(section.locator('.e-calendar')).toHaveClass(/e-disabled/);
  expect(await widgetProp(host, 'enabled')).toBe(false);
});

test('start and depth choose the view, calendarMode switches to Islamic', async ({ app }) => {
  const section = app.section('cal-views');
  const calendar = section.getByTestId('cal-views');
  expect(await widgetProps(calendar, ['start', 'depth'])).toEqual({ start: 'Year', depth: 'Year' });
  await expect(calendar.locator('.e-header .e-title')).toHaveText('2024');
  await expect(calendar.locator('td.e-cell span', { hasText: 'Jan' })).toBeVisible();
  // the deepest view is the year view, a month is selected instead of drilling into days
  await calendar.locator('td.e-cell span', { hasText: 'Jul' }).click();
  await expect(calendar.locator('.e-header .e-title')).toHaveText('2024');
  await expect(calendar.locator('td.e-selected')).toContainText('Jul');
  await section.getByTestId('cal-views-change').click();
  await expect(calendar.locator('.e-header .e-title')).toHaveText('2020 - 2029');
  const islamic = section.getByTestId('cal-islamic');
  await expect(islamic.locator('.e-day.e-title')).toHaveText('May 2024');
  await section.getByTestId('cal-islamic-switch').click();
  await expect(islamic.locator('.e-day.e-title')).toHaveText(/1445/);
  expect(await widgetProp(islamic, 'calendarMode')).toBe('Islamic');
});

test('week numbers, week rule, first day, header format and today button', async ({ app }) => {
  const section = app.section('cal-week');
  const host = section.getByTestId('cal-week');
  const weekOfSelection = () => section.locator('tr', { has: section.page().locator('td.e-selected') }).locator('td.e-week-number').textContent();
  await expect(section.locator('td.e-week-number').first()).toBeVisible();
  expect(await weekOfSelection()).toBe('20');
  await expect(section.locator('th').nth(1)).toHaveText('M');
  await expect(section.locator('.e-footer-container .e-today')).toBeVisible();
  expect(await widgetProps(host, ['weekRule', 'firstDayOfWeek', 'weekNumber'])).toEqual({ weekRule: 'FirstFourDayWeek', firstDayOfWeek: 1, weekNumber: true });
  await section.getByTestId('cal-week-change').click();
  // the first full week of a Sunday based calendar starts on January 7th, which makes May 12-18 week 19
  await expect.poll(weekOfSelection).toBe('19');
  await expect(section.locator('th').nth(1)).toHaveText('Sun');
  await expect(section.locator('.e-footer-container .e-today')).toHaveCount(0);
  expect(await widgetProps(host, ['weekRule', 'firstDayOfWeek', 'dayHeaderFormat', 'showTodayButton'])).toEqual({ weekRule: 'FirstFullWeek', firstDayOfWeek: 0, dayHeaderFormat: 'Abbreviated', showTodayButton: false });
});

test('renderDayCell customises cells', async ({ app }) => {
  const section = app.section('cal-cells');
  expect(Number(await section.getByTestId('cal-cells-count').textContent())).toBeGreaterThanOrEqual(35);
  await expect(day(section, 18)).toHaveClass(/e-disabled/);
  await expect(day(section, 17)).not.toHaveClass(/e-disabled/);
  await expect(section.locator('td.special-day')).toHaveCount(1);
  await expect(section.locator('td.special-day')).toContainText('14');
});

test('keyConfigs rebinds keyboard navigation', async ({ app, page }) => {
  const section = app.section('cal-keys');
  const calendar = section.getByTestId('cal-keys');
  await day(calendar, 10).click();
  await page.keyboard.press('Alt+l');
  await expect(calendar.locator('td.e-focused-date')).toContainText('11');
  expect((await widgetProp(calendar, 'keyConfigs')).moveRight).toBe('alt+l');
});

test('serverTimezoneOffset shifts the selected value into the server time zone', async ({ app }) => {
  const section = app.section('cal-keys');
  const calendar = section.getByTestId('cal-tz');
  expect(await widgetProp(calendar, 'serverTimezoneOffset')).toBe(14);
  // the value is moved by (server offset + client offset) hours when the calendar renders
  const expected = await calendar.evaluate(() => {
    const shifted = new Date(new Date(2024, 4, 15, 12, 0, 0).getTime() + (14 + new Date().getTimezoneOffset() / 60) * 3600000);
    return { day: shifted.getDate(), month: shifted.getMonth() };
  });
  expect(expected.month).toBe(4);
  const selected = calendar.locator('td.e-selected');
  await expect(selected).toHaveCount(1);
  await expect(selected).toContainText(String(expected.day));
  expect(expected.day).not.toBe(15);
});

test('destroyed, enableRtl, enablePersistence and locale', async ({ app }) => {
  const section = app.section('cal-life');
  const host = section.getByTestId('cal-life');
  await expect(section.locator('.e-calendar')).toHaveClass(/e-rtl/);
  expect(await widgetProps(host, ['enablePersistence', 'locale'])).toEqual({ enablePersistence: false, locale: 'en-US' });
  await section.getByTestId('cal-toggle').click();
  await expect(section.getByTestId('cal-destroyed')).toHaveText('1');
  await expect(section.locator('.e-calendar')).toHaveCount(0);
});
