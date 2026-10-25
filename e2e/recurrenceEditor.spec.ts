import { test, expect } from './fixtures';
import { Locator } from '@playwright/test';
import { openPopup } from './helpers';

test.beforeEach(async ({ app }) => app.open('recurrenceEditor'));

/** Read a property from the Syncfusion instance that backs a recurrence editor. */
function prop(editor: Locator, name: string) {
  return editor.locator('.e-recurrenceeditor').evaluate((e: any, n) => {
    const v = e.ej2_instances[0][n];
    return v instanceof Date ? v.toISOString() : v;
  }, name);
}

test('default: renders the editor and shows the bound rule', async ({ app }) => {
  const section = app.section('re-default');
  await expect(section.locator('.e-recurrenceeditor')).toBeVisible();
  await expect(section.getByTestId('re-rule')).toHaveText('FREQ=DAILY;INTERVAL=1;COUNT=5');
  await expect(section.locator('input.e-repeat-element')).toHaveValue('Daily');
  await expect(section.locator('input.e-repeat-interval')).toHaveValue('1');
  // the bound start date reaches the widget
  expect(await prop(section, 'startDate')).toBe(new Date(2024, 0, 10).toISOString());
});

test('two-way value: view to model raises change with the rule', async ({ app }) => {
  const section = app.section('re-default');
  // the widget raises change once while it renders the initial rule
  await expect(section.getByTestId('re-change-count')).toHaveText('1');
  await section.locator('.e-repeat-content-wrapper .e-spin-up').click();
  await expect(section.locator('input.e-repeat-interval')).toHaveValue('2');
  await expect(section.getByTestId('re-rule')).toContainText('INTERVAL=2');
  await expect(section.getByTestId('re-change-count')).not.toHaveText('1');
  await expect(section.getByTestId('re-change-value')).toContainText('INTERVAL=2');
  expect(await prop(section, 'value')).toContain('INTERVAL=2');
});

test('two-way value: model to view', async ({ app }) => {
  const section = app.section('re-default');
  await section.getByTestId('re-set-rule').click();
  await expect(section.locator('input.e-repeat-element')).toHaveValue('Weekly');
  await expect(section.locator('input.e-repeat-interval')).toHaveValue('2');
  await expect(section.locator('.e-days button.e-primary')).toHaveCount(2);
  await expect(section.locator('.e-days button[title="Monday"]')).toHaveClass(/e-primary/);
  await expect(section.locator('.e-days button[title="Wednesday"]')).toHaveClass(/e-primary/);
});

test('changing the repeat type from the dropdown writes the rule back', async ({ app }) => {
  const section = app.section('re-default');
  const popup = await openPopup(app.page, section.locator('.e-repeat-element').locator('xpath=..'));
  await popup.locator('li[data-value="weekly"]').click();
  await expect(section.getByTestId('re-rule')).toContainText('FREQ=WEEKLY');
  await expect(section.locator('.e-days')).not.toHaveClass(/e-hide-recurrence-element/);
});

test('frequencies, endTypes, firstDayOfWeek, selectedType and cssClass', async ({ app }) => {
  const section = app.section('re-options');
  const editor = section.locator('.e-recurrenceeditor');
  await expect(editor).toHaveClass(/re-custom/);
  expect(await prop(section, 'frequencies')).toEqual(['none', 'daily', 'weekly', 'yearly']);
  expect(await prop(section, 'endTypes')).toEqual(['never', 'count']);
  expect(await prop(section, 'firstDayOfWeek')).toBe(1);
  expect(await prop(section, 'selectedType')).toBe(0);
  await expect(section.locator('input.e-repeat-element')).toHaveValue('Never');
  // the repeat dropdown only offers the configured frequencies
  const repeatPopup = await openPopup(app.page, section.locator('.e-repeat-element').locator('xpath=..'));
  await expect(repeatPopup.locator('li')).toHaveText(['Never', 'Daily', 'Weekly', 'Yearly']);
  await repeatPopup.locator('li[data-value="none"]').click();
  await expect(app.page.locator('.e-popup-open')).toHaveCount(0);
  // selectedType from the view-model
  await section.getByTestId('re-set-type').click();
  await expect(section.locator('input.e-repeat-element')).toHaveValue('Daily');
  expect(await prop(section, 'selectedType')).toBe(1);
  // end type choices
  const endPopup = await openPopup(app.page, section.locator('input.e-end-on-element').locator('xpath=..'));
  await expect(endPopup.locator('li')).toHaveText(['Never', 'Count']);
  await endPopup.locator('li').first().click();
  await expect(app.page.locator('.e-popup-open')).toHaveCount(0);
  // the week starts on Monday
  const popup = await openPopup(app.page, section.locator('.e-repeat-element').locator('xpath=..'));
  await popup.locator('li[data-value="weekly"]').click();
  await expect(section.locator('.e-days button').first()).toHaveAttribute('title', 'Monday');
});

test('dateFormat, min/max date, startDate and rule with until', async ({ app }) => {
  const section = app.section('re-dates');
  await expect(section.locator('input.e-repeat-element')).toHaveValue('Daily');
  await expect(section.locator('input.e-end-on-element')).toHaveValue('Until');
  await expect(section.locator('.e-end-on-date input.e-datepicker')).toHaveValue('01/03/2024');
  expect(await prop(section, 'dateFormat')).toBe('dd/MM/yyyy');
  expect(await prop(section, 'minDate')).toBe(new Date(2024, 0, 1).toISOString());
  expect(await prop(section, 'maxDate')).toBe(new Date(2024, 11, 31).toISOString());
  expect(await prop(section, 'startDate')).toBe(new Date(2024, 0, 10).toISOString());
});

test('calendarMode follows the view-model', async ({ app }) => {
  const section = app.section('re-dates');
  expect(await prop(section, 'calendarMode')).toBe('Gregorian');
  await section.getByTestId('re-islamic').click();
  await expect.poll(() => prop(section, 'calendarMode')).toBe('Islamic');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('re-life');
  await expect(section.locator('.e-recurrenceeditor')).toBeVisible();
  await expect(section.getByTestId('re-created')).toHaveText('1');
  await expect(section.getByTestId('re-destroyed')).toHaveText('0');
  await section.getByTestId('re-toggle').click();
  await expect(section.locator('.e-recurrenceeditor')).toHaveCount(0);
  await expect(section.getByTestId('re-destroyed')).toHaveText('1');
  await section.getByTestId('re-toggle').click();
  await expect(section.getByTestId('re-created')).toHaveText('2');
});
