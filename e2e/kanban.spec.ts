import { test, expect } from './fixtures';
import { bridgeCtl } from './bridgeCtl';

const { expectWidget, expectEvent, evArg, evCount } = bridgeCtl('ej2-kanban', '__kanbanEvents');

test.describe('Kanban', () => {
  test.beforeEach(async ({ app }) => { await app.open('kanban'); });

  const cards = (app: any, id: string) => app.section(id).locator('.e-card');

  test('renders the columns and cards, the bound options reach the widget', async ({ app }) => {
    const id = 'kanban-basic';
    await expect(cards(app, id)).toHaveCount(8);
    await expect(app.section(id).locator('.e-header-cells .e-header-text').first()).toHaveText('To Do');
    await expect(app.section(id).locator('.e-header-cells')).toHaveCount(4);
    await expectWidget(app.page, id, 'w.keyField', 'Status');
    await expectWidget(app.page, id, 'w.columns.length', 4);
    await expectWidget(app.page, id, 'w.cardSettings.headerField', 'Id');
    await expectWidget(app.page, id, 'w.sortSettings.field', 'RankId');
    await expectWidget(app.page, id, 'w.dataSource.length', 8);
    await expectWidget(app.page, id, 'w.allowKeyboard', true);
    await expectWidget(app.page, id, 'w.enableHtmlSanitizer', true);
    await expectWidget(app.page, id, 'w.height', '420px');
    await expectWidget(app.page, id, 'w.width', 'auto');
    await expectWidget(app.page, id, 'w.cardHeight', '110px');
    await expect(app.section(id).locator('.e-kanban')).toHaveClass(/kb-custom/);
    await expect(cards(app, id).first()).toHaveCSS('height', '110px');
    await expect(app.section(id).locator('.e-card-header-title').first()).toHaveText('Task 1');
  });

  test('look properties follow view model changes', async ({ app }) => {
    const id = 'kanban-basic';
    await app.page.getByTestId('kanban-change-look').click();
    await expectWidget(app.page, id, 'w.height', '360px');
    await expectWidget(app.page, id, 'w.cardHeight', '130px');
    await expectWidget(app.page, id, 'w.cssClass', 'kb-custom kb-changed');
    await expect(app.section(id).locator('.e-kanban')).toHaveClass(/kb-changed/);
  });

  test('lifecycle and render events', async ({ app }) => {
    for (const name of ['created', 'dataBinding', 'dataBound', 'queryCellInfo', 'cardRendered']) {
      await expectEvent(app.page, name);
    }
    expect(await evCount(app.page, 'cardRendered')).toBeGreaterThanOrEqual(8);
  });

  test('card click, card double click and the action events', async ({ app }) => {
    const id = 'kanban-basic';
    await cards(app, id).first().click();
    await expectEvent(app.page, 'cardClick');
    expect(await evArg(app.page, 'cardClick', 'data.Id')).toBe('Task 1');
    await expectEvent(app.page, 'actionComplete');
    await cards(app, id).first().dblclick();
    await expectEvent(app.page, 'cardDoubleClick');
    await expectEvent(app.page, 'actionBegin');
  });

  test('drag and drop moves a card and raises the drag events', async ({ app }) => {
    const id = 'kanban-drag';
    await expectWidget(app.page, id, 'w.allowDragAndDrop', true);
    await expectWidget(app.page, id, 'w.constraintType', 'Swimlane');
    const card = cards(app, id).first();
    await card.scrollIntoViewIfNeeded();
    const from = (await card.boundingBox())!;
    const target = (await app.section(id).locator('.e-content-row .e-content-cells').nth(3).boundingBox())!;
    await app.page.mouse.move(from.x + 20, from.y + 20);
    await app.page.mouse.down();
    await app.page.mouse.move(from.x + 40, from.y + 40, { steps: 5 });
    await app.page.mouse.move(target.x + target.width / 2, target.y + 60, { steps: 12 });
    await app.page.mouse.up();
    for (const name of ['dragStart', 'drag', 'dragStop']) { await expectEvent(app.page, name); }
    await expectWidget(app.page, id, "w.kanbanData.find(c => c.Id === 'Task 1').Status", 'Done');
  });

  test('swimlanes, stacked headers, empty columns and column drag', async ({ app }) => {
    const id = 'kanban-swimlane';
    await expectWidget(app.page, id, 'w.swimlaneSettings.keyField', 'Assignee');
    await expectWidget(app.page, id, 'w.showEmptyColumn', true);
    await expectWidget(app.page, id, 'w.allowColumnDragAndDrop', true);
    await expectWidget(app.page, id, 'w.stackedHeaders.length', 2);
    await expect(app.section(id).locator('.e-swimlane-row')).toHaveCount(3);
    await expect(app.section(id).locator('.e-stacked-header-cell').first()).toContainText('Planning');
    await expect(app.section(id).locator('.e-header-cells', { hasText: 'Archived' })).toBeVisible();
    const headers = app.section(id).locator('.e-header-cells');
    await headers.first().scrollIntoViewIfNeeded();
    const from = (await headers.nth(0).boundingBox())!;
    const to = (await headers.nth(2).boundingBox())!;
    await app.page.mouse.move(from.x + 20, from.y + from.height / 2);
    await app.page.mouse.down();
    for (let i = 1; i <= 20; i++) { await app.page.mouse.move(from.x + 20 + ((to.x + 30 - from.x - 20) * i) / 20, from.y + from.height / 2 + (i % 2)); }
    await app.page.mouse.up();
    for (const name of ['columnDragStart', 'columnDrag', 'columnDrop']) { await expectEvent(app.page, name); }
  });

  test('edit dialog opens on double click and raises dialogOpen / dialogClose', async ({ app }) => {
    const id = 'kanban-dialog';
    await expectWidget(app.page, id, 'w.dialogSettings.fields.length', 4);
    await cards(app, id).first().scrollIntoViewIfNeeded();
    await cards(app, id).first().dblclick();
    const dialog = app.page.locator('.e-kanban-dialog:visible');
    await expect(dialog).toBeVisible();
    await expectEvent(app.page, 'dialogOpen');
    await dialog.locator('button', { hasText: 'Cancel' }).click();
    await expectEvent(app.page, 'dialogClose');
  });

  test('tooltip template is shown on hover', async ({ app }) => {
    const id = 'kanban-tooltip';
    await expectWidget(app.page, id, 'w.enableTooltip', true);
    await expectWidget(app.page, id, 'typeof w.tooltipTemplate', 'string');
    await cards(app, id).first().scrollIntoViewIfNeeded();
    await cards(app, id).first().hover();
    await expect(app.page.locator('.kb-tooltip-template')).toContainText('Analyze the new requirements');
  });

  test('card template replaces the card content', async ({ app }) => {
    await expect(app.section('kanban-template').locator('.kb-card-template')).toHaveCount(8);
    await expect(app.section('kanban-template').locator('.kb-card-template').first()).toContainText('Task 1: Analyze');
  });

  test('virtualization renders only a window of the cards', async ({ app }) => {
    const id = 'kanban-virtual';
    await expectWidget(app.page, id, 'w.enableVirtualization', true);
    expect(await cards(app, id).count()).toBeLessThan(300);
    expect(await cards(app, id).count()).toBeGreaterThan(0);
  });

  test('externalDropId is set and the target exists', async ({ app }) => {
    await expectWidget(app.page, 'kanban-external', 'w.externalDropId', '#kb-external-target');
    await expect(app.page.locator('#kb-external-target')).toHaveText('Drop target');
  });

  test('query keeps only the critical cards', async ({ app }) => {
    const id = 'kanban-query';
    await expectWidget(app.page, id, 'w.query.queries.length', 1);
    await expect(cards(app, id)).toHaveCount(2);
  });

  test('custom data binding: an edit raises dataSourceChanged then dataStateChange', async ({ app }) => {
    const id = 'kanban-state';
    await expect(cards(app, id)).toHaveCount(8);
    await cards(app, id).first().scrollIntoViewIfNeeded();
    await cards(app, id).first().dblclick();
    const dialog = app.page.locator('.e-kanban-dialog:visible');
    await expect(dialog).toBeVisible();
    await dialog.locator('textarea').first().fill('Edited summary');
    await dialog.locator('button', { hasText: 'Save' }).click();
    await expectEvent(app.page, 'dataSourceChanged');
    await expect(app.page.getByTestId('kanban-state-changed')).toHaveText('cardChanged');
    await expectEvent(app.page, 'dataStateChange');
    await expect(app.page.getByTestId('kanban-state-last')).not.toHaveText('');
  });

  test('actionFailure is raised when the data request cannot be read', async ({ app }) => {
    await app.page.route('**/kb-missing*', route => route.fulfill({ status: 500, contentType: 'text/plain', body: 'boom' }));
    await app.page.getByTestId('kanban-failure-show').click();
    await expectEvent(app.page, 'actionFailure');
    expect(await evArg(app.page, 'actionFailure', 'error')).toBeTruthy();
    // the failed request is logged by the browser, that is the point of this test
    expect(app.errors.length).toBeGreaterThan(0);
    app.errors.splice(0);
  });
});
