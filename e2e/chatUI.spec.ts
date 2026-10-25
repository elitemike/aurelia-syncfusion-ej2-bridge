import { test, expect } from './fixtures';
import { Locator } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('chatUI'));

const host = (section: Locator) => section.locator('.e-chat-ui');
const editor = (section: Locator) => section.locator('.e-chat-textarea');
const sendButton = (section: Locator) => section.locator('.e-chat-send');
const prop = (section: Locator, path: string) =>
  host(section).evaluate((e: any, p) => {
    let v = e.ej2_instances[0];
    for (const k of p.split('.')) { v = v[k]; }
    return JSON.parse(JSON.stringify(v, (k, val) => (k === 'parentObj' || k === 'controlParent' ? undefined
      : (val && typeof val === 'object' && !Array.isArray(val) && val.properties && val.parentObj ? val.properties : val))));
  }, path);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.describe('default', () => {
  test('renders the header and the conversation', async ({ app }) => {
    const section = app.section('chat-default');
    await expect(section.getByTestId('chat-ev-created')).not.toHaveText('0');
    await expect(section.locator('.e-header-text')).toHaveText('Project chat');
    await expect(section.locator('.e-header-icon')).toHaveClass(/e-user/);
    const content = section.locator('.e-chat-content');
    await expect(content).toContainText('Hi Michale, are we meeting today?');
    await expect(content).toContainText('Perfect, see you then.');
    await expect(editor(section)).toHaveAttribute('placeholder', 'Type your message');
    await expect(host(section)).toHaveCSS('height', '420px');
    expect((await prop(section, 'user')).id).toBe('user1');
    expect(await prop(section, 'headerText')).toBe('Project chat');
    expect(await prop(section, 'headerIconCss')).toBe('e-icons e-user');
    expect(await prop(section, 'placeholder')).toBe('Type your message');
    expect(await prop(section, 'messages')).toHaveLength(4);
    await expect(host(section)).toHaveAttribute('id', /^chat-ui-\d+$/);
  });

  test('typing raises userTyping and sending raises messageSend', async ({ app }) => {
    const section = app.section('chat-default');
    await editor(section).click();
    await app.page.keyboard.type('See you');
    await expect(section.getByTestId('chat-ev-userTyping')).not.toHaveText('0');
    await expect(section.getByTestId('chat-ev-userTyping-text')).toContainText('See you');
    await expect(section.getByTestId('chat-ev-messageSend')).toHaveText('0');
    await sendButton(section).click();
    await expect(section.getByTestId('chat-ev-messageSend')).toHaveText('1');
    await expect(section.getByTestId('chat-ev-messageSend-text')).toHaveText('See you');
    await expect(section.locator('.e-chat-content')).toContainText('See you');
    await expect(editor(section)).toHaveText('');
  });

  test('the Enter key sends the message', async ({ app }) => {
    const section = app.section('chat-default');
    await editor(section).click();
    await app.page.keyboard.type('Via enter');
    await app.page.keyboard.press('Enter');
    await expect(section.getByTestId('chat-ev-messageSend-text')).toHaveText('Via enter');
  });
});

test.describe('header, footer, time and layout', () => {
  test('size, css class, time stamps and time breaks', async ({ app }) => {
    const section = app.section('chat-appearance');
    await expect(host(section)).toHaveCSS('width', '520px');
    await expect(host(section)).toHaveCSS('height', '360px');
    await expect(host(section)).toHaveClass(/chat-custom/);
    expect(await prop(section, 'showTimeBreak')).toBe(true);
    expect(await prop(section, 'autoScrollToBottom')).toBe(true);
    expect(await prop(section, 'timeStampFormat')).toBe('hh:mm a');
    await expect(section.locator('.e-time').first()).toHaveText(/^\d{2}:\d{2} (AM|PM)$/);
    await expect(section.locator('.e-timebreak')).toHaveCount(2);
  });

  test('showHeader, showFooter, enableCompactMode and showTimeStamp follow the view-model', async ({ app }) => {
    const section = app.section('chat-appearance');
    await expect(section.locator('.e-chat-header')).toBeVisible();
    await section.getByTestId('chat-toggle-header').click();
    await expect(section.locator('.e-chat-header')).toBeHidden();
    await section.getByTestId('chat-toggle-footer').click();
    await expect(section.locator('.e-footer')).toBeHidden();
    await section.getByTestId('chat-toggle-time').click();
    await expect(section.locator('.e-time').first()).toBeHidden();
    await section.getByTestId('chat-toggle-compact').click();
    await expect.poll(() => prop(section, 'enableCompactMode')).toBe(true);
    expect(await prop(section, 'showHeader')).toBe(false);
    expect(await prop(section, 'showFooter')).toBe(false);
    expect(await prop(section, 'showTimeStamp')).toBe(false);
  });

  test('headerToolbar items and the item click callback', async ({ app }) => {
    const section = app.section('chat-appearance');
    const item = section.locator('.e-chat-toolbar .e-toolbar-item button').first();
    await expect(item.locator('.e-refresh')).toBeAttached();
    await item.click();
    await expect(section.getByTestId('chat-toolbar-clicks')).toHaveText('1');
  });

  test('messageToolbarSettings configure the message toolbar', async ({ app }) => {
    const section = app.section('chat-appearance');
    const settings = await prop(section, 'messageToolbarSettings');
    expect(settings.width).toBe(160);
    expect(settings.items).toHaveLength(2);
    await expect(section.locator('.e-chat-message-toolbar').first()).toBeAttached();
    await expect(section.locator('.e-chat-message-toolbar .e-reply').first()).toBeAttached();
    await expect(section.locator('.e-chat-message-toolbar .e-copy').first()).toBeAttached();
  });
});

test.describe('suggestions and typing users', () => {
  test('suggestions are listed and clicking one sends it', async ({ app }) => {
    const section = app.section('chat-suggestions');
    expect(await prop(section, 'suggestions')).toEqual(['Looks good to me', 'Can we reschedule?', 'Thanks!']);
    expect(await prop(section, 'loadOnDemand')).toBe(true);
    const list = section.locator('.e-suggestion-list');
    await expect(list).toContainText('Looks good to me');
    await expect(list).toContainText('Can we reschedule?');
    await list.getByText('Thanks!').click();
    await expect(section.locator('.e-chat-content')).toContainText('Thanks!');
  });

  test('typingUsers shows the typing indicator', async ({ app }) => {
    const section = app.section('chat-suggestions');
    expect(await prop(section, 'typingUsers')).toHaveLength(1);
    await expect(section.locator('.e-typing-indicator')).toBeAttached();
    await expect(section.locator('.e-typing-indicator')).toContainText('Michale Suyama');
  });
});

test('mentions: the trigger character opens the user list and raises mentionSelect', async ({ app }) => {
  const section = app.section('chat-mention');
  expect(await prop(section, 'mentionTriggerChar')).toBe('@');
  expect(await prop(section, 'mentionUsers')).toHaveLength(3);
  await editor(section).click();
  await app.page.keyboard.type('@');
  const popup = app.page.locator('.e-chat-mention.e-popup-open');
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('Reena Jones');
  await popup.getByText('Reena Jones').click();
  await expect(section.getByTestId('chat-ev-mentionSelect')).toHaveText('1');
  await expect(section.getByTestId('chat-ev-mentionSelect-user')).toHaveText('Reena Jones');
  await expect(editor(section)).toContainText('Reena Jones');
});

test.describe('templates', () => {
  test('message, time break, typing users, suggestion and footer templates', async ({ app }) => {
    const section = app.section('chat-templates');
    await expect(section.locator('.chat-custom-message').first()).toBeAttached();
    await expect(section.locator('.chat-custom-message').first()).toContainText('Template message one');
    await expect(section.locator('.chat-custom-timebreak').first()).toHaveText('Day separator');
    await expect(section.locator('.chat-custom-typing')).toHaveText('Someone is typing');
    await expect(section.locator('.chat-custom-suggestion')).toHaveCount(3);
    await expect(section.locator('.chat-custom-footer')).toHaveText('Custom footer');
    await expect(host(section).first().locator('.e-chat-textarea')).toHaveCount(0);
  });

  test('emptyChatTemplate renders when there are no messages', async ({ app }) => {
    const section = app.section('chat-templates').getByTestId('chat-empty');
    await expect(section.locator('.chat-custom-empty')).toHaveText('Nothing here yet');
  });
});

test.describe('attachments', () => {
  test('attachmentSettings reach the widget and the attach control is rendered', async ({ app }) => {
    const section = app.section('chat-attachments');
    expect(await prop(section, 'enableAttachments')).toBe(true);
    const settings = await prop(section, 'attachmentSettings');
    expect(settings).toMatchObject({
      saveUrl: '/api/chat/upload', removeUrl: '/api/chat/remove', path: '/uploads/', saveFormat: 'Blob',
      allowedFileTypes: '.png,.txt', maxFileSize: 500000, enableDragAndDrop: true, maximumCount: 3
    });
    await expect(section.locator('.e-chat-attachment-icon')).toBeAttached();
    await expect(section.locator('input.e-chat-file-upload')).toHaveAttribute('accept', '.png,.txt');
  });

  test('uploading a file raises the upload events and removing it raises attachmentRemoved', async ({ app }) => {
    await app.page.route('**/api/chat/upload', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await app.page.route('**/api/chat/remove', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    const section = app.section('chat-attachments');
    await section.locator('input.e-chat-file-upload').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('chat-ev-beforeAttachmentUpload')).toHaveText('1');
    await expect(section.getByTestId('chat-ev-attachmentUploadSuccess')).toHaveText('1');
    await expect(section.getByTestId('chat-ev-attachmentUploadFailure')).toHaveText('0');
    await expect(section.locator('.e-chat-uploaded-file-item')).toContainText('dot.png');
    await section.locator('.e-chat-uploaded-file-item .e-chat-close').click();
    await expect(section.getByTestId('chat-ev-attachmentRemoved')).not.toHaveText('0');
  });

  test('a rejected upload raises attachmentUploadFailure', async ({ app }) => {
    await app.page.route('**/api/chat/upload', route => route.fulfill({ status: 500, body: 'no' }));
    const section = app.section('chat-attachments');
    await section.locator('input.e-chat-file-upload').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('chat-ev-attachmentUploadFailure')).not.toHaveText('0');
    await expect(section.getByTestId('chat-ev-attachmentUploadSuccess')).toHaveText('0');
    // the browser reports the 500 of the stubbed endpoint, that is the point of this test
    app.errors.length = 0;
  });
});
