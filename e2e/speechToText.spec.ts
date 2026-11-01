import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { widgetProp, widgetProps, onWidget } from './pickerHelpers';

/** The browser speech engine needs a microphone and a hosted service, replace it with a scripted one. */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const w: any = window;
    w.__srs = [];
    class FakeRecognition {
      lang = ''; interimResults = false; continuous = false;
      onstart: any; onend: any; onerror: any; onresult: any;
      constructor() { w.__srs.push(this); }
      start() { setTimeout(() => this.onstart && this.onstart({ type: 'start' }), 0); }
      stop() { setTimeout(() => this.onend && this.onend({ type: 'end' }), 0); }
      abort() { }
      emit(text: string, isFinal: boolean) {
        const result: any = [{ transcript: text }];
        result.isFinal = isFinal;
        this.onresult({ resultIndex: 0, results: [result] });
      }
      fail(error: string) { this.onerror({ error }); }
    }
    w.SpeechRecognition = FakeRecognition;
  });
});

/** Engines are created in the order of the demo sections: basic, lang, button, state. */
function emit(page: Page, index: number, text: string, isFinal: boolean) {
  return page.evaluate(([i, t, f]) => (<any>window).__srs[i as number].emit(t, f), [index, text, isFinal] as any);
}

test('clicking the button starts and stops listening', async ({ app }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  const button = section.locator('button.e-speech-to-text, button.e-btn').first();
  await expect(section.getByTestId('stt-created')).toHaveText('1');
  await expect(section.getByTestId('stt-state-out')).toHaveText('Inactive');
  await button.click();
  await expect(section.getByTestId('stt-starts')).toHaveText('1');
  await expect(section.getByTestId('stt-start-interacted')).toHaveText('true');
  await expect(section.getByTestId('stt-state-out')).toHaveText('Listening');
  await expect(button).toHaveClass(/e-listening-state/);
  await button.click();
  await expect(section.getByTestId('stt-stops')).toHaveText('1');
  await expect(section.getByTestId('stt-state-out')).toHaveText('Inactive');
  await expect(button).not.toHaveClass(/e-listening-state/);
});

test('transcriptChanged reports interim and final results and the transcript is two-way: view to model', async ({ app, page }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await section.locator('button.e-speech-to-text, button.e-btn').first().click();
  await expect(section.getByTestId('stt-state-out')).toHaveText('Listening');
  await emit(page, 0, 'hello', false);
  await expect(section.getByTestId('stt-transcript-out')).toHaveText('hello');
  await expect(section.getByTestId('stt-interim')).toHaveText('true');
  await emit(page, 0, 'hello world', true);
  await expect(section.getByTestId('stt-transcript-out')).toHaveText('hello world');
  await expect(section.getByTestId('stt-interim')).toHaveText('false');
  await expect(section.getByTestId('stt-transcript-events')).toHaveText('2');
  await expect(section.getByTestId('stt-text')).toHaveValue('hello world');
});

test('transcript is two-way: model to view', async ({ app, page }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await section.getByTestId('stt-transcript-set').click();
  await expect.poll(() => widgetProp(section.getByTestId('stt-basic'), 'transcript')).toBe('typed text');
  // new dictation continues from the transcript set by the model
  await section.locator('button.e-speech-to-text, button.e-btn').first().click();
  await expect(section.getByTestId('stt-state-out')).toHaveText('Listening');
  await expect(section.getByTestId('stt-transcript-out')).toHaveText('');
});

test('listeningState is two-way: model to view starts and stops the engine', async ({ app }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await section.getByTestId('stt-state-start').click();
  await expect(section.getByTestId('stt-starts')).toHaveText('1');
  await expect(section.getByTestId('stt-start-interacted')).not.toHaveText('true');
  await expect(section.locator('button.e-speech-to-text, button.e-btn').first()).toHaveClass(/e-listening-state/);
  await expect.poll(() => widgetProp(section.getByTestId('stt-basic'), 'listeningState')).toBe('Listening');
  await section.getByTestId('stt-state-stop').click();
  await expect(section.getByTestId('stt-stops')).toHaveText('1');
  await expect(section.getByTestId('stt-state-out')).toHaveText('Inactive');
});

test('startListening and stopListening API calls are not user interactions', async ({ app }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await section.getByTestId('stt-api-start').click();
  await expect(section.getByTestId('stt-starts')).toHaveText('1');
  await expect(section.getByTestId('stt-start-interacted')).toHaveText('false');
  await section.getByTestId('stt-api-stop').click();
  await expect(section.getByTestId('stt-stops')).toHaveText('1');
});

test('onStart can cancel listening and the state binding follows', async ({ app }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await section.getByTestId('stt-cancel').check();
  await section.locator('button.e-speech-to-text, button.e-btn').first().click();
  await expect(section.getByTestId('stt-starts')).toHaveText('1');
  await expect(section.getByTestId('stt-state-out')).toHaveText('Inactive');
  await expect(section.locator('button.e-speech-to-text, button.e-btn').first()).not.toHaveClass(/e-listening-state/);
  expect(await widgetProp(section.getByTestId('stt-basic'), 'listeningState')).toBe('Inactive');
});

test('onError reports engine errors', async ({ app, page }) => {
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await page.evaluate(() => (<any>window).__srs[0].fail('not-allowed'));
  await expect(section.getByTestId('stt-error')).toHaveText('not-allowed');
});

test('onError reports an unsupported browser', async ({ app, page }) => {
  await page.addInitScript(() => {
    delete (<any>window).SpeechRecognition;
    delete (<any>window).webkitSpeechRecognition;
  });
  await app.open('speechToText');
  const section = app.section('stt-basic');
  await expect(section.getByTestId('stt-created')).toHaveText('1');
  // raised while the widget renders, the demo records it
  await expect(section.getByTestId('stt-error')).toHaveText('unsupported-browser');
});

test('lang and allowInterimResults reach the recognition engine', async ({ app, page }) => {
  await app.open('speechToText');
  const section = app.section('stt-lang');
  const engine = () => page.evaluate(() => ({ lang: (<any>window).__srs[1].lang, interim: (<any>window).__srs[1].interimResults }));
  expect(await engine()).toEqual({ lang: 'en-US', interim: true });
  await section.getByTestId('stt-lang-change').click();
  await expect.poll(engine).toEqual({ lang: 'de-DE', interim: false });
  expect(await widgetProps(section.getByTestId('stt-lang'), ['lang', 'allowInterimResults'])).toEqual({ lang: 'de-DE', allowInterimResults: false });
});

test('buttonSettings, tooltipSettings and showTooltip', async ({ app, page }) => {
  await app.open('speechToText');
  const section = app.section('stt-button');
  const host = section.getByTestId('stt-button');
  const button = section.locator('button.e-speech-to-text, button.e-btn').first();
  await expect(button).toContainText('Speak');
  await expect(button).toHaveClass(/e-primary/);
  await expect(button.locator('.e-icon-left, .e-btn-icon').first()).toHaveClass(/e-icon-left/);
  await button.hover();
  await expect(page.locator('.e-speech-to-text-tooltip')).toContainText('Tap to talk');
  await button.click();
  await expect(button).toContainText('Halt');
  await button.click();
  await expect(button).toContainText('Speak');
  expect(await widgetProp(host, 'showTooltip')).toBe(true);
  await section.getByTestId('stt-button-change').click();
  await expect(button).toContainText('Talk');
  await expect(button).not.toHaveClass(/e-primary/);
  await expect(button.locator('.e-btn-icon').first()).toHaveClass(/e-icon-right/);
  await expect.poll(() => widgetProp(host, 'showTooltip')).toBe(false);
  await expect.poll(() => onWidget(host, w => w.tooltipSettings.position + '|' + w.tooltipSettings.content)).toBe('TopCenter|Click to talk');
  expect(await onWidget(host, w => w.buttonSettings.stopContent + '|' + w.buttonSettings.iconPosition + '|' + w.buttonSettings.isPrimary)).toBe('Quiet|Right|false');
});

test('disabled, cssClass, htmlAttributes, enableRtl and locale', async ({ app }) => {
  await app.open('speechToText');
  const section = app.section('stt-state');
  const host = section.getByTestId('stt-state');
  const button = section.locator('button.e-speech-to-text, button.e-btn').first();
  await expect(button).toBeDisabled();
  await expect(button).toHaveClass(/stt-custom/);
  await expect(button).toHaveAttribute('data-foo', 'bar');
  await expect(button).toHaveClass(/e-rtl/);
  expect(await widgetProp(host, 'locale')).toBe('en-US');
  await section.getByTestId('stt-state-change').click();
  await expect(button).toBeEnabled();
  await expect(button).toHaveClass(/stt-custom-two/);
  await expect(button).toHaveAttribute('data-foo', 'baz');
});
