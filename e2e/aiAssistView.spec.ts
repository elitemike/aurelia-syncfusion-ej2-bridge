import { test, expect } from './fixtures';
import { Locator } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('aiAssistView'));

const host = (section: Locator) => section.locator('.e-aiassistview').first();
const editor = (section: Locator) => section.locator('.e-assist-textarea').first();
const sendButton = (section: Locator) => section.locator('.e-assist-send').first();
const prop = (section: Locator, path: string, index = 0) =>
  section.locator('.e-aiassistview').nth(index).evaluate((e: any, p) => {
    let v = e.ej2_instances[0];
    for (const k of p.split('.')) { v = v[k]; }
    if (typeof v === 'function') { return `[function ${v.name}]`; }
    return JSON.parse(JSON.stringify(v, (k, val) => (k === 'parentObj' || k === 'controlParent' ? undefined
      : typeof val === 'function' ? '[function]'
        : (val && typeof val === 'object' && !Array.isArray(val) && val.properties && val.parentObj ? val.properties : val))));
  }, path);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.describe('default', () => {
  test('renders suggestions, placeholder and header options', async ({ app }) => {
    const section = app.section('ai-default');
    await expect(section.getByTestId('ai-ev-created')).not.toHaveText('0');
    await expect(editor(section)).toHaveAttribute('placeholder', 'Ask the assistant');
    await expect(section.locator('.e-suggestion-header')).toHaveText('Try one of these');
    await expect(section.locator('.e-suggestion-list li')).toHaveText(['What can you do?', 'Summarize this page', 'Tell me a joke']);
    await expect(host(section)).toHaveCSS('height', '460px');
    expect(await prop(section, 'promptPlaceholder')).toBe('Ask the assistant');
    expect(await prop(section, 'promptSuggestionsHeader')).toBe('Try one of these');
    expect(await prop(section, 'promptSuggestions')).toHaveLength(3);
    await expect(host(section)).toHaveAttribute('id', /^ai-assist-view-\d+$/);
  });

  test('sending a prompt raises promptRequest and shows the stub response', async ({ app }) => {
    const section = app.section('ai-default');
    await editor(section).click();
    await app.page.keyboard.type('Hello there');
    await expect(section.getByTestId('ai-ev-promptChanged')).not.toHaveText('0');
    await expect(section.getByTestId('ai-ev-promptChanged-value')).toContainText('Hello there');
    await sendButton(section).click();
    await expect(section.getByTestId('ai-ev-promptRequest')).toHaveText('1');
    await expect(section.getByTestId('ai-ev-promptRequest-text')).toHaveText('Hello there');
    await expect(section.locator('.e-prompt-text').last()).toHaveText('Hello there');
    await expect(section.locator('.e-response').last()).toContainText('Stub answer to: Hello there');
    await expect.poll(() => prop(section, 'prompts')).toHaveLength(1);
  });

  test('clicking a suggestion sends it as the prompt', async ({ app }) => {
    const section = app.section('ai-default');
    await section.locator('.e-suggestion-list li', { hasText: 'Tell me a joke' }).click();
    await expect(section.getByTestId('ai-ev-promptRequest-text')).toHaveText('Tell me a joke');
    await expect(section.locator('.e-response').last()).toContainText('Stub answer to: Tell me a joke');
  });

  test('the stop button raises stopRespondingClick while a response is pending', async ({ app }) => {
    const section = app.section('ai-default');
    await section.getByTestId('ai-hold').click();
    await editor(section).click();
    await app.page.keyboard.type('Never answered');
    await sendButton(section).click();
    await expect(section.getByTestId('ai-ev-promptRequest')).toHaveText('1');
    await section.locator('[title="Stop Responding"] button').click();
    await expect(section.getByTestId('ai-ev-stopRespondingClick')).toHaveText('1');
  });
});

test.describe('look, views and toolbars', () => {
  test('size, css class, icons and clear button', async ({ app }) => {
    const section = app.section('ai-look');
    await expect(host(section)).toHaveCSS('width', '560px');
    await expect(host(section)).toHaveCSS('height', '420px');
    await expect(host(section)).toHaveClass(/ai-custom/);
    await expect(editor(section)).toHaveAttribute('placeholder', 'Look placeholder');
    await expect(section.locator('.e-prompt-icon')).toHaveClass(/e-user/);
    await expect(section.locator('.e-output-icon')).toHaveClass(/e-bookmark/);
    await expect(section.locator('.e-assist-clear-icon')).toBeAttached();
    expect(await prop(section, 'showClearButton')).toBe(true);
    expect(await prop(section, 'enableScrollToBottom')).toBe(true);
    expect(await prop(section, 'promptIconCss')).toBe('e-icons e-user');
    expect(await prop(section, 'responseIconCss')).toBe('e-icons e-bookmark');
    expect(await prop(section, 'cssClass')).toBe('ai-custom');
    await expect(section.locator('.e-scroll-down-btn')).toBeAttached();
  });

  test('showHeader and prompt follow the view-model', async ({ app }) => {
    const section = app.section('ai-look');
    await expect(section.locator('.e-view-header')).toBeVisible();
    await section.getByTestId('ai-toggle-header').click();
    await expect(section.locator('.e-view-header')).toBeHidden();
    await section.getByTestId('ai-set-prompt').click();
    await expect(editor(section)).toContainText('Prefilled prompt');
    expect(await prop(section, 'prompt')).toBe('Prefilled prompt');
  });

  test('views and activeView switch between the assist and the custom view', async ({ app }) => {
    const section = app.section('ai-look');
    await expect(section.locator('.e-view-header')).toContainText('Assistant');
    await expect(section.locator('.e-view-header')).toContainText('Custom view');
    expect(await prop(section, 'views')).toHaveLength(2);
    await section.getByTestId('ai-second-view').click();
    await expect.poll(() => prop(section, 'activeView')).toBe(1);
    await expect(section.locator('.ai-custom-view')).toBeVisible();
    await expect(section.locator('.ai-custom-view')).toHaveText('Custom view content');
  });

  test('header, prompt, response and footer toolbars', async ({ app }) => {
    const section = app.section('ai-look');
    await section.locator('[title="Refresh"]').click();
    await expect(section.getByTestId('ai-toolbar-clicks')).toHaveText('1');
    await expect(section.locator('[title="Edit prompt"]')).toBeAttached();
    await section.locator('[title="Like"]').click();
    await expect(section.getByTestId('ai-response-clicks')).toHaveText('1');
    await expect(section.locator('[title="Copy"]')).toBeAttached();
    await expect(section.locator('.e-footer [title="More"]')).toBeAttached();
    expect((await prop(section, 'toolbarSettings')).items).toHaveLength(1);
    expect((await prop(section, 'promptToolbarSettings')).width).toBe('120px');
    expect((await prop(section, 'responseToolbarSettings')).items).toHaveLength(2);
    expect((await prop(section, 'footerToolbarSettings')).toolbarPosition).toBe('Top');
  });
});

test.describe('templates', () => {
  test('prompt, response, suggestion, footer and banner templates', async ({ app }) => {
    const section = app.section('ai-templates');
    await expect(section.locator('.ai-custom-prompt').first()).toHaveText('Q: Templated prompt');
    await expect(section.locator('.ai-custom-response').first()).toHaveText('A: Templated response');
    await expect(section.locator('.ai-custom-suggestion').first()).toHaveText('What can you do?');
    await expect(section.locator('.ai-custom-suggestion')).toHaveCount(3);
    await expect(section.locator('.ai-custom-footer')).toHaveText('Custom footer');
    await expect(section.locator('.ai-custom-banner').first()).toHaveText('Custom banner');
  });

  test('banner template renders without prompts', async ({ app }) => {
    const section = app.section('ai-templates');
    await expect(section.locator('.e-aiassistview').nth(1).locator('.ai-custom-banner')).toHaveText('Custom banner');
  });

  test('the template properties reach the widget', async ({ app }) => {
    const section = app.section('ai-templates');
    for (const name of ['promptItemTemplate', 'responseItemTemplate', 'promptSuggestionItemTemplate', 'bannerTemplate',
      'footerTemplate', 'responseAnimationTemplate', 'blockTemplate', 'itemTemplate']) {
      expect(typeof (await prop(section, name)), name).toBe('string');
      expect(await prop(section, name), name).toContain('[function');
    }
  });

  test('the response animation template is shown while a response is pending', async ({ app }) => {
    const section = app.section('ai-templates');
    await host(section).first().evaluate((e: any) => {
      e.ej2_instances[0].executePrompt('Waiting for an answer');
    });
    await expect(section.locator('.ai-custom-animation')).toBeVisible();
  });
});

test.describe('streaming', () => {
  test('a streamed response arrives in chunks', async ({ app }) => {
    const section = app.section('ai-streaming');
    expect(await prop(section, 'enableStreaming')).toBe(true);
    await editor(section).click();
    await app.page.keyboard.type('Stream please');
    await sendButton(section).click();
    await expect(section.locator('.e-response').last()).toContainText('Final chunk.', { timeout: 10000 });
    await expect(section.locator('.e-response').last()).toContainText('First chunk.');
  });
});

test.describe('attachments', () => {
  test('attachmentSettings reach the widget', async ({ app }) => {
    const section = app.section('ai-attach');
    expect(await prop(section, 'enableAttachments')).toBe(true);
    expect(await prop(section, 'attachmentSettings')).toMatchObject({
      saveUrl: '/api/ai/upload', removeUrl: '/api/ai/remove', allowedFileTypes: '.png,.txt', maxFileSize: 500000, maximumCount: 3
    });
    await expect(section.locator('input[type="file"]').first()).toHaveAttribute('accept', '.png,.txt');
  });

  test('uploading and removing a file raises the attachment events', async ({ app }) => {
    await app.page.route('**/api/ai/upload', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await app.page.route('**/api/ai/remove', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    const section = app.section('ai-attach');
    await section.locator('input[type="file"]').first().setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('ai-ev-beforeAttachmentUpload')).toHaveText('1');
    await expect(section.getByTestId('ai-ev-attachmentUploadSuccess')).toHaveText('1');
    await expect(section.getByTestId('ai-ev-attachmentUploadFailure')).toHaveText('0');
    await expect(section.locator('.e-footer')).toContainText('dot.png');
    await section.locator('.e-assist-uploaded-file-item .e-assist-clear-icon').click();
    await expect(section.getByTestId('ai-ev-attachmentRemoving')).not.toHaveText('0');
    await expect(section.getByTestId('ai-ev-attachmentRemoved')).not.toHaveText('0');
  });

  test('a rejected upload raises attachmentUploadFailure', async ({ app }) => {
    await app.page.route('**/api/ai/upload', route => route.fulfill({ status: 500, body: 'no' }));
    const section = app.section('ai-attach');
    await section.locator('input[type="file"]').first().setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(section.getByTestId('ai-ev-attachmentUploadFailure')).not.toHaveText('0');
    await expect(section.getByTestId('ai-ev-attachmentUploadSuccess')).toHaveText('0');
    // the browser reports the 500 of the stubbed endpoint, that is the point of this test
    app.errors.length = 0;
  });
});

test('mentions open the data source list and raise mentionSelect', async ({ app }) => {
  const section = app.section('ai-mention');
  const mention = (await prop(section, 'mentions'))[0];
  expect(mention).toMatchObject({ mentionChar: '@', highlight: true, showMentionChar: true, filterType: 'StartsWith', popupWidth: '240px', popupHeight: '180px' });
  expect(mention.dataSource).toHaveLength(3);
  expect(mention.fields.text).toBe('name');
  expect(mention.displayTemplate).toContain('ai-mention-chip');
  await editor(section).click();
  await app.page.keyboard.type('@');
  const popup = app.page.locator('.e-mention.e-popup-open').last();
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('Bob');
  await popup.getByText('Bob').click();
  await expect(section.getByTestId('ai-ev-mentionSelect')).toHaveText('1');
  await expect(editor(section).locator('.ai-mention-chip')).toHaveText('@Bob');
  await expect(section.getByTestId('ai-ev-mentionSelect-item')).toHaveText('Bob');
});

test.describe('speech, telemetry and thinking', () => {
  test('speech, text to speech and telemetry settings reach the widget', async ({ app }) => {
    const section = app.section('ai-speech');
    expect(await prop(section, 'speechToTextSettings')).toMatchObject({ enable: true, lang: 'en-US', allowInterimResults: true, showTooltip: true });
    expect(await prop(section, 'textToSpeechSettings')).toMatchObject({ language: 'en-US', speechPitch: 1, speechRate: 1, volume: 1 });
    expect((await prop(section, 'telemetrySettings')).enable).toBe(false);
    await expect(section.locator('.e-assistview-speech-to-text')).toBeAttached();
  });

  test('thinking blocks of a response are rendered', async ({ app }) => {
    const section = app.section('ai-speech');
    await expect(section.locator('.e-aiassist-thinking-header')).toContainText('Thinking');
    await expect(section.locator('.e-single-stage-content')).toContainText('Looked up the topic');
    await expect(section.locator('.e-response-block-item-1')).toContainText('Rayleigh scattering.');
  });
});
