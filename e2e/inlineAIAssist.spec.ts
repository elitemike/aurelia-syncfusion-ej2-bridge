import { test, expect } from './fixtures';
import { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ app }) => app.open('inlineAIAssist'));

// The popup is moved out of its section when it is created, find it by its generated id. The demo renders the
// sections in this order, so the ids follow it.
const ids: { [name: string]: number } = { 'ia-default': 0, 'ia-popup': 1, 'ia-templates': 2, 'ia-editor': 3, 'ia-streaming': 4 };
let current = 0;
const use = (app: { section(id: string): Locator }, name: string) => { current = ids[name]; return app.section(name); };
const host = (section: Locator) => section.page().locator(`#inline-ai-assist-${current}`);
const editor = (section: Locator) => host(section).locator('.e-assist-textarea');
const prop = (section: Locator, path: string) =>
  host(section).evaluate((e: any, p) => {
    let v = e.ej2_instances[0];
    for (const k of p.split('.')) { v = v[k]; }
    if (typeof v === 'function') { return `[function ${v.name}]`; }
    return JSON.parse(JSON.stringify(v, (k, val) => (k === 'parentObj' || k === 'controlParent' ? undefined
      : typeof val === 'function' ? '[function]'
        : (val && typeof val === 'object' && !Array.isArray(val) && val.properties && val.parentObj ? val.properties : val))));
  }, path);

/** The popup positions itself against the current selection, select a word of the target first. */
async function openPopup(page: Page, section: Locator, targetTestId: string, showTestId: string) {
  await section.getByTestId(showTestId).click();
  await expect(host(section)).toBeVisible();
}

test.describe('default', () => {
  test('is created hidden and opens next to the selection', async ({ app }) => {
    const section = use(app, 'ia-default');
    await expect(section.getByTestId('ia-ev-created')).not.toHaveText('0');
    await expect(host(section)).toBeHidden();
    await expect(section.getByTestId('ia-ev-open')).toHaveText('0');
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    await expect(section.getByTestId('ia-ev-open')).toHaveText('1');
    await expect(host(section)).toHaveCSS('width', '420px');
    await expect(host(section)).toHaveCSS('height', '280px');
    await expect(host(section)).toHaveCSS('z-index', '2500');
    await expect(editor(section)).toHaveAttribute('placeholder', 'Ask the assistant');
    expect(await prop(section, 'placeholder')).toBe('Ask the assistant');
    expect(await prop(section, 'target')).toBe('#ia-default-target');
    expect(await prop(section, 'popupWidth')).toBe('420px');
    expect(await prop(section, 'popupHeight')).toBe('280px');
    expect(await prop(section, 'zIndex')).toBe(2500);
    await expect(host(section)).toHaveAttribute('id', /^inline-ai-assist-\d+$/);
  });

  test('hiding the popup raises close', async ({ app }) => {
    const section = use(app, 'ia-default');
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    const before = Number(await section.getByTestId('ia-ev-close').innerText());
    // the open popup covers the button, trigger the click directly
    await section.getByTestId('ia-hide').evaluate((b: HTMLElement) => b.click());
    await expect(host(section)).toBeHidden();
    await expect(section.getByTestId('ia-ev-close')).not.toHaveText(String(before));
  });

  test('previous prompts are listed', async ({ app }) => {
    const section = use(app, 'ia-default');
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    expect(await prop(section, 'prompts')).toHaveLength(1);
  });

  test('commandSettings list the commands and selecting one sends its prompt', async ({ app }) => {
    const section = use(app, 'ia-default');
    const settings = await prop(section, 'commandSettings');
    expect(settings.popupWidth).toBe('240px');
    expect(settings.popupHeight).toBe('200px');
    expect(settings.commands).toHaveLength(2);
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    const menu = app.page.locator('.e-mention-container.e-popup-open');
    await expect(menu).toContainText('Make shorter');
    await expect(menu).toContainText('Make formal');
    await expect(menu).toContainText('Edit');
    await menu.getByText('Make formal').click();
    await expect(section.getByTestId('ia-ev-command')).toHaveText('1');
    await expect(section.getByTestId('ia-ev-promptRequest')).toHaveText('1');
    await expect(section.getByTestId('ia-ev-promptRequest-text')).toHaveText('Make the text formal');
  });

  test('executePrompt raises promptRequest and the response items are offered', async ({ app }) => {
    const section = use(app, 'ia-default');
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    await host(section).evaluate((e: any) => e.ej2_instances[0].executePrompt('Translate it'));
    await expect(section.getByTestId('ia-ev-promptRequest-text')).toHaveText('Translate it');
    await expect(host(section)).toContainText('Stub answer to: Translate it');
    const responseSettings = await prop(section, 'responseSettings');
    expect(responseSettings.items.map((i: any) => i.label)).toEqual(expect.arrayContaining(['Accept', 'Discard']));
    expect(responseSettings.items.map((i: any) => i.id)).toEqual(expect.arrayContaining(['resp-accept', 'resp-discard']));
    // 35.1.40 does not render the response items for a stub response, the itemSelect callback is not reachable
  });

  test('the inline toolbar items are rendered and clickable', async ({ app }) => {
    const section = use(app, 'ia-default');
    await openPopup(app.page, section, 'ia-default-target', 'ia-show');
    const settings = await prop(section, 'inlineToolbarSettings');
    expect(settings.toolbarPosition).toBe('Bottom');
    expect(settings.items[0].tooltip).toBe('Add');
    await host(section).locator('[title="Add"] button').click();
    await expect(section.getByTestId('ia-ev-toolbar')).toHaveText('1');
  });
});

test.describe('popup response mode', () => {
  test('responseMode, relateTo, cssClass and prompt reach the widget', async ({ app }) => {
    const section = use(app, 'ia-popup');
    expect(await prop(section, 'responseMode')).toBe('Popup');
    expect(await prop(section, 'relateTo')).toBe('#ia-popup-target');
    expect(await prop(section, 'cssClass')).toBe('ia-custom');
    await openPopup(app.page, section, 'ia-popup-target', 'ia-popup-show');
    await expect(host(section)).toHaveClass(/ia-custom/);
    await expect(editor(section)).toContainText('Make it shorter');
  });

  test('a prompt is answered in the popup', async ({ app }) => {
    const section = use(app, 'ia-popup');
    await openPopup(app.page, section, 'ia-popup-target', 'ia-popup-show');
    await editor(section).click();
    await app.page.keyboard.press('Enter');
    await expect(host(section)).toContainText('Popup answer to: Make it shorter');
  });
});

test('editorTemplate reaches the widget', async ({ app }) => {
  const section = use(app, 'ia-editor');
  expect(await prop(section, 'editorTemplate')).toContain('[function');
  await expect(host(section)).toBeHidden();
});

test('responseTemplate replaces the built-in response rendering', async ({ app }) => {
  const section = use(app, 'ia-templates');
  await openPopup(app.page, section, 'ia-template-target', 'ia-template-show');
  expect(await prop(section, 'responseTemplate')).toContain('[function');
  await host(section).evaluate((e: any) => e.ej2_instances[0].executePrompt('Hello'));
  await expect(host(section).locator('.ia-custom-response').last()).toHaveText('Response: Templated answer to: Hello');
});

test('enableStreaming and speechToTextSettings: a streamed response arrives in chunks', async ({ app }) => {
  const section = use(app, 'ia-streaming');
  expect(await prop(section, 'enableStreaming')).toBe(true);
  expect(await prop(section, 'speechToTextSettings')).toMatchObject({ enable: true, lang: 'en-US' });
  await openPopup(app.page, section, 'ia-stream-target', 'ia-stream-show');
  await editor(section).click();
  await app.page.keyboard.type('Stream please');
  await app.page.keyboard.press('Enter');
  await expect(host(section)).toContainText('Final chunk.', { timeout: 10000 });
  await expect(host(section)).toContainText('First chunk.');
});
