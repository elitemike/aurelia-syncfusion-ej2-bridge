import * as http from 'http';
import { AddressInfo } from 'net';
import { test, expect } from './fixtures';

/**
 * Upload progress events are only produced by real network requests, a fulfilled route never raises them.
 * Forward the demo upload url to a tiny local server instead (answers CORS, optionally slowly).
 */
async function forwardToRealServer(page, urlGlob: string, delayMs = 0) {
  const server = http.createServer((req, res) => {
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'content-type': 'application/json' };
    if (req.method === 'OPTIONS') { res.writeHead(204, headers); res.end(); return; }
    req.on('data', () => { /* drain */ });
    req.on('end', () => setTimeout(() => { res.writeHead(200, headers); res.end(JSON.stringify({ id: 'srv' })); }, delayMs));
  });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/upload`;
  await page.route(urlGlob, route => route.continue({ url }));
  return () => new Promise(r => server.close(r));
}

const txt = (name: string, body = 'hello') => ({ name, mimeType: 'text/plain', buffer: Buffer.from(body) });

test.beforeEach(async ({ app }) => app.open('uploader'));

test('uploads a file and adds it to e-files', async ({ app }) => {
  const section = app.section('up-multiple');
  await section.locator('input[type=file]').setInputFiles(txt('notes.txt'));
  await expect(section.locator('.e-upload-file-list')).toHaveCount(1);
  await expect(section.locator('.e-file-status')).toHaveText('File uploaded successfully');
  await expect(section.getByTestId('up-multiple-count')).toHaveText('1');
  await expect(section.getByTestId('up-multiple-list')).toHaveText('notes');
});

test('multiple files', async ({ app }) => {
  const section = app.section('up-multiple');
  await section.locator('input[type=file]').setInputFiles([txt('a.txt'), txt('b.txt')]);
  await expect(section.getByTestId('up-multiple-count')).toHaveText('2');
});

test('removing an uploaded file updates e-files', async ({ app }) => {
  const section = app.section('up-multiple');
  await section.locator('input[type=file]').setInputFiles(txt('notes.txt'));
  await expect(section.getByTestId('up-multiple-count')).toHaveText('1');
  await section.locator('.e-file-remove-btn, .e-file-delete-btn').first().click();
  await expect(section.getByTestId('up-multiple-count')).toHaveText('0');
  await expect(section.locator('.e-upload-file-list')).toHaveCount(0);
});

test('preloaded files are listed and removable with events', async ({ app }) => {
  const section = app.section('up-existing');
  await expect(section.locator('.e-upload-file-list')).toHaveCount(1);
  await expect(section.locator('.e-file-name')).toHaveText('existing');
  await section.locator('.e-file-remove-btn, .e-file-delete-btn').first().click();
  await expect(section.getByTestId('up-existing-count')).toHaveText('0');
  await expect(section.getByTestId('up-removing-events')).toHaveText('1');
  await expect(section.getByTestId('up-removed-events')).toHaveText('1');
});

test('on-uploaded event', async ({ app }) => {
  const section = app.section('up-events');
  await section.locator('input[type=file]').setInputFiles(txt('evt.txt'));
  await expect(section.getByTestId('up-uploaded-events')).toHaveText('1');
});

test('validation rejects disallowed extension and oversize files', async ({ app }) => {
  const section = app.section('up-restricted');
  await section.locator('input[type=file]').setInputFiles({ name: 'img.png', mimeType: 'image/png', buffer: Buffer.from('x') });
  await expect(section.locator('.e-file-invalid-name, .e-validation-fails').first()).toBeAttached();
  await section.locator('input[type=file]').setInputFiles(txt('big.txt', 'x'.repeat(5000)));
  await expect(section.locator('.e-validation-fails').first()).toBeAttached();
});

/** Evaluate an expression against the Syncfusion widget behind an ej2-uploader. */
const widgetValue = (page, testId: string, expr: string) => page.evaluate(([id, e]) => {
  const el: any = document.querySelector(`[data-testid="${id}"]`);
  const w = el.au['ej2-uploader'].viewModel.widget;
  return new Function('w', `return ${e}`)(w);
}, [testId, expr]);

const logHas = (loc, name: string, n = 1) => expect(loc).toHaveText(new RegExp(`(^|\\s)${name}:([${n}-9]|\\d{2,})(\\s|$)`));

test('properties: cssClass, buttons, htmlAttributes, dropEffect, dropArea, sanitizer, multiple, sequential', async ({ app, page }) => {
  const section = app.section('up-props');
  const host = section.locator('.e-upload');
  await expect(host).toHaveClass(/custom-up/);
  await expect(section.locator('input[type=file]')).toHaveAttribute('data-x', 'y');
  await expect(section.locator('.e-file-select-wrap button')).toHaveText('Pick');
  expect(await widgetValue(page, 'up-props', 'w.dropEffect')).toBe('Copy');
  expect(await widgetValue(page, 'up-props', 'w.dropArea')).toBe('#up-dropzone');
  // dragging over the configured drop area highlights it
  await page.evaluate(() => {
    const zone = document.getElementById('up-dropzone');
    const dt = new DataTransfer();
    dt.items.add(new File(['abc'], 'drag.txt', { type: 'text/plain' }));
    zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }));
  });
  await expect(page.locator('#up-dropzone')).toHaveClass(/e-upload-drag-hover/);
  // dropping on it selects the file
  await page.evaluate(() => {
    const zone = document.getElementById('up-dropzone');
    const dt = new DataTransfer();
    dt.items.add(new File(['abc'], 'drag.txt', { type: 'text/plain' }));
    zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
  });
  await expect(section.locator('.e-upload-file-list')).toHaveCount(1);
  expect(await widgetValue(page, 'up-props', 'w.enableHtmlSanitizer')).toBe(true);
  expect(await widgetValue(page, 'up-props', 'w.multiple')).toBe(true);
  expect(await widgetValue(page, 'up-props', 'w.sequentialUpload')).toBe(true);
  expect(await widgetValue(page, 'up-props', 'w.autoUpload')).toBe(false);
  expect(await widgetValue(page, 'up-props', 'w.asyncSettings.saveUrl')).toBe('/api/file/upload/test');
});

test('properties: autoUpload off, custom buttons and showFileList', async ({ app, page }) => {
  const section = app.section('up-props');
  await section.locator('input[type=file]').setInputFiles(txt('t.txt', 'abcd'));
  await expect(section.locator('.e-upload-actions .e-file-upload-btn')).toHaveText('Send');
  await expect(section.locator('.e-upload-actions .e-file-clear-btn')).toHaveText('Wipe');
  await expect(section.locator('.e-file-status')).not.toHaveText('File uploaded successfully');
  await expect(section.locator('.e-upload-file-list')).toHaveCount(1);
  await section.getByRole('button', { name: 'Toggle file list' }).click();
  await expect.poll(() => widgetValue(page, 'up-props', 'w.showFileList')).toBe(false);
  await section.locator('input[type=file]').setInputFiles(txt('hidden.txt', 'abcd'));
  await expect(section.locator('.e-upload-file-list')).toHaveCount(1);
  await expect(section.locator('.e-upload-file-list', { hasText: 'hidden' })).toHaveCount(0);
});

test('properties: min size, max size (model to view) and allowed extensions', async ({ app, page }) => {
  const section = app.section('up-props');
  const input = section.locator('input[type=file]');
  await input.setInputFiles(txt('small.txt', 'x'));
  await expect(section.locator('.e-validation-fails')).toHaveCount(1);
  await expect(section.locator('.e-file-status').last()).toContainText('too small');
  await input.setInputFiles({ name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('abcdef') });
  await expect(section.locator('.e-file-status').last()).toContainText('not allowed');
  await input.setInputFiles(txt('big.txt', 'x'.repeat(2000)));
  await expect(section.locator('.e-file-status').last()).toContainText('too large');
  await section.getByRole('button', { name: 'Set max size' }).click();
  await expect.poll(() => widgetValue(page, 'up-props', 'w.maxFileSize')).toBe(5000);
  await input.setInputFiles(txt('big.txt', 'x'.repeat(2000)));
  await expect(section.locator('.e-validation-fails')).toHaveCount(0);
});

test('properties: enabled toggles from the view-model', async ({ app, page }) => {
  const section = app.section('up-props');
  await expect(section.locator('.e-upload')).not.toHaveClass(/e-disabled/);
  await section.getByRole('button', { name: 'Toggle enabled' }).click();
  await expect.poll(() => widgetValue(page, 'up-props', 'w.enabled')).toBe(false);
  await expect(section.locator('.e-upload')).toHaveClass(/e-disabled/);
  await section.getByRole('button', { name: 'Toggle enabled' }).click();
  await expect(section.locator('.e-upload')).not.toHaveClass(/e-disabled/);
});

test('properties: directoryUpload and template', async ({ app, page }) => {
  await expect(app.section('up-dir').locator('input[type=file]')).toHaveAttribute('webkitdirectory', 'true');
  expect(await widgetValue(page, 'up-dir', 'w.directoryUpload')).toBe(true);
  const section = app.section('up-dir');
  await section.locator('input[type=file]').setInputFiles('dev-app/demo-resources');
  await expect(section.locator('.tpl-file .tpl-name').first()).toContainText('date-iso-value-converter.ts');
});

test('events: created, selected, rendering, upload, progress, change, success, actionComplete, remove, clear', async ({ app, page }) => {
  const close = await forwardToRealServer(page, '**/api/file/upload/test/slow');
  const section = app.section('up-evlog');
  const log = section.getByTestId('up-log');
  await logHas(log, 'created');
  await section.locator('input[type=file]').setInputFiles(txt('e1.txt', 'x'.repeat(25)));
  await logHas(log, 'selected');
  await logHas(log, 'rendering');
  await logHas(log, 'fileListRendering');
  await section.locator('.e-upload-actions .e-file-upload-btn').click();
  await logHas(log, 'beforeUpload');
  await logHas(log, 'uploading');
  await logHas(log, 'chunkUploading', 2);
  await logHas(log, 'chunkSuccess', 3);
  await logHas(log, 'success');
  await logHas(log, 'actionComplete');
  await logHas(log, 'change');
  await section.locator('.e-file-remove-btn, .e-file-delete-btn').first().click();
  await logHas(log, 'beforeRemove');
  await logHas(log, 'removing');
  await section.locator('input[type=file]').setInputFiles(txt('e2.txt', 'abc'));
  await expect(section.locator('.e-upload-actions .e-file-clear-btn')).toBeVisible();
  await section.locator('.e-upload-actions .e-file-clear-btn').click();
  await logHas(log, 'clearing');
  await close();
});

test('events: progress while a file uploads', async ({ app, page }) => {
  const close = await forwardToRealServer(page, '**/api/file/upload/test', 100);
  const section = app.section('up-multiple');
  await section.locator('input[type=file]').setInputFiles(txt('p.txt', 'x'.repeat(200000)));
  await logHas(app.section('up-evlog').getByTestId('up-log'), 'progress');
  await expect(section.getByTestId('up-multiple-count')).toHaveText('1');
  await close();
});

test('events: pausing, resuming and canceling a chunked upload', async ({ app, page }) => {
  const close = await forwardToRealServer(page, '**/api/file/upload/test/slow', 400);
  const section = app.section('up-evlog');
  const log = section.getByTestId('up-log');
  await section.locator('input[type=file]').setInputFiles(txt('slow.txt', 'x'.repeat(100)));
  await section.locator('.e-upload-actions .e-file-upload-btn').click();
  await logHas(log, 'chunkUploading');
  await section.locator('.e-file-pause-btn').click();
  await logHas(log, 'pausing');
  await section.locator('.e-file-play-btn').click();
  await logHas(log, 'resuming');
  await section.locator('.e-file-abort-btn').click();
  await logHas(log, 'canceling');
  await close();
});

test('events: failure and chunkFailure when the server rejects', async ({ app, page }) => {
  await page.route('**/api/file/upload/test/fail', route => route.fulfill({ status: 500, body: 'no' }));
  const section = app.section('up-fail');
  await section.locator('input[type=file]').setInputFiles(txt('f.txt', 'x'.repeat(25)));
  await logHas(section.getByTestId('up-fail-log'), 'chunkFailure');
  await logHas(section.getByTestId('up-fail-log'), 'failure');
  // the browser logs the rejected request itself, that is the expected outcome here
  app.errors.length = 0;
});
