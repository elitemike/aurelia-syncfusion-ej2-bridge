import { test, expect } from './fixtures';

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
