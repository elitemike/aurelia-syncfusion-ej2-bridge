import { test, expect } from './fixtures';
import { setVm, widgetOf } from './pdfViewerHelpers';

const ID = 'pdfComparer-basic';
const cmp = (page: any, expr: string) => widgetOf(page, 'ej2-pdf-comparer', ID, expr);

test.beforeEach(async ({ app }) => app.open('pdfComparer'));

test.describe('pdf comparer', () => {
  test('compares the two bound documents side by side and lists the differences', async ({ app }) => {
    const section = app.section('pdfComparer-basic');
    await expect(section.locator('.e-pdfcomparer')).toBeVisible();
    await expect(section.locator('.e-pdfviewer')).toHaveCount(2, { timeout: 30_000 });
    await expect(section.locator('.e-pv-pdf-comparer-header-left')).toContainText('Original');
    await expect(section.locator('.e-pv-pdf-comparer-header-right')).toContainText('Modified');
    await expect(section.locator('.e-pv-difference-card').first()).toBeVisible({ timeout: 30_000 });
  });

  test('bound properties reach the widget', async ({ page }) => {
    await expect.poll(() => cmp(page, 'w.originalDocumentPath.startsWith("data:application/pdf")')).toBe(true);
    expect(await cmp(page, 'w.modifiedDocumentPath.startsWith("data:application/pdf")')).toBe(true);
    expect(await cmp(page, 'w.resourceUrl')).toMatch(/\/scripts\/ej2-pdfviewer-lib$/);
    expect(await cmp(page, 'w.enableDifferencePanel')).toBe(true);
    expect(await cmp(page, 'w.enableSyncScrolling')).toBe(true);
    expect(await cmp(page, 'w.height')).toBe('520px');
    expect(await cmp(page, 'w.width')).toBe('100%');
    expect(await cmp(page, 'w.comparisonOptions.beforeColor')).toBe('#ff0000');
    expect(await cmp(page, 'w.comparisonOptions.afterColorOpacity')).toBe(0.4);
    expect(await cmp(page, 'w.comparisonOptions.enableHighlights')).toBe(true);
  });

  test('enableDifferencePanel and enableSyncScrolling update from the model', async ({ app, page }) => {
    const section = app.section('pdfComparer-basic');
    await expect(section.locator('.e-pv-difference-card').first()).toBeVisible({ timeout: 30_000 });
    await section.getByTestId('pc-toggle-panel').click();
    await expect.poll(() => cmp(page, 'w.enableDifferencePanel')).toBe(false);
    await expect(section.locator('.e-pv-pdf-comparer-header-panel')).toBeHidden();
    await section.getByTestId('pc-toggle-panel').click();
    await expect(section.locator('.e-pv-pdf-comparer-header-panel')).toBeVisible();
    await section.getByTestId('pc-toggle-sync').click();
    await expect.poll(() => cmp(page, 'w.enableSyncScrolling')).toBe(false);
  });

  test('width, height and comparisonOptions update from the model', async ({ app, page }) => {
    const section = app.section('pdfComparer-basic');
    await expect(section.locator('.e-pdfcomparer')).toBeVisible();
    // resizing before both viewers exist makes the comparer's zoom sync read a viewer that is not there yet
    await expect(section.locator('.e-pdfviewer')).toHaveCount(2, { timeout: 30_000 });
    await expect(section.locator('.e-pv-difference-card').first()).toBeVisible({ timeout: 30_000 });
    await section.getByTestId('pc-narrow').click();
    await expect.poll(() => cmp(page, 'w.width')).toBe('700px');
    expect(await cmp(page, 'w.height')).toBe('400px');
    await expect.poll(async () => Math.round((await section.locator('.e-pdfcomparer').boundingBox()).height)).toBeLessThanOrEqual(405);
    await section.getByTestId('pc-recolor').click();
    await expect.poll(() => cmp(page, 'w.comparisonOptions.beforeColor')).toBe('#0000ff');
    expect(await cmp(page, 'w.comparisonOptions.enableHighlights')).toBe(false);
  });

  test('document paths can be swapped from the model', async ({ app, page }) => {
    // Syncfusion limitation, not the bridge: PdfComparer hands the new path to its inner viewer, which asks a server for it
    // and throws while drawing the resulting error popup, at some point after the swap. Any other error still fails the test.
    app.ignoreErrors(/reading 'appendChild'/);
    await expect(app.section('pdfComparer-basic').locator('.e-pdfviewer')).toHaveCount(2, { timeout: 30_000 });
    // swap the two distinct documents: comparing a document with an identical copy makes Syncfusion fall back to a server request
    const original = await cmp(page, 'w.originalDocumentPath');
    const modified = await cmp(page, 'w.modifiedDocumentPath');
    expect(original).not.toEqual(modified);
    await setVm(page, ID, 'originalDocumentPath', modified, 'ej2-pdf-comparer');
    await setVm(page, ID, 'modifiedDocumentPath', original, 'ej2-pdf-comparer');
    await expect.poll(() => cmp(page, 'w.originalDocumentPath')).toBe(modified);
    await expect.poll(() => cmp(page, 'w.modifiedDocumentPath')).toBe(original);
  });
});
