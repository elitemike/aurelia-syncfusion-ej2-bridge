import { test, expect } from './fixtures';
import { inst, center, eventCount } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const lay = (app, section: string, id: string) => app.section(section).getByTestId(id);
const fired = (page, name: string) => expect.poll(() => eventCount(page, 'lay:' + name), { message: name }).toBeGreaterThan(0);
// data bound nodes get generated ids, find them by their data
const pos = (d, id: string) => inst(d, (w, nid) => {
  const n = w.getObject(nid) || w.nodes.find((x: any) => x.data && x.data.Id === nid);
  return { x: n.offsetX, y: n.offsetY };
}, id);

test('org chart: data source creates the nodes, HierarchicalTree arranges them top down', async ({ app, page }) => {
  const d = lay(app, 'diagram-org', 'diagram-org');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  expect(await inst(d, w => w.nodes.length)).toBe(6);
  expect(await inst(d, w => w.connectors.length)).toBe(5);
  await fired(page, 'dataLoaded');
  await fired(page, 'layoutUpdated');
  expect(await inst(d, w => w.dataSourceSettings.id + '/' + w.dataSourceSettings.parentId)).toBe('Id/Manager');
  expect(await inst(d, w => w.layout.type)).toBe('OrganizationalChart');
  const ceo = await pos(d, 'ceo');
  const cto = await pos(d, 'cto');
  const dev = await pos(d, 'dev');
  expect(cto.y).toBeGreaterThan(ceo.y);
  expect(dev.y).toBeGreaterThan(cto.y);
  expect(await inst(d, w => w.nodes.find((n: any) => n.data.Id === 'dev').annotations[0].content)).toBe('Dev lead');
});

test('org chart: collapsing a branch raises expandStateChange', async ({ app, page }) => {
  const d = lay(app, 'diagram-org', 'diagram-org');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await fired(page, 'layoutUpdated');
  const icon = await center(d.locator('[id$="cto_icon_content_rect"]'));
  await page.mouse.click(icon.x, icon.y);
  await fired(page, 'expandStateChange');
  await fired(page, 'animationComplete');
  expect(await inst(d, w => w.nodes.find((n: any) => n.data.Id === 'cto').isExpanded)).toBe(false);
});

test('org chart: a new layout object re-arranges the chart', async ({ app }) => {
  const d = lay(app, 'diagram-org', 'diagram-org');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => (await pos(d, 'dev')).y).toBeGreaterThan((await pos(d, 'cto')).y);
  await app.section('diagram-org').getByTestId('org-sideways').click();
  await expect.poll(() => inst(d, w => w.layout.orientation)).toBe('LeftToRight');
  // left to right: the root ends up at the left, its reports to the right of it
  await expect.poll(async () => (await pos(d, 'dev')).x - (await pos(d, 'cto')).x).toBeGreaterThan(60);
  expect((await pos(d, 'cto')).x).toBeGreaterThan((await pos(d, 'ceo')).x);
});

test('mind map: getBranch sends nodes to the left or right of the root', async ({ app }) => {
  const d = lay(app, 'diagram-mindmap', 'diagram-mindmap');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => (await pos(d, 'm1')).x).not.toBe(0);
  const root = await pos(d, 'root');
  // the two branches returned by getBranch end up on opposite sides of the root
  const x = async (id: string) => (await pos(d, id)).x - root.x;
  expect(await x('m1')).toBe(await x('m2'));
  expect(await x('m3')).toBe(await x('m4'));
  expect((await x('m1')) * (await x('m3'))).toBeLessThan(0);
  expect(await inst(d, w => w.layout.type)).toBe('MindMap');
});

test('radial tree: children surround the root at a distance', async ({ app }) => {
  const d = lay(app, 'diagram-radial', 'diagram-radial');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => { const a = await pos(d, 'a'); const r = await pos(d, 'r'); return a.x !== r.x || a.y !== r.y; }).toBe(true);
  const dist = async (a: string, b: string) => { const p = await pos(d, a); const q = await pos(d, b); return Math.hypot(p.x - q.x, p.y - q.y); };
  expect(await dist('r', 'a')).toBeGreaterThan(60);
  expect(await dist('r', 'c')).toBeGreaterThan(await dist('r', 'a'));
});

test('symmetrical layout spreads the nodes', async ({ app }) => {
  const d = lay(app, 'diagram-symmetric', 'diagram-symmetric');
  await expect(d.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => { const a = await pos(d, 's1'); const b = await pos(d, 's2'); return Math.hypot(a.x - b.x, a.y - b.y); }).toBeGreaterThan(60);
  expect(await inst(d, w => w.layout.type)).toBe('SymmetricalLayout');
});

test('complex hierarchical tree and flowchart layouts order nodes by depth', async ({ app }) => {
  const c = lay(app, 'diagram-complex', 'diagram-complex');
  await expect(c.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => (await pos(c, 'x5')).y).toBeGreaterThan((await pos(c, 'x1')).y);
  expect((await pos(c, 'x4')).y).toBeGreaterThan((await pos(c, 'x2')).y);
  const f = lay(app, 'diagram-complex', 'diagram-flowlayout');
  await expect(f.locator('svg[id$="_diagramLayer_svg"]')).toBeVisible();
  await expect.poll(async () => (await pos(f, 'f2')).y).toBeGreaterThan((await pos(f, 'f1')).y);
  expect(await inst(f, w => w.layout.type)).toBe('Flowchart');
});
