import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { documentLoaded, evArg, evCount, expectEvent, expectViewer, getVm, textLayerReady, viewerValue } from './pdfViewerHelpers';

const MAIN = 'pv-main';

test.beforeEach(async ({ app }) => app.open('pdfViewer'));

const evt = (page: Page, name: string, min = 1) => expectEvent(page, `main.${name}`, min);

/** Screen position of a point given in PDF points (origin bottom left) on page `n`. */
const pagePoint = async (app: any, n = 0) => {
  const box = await app.section(MAIN).locator('.e-pv-page-div').nth(n).boundingBox();
  const s = box.width / 612;
  return (ptx: number, pty: number): [number, number] => [box.x + ptx * s, box.y + (792 - pty) * s];
};

test.describe('main viewer', () => {
  test('renders the toolbar and the document pages', async ({ app, page }) => {
    const section = app.section(MAIN);
    await documentLoaded(page, MAIN);
    await expect(section.locator('.e-pv-toolbar')).toBeVisible();
    await expect(section.locator('.e-pv-page-div').first()).toBeVisible();
    await expect(section.locator('[id$="_totalPage"]')).toContainText('3');
  });

  test('pageCount is read back from the widget (from-view)', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await expect(app.section(MAIN).getByTestId('pv-count-out')).toHaveText('3');
    expect(await getVm(page, MAIN, 'pageCount')).toBe(3);
  });

  test('currentPageNumber is two-way: model to view and view to model', async ({ app, page }) => {
    const section = app.section(MAIN);
    await documentLoaded(page, MAIN);
    await section.getByTestId('pv-goto3').click();
    await expectViewer(page, MAIN, 'w.currentPageNumber', 3);
    await expect(section.locator('[id$="_currentPageInput"]')).toHaveValue('3');
    await section.locator('[id$="_previousPage"]').click();
    await expect(section.getByTestId('pv-page-out')).toHaveText('2');
    expect(await getVm(page, MAIN, 'currentPage')).toBe(2);
    await section.getByTestId('pv-next').click();
    await expectViewer(page, MAIN, 'w.currentPageNumber', 3);
  });

  test('zoomValue is two-way: model to view and view to model', async ({ app, page }) => {
    const section = app.section(MAIN);
    await documentLoaded(page, MAIN);
    await section.getByTestId('pv-zoom150').click();
    await expectViewer(page, MAIN, 'w.zoomValue', 150);
    await section.locator('[id$="_zoomIn"]').click();
    await expect.poll(() => getVm(page, MAIN, 'zoom')).toBeGreaterThan(150);
    await expect(section.getByTestId('pv-zoom-out')).not.toHaveText('150');
  });

  test('enableToolbar toggles the toolbar', async ({ app, page }) => {
    const section = app.section(MAIN);
    await documentLoaded(page, MAIN);
    await section.getByTestId('pv-toggle-toolbar').click();
    await expectViewer(page, MAIN, 'w.enableToolbar', false);
    await expect(section.locator('.e-pv-toolbar')).toBeHidden();
    await section.getByTestId('pv-toggle-toolbar').click();
    await expect(section.locator('.e-pv-toolbar')).toBeVisible();
  });

  test('startup events: created, resourcesLoaded, documentLoad, page render, ajax success, extractTextCompleted', async ({ page }) => {
    for (const name of ['created', 'resourcesLoaded', 'documentLoad', 'pageRenderInitiate', 'pageRenderComplete', 'ajaxRequestSuccess', 'extractTextCompleted']) {
      await evt(page, name);
    }
    expect(await evArg(page, 'main.documentLoad', 'detail.documentName')).toBeTruthy();
  });

  test('navigation events: pageChange, zoomChange, toolbarClick', async ({ app, page }) => {
    const section = app.section(MAIN);
    await documentLoaded(page, MAIN);
    await section.locator('[id$="_nextPage"]').click();
    await evt(page, 'pageChange');
    expect(await evArg(page, 'main.pageChange', 'detail.currentPageNumber')).toBe(2);
    await section.locator('[id$="_zoomIn"]').click();
    await evt(page, 'zoomChange');
    expect(await evArg(page, 'main.zoomChange', 'detail.zoomValue')).toBeGreaterThan(100);
  });

  test('toolbarClick is raised for custom toolbar items', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await app.section(MAIN).locator('.e-pv-toolbar .e-toolbar-item', { hasText: 'Custom' }).click();
    await evt(page, 'toolbarClick');
    expect(await evArg(page, 'main.toolbarClick', 'detail.item.id')).toBe('demo_custom');
  });

  test('text search raises textSearchStart, textSearchHighlight and textSearchComplete', async ({ page }) => {
    await documentLoaded(page, MAIN);
    await viewerValue(page, MAIN, "w.textSearch.searchText('fox', false)");
    await evt(page, 'textSearchStart');
    await evt(page, 'textSearchHighlight');
    await viewerValue(page, MAIN, 'w.textSearch.searchNext(false)');
    await evt(page, 'textSearchHighlight', 2);
    await viewerValue(page, MAIN, "w.textSearch.searchText('zzzz-not-in-document', false)");
    await evt(page, 'textSearchComplete');
    expect(await evArg(page, 'main.textSearchComplete', 'detail.searchText')).toBe('zzzz-not-in-document');
  });

  test('page mouse events: pageMouseover, pageClick', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await textLayerReady(page, MAIN);
    const at = await pagePoint(app);
    const [x, y] = at(300, 650);
    await page.mouse.move(x - 5, y);
    await page.mouse.move(x, y);
    await evt(page, 'pageMouseover');
    await page.mouse.click(x, y);
    await evt(page, 'pageClick');
    expect(await evArg(page, 'main.pageClick', 'detail.pageNumber')).toBe(1);
  });

  test('hyperlink events: hyperlinkMouseOver and hyperlinkClick', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await textLayerReady(page, MAIN);
    const at = await pagePoint(app);
    const [x, y] = at(120, 625);
    await page.mouse.move(x - 40, y - 30);
    await page.mouse.move(x, y, { steps: 3 });
    await evt(page, 'hyperlinkMouseOver');
    await page.mouse.click(x, y);
    await evt(page, 'hyperlinkClick');
    expect(await evArg(page, 'main.hyperlinkClick', 'detail.hyperlink')).toContain('example.invalid');
  });

  test('selecting text raises textSelectionStart and textSelectionEnd', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await textLayerReady(page, MAIN);
    const at = await pagePoint(app);
    const [x1, y1] = at(74, 705);
    const [x2, y2] = at(250, 705);
    await page.mouse.move(x1, y1);
    await page.mouse.down();
    await page.mouse.move(x2, y2, { steps: 8 });
    await page.mouse.up();
    await evt(page, 'textSelectionStart');
    await evt(page, 'textSelectionEnd');
  });

  test('annotations: add, change, edit, remove raise their events and update isDocumentEdited', async ({ app, page }) => {
    await documentLoaded(page, MAIN);
    await viewerValue(page, MAIN, "w.annotation.addAnnotation('Rectangle', { offset: { x: 100, y: 100 }, pageNumber: 1, width: 100, height: 50 })");
    await evt(page, 'annotationAdd');
    await evt(page, 'annotationChanged');
    await expect(app.section(MAIN).getByTestId('pv-edited-out')).toHaveText('true');
    await viewerValue(page, MAIN, "(() => { const a = w.annotationCollection[0]; a.fillColor = '#00ff00'; w.annotation.editAnnotation(a); })()");
    await evt(page, 'annotationPropertiesChange');
    await viewerValue(page, MAIN, 'w.annotation.deleteAnnotationById(w.annotationCollection[0].annotationId)');
    await evt(page, 'annotationRemove');
  });

  test('form fields: add and update raise formFieldAdd, formFieldChanged, formFieldPropertiesChange', async ({ page }) => {
    await documentLoaded(page, MAIN);
    await viewerValue(page, MAIN, "w.formDesigner.addFormField('Textbox', { name: 'tb1', bounds: { X: 100, Y: 200, Width: 100, Height: 20 }, pageNumber: 1 })");
    await evt(page, 'formFieldAdd');
    await evt(page, 'formFieldChanged');
    await viewerValue(page, MAIN, "w.formDesigner.updateFormField(w.formFieldCollections[0], { backgroundColor: 'red' })");
    await evt(page, 'formFieldPropertiesChange');
  });

  test('unload and load raise documentUnload and documentLoad', async ({ page }) => {
    await documentLoaded(page, MAIN);
    const before = await evCount(page, 'main.documentLoad');
    await viewerValue(page, MAIN, 'w.unload()');
    await evt(page, 'documentUnload');
    await viewerValue(page, MAIN, 'w.load(w.documentPath, null)');
    await evt(page, 'documentLoad', before + 1);
  });
});
