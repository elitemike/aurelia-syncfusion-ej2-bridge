import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect } from './fixtures';

test('each example is a Preview / Markup / TypeScript tab view', async ({ app, page }) => {
  await app.open('slider');
  const section = app.section('sl-default');
  const preview = section.locator('.demo-section__body');
  await expect(section.getByTestId('section-sl-default-tab-preview')).toHaveAttribute('aria-pressed', 'true');
  await expect(preview).toBeVisible();

  await section.getByTestId('section-sl-default-tab-markup').click();
  const code = section.getByTestId('section-sl-default-code');
  await expect(code).toContainText('<ej2-slider');
  await expect(code.locator('.tok-tag').first()).toBeVisible();
  await expect(preview).toBeHidden();

  // only the view-model members this example binds are shown
  await section.getByTestId('section-sl-default-tab-ts').click();
  await expect(code).toContainText('export class SliderDemo');
  await expect(code).toContainText('setValue()');
  await expect(code).not.toContainText('onTooltipChange');

  // the widget stays alive while its tab is hidden
  await section.getByTestId('section-sl-default-tab-preview').click();
  await expect(preview).toBeVisible();
  await expect(section.locator('.e-slider-container').first()).toBeVisible();

  // other examples on the page keep their own tab state
  await expect(app.section('sl-range').getByTestId('section-sl-range-tab-preview')).toHaveAttribute('aria-pressed', 'true');
});

test('examples that need no view-model code say so', async ({ app }) => {
  await app.open('slider');
  const section = app.section('sl-ticks');
  await section.getByTestId('section-sl-ticks-tab-ts').click();
  await expect(section.getByTestId('section-sl-ticks-code')).toContainText('needs no view-model code');
});

test('composed demos resolve their own source (grid)', async ({ app }) => {
  await app.open('grid');
  const section = app.section('grid-chooser');
  await section.getByTestId('section-grid-chooser-tab-markup').click();
  await expect(section.getByTestId('section-grid-chooser-code')).toContainText('<ej2-grid');
});

test('every demo section has generated source', async ({ request }) => {
  const nav = readFileSync(join(__dirname, '..', 'dev-app', 'nav.ts'), 'utf8');
  const routes = [...nav.matchAll(/route: '([^']+)'/g)].map(m => m[1]);
  let total = 0;
  for (const route of routes) {
    const res = await request.get(`/scripts/demo-src/${route}.json`);
    expect(res.ok(), route).toBe(true);
    const { sections } = await res.json();
    for (const [id, s] of Object.entries<any>(sections)) {
      total++;
      expect(s.markup.length, `${route}/${id} markup`).toBeGreaterThan(0);
      expect(s.ts.length, `${route}/${id} ts`).toBeGreaterThan(0);
    }
  }
  expect(total).toBeGreaterThanOrEqual(850);
});

test('code tabs can switch to the full file and to imported files', async ({ app }) => {
  await app.open('grid');
  const section = app.section('grid-chooser');
  await section.getByTestId('section-grid-chooser-tab-ts').click();
  const code = section.getByTestId('section-grid-chooser-code');
  const view = section.getByTestId('section-grid-chooser-view');
  await expect(view.locator('option')).toHaveText(['This example', 'Full gridDemo.ts', 'gridLog.ts']);
  await expect(code).not.toContainText('onCreated'); // not bound by this example
  await view.selectOption({ label: 'Full gridDemo.ts' });
  await expect(code).toContainText('onCreated');
  await view.selectOption({ label: 'gridLog.ts' });
  await expect(code).toContainText('logEvent');
  await section.getByTestId('section-grid-chooser-tab-markup').click();
  await section.getByTestId('section-grid-chooser-view').selectOption({ label: 'Full gridDemo.html' });
  await expect(code).toContainText('grid-default'); // another section of the same file
});

// every page reached by clicking through the sidebar: all of its sections are tab views backed by generated source
test('every rendered example on every page has its source', async ({ app, page, request }) => {
  test.setTimeout(300_000);
  const nav = readFileSync(join(__dirname, '..', 'dev-app', 'nav.ts'), 'utf8');
  const routes = [...nav.matchAll(/route: '([^']+)'/g)].map(m => m[1]);
  await app.open('home');
  for (const route of routes) {
    await page.getByTestId(`nav-${route}`).click();
    await expect(page).toHaveURL(new RegExp(`/${route}$`));
    await expect(page.locator('main section.demo-section').first(), `${route} has examples`).toBeAttached();
    const { sections } = await (await request.get(`/scripts/demo-src/${route}.json`)).json();
    // composed parts attach one after another, wait until every example has its tab bar
    const read = () => page.locator('main section.demo-section').evaluateAll(els => ({
      ids: els.map(e => (e.getAttribute('data-testid') || '').replace(/^section-/, '')),
      tabbed: els.filter(e => e.querySelector(':scope > .demo-section__head > .demo-section__tabs')).length
    }));
    await expect.poll(async () => { const r = await read(); return r.tabbed === r.ids.length; }, { message: `${route}: every example has tabs` }).toBe(true);
    const { ids } = await read();
    const known = (id: string) => sections[id] || Object.keys(sections).some(k => k.includes('${') &&
      new RegExp('^' + k.split(/\$\{[^}]*\}/).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+') + '$').test(id));
    for (const id of ids) { expect(known(id), `${route}: source for ${id}`).toBeTruthy(); }
  }
});
