import { test, expect } from './fixtures';
import { inst } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const shapes = (app, section: string, id: string) => app.section(section).getByTestId(id);

test('model: UML sequence diagram draws participants and messages', async ({ app }) => {
  const d = shapes(app, 'diagram-sequence', 'diagram-sequence');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => w.model.participants.length + '/' + w.model.messages.length)).toBe('3/3');
  for (const text of ['Web app', 'Database', 'Login', 'Query', 'Rows']) {
    await expect(d.locator('text', { hasText: text }).first()).toBeAttached();
  }
  expect(await inst(d, w => w.nodes.length)).toBeGreaterThanOrEqual(3);
});

test('BPMN shapes render with their flows', async ({ app }) => {
  const d = shapes(app, 'diagram-bpmn', 'diagram-bpmn');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => w.nodes.map((n: any) => n.shape.shape).join())).toBe('Event,Activity,Gateway,Event');
  await expect(d.locator('#btask_groupElement')).toBeAttached();
  await expect(d.locator('#bgate_groupElement')).toBeAttached();
  await expect(d.locator('text', { hasText: 'Review' }).first()).toBeAttached();
  expect(await inst(d, w => w.connectors[2].shape.sequence)).toBe('Conditional');
});

test('swimlane renders header, lanes and the tasks inside them', async ({ app }) => {
  const d = shapes(app, 'diagram-swimlane', 'diagram-swimlane');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  for (const text of ['Order process', 'Customer', 'Shop', 'Order', 'Ship']) {
    await expect(d.locator('text', { hasText: text }).first()).toBeAttached();
  }
  expect(await inst(d, w => w.getObject('swim').shape.lanes.length)).toBe(2);
});

test('UML classifier shows name, attributes and methods', async ({ app }) => {
  const d = shapes(app, 'diagram-uml', 'diagram-uml');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  for (const text of ['Person', 'name', 'age', 'save']) {
    await expect(d.locator('text', { hasText: text }).first()).toBeAttached();
  }
});
