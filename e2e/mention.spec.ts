import { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app, page }) => {
  await page.route('**/api/mn-fail**', route => route.fulfill({ status: 500, body: 'nope' }));
  await page.route('**/api/mn-slow**', async route => {
    await new Promise(r => setTimeout(r, 1500));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ Name: 'Slow Sam' }, { Name: 'Slow Sue' }]) });
  });
  await app.open('mention');
});

const popup = (page: Page) => page.locator('.e-mention.e-popup-open').last();
const editorOf = (section: Locator, id: string) => section.getByTestId(id).locator('[contenteditable="true"]');

async function type(editor: Locator, text: string) {
  await editor.click();
  await editor.pressSequentially(text, { delay: 30 });
}

test('typing the mention character opens the suggestions and raises the open events', async ({ app, page }) => {
  const section = app.section('mn-basic');
  await expect(section.getByTestId('mn-created')).toHaveText('1');
  await type(editorOf(section, 'mn-basic'), 'Hi @');
  await expect(popup(page)).toBeVisible();
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(5);
  await expect(section.getByTestId('mn-before-open')).toHaveText('1');
  await expect(section.getByTestId('mn-opened')).toHaveText('1');
  await expect(section.getByTestId('mn-action-begin')).not.toHaveText('0');
  await expect(section.getByTestId('mn-action-complete')).not.toHaveText('0');
});

test('typing after the character filters and selecting inserts the mention, raising select, change and closed', async ({ app, page }) => {
  const section = app.section('mn-basic');
  const editor = editorOf(section, 'mn-basic');
  await type(editor, 'Hi @ru');
  await expect(section.getByTestId('mn-filtering')).not.toHaveText('0');
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(1);
  await popup(page).locator('li.e-list-item', { hasText: 'Russo Kay' }).click();
  await expect(section.getByTestId('mn-selected')).toHaveText('Russo Kay');
  await expect(section.getByTestId('mn-changed')).toHaveText(/^Russo Kay/);
  await expect(section.getByTestId('mn-closed')).not.toHaveText('0');
  await expect(editor).toContainText('Russo Kay');
  await expect(popup(page)).toBeHidden();
});

test('select can cancel the insertion', async ({ app, page }) => {
  const section = app.section('mn-basic');
  const editor = editorOf(section, 'mn-basic');
  await section.getByTestId('mn-cancel-select').check();
  await type(editor, '@m');
  await popup(page).locator('li.e-list-item', { hasText: 'Maria' }).click();
  await expect(section.getByTestId('mn-selected')).toHaveText('Maria');
  await expect(editor).not.toContainText('Maria');
});

test('mention options reach the widget and change behaviour', async ({ app, page }) => {
  const section = app.section('mn-options');
  const host = section.getByTestId('mn-options');
  const editor = editorOf(section, 'mn-options');
  expect(await widgetProps(host, ['mentionChar', 'showMentionChar', 'suffixText', 'suggestionCount', 'minLength', 'allowSpaces', 'requireLeadingSpace', 'ignoreCase', 'highlight', 'sortOrder', 'filterType', 'popupWidth', 'popupHeight', 'debounceDelay', 'cssClass']))
    .toEqual({ mentionChar: '@', showMentionChar: false, suffixText: '', suggestionCount: 8, minLength: 0, allowSpaces: false, requireLeadingSpace: true, ignoreCase: true, highlight: false, sortOrder: 'None', filterType: 'StartsWith', popupWidth: '200px', popupHeight: '150px', debounceDelay: 100, cssClass: 'mn-custom' });
  // a mention character glued to a word does not open the list while requireLeadingSpace is on
  await type(editor, 'a@');
  await page.waitForTimeout(400);
  await expect(popup(page)).toHaveCount(0);
  await editor.fill('');
  await type(editor, ' @R');
  await expect(popup(page)).toBeVisible();
  await expect(popup(page)).toHaveClass(/mn-custom/);
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(2);
  expect((await popup(page).evaluate(e => (e as HTMLElement).style.width))).toBe('200px');
  await popup(page).locator('li.e-list-item').first().click();
  await expect(editor).toContainText('Russo Kay');

  await section.getByTestId('mn-options-change').click();
  await expect.poll(() => widgetProps(host, ['mentionChar', 'suggestionCount', 'sortOrder', 'filterType', 'debounceDelay', 'cssClass', 'popupWidth', 'popupHeight']))
    .toEqual({ mentionChar: '#', suggestionCount: 2, sortOrder: 'Descending', filterType: 'Contains', debounceDelay: 50, cssClass: 'mn-custom-two', popupWidth: '300px', popupHeight: '120px' });
  expect(await widgetProps(host, ['showMentionChar', 'suffixText', 'minLength', 'allowSpaces', 'requireLeadingSpace', 'ignoreCase', 'highlight']))
    .toEqual({ showMentionChar: true, suffixText: '!', minLength: 1, allowSpaces: true, requireLeadingSpace: false, ignoreCase: false, highlight: true });
  await editor.fill('');
  await type(editor, 'a#o');
  await expect(popup(page)).toBeVisible();
  await expect(popup(page)).toHaveClass(/mn-custom-two/);
  // Contains + case sensitive finds the four names with a lower case o, limited to two suggestions
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(2);
  await expect(popup(page).locator('li.e-list-item').first()).toContainText('Selma Rose');
  expect((await popup(page).evaluate(e => (e as HTMLElement).style.width))).toBe('300px');
  await popup(page).locator('li.e-list-item').first().click();
  await expect(editor).toContainText('#Selma Rose!');
});

test('item, display, no records and spinner templates', async ({ app, page }) => {
  const section = app.section('mn-templates');
  const editor = editorOf(section, 'mn-templates');
  await type(editor, '@');
  await expect(popup(page).locator('.mn-item-tpl')).toHaveCount(5);
  await expect(popup(page).locator('.mn-item-tpl').first()).toHaveText('Person Selma Rose');
  await popup(page).locator('.mn-item-tpl').first().click();
  await expect(editor.locator('.mn-display-tpl, :text("[Selma Rose]")').first()).toBeAttached();
  await type(editor, ' @zzz');
  await expect(popup(page).locator('.mn-none-tpl')).toHaveText('Nobody found');
  await editor.press('Escape');

  const slow = editorOf(section, 'mn-slow');
  await type(slow, '@');
  await expect(page.locator('.mn-spinner-tpl')).toBeVisible();
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(2, { timeout: 15000 });
  await expect(popup(page).locator('li.e-list-item').first()).toHaveText('Slow Sam');
});

test('target and query: an external editor with only the first two suggestions', async ({ app, page }) => {
  const section = app.section('mn-target');
  await type(section.getByTestId('mn-target-editor'), '@');
  await expect(popup(page).locator('li.e-list-item')).toHaveCount(2);
  await popup(page).locator('li.e-list-item').first().click();
  await expect(section.getByTestId('mn-target-editor')).toContainText('Selma Rose');
  expect(await widgetProps(section.getByTestId('mn-target'), ['target', 'suggestionCount'])).toEqual({ target: '#mn-target-editor', suggestionCount: 25 });
});

test('actionFailure for a failing source and destroyed on removal', async ({ app, page }) => {
  const section = app.section('mn-fail');
  await type(editorOf(section, 'mn-fail'), '@');
  await expect(section.getByTestId('mn-failures')).not.toHaveText('0');
  app.errors.length = 0; // the failed request is logged by the browser as a console error
  await section.getByTestId('mn-fail-toggle').click();
  await expect(section.getByTestId('mn-destroyed')).toHaveText('1');
  app.errors.length = 0;
});
