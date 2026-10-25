import { test, expect } from './fixtures';
import { expectEvent, expectWidget, widgetValue, evArg, getVm } from './bridgeHelpers';

const TAG = 'ej2-query-builder';
const w = (page, id: string, expr: string) => widgetValue(page, TAG, id, expr);
const ew = (page, id: string, expr: string, expected: unknown) => expectWidget(page, TAG, id, expr, expected);

test.beforeEach(async ({ app }) => app.open('queryBuilder'));

test('renders the rule rows from the bound rule and columns', async ({ app, page }) => {
  const qb = app.section('qb-main');
  await expect(qb.locator('.e-query-builder')).toBeVisible();
  await expect(qb.locator('.e-rule-container')).toHaveCount(2);
  await ew(page, 'qb-main', 'w.columns.length', 6);
  await expectEvent(page, 'created');
  await expectEvent(page, 'dataBound');
});

test('property bindings reach the widget', async ({ page }) => {
  await ew(page, 'qb-main', 'w.allowDragAndDrop', true);
  await ew(page, 'qb-main', 'w.enableNotCondition', true);
  await ew(page, 'qb-main', 'w.matchCase', true);
  await ew(page, 'qb-main', 'w.maxGroupCount', 5);
  await ew(page, 'qb-main', 'w.cssClass', 'qb-main-class');
  await ew(page, 'qb-main', 'w.width', '100%');
  await ew(page, 'qb-main', 'w.height', 'auto');
  await ew(page, 'qb-main', 'w.immediateModeDelay', 0);
  await ew(page, 'qb-main', 'w.showButtons.cloneRule', true);
  await ew(page, 'qb-main', 'w.allowValidation', false);
  await expect(page.getByTestId('qb-main').locator('.e-query-builder')).toHaveClass(/qb-main-class/);
});

test('NOT condition checkbox is rendered', async ({ app }) => {
  await expect(app.section('qb-main').locator('.e-qb-toggle').first()).toBeAttached();
});

test('editing a value writes the rule back to the view-model (two-way, widget -> vm)', async ({ app, page }) => {
  const qb = app.section('qb-main');
  const before = await page.evaluate(() => (window as any).__bridgeEvents?.ruleChange?.count || 0);
  // toggle the AND/OR connector to OR
  await qb.locator('.e-btn-group label').filter({ hasText: /OR/i }).first().click();
  await expect(page.getByTestId('qb-main-condition')).toHaveText('or');
  await expectEvent(page, 'ruleChange', before + 1);
  await expectEvent(page, 'change');
  await expectEvent(page, 'beforeChange');
  expect((await getVm(page, TAG, 'qb-main', 'mainRule')).condition).toBe('or');
});

test('adding a rule through the UI updates the vm rule', async ({ app, page }) => {
  const qb = app.section('qb-main');
  await qb.locator('.e-add-btn').first().click();
  await page.locator('.e-dropdown-popup li', { hasText: /Add Condition/i }).first().click();
  await expect(page.getByTestId('qb-main-count')).toHaveText('3');
  await ew(page, 'qb-main', 'w.getRules().rules.length', 3);
});

test('vm rule change updates the widget (vm -> widget)', async ({ app, page }) => {
  await page.getByTestId('qb-apply-rule').click();
  await expect(app.section('qb-main').locator('.e-rule-container')).toHaveCount(1);
  await ew(page, 'qb-main', 'w.getRules().condition', 'or');
  await expect(page.getByTestId('qb-main-condition')).toHaveText('or');
});

test('drag and drop of a rule raises dragStart, drag and drop', async ({ app, page }) => {
  const qb = app.section('qb-main');
  const handles = qb.locator('.e-rule-field .e-drag-qb-rule');
  await expect(handles).toHaveCount(2);
  const a = await handles.nth(0).boundingBox();
  const b = await qb.locator('.e-rule-container').nth(1).boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2 + 10, { steps: 3 });
  await page.mouse.move(b.x + 40, b.y + b.height - 4, { steps: 10 });
  await page.mouse.up();
  await expectEvent(page, 'dragStart');
  await expectEvent(page, 'drag');
  await expectEvent(page, 'drop');
});

test('destroyed is raised when the control is removed', async ({ page }) => {
  await page.getByTestId('qb-toggle').click();
  await expect(page.getByTestId('qb-destroyed')).toHaveText('1');
});

test('dataSource derives the columns, separator, sort direction and auto select', async ({ app, page }) => {
  await ew(page, 'qb-data', 'w.dataSource.length', 3);
  await ew(page, 'qb-data', 'w.sortDirection', 'Descending');
  await ew(page, 'qb-data', 'w.separator', '|');
  await ew(page, 'qb-data', 'w.enableSeparateConnector', true);
  await expect(app.section('qb-data').locator('.e-query-builder')).toBeVisible();
  await ew(page, 'qb-data', 'w.columns.length > 0', true);
  // descending: the first column is the last field alphabetically
  const fields = await w(page, 'qb-data', 'w.columns.map(c => c.field)');
  expect(fields[0] > fields[fields.length - 1]).toBe(true);
});

test('allowValidation flags an empty required value', async ({ app, page }) => {
  await ew(page, 'qb-validation', 'w.allowValidation', true);
  await ew(page, 'qb-validation', 'w.autoSelectField', true);
  await ew(page, 'qb-validation', 'w.autoSelectOperator', true);
  await ew(page, 'qb-validation', 'w.addRuleToNewGroups', true);
  await ew(page, 'qb-validation', 'w.validateFields()', false);
  await ew(page, 'qb-validation', 'w.columns[0].validation.isRequired', true);
});

test('vertical mode, models, readonly and show buttons', async ({ app, page }) => {
  const qb = app.section('qb-look');
  await ew(page, 'qb-look', 'w.displayMode', 'Vertical');
  await expect(qb.locator('.e-rule-container').first()).toHaveClass(/e-vertical-mode/);
  await ew(page, 'qb-look', 'w.fieldMode', 'Default');
  await ew(page, 'qb-look', 'w.showButtons.ruleDelete', false);
  await ew(page, 'qb-look', 'w.fieldModel.placeholder', 'Pick a field');
  await ew(page, 'qb-look', 'w.operatorModel.placeholder', 'Pick an operator');
  await ew(page, 'qb-look', 'w.valueModel.placeholder', 'Pick a value');
  await ew(page, 'qb-look', 'w.readonly', false);
  await page.getByTestId('qb-readonly').click();
  await ew(page, 'qb-look', 'w.readonly', true);
});

test('summary view renders the rule as text', async ({ app, page }) => {
  const qb = app.section('qb-summary');
  await ew(page, 'qb-summary', 'w.summaryView', true);
  await expect(qb.locator('.e-summary-text')).toHaveValue("Country = 'USA'");
});

test('header template replaces the group header and raises actionBegin', async ({ app, page }) => {
  await ew(page, 'qb-header', 'typeof w.headerTemplate', 'string');
  await expect(app.section('qb-header').locator('.qb-header-tpl').first()).toHaveText('Custom header');
  await expectEvent(page, 'headerActionBegin');
});
