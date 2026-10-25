import { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { containerPropertyGroups } from './documentEditorContainerProps.data';

test.beforeEach(async ({ app }) => app.open('documentEditorContainer'));

const TAG = 'ej2-document-editor-container';
const widget = (page: Page, id: string, expr: string) => page.evaluate(([i, e]) => {
  const el: any = document.querySelector(`[data-testid="${i}"]`);
  return new Function('w', `return ${e};`)(el.au['ej2-document-editor-container'].viewModel.widget);
}, [id, expr]);
const evCount = (page: Page, name: string) => page.evaluate((n) => ((window as any).__docEvents?.[n]?.count) || 0, name);
const evt = (page: Page, name: string, min = 1) =>
  expect.poll(() => evCount(page, name), { message: `event ${name}`, timeout: 15_000 }).toBeGreaterThanOrEqual(min);
const evArg = (page: Page, name: string, path: string) => page.evaluate(([n, p]) => {
  const rec = (window as any).__docEvents?.[n];
  return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
}, [name, path]);

const DC = 'dc-main';
const loaded = async (app: any, page: Page) => {
  await app.section(DC).getByTestId('dc-load').click();
  await expect.poll(() => widget(page, DC, "w.documentEditor.serialize().includes('Hello Document Editor')"), { timeout: 30_000 }).toBe(true);
};

test.describe('bound properties reach the widget', () => {
  for (const group of containerPropertyGroups) {
    test(`${group.id}: ${group.props.length} properties`, async ({ app, page }) => {
      await app.section(group.id).scrollIntoViewIfNeeded();
      await expect(app.section(group.id).locator('.e-documenteditorcontainer')).toBeVisible();
      await expect.poll(async () => {
        const actual = await page.evaluate(([id, exprs]) => {
          const el: any = document.querySelector(`[data-testid="${id}"]`);
          const w = el.au['ej2-document-editor-container'].viewModel.widget;
          return (exprs as string[]).map(e => { try { return new Function('w', `return ${e};`)(w); } catch (err) { return `ERR ${err}`; } });
        }, [group.id, group.checks.map(c => c[0])] as [string, string[]]);
        return group.checks.map(([expr, expected], i) => JSON.stringify(actual[i]) === JSON.stringify(expected) ? null : `${expr}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual[i])}`).filter(Boolean);
      }, { timeout: 15_000 }).toEqual([]);
    });
  }
});

test.describe('container', () => {
  test('renders the toolbar, the editor and the properties pane', async ({ app }) => {
    const section = app.section(DC);
    await expect(section.locator('.e-documenteditorcontainer')).toBeVisible();
    await expect(section.locator('.e-de-ctnr-toolbar')).toBeVisible();
    await expect(section.locator('.e-documenteditor').first()).toBeVisible();
    await expect(section.locator('.e-de-tool-ctnr-properties-pane')).toBeVisible();
  });

  test('enableToolbar and showPropertiesPane update from the model', async ({ app, page }) => {
    const section = app.section(DC);
    await section.getByTestId('dc-toggle-pane').click();
    await expect.poll(() => widget(page, DC, 'w.showPropertiesPane')).toBe(false);
    // the container mirrors the property into its internal showPane flag from onPropertyChanged
    await expect.poll(() => widget(page, DC, 'w.showPane')).toBe(false);
    await section.getByTestId('dc-toggle-pane').click();
    await expect.poll(() => widget(page, DC, 'w.showPane')).toBe(true);
    await section.getByTestId('dc-toggle-toolbar').click();
    await expect.poll(() => widget(page, DC, 'w.enableToolbar')).toBe(false);
  });

  test('restrictEditing and enableTrackChanges update from the model', async ({ app, page }) => {
    const section = app.section(DC);
    await section.getByTestId('dc-toggle-restrict').click();
    await expect.poll(() => widget(page, DC, 'w.restrictEditing')).toBe(true);
    await expect.poll(() => widget(page, DC, 'w.documentEditor.isReadOnly')).toBe(true);
    await section.getByTestId('dc-toggle-track').click();
    await expect.poll(() => widget(page, DC, 'w.enableTrackChanges')).toBe(true);
    await expect.poll(() => widget(page, DC, 'w.documentEditor.enableTrackChanges')).toBe(true);
  });

  test('created, documentChange and selectionChange are raised on startup and open', async ({ app, page }) => {
    await evt(page, 'dc.created');
    await loaded(app, page);
    await evt(page, 'dc.documentChange');
    await evt(page, 'dc.selectionChange');
  });

  test('editing raises contentChange', async ({ app, page }) => {
    await loaded(app, page);
    const before = await evCount(page, 'dc.contentChange');
    await widget(page, DC, "w.documentEditor.editor.insertText('XYZ')");
    await evt(page, 'dc.contentChange', before + 1);
    expect(await widget(page, DC, "w.documentEditor.serialize().includes('XYZ')")).toBe(true);
  });

  test('custom toolbar item raises toolbarClick', async ({ app, page }) => {
    await loaded(app, page);
    await app.section(DC).locator('.e-de-ctnr-toolbar [id$="demo_custom"], .e-de-ctnr-toolbar .e-toolbar-item', { hasText: 'Custom' }).first().click();
    await evt(page, 'dc.toolbarClick');
    expect(await evArg(page, 'dc.toolbarClick', 'detail.item.id')).toContain('demo_custom');
  });

  test('comments raise beforeCommentAction', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, DC, 'w.documentEditor.selection.selectAll()');
    await widget(page, DC, "w.documentEditor.editor.insertComment('a note')");
    await evt(page, 'dc.beforeCommentAction');
  });

  test('revisions raise beforeAcceptRejectChanges', async ({ app, page }) => {
    await loaded(app, page);
    await widget(page, DC, 'w.documentEditor.enableTrackChanges = true');
    await widget(page, DC, "w.documentEditor.editor.insertText('tracked')");
    await widget(page, DC, 'w.documentEditor.revisions.acceptAll()');
    await evt(page, 'dc.beforeAcceptRejectChanges');
  });

  test('custom context menu raises customContextMenuBeforeOpen and customContextMenuSelect', async ({ app, page }) => {
    await loaded(app, page);
    const box = await app.section(DC).locator('[id$="_editor_viewerContainer"], .e-de-ctnr-properties-pane ~ * [id$="_viewerContainer"], [id$="_viewerContainer"]').first().boundingBox();
    await widget(page, DC, 'w.documentEditor.contextMenu.addCustomMenu([{ text: "Custom item", id: "custom_item" }], false)');
    await page.mouse.click(box.x + 300, box.y + 130, { button: 'right' });
    await evt(page, 'dc.customContextMenuBeforeOpen');
    await page.locator('li[id$="custom_item"]').first().dispatchEvent('click');
    await evt(page, 'dc.customContextMenuSelect');
  });

});

test.describe('ribbon mode', () => {
  test('toolbarMode Ribbon renders a ribbon instead of the toolbar', async ({ app }) => {
    const section = app.section('dc-ribbon');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.e-ribbon').first()).toBeVisible();
    await expect(section.locator('.e-de-ctnr-toolbar')).toHaveCount(0);
  });
});
