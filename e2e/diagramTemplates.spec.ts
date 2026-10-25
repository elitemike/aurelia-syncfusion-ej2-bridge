import { test, expect } from './fixtures';
import { inst, center, hover, eventCount } from './diagramHelpers';

test.beforeEach(async ({ app }) => app.open('diagram'));

const tpl = (app) => app.section('diagram-templates').getByTestId('diagram-templates');

test('nodeTemplate renders HTML nodes, annotationTemplate the label', async ({ app }) => {
  const d = tpl(app);
  await expect(d.locator('.html-node-tpl')).toHaveText('Node html1');
  await expect(d.locator('.annotation-tpl')).toHaveText('Note note1');
  expect(await inst(d, w => typeof w.nodeTemplate + typeof w.annotationTemplate)).toBe('stringstring');
});

test('fixedUserHandleTemplate renders the fixed handle and its mouse events fire', async ({ app, page }) => {
  const d = tpl(app);
  const handle = d.locator('.fixed-handle-tpl');
  await expect(handle).toHaveText('fixed1');
  const h = await center(handle);
  await hover(page, h);
  await expect.poll(() => eventCount(page, 'onFixedUserHandleMouseEnter')).toBeGreaterThan(0);
  await page.mouse.down();
  await expect.poll(() => eventCount(page, 'onFixedUserHandleMouseDown')).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(() => eventCount(page, 'onFixedUserHandleMouseUp')).toBeGreaterThan(0);
  await expect.poll(() => eventCount(page, 'fixedUserHandleClick')).toBeGreaterThan(0);
  await page.mouse.move(h.x + 200, h.y + 100, { steps: 6 });
  await expect.poll(() => eventCount(page, 'onFixedUserHandleMouseLeave')).toBeGreaterThan(0);
});

test('userHandleTemplate renders the handle of a selected node', async ({ app, page }) => {
  const d = tpl(app);
  const at = await center(d.locator('.html-node-tpl'));
  await page.mouse.click(at.x, at.y);
  await expect(d.locator('#tplHandle_shape_html_element .user-handle-tpl')).toHaveText('tplHandle');
  expect(await inst(d, w => typeof w.userHandleTemplate + typeof w.fixedUserHandleTemplate)).toBe('stringstring');
});
