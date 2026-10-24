import { test, expect } from './fixtures';
import { widgetProp } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('smartTextArea'));

test('typing raises input and focus events and the value is two-way', async ({ app }) => {
  const section = app.section('sta-inline');
  const area = section.locator('textarea');
  await area.focus();
  await expect(section.getByTestId('sta-focused')).toHaveText('true');
  await area.pressSequentially('Hello');
  await expect(section.getByTestId('sta-input-count')).not.toHaveText('0');
  await expect(section.getByTestId('sta-value-out')).toHaveText('Hello');
  await section.getByTestId('sta-set').click();
  await expect(area).toHaveValue('from view-model');
});

test('inline suggestion is requested after a typing pause and accepted with Tab', async ({ app, page }) => {
  const section = app.section('sta-inline');
  const area = section.locator('textarea');
  await area.focus();
  await area.pressSequentially('The answer');
  await expect(area).toHaveAttribute('data-suggestion-visible', '');
  await expect(section.getByTestId('sta-before')).toHaveText('is the answer. ');
  await area.press('Tab');
  await expect(section.getByTestId('sta-after')).toHaveText('is the answer. ');
  await expect(area).toHaveValue('The answer is the answer. ');
  await expect(area).not.toHaveAttribute('data-suggestion-visible', '');
  await expect(section.getByTestId('sta-value-out')).toHaveText('The answer is the answer.');
});

test('userRole and UserPhrases are sent to the suggestion handler', async ({ app, page }) => {
  const section = app.section('sta-inline');
  const area = section.locator('textarea');
  await area.focus();
  await area.pressSequentially('Dear customer');
  await expect(section.getByTestId('sta-calls')).not.toHaveText('0');
  const prompt = await page.evaluate(() => (<any>window).smartTextAreaPrompt);
  const system = prompt.messages[0].content as string;
  expect(system).toContain('Thank you for contacting us');
  expect(system).toContain('We will get back to you soon');
  const last = prompt.messages[prompt.messages.length - 1].content as string;
  expect(last).toContain('ROLE: Customer support agent');
  expect(last).toContain('Dear customer');
  expect(await widgetProp(section.getByTestId('sta-inline'), 'userRole')).toBe('Customer support agent');
  expect(await widgetProp(section.getByTestId('sta-inline'), 'UserPhrases')).toHaveLength(2);
  expect(await widgetProp(section.getByTestId('sta-inline'), 'showSuggestionOnPopup')).toBe('Disable');
});

test('beforeSuggestionInsert can cancel the suggestion', async ({ app }) => {
  const section = app.section('sta-inline');
  await section.getByTestId('sta-cancel').check();
  const area = section.locator('textarea');
  await area.focus();
  await area.pressSequentially('Cancel me');
  await expect(section.getByTestId('sta-before')).toHaveText('is the answer. ');
  await expect(area).not.toHaveAttribute('data-suggestion-visible', '');
  await expect(section.getByTestId('sta-after')).toHaveText('');
  await expect(area).toHaveValue('Cancel me');
});

test('change is raised when the textarea is committed', async ({ app }) => {
  const section = app.section('sta-inline');
  const area = section.locator('textarea');
  await area.fill('committed');
  await area.blur();
  await expect(section.getByTestId('sta-change-count')).toHaveText('1');
  await expect(section.getByTestId('sta-focused')).toHaveText('false');
});

test('popup mode shows a clickable overlay', async ({ app }) => {
  const section = app.section('sta-popup');
  const area = section.locator('textarea');
  expect(await widgetProp(section.getByTestId('sta-popup'), 'showSuggestionOnPopup')).toBe('Enable');
  await area.focus();
  await area.pressSequentially('Popup');
  const overlay = section.locator('.smart-textarea-suggestion-overlay-visible');
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText('is the answer.');
  await overlay.dispatchEvent('mousedown');
  await expect(area).toHaveValue(/Popup.*is the answer\./);
  await expect(section.getByTestId('sta-popup-out')).toContainText('is the answer.');
  await section.getByTestId('sta-mode').click();
  await expect.poll(() => widgetProp(section.getByTestId('sta-popup'), 'showSuggestionOnPopup')).toBe('None');
});

test('TextArea options reach the textarea and follow the model', async ({ app }) => {
  const section = app.section('sta-props');
  const host = section.getByTestId('sta-props');
  const area = section.locator('textarea');
  await expect(area).toHaveAttribute('readonly', '');
  await expect(section.locator('.e-float-text')).toHaveText('Notes');
  await expect(area).toHaveAttribute('cols', '30');
  await expect(area).toHaveAttribute('rows', '2');
  await expect(area).toHaveAttribute('maxlength', '20');
  await expect(area).toHaveAttribute('data-foo', 'bar');
  await expect(section.locator('.e-input-group')).toHaveClass(/sta-custom/);
  await expect(section.locator('.sta-prepend')).toHaveText('pre');
  await expect(section.locator('.sta-append')).toHaveText('app');
  expect(await widgetProp(host, 'showClearButton')).toBe(true);
  expect(await widgetProp(host, 'width')).toBe('300px');
  expect(await widgetProp(host, 'resizeMode')).toBe('Vertical');
  expect(await widgetProp(host, 'adornmentFlow')).toBe('Horizontal');
  expect(await widgetProp(host, 'adornmentOrientation')).toBe('Horizontal');
  await section.getByTestId('sta-props-change').click();
  await expect(area).not.toHaveAttribute('readonly', '');
  await expect(area).toBeDisabled();
  await expect(area).toHaveAttribute('cols', '40');
  await expect(area).toHaveAttribute('rows', '5');
  await expect(area).toHaveAttribute('maxlength', '10');
  await expect(area).toHaveAttribute('data-foo', 'baz');
  await expect(section.locator('.e-input-group')).toHaveClass(/sta-custom-two/);
  await expect.poll(() => widgetProp(host, 'width')).toBe('400px');
  expect(await widgetProp(host, 'resizeMode')).toBe('Horizontal');
  expect(await widgetProp(host, 'adornmentFlow')).toBe('Vertical');
  expect(await widgetProp(host, 'adornmentOrientation')).toBe('Vertical');
});

test('created and destroyed events', async ({ app }) => {
  const section = app.section('sta-life');
  await expect(section.getByTestId('sta-created')).toHaveText('1');
  await section.getByTestId('sta-toggle').click();
  await expect(section.getByTestId('sta-destroyed')).toHaveText('1');
  await expect(section.locator('textarea')).toHaveCount(0);
});
