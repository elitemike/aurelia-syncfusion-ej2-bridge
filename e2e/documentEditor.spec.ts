import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { editorPropertyGroups } from './documentEditorProps.data';

test.beforeEach(async ({ app }) => app.open('documentEditor'));

const TAG = 'ej2-document-editor';
const widget = (page: Page, id: string, expr: string) => page.evaluate(([i, e]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  return new Function('w', `return ${e};`)(el.au['ej2-document-editor'].viewModel.widget);
}, [id, expr]);
const setVm = (page: Page, id: string, prop: string, value: unknown) => page.evaluate(([i, p, v]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  el.au['ej2-document-editor'].viewModel.bindingContext[p as string] = v;
}, [id, prop, value] as any);
const getVm = (page: Page, id: string, prop: string) => page.evaluate(([i, p]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  return el.au['ej2-document-editor'].viewModel.bindingContext[p];
}, [id, prop]);
const evCount = (page: Page, name: string) => page.evaluate((n) => ((window as any).__docEvents?.[n]?.count) || 0, name);
const evt = (page: Page, name: string, min = 1) =>
  expect.poll(() => evCount(page, name), { message: `event ${name}`, timeout: 15_000 }).toBeGreaterThanOrEqual(min);
const evArg = (page: Page, name: string, path: string) => page.evaluate(([n, p]) => {
  const rec = (window as any).__docEvents?.[n];
  return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
}, [name, path]);
/** Load the sample SFDT document through the demo button and wait until it is laid out. */
const loaded = async (app: any, page: Page) => {
  await app.section('de-main').getByTestId('de-load').click();
  await expect.poll(() => widget(page, 'de-main', "w.serialize().includes('Hello Document Editor')"), { timeout: 20_000 }).toBe(true);
};

/** Position inside the editor viewer of the main editor. */
const viewerPoint = async (app: any) => {
  const box = await app.section('de-main').locator('[id$="_viewerContainer"]').first().boundingBox();
  return (x: number, y: number): [number, number] => [box.x + x, box.y + y];
};

test.describe('bound properties reach the widget', () => {
  for (const group of editorPropertyGroups) {
    test(`${group.id}: ${group.props.length} properties`, async ({ app, page }) => {
      await app.section(group.id).scrollIntoViewIfNeeded();
      await expect(app.section(group.id).locator('.e-documenteditor')).toBeVisible();
      await expect.poll(async () => {
        const actual = await page.evaluate(([id, exprs]) => {
          const el: any = document.querySelector(`[data-testid="${id}"]`);
          const w = el.au['ej2-document-editor'].viewModel.widget;
          return (exprs as string[]).map(e => { try { return new Function('w', `return ${e};`)(w); } catch (err) { return `ERR ${err}`; } });
        }, [group.id, group.checks.map(c => c[0])] as [string, string[]]);
        return group.checks.map(([expr, expected], i) => JSON.stringify(actual[i]) === JSON.stringify(expected) ? null : `${expr}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual[i])}`).filter(Boolean);
      }, { timeout: 15_000 }).toEqual([]);
    });
  }
});

test.describe('main editor', () => {
  test('renders the viewer with the loaded document', async ({ app, page }) => {
    await expect(app.section('de-main').locator('.e-documenteditor')).toBeVisible();
    await loaded(app, page);
    await expect.poll(() => widget(page, 'de-main', "w.serialize().includes('Hello Document Editor')"), { timeout: 20_000 }).toBe(true);
  });

  test('zoomFactor is two-way: model to view and view to model', async ({ app, page }) => {
    const section = app.section('de-main');
    await loaded(app, page);
    await section.getByTestId('de-zoom150').click();
    await expect.poll(() => widget(page, 'de-main', 'w.zoomFactor')).toBe(1.5);
    await widget(page, 'de-main', 'w.zoomFactor = 0.75');
    await expect(section.getByTestId('de-zoom-out')).toHaveText('0.75');
    expect(await getVm(page, 'de-main', 'zoom')).toBe(0.75);
  });

  test('documentName is two-way: written back when a document is opened', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, 'de-main', 'w.documentName = "Renamed"');
    expect(await widget(page, 'de-main', 'w.documentName')).toBe('Renamed');
    await setVm(page, 'de-main', 'name', 'From the model');
    await expect.poll(() => widget(page, 'de-main', 'w.documentName')).toBe('From the model');
    await expect(app.section('de-main').getByTestId('de-name-out')).toHaveText('From the model');
  });

  test('isReadOnly and enableTrackChanges update from the model', async ({ app, page }) => {
    const section = app.section('de-main');
    await section.getByTestId('de-toggle-readonly').click();
    await expect.poll(() => widget(page, 'de-main', 'w.isReadOnly')).toBe(true);
    await section.getByTestId('de-toggle-readonly').click();
    await expect.poll(() => widget(page, 'de-main', 'w.isReadOnly')).toBe(false);
    await section.getByTestId('de-toggle-track').click();
    await expect.poll(() => widget(page, 'de-main', 'w.enableTrackChanges')).toBe(true);
  });

  test('startup events: created, documentChange, selectionChange, searchResultsChange, beforePaneSwitch', async ({ page }) => {
    for (const name of ['created', 'documentChange', 'selectionChange', 'searchResultsChange', 'beforePaneSwitch']) {
      await evt(page, `main.${name}`);
    }
  });

  test('zoomFactorChange and viewChange are raised when the zoom changes', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, 'de-main', 'w.zoomFactor = 1.25');
    await evt(page, 'main.zoomFactorChange');
    await evt(page, 'main.viewChange');
  });

  test('typing raises keyDown, contentChange and selectionChange', async ({ app, page }) => {
    await loaded(app, page);
    const at = await viewerPoint(app);
    const before = await evCount(page, 'main.contentChange');
    await page.mouse.click(...at(300, 130));
    await page.keyboard.type('hi');
    await evt(page, 'main.keyDown');
    await evt(page, 'main.contentChange', before + 1);
    expect(await widget(page, 'de-main', 'w.serialize()')).toContain('hi');
  });

  test('comments raise commentBegin, commentEnd and beforeCommentAction', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, 'de-main', 'w.selection.selectAll()');
    await widget(page, 'de-main', 'w.editor.insertComment("a note")');
    await evt(page, 'main.commentBegin');
    await evt(page, 'main.commentEnd');
    await evt(page, 'main.beforeCommentAction');
  });

  test('revisions raise beforeAcceptRejectChanges', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, 'de-main', 'w.enableTrackChanges = true');
    await widget(page, 'de-main', 'w.editor.insertText("tracked")');
    await widget(page, 'de-main', 'w.revisions.acceptAll()');
    await evt(page, 'main.beforeAcceptRejectChanges');
  });

  test('custom context menu raises customContextMenuBeforeOpen and customContextMenuSelect', async ({ app, page }) => {
    await loaded(app, page);
    const at = await viewerPoint(app);
    await widget(page, 'de-main', 'w.contextMenu.addCustomMenu([{ text: "Custom item", id: "custom_item" }], false)');
    await page.mouse.click(...at(300, 130), { button: 'right' });
    await evt(page, 'main.customContextMenuBeforeOpen');
    await page.locator('li[id$="custom_item"]').first().dispatchEvent('click');
    await evt(page, 'main.customContextMenuSelect');
  });

  test('content controls raise contentControl', async ({ app, page }) => {
    await loaded(app, page);
    const at = await viewerPoint(app);
    await widget(page, 'de-main', 'w.selection.moveToDocumentStart()');
    await widget(page, 'de-main', 'w.editor.insertContentControl("RichText")');
    await page.mouse.click(...at(300, 130));
    await page.keyboard.type('zz');
    await evt(page, 'main.contentControl');
  });

  test('opening an invalid document raises documentLoadFailed', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, 'de-main', "w.open('not json')").catch(() => null);
    await evt(page, 'main.documentLoadFailed');
    // the editor reports the malformed document by throwing, that is the expected failure
    app.errors.length = 0;
  });
});
