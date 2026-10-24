import { Page } from '@playwright/test';
import { test, expect } from './fixtures';

test.beforeEach(async ({ app }) => app.open('treeView'));

/** Reads a property of the Syncfusion widget behind a demo element (data-testid). */
function prop(page: Page, testId: string, name: string) {
  return page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-tree-view'].viewModel.widget[p];
  }, [testId, name]);
}

test('renders nodes and honours initial expansion', async ({ app }) => {
  const section = app.section('tv-select');
  await expect(section.locator('li[data-uid]', { hasText: 'Program Files' }).first()).toBeVisible();
  await expect(section.locator('li[data-uid]', { hasText: 'Personals' })).toBeHidden();
});

test('initial selectedNodes selects the node', async ({ app }) => {
  await expect(app.section('tv-select').locator('li.e-active')).toContainText('Users');
});

test('selectedNodes two-way: view to model and nodeSelected event', async ({ app }) => {
  const section = app.section('tv-select');
  await section.locator('.e-list-text', { hasText: 'Program Files' }).click({ force: true });
  await expect(section.getByTestId('tv-selected-out')).toHaveText('01-01');
  await expect(section.getByTestId('tv-last')).toHaveText('Program Files');
  await expect(section.getByTestId('tv-events')).not.toHaveText('0');
});

test('selectedNodes two-way: model to view', async ({ app }) => {
  const section = app.section('tv-select');
  await section.getByTestId('tv-select-program-files').click();
  await expect(section.locator('li.e-active').first()).toContainText('Program Files');
});

test('checkedNodes two-way', async ({ app }) => {
  const section = app.section('tv-check');
  await expect(section.getByTestId('tv-checked-out')).toHaveText('02-01');
  await section.locator('li[data-uid="01"] > .e-text-content .e-checkbox-wrapper').click();
  await expect(section.getByTestId('tv-checked-out')).toContainText('01-01,01-02'); // autoCheck cascades to the children
});

test('checkedNodes two-way: model to view', async ({ app, page }) => {
  const section = app.section('tv-check');
  await section.getByTestId('tv-check-set').click();
  await expect(section.locator('li[data-uid="01-01"] > .e-text-content .e-frame.e-check')).toBeVisible();
  await expect(section.locator('li[data-uid="01-02"] > .e-text-content .e-frame.e-check')).toBeVisible();
  await expect(section.locator('li[data-uid="02-01"] > .e-text-content .e-frame.e-check')).toHaveCount(0);
  await expect.poll(() => prop(page, 'tv-check', 'checkedNodes')).toEqual(expect.arrayContaining(['01-01', '01-02']));
});

test('expandedNodes two-way follows expand and collapse', async ({ app }) => {
  const section = app.section('tv-expand');
  await expect(section.getByTestId('tv-expanded-out')).toHaveText('01');
  await section.locator('li[data-uid="02"] > .e-text-content .e-icons').first().click();
  await expect(section.getByTestId('tv-expanded-out')).toContainText('02');
  await section.locator('li[data-uid="01"] > .e-text-content .e-icons').first().click();
  await expect(section.getByTestId('tv-expanded-out')).not.toContainText('01');
});

test('expandedNodes two-way: model to view', async ({ app }) => {
  const section = app.section('tv-expand');
  await expect(section.locator('li[data-uid="01"]')).toHaveAttribute('aria-expanded', 'true');
  await section.getByTestId('tv-collapse-all').click();
  await expect(section.locator('li[data-uid="01"]')).toHaveAttribute('aria-expanded', 'false');
});

test('descending sort and multi-selection with ctrl', async ({ app, page }) => {
  const section = app.section('tv-sort');
  await expect(section.locator('li[data-uid]').first()).toContainText('Local Disk (D:)');
  expect(await prop(page, 'tv-sort', 'sortOrder')).toBe('Descending');
  expect(await prop(page, 'tv-sort', 'allowMultiSelection')).toBe(true);
  await section.locator('.e-list-text', { hasText: 'Local Disk (D:)' }).click({ force: true });
  await page.keyboard.down('Control');
  await section.locator('.e-list-text', { hasText: 'Local Disk (C:)' }).click({ force: true });
  await page.keyboard.up('Control');
  await expect(section.locator('li.e-active')).toHaveCount(2);
});

test('lifecycle, selection, key, expand and check events', async ({ app, page }) => {
  const section = app.section('tv-events');
  const log = section.getByTestId('tv-tree-ev');
  await expect(log).toContainText('created,');
  await expect(log).toContainText('dataBound,');
  await expect(log).toContainText('drawNode,');
  await section.locator('.e-list-text', { hasText: 'Users' }).click({ force: true });
  await expect(log).toContainText('nodeSelecting,');
  await expect(log).toContainText('nodeClicked,');
  await page.keyboard.press('ArrowDown');
  await expect(log).toContainText('keyPress,');
  const diskD = section.locator('li[data-uid="02"] > .e-text-content');
  await diskD.locator('.e-icons').first().click();
  await expect(log).toContainText('nodeExpanding,');
  await expect(log).toContainText('nodeExpanded,');
  await diskD.locator('.e-icons').first().click();
  await expect(log).toContainText('nodeCollapsing,');
  await expect(log).toContainText('nodeCollapsed,');
  await diskD.locator('.e-checkbox-wrapper').click();
  await expect(log).toContainText('nodeChecking,');
  await expect(log).toContainText('nodeChecked,');
});

test('autoCheck, checkOnClick and checkDisabledChildren', async ({ app, page }) => {
  const section = app.section('tv-checkbehaviour');
  const out = section.getByTestId('tv-checkbehaviour-out');
  expect(await prop(page, 'tv-checkbehaviour', 'autoCheck')).toBe(false);
  expect(await prop(page, 'tv-checkbehaviour', 'checkOnClick')).toBe(true);
  expect(await prop(page, 'tv-checkbehaviour', 'checkDisabledChildren')).toBe(false);
  // checkOnClick: clicking the node text toggles its check box
  await section.locator('.e-list-text', { hasText: 'Users' }).click({ force: true });
  await expect(out).toHaveText('01-02');
  // autoCheck is off, so the children of Users stay unchecked
  await expect(section.locator('li[data-uid="01-02-01"] .e-frame.e-check')).toHaveCount(0);
  await section.locator('.e-list-text', { hasText: 'Users' }).click({ force: true });
  await expect(out).toHaveText('');
  // model to view: turning autoCheck on cascades from now on
  await section.getByTestId('tv-autocheck-btn').click();
  await expect.poll(() => prop(page, 'tv-checkbehaviour', 'autoCheck')).toBe(true);
  await section.locator('li[data-uid="01-02"] > .e-text-content .e-checkbox-wrapper').click();
  await expect(out).toContainText('01-02-01');
  await expect(out).toContainText('01-02-02');
  // disabled children are skipped unless checkDisabledChildren is set
  await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="tv-checkbehaviour"]') as any).au['ej2-tree-view'].viewModel.widget;
    w.uncheckAll();
    w.disableNodes(['01-02-02']);
  });
  await section.locator('li[data-uid="01-02"] > .e-text-content .e-checkbox-wrapper').click();
  await expect(out).toContainText('01-02-01');
  await expect(out).not.toContainText('01-02-02');
});

test('expandOn, loadOnDemand and animation', async ({ app, page }) => {
  const section = app.section('tv-expandbehaviour');
  expect(await prop(page, 'tv-expandbehaviour', 'expandOn')).toBe('Click');
  expect(await prop(page, 'tv-expandbehaviour', 'loadOnDemand')).toBe(false);
  expect(await page.evaluate(() => {
    const a = (document.querySelector('[data-testid="tv-expandbehaviour"]') as any).au['ej2-tree-view'].viewModel.widget.animation;
    return [a.expand.effect, a.collapse.effect, a.expand.duration];
  })).toEqual(['None', 'None', 0]);
  // loadOnDemand false renders the children of collapsed nodes up front
  await expect(section.locator('li[data-uid="02-01"]')).toBeAttached();
  await expect(section.locator('li[data-uid="02-01"]')).toBeHidden();
  // expandOn Click expands with a single click on the text
  await section.locator('.e-list-text', { hasText: 'Local Disk (D:)' }).click({ force: true });
  await expect(section.locator('li[data-uid="02"]')).toHaveAttribute('aria-expanded', 'true');
  await expect(section.locator('li[data-uid="02-01"]')).toBeVisible();
});

test('appearance properties reach the widget and follow the view-model', async ({ app, page }) => {
  const section = app.section('tv-appearance');
  const tree = section.locator('.e-treeview');
  await expect(tree).toHaveClass(/tv-custom-class/);
  await expect.poll(async () => (await tree.boundingBox()).height).toBeCloseTo(160, 0);
  await expect(tree).toHaveClass(/e-text-wrap/);
  await expect(tree.locator('.e-fullrow')).toHaveCount(0); // fullRowSelect false hides the full row elements
  expect(await prop(page, 'tv-appearance', 'fullRowNavigable')).toBe(true);
  expect(await prop(page, 'tv-appearance', 'allowTextWrap')).toBe(true);
  expect(await prop(page, 'tv-appearance', 'fullRowSelect')).toBe(false);
  await expect(tree).not.toHaveClass(/e-disabled/);
  await section.getByTestId('tv-restyle').click();
  await expect(tree).toHaveClass(/tv-other-class/);
  await expect.poll(async () => (await tree.boundingBox()).height).toBeCloseTo(200, 0);
  await expect(tree).toHaveClass(/e-disabled/);
  expect(await prop(page, 'tv-appearance', 'disabled')).toBe(true);
  expect(await prop(page, 'tv-appearance', 'height')).toBe('200px');
});

test('nodeTemplate renders each node', async ({ app }) => {
  const nodes = app.section('tv-template').locator('.tpl-node');
  await expect(nodes.first()).toHaveText('Node: Local Disk (C:)');
});

test('enableHtmlSanitizer and disableHtmlEncode', async ({ app, page }) => {
  expect(await prop(page, 'tv-html', 'enableHtmlSanitizer')).toBe(false);
  expect(await prop(page, 'tv-html', 'disableHtmlEncode')).toBe(false);
  await expect(app.section('tv-html').locator('b.bold-node')).toHaveText('Bold'); // markup is rendered, not escaped
});

test('allowEditing with nodeEditing and nodeEdited', async ({ app, page }) => {
  const section = app.section('tv-edit');
  expect(await prop(page, 'tv-edit', 'allowEditing')).toBe(true);
  await section.locator('.e-list-text', { hasText: 'Local Disk (D:)' }).click({ force: true });
  await page.keyboard.press('F2');
  await expect(section.getByTestId('tv-edit-ev')).toContainText('nodeEditing,');
  const input = section.locator('.e-treeview input.e-input');
  await input.fill('Renamed disk');
  await page.keyboard.press('Enter');
  await expect(section.getByTestId('tv-edit-ev')).toContainText('nodeEdited,');
  await expect(section.locator('.e-list-text', { hasText: 'Renamed disk' })).toBeVisible();
});

test('allowDragAndDrop and dragArea raise the drag events', async ({ app, page }) => {
  const section = app.section('tv-drag');
  expect(await prop(page, 'tv-drag', 'allowDragAndDrop')).toBe(true);
  expect(await prop(page, 'tv-drag', 'dragArea')).toBe('#tv-drag-area');
  const source = section.locator('li[data-uid="01-02"] > .e-text-content .e-list-text');
  const target = section.locator('li[data-uid="02"] > .e-text-content .e-list-text');
  await section.scrollIntoViewIfNeeded();
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2 + 10, { steps: 3 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 8 });
  await page.mouse.up();
  const log = section.getByTestId('tv-drag-ev');
  await expect(log).toContainText('nodeDragStart,');
  await expect(log).toContainText('nodeDragging,');
  await expect(log).toContainText('nodeDragStop,');
  await expect(log).toContainText('nodeDropped,');
});

test('dataSourceChanged is raised when nodes are added', async ({ app, page }) => {
  const log = app.section('tv-datasource').getByTestId('tv-data-ev');
  await page.evaluate(() => {
    const w = (document.querySelector('[data-testid="tv-datasource"]') as any).au['ej2-tree-view'].viewModel.widget;
    w.addNodes([{ id: 'new1', name: 'Added node' }], '02');
  });
  await expect(log).toContainText('dataSourceChanged,');
  await expect(app.section('tv-datasource').locator('li[data-uid="new1"]')).toBeAttached();
});

test('enableVirtualization renders a window of a long list', async ({ app, page }) => {
  expect(await prop(page, 'tv-virtual', 'enableVirtualization')).toBe(true);
  const nodes = app.section('tv-virtual').locator('li.e-list-item');
  await expect(nodes.first()).toBeVisible();
  const count = await nodes.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(500);
});

test('actionFailure for a failing request', async ({ app }) => {
  await expect(app.section('tv-remote').getByTestId('tv-remote-ev')).toContainText('actionFailure,');
});

test('destroyed event is raised when the wrapper is removed', async ({ app }) => {
  const section = app.section('tv-destroy');
  await expect(section.getByTestId('tv-destroyed-count')).toHaveText('0');
  await section.getByTestId('tv-destroy-btn').click();
  await expect(section.getByTestId('tv-destroyed-count')).toHaveText('1');
  await expect(section.locator('.e-treeview')).toHaveCount(0);
});
