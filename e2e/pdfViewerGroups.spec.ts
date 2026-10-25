import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { documentLoaded, evArg, expectEvent, expectViewer, setVm, viewerValue } from './pdfViewerHelpers';

test.beforeEach(async ({ app }) => app.open('pdfViewer'));

const evt = (page: Page, prefix: string, name: string, min = 1) => expectEvent(page, `${prefix}.${name}`, min);

test.describe('free text, comments and page organizer (main viewer)', () => {
  test('free text annotation raises beforeAddFreeText, commentAdd and annotationDoubleClick', async ({ app, page }) => {
    await documentLoaded(page, 'pv-main');
    const box = await app.section('pv-main').locator('.e-pv-page-div').first().boundingBox();
    await viewerValue(page, 'pv-main', "w.annotation.setAnnotationMode('FreeText')");
    await page.mouse.click(box.x + 300, box.y + 250);
    await page.keyboard.type('hello');
    await page.mouse.click(box.x + 600, box.y + 450);
    await evt(page, 'main', 'beforeAddFreeText');
    await evt(page, 'main', 'commentAdd');
    await page.mouse.dblclick(box.x + 320, box.y + 260);
    await evt(page, 'main', 'annotationDoubleClick');
  });

  test('selecting an annotation in the comment panel raises commentSelect', async ({ app, page }) => {
    await documentLoaded(page, 'pv-main');
    const box = await app.section('pv-main').locator('.e-pv-page-div').first().boundingBox();
    await viewerValue(page, 'pv-main', "w.annotation.addAnnotation('Rectangle', { offset: { x: 100, y: 300 }, pageNumber: 1, width: 150, height: 80, fillColor: '#ff8888' })");
    await setVm(page, 'pv-main', 'showToolbar', true);
    await viewerValue(page, 'pv-main', 'w.isCommandPanelOpen = true');
    await expect(page.locator('.e-pv-comment-panel').first()).toBeVisible();
    await page.mouse.click(box.x + 175, box.y + 340);
    await evt(page, 'main', 'commentSelect');
  });

  test('page organizer opens through isPageOrganizerOpen and lists the pages', async ({ page }) => {
    await documentLoaded(page, 'pv-main');
    await viewerValue(page, 'pv-main', 'w.isPageOrganizerOpen = true');
    await expect(page.locator('.e-pv-organize-tile')).toHaveCount(3);
    await page.locator('.e-pv-organize-tile').first().hover();
    await page.locator('.e-pv-delete-button').first().click();
    await expect(page.locator('.e-pv-organize-tile')).toHaveCount(2);
  });
});

test.describe('server mode (pv-server)', () => {
  test('load sends the request to serviceUrl and raises ajaxRequestInitiate', async ({ app, page }) => {
    const requests: string[] = [];
    await page.route('**/pdfviewer-service/**', route => {
      requests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await app.section('pv-server').scrollIntoViewIfNeeded();
    await expect(app.section('pv-server').locator('.e-pdfviewer')).toBeVisible();
    await viewerValue(page, 'pv-server', "w.load('some-document-id', null)");
    await evt(page, 'server', 'ajaxRequestInitiate');
    expect(requests.some(u => u.endsWith('/pdfviewer-service/api/PdfViewer/Load'))).toBe(true);
    expect(await evArg(page, 'server.ajaxRequestInitiate', 'detail.name')).toBe('ajaxRequestInitiate');
  });

  test('a failing service raises ajaxRequestFailed', async ({ app, page }) => {
    await page.route('**/pdfviewer-service/**', route => route.fulfill({ status: 500, contentType: 'text/plain', body: 'boom' }));
    await app.section('pv-server').scrollIntoViewIfNeeded();
    await expect(app.section('pv-server').locator('.e-pdfviewer')).toBeVisible();
    await viewerValue(page, 'pv-server', "w.load('some-document-id', null)");
    await evt(page, 'server', 'ajaxRequestFailed');
    // the browser reports the 500 of the stubbed service on the console, that is the expected failure
    await expect.poll(() => app.errors.length).toBeGreaterThan(0);
    expect(app.errors.every(e => e.includes('status of 500'))).toBe(true);
    app.errors.length = 0;
  });
});

test.describe('form fields (pv-forms)', () => {
  test('loaded form field raises formFieldMouseover, formFieldSelect and formFieldRemove', async ({ app, page }) => {
    await app.section('pv-forms').scrollIntoViewIfNeeded();
    await documentLoaded(page, 'pv-forms');
    await expect.poll(() => viewerValue(page, 'pv-forms', 'w.formFieldCollections.length')).toBeGreaterThan(0);
    await app.section('pv-forms').locator('.e-pv-page-div').first().evaluate(e => e.scrollIntoView({ block: 'start' }));
    const box = await app.section('pv-forms').locator('.e-pv-page-div').first().boundingBox();
    const px = (x: number, y: number): [number, number] => [box.x + x, box.y + y];
    await page.mouse.move(...px(50, 310));
    await page.mouse.move(...px(200, 370), { steps: 4 });
    await evt(page, 'forms', 'formFieldMouseover');
    await page.mouse.click(...px(200, 370));
    await evt(page, 'forms', 'formFieldSelect');
    await viewerValue(page, 'pv-forms', 'w.formDesigner.deleteFormField(w.formFieldCollections[0])');
    await evt(page, 'forms', 'formFieldRemove');
    await evt(page, 'forms', 'formFieldChanged');
  });

  test('adding and updating fields raises formFieldAdd and formFieldPropertiesChange', async ({ page }) => {
    await documentLoaded(page, 'pv-forms');
    await viewerValue(page, 'pv-forms', "w.formDesigner.addFormField('Textbox', { name: 'added', bounds: { X: 100, Y: 100, Width: 150, Height: 30 }, pageNumber: 2 })");
    await evt(page, 'forms', 'formFieldAdd');
    await viewerValue(page, 'pv-forms', "w.formDesigner.updateFormField(w.formFieldCollections.find(f => f.name === 'added'), { backgroundColor: 'red' })");
    await evt(page, 'forms', 'formFieldPropertiesChange');
  });
});

test.describe('model to widget updates', () => {
  test('feature flags update the widget and the UI', async ({ app, page }) => {
    await documentLoaded(page, 'pv-ui');
    await setVm(page, 'pv-ui', 'enableToolbar', false);
    await expectViewer(page, 'pv-ui', 'w.enableToolbar', false);
    await expect(app.section('pv-ui').locator('.e-pv-toolbar')).toBeHidden();
    await setVm(page, 'pv-ui', 'minZoom', 50);
    await expectViewer(page, 'pv-ui', 'w.minZoom', 50);
    await setVm(page, 'pv-ui', 'downloadFileName', 'changed.pdf');
    await expectViewer(page, 'pv-ui', 'w.downloadFileName', 'changed.pdf');
  });

  test('bound interactionMode is re-applied after the document loaded', async ({ page }) => {
    await documentLoaded(page, 'pv-ui');
    await expectViewer(page, 'pv-ui', 'w.interactionMode', 'Pan');
    await setVm(page, 'pv-ui', 'interactionMode', 'TextSelection');
    await expectViewer(page, 'pv-ui', 'w.interactionMode', 'TextSelection');
  });

  test('pv-ui shows the thumbnail pane (isThumbnailViewOpen) and fits the width (zoomMode)', async ({ app, page }) => {
    await documentLoaded(page, 'pv-ui');
    await expect(app.section('pv-ui').locator('.e-pv-thumbnail-view').first()).toBeVisible();
    await expectViewer(page, 'pv-ui', 'w.zoomMode', 'FitToWidth');
  });

  test('pv-off renders no toolbar and no sidebar', async ({ app, page }) => {
    await documentLoaded(page, 'pv-off');
    const section = app.section('pv-off');
    await expect(section.locator('.e-pv-toolbar')).toHaveCount(0);
    await expect(section.locator('.e-pv-thumbnail-view-button')).toHaveCount(0);
    await expect(section.locator('.e-pv-page-div').first()).toBeVisible();
  });

  test('pv-annot shows the annotation toolbar', async ({ app, page }) => {
    await documentLoaded(page, 'pv-annot');
    await expect(app.section('pv-annot').locator('[id$="_annotation_toolbar"], .e-pv-annotation-toolbar').first()).toBeAttached();
  });

  test('pv-forms shows the form designer toolbar', async ({ app, page }) => {
    await documentLoaded(page, 'pv-forms');
    await expect(app.section('pv-forms').locator('[id$="_formdesigner_toolbar"], .e-pv-formdesigner-toolbar').first()).toBeAttached();
  });
});
