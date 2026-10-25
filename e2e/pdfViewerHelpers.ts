import { Page, expect } from '@playwright/test';

/** Number of times the demo handler for `name` (`<viewer>.<event>`, see dev-app/pdfViewer/pvLog.ts) has run. */
export const evCount = (page: Page, name: string) =>
  page.evaluate((n) => ((window as any).__pvEvents?.[n]?.count) || 0, name);

/** Poll until the handler ran at least `min` times. */
export const expectEvent = (page: Page, name: string, min = 1) =>
  expect.poll(() => evCount(page, name), { message: `event ${name}`, timeout: 15_000 }).toBeGreaterThanOrEqual(min);

/** Read `path` (dot separated) from the arguments of the last raise of `name`. */
export const evArg = (page: Page, name: string, path: string) =>
  page.evaluate(([n, p]) => {
    const rec = (window as any).__pvEvents?.[n];
    return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
  }, [name, path]);

/** Evaluate a JS expression against the EJ2 widget behind `<tag data-testid=...>`. */
export const widgetOf = (page: Page, tag: string, testId: string, expr: string) =>
  page.evaluate(([t, id, e]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au[t].viewModel.widget;
    return new Function('w', `return ${e};`)(w);
  }, [tag, testId, expr]);

export const viewerValue = (page: Page, testId: string, expr: string) => widgetOf(page, 'ej2-pdf-viewer', testId, expr);

/** Poll a widget expression until it equals `expected`. */
export const expectViewer = (page: Page, testId: string, expr: string, expected: unknown, timeout = 10_000) =>
  expect.poll(() => viewerValue(page, testId, expr), { message: `${testId}: ${expr}`, timeout }).toEqual(expected);

/** Set a property on the view model that owns the viewer (the bound source), like a user of the wrapper would. */
export const setVm = (page: Page, testId: string, prop: string, value: unknown, tag = 'ej2-pdf-viewer') =>
  page.evaluate(([t, id, p, v]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    el.au[t].viewModel.bindingContext[p as string] = v;
  }, [tag, testId, prop, value] as any);

/** Read a property from the view model that owns the viewer. */
export const getVm = (page: Page, testId: string, prop: string, tag = 'ej2-pdf-viewer') =>
  page.evaluate(([t, id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au[t].viewModel.bindingContext[p];
  }, [tag, testId, prop]);

/** Wait until the viewer finished loading its document. */
export const documentLoaded = (page: Page, testId: string) =>
  expect.poll(() => viewerValue(page, testId, 'w.pageCount'), { message: `${testId} document load`, timeout: 30_000 }).toBeGreaterThan(0);

/** Wait until the text layer of the first page exists, hyperlink detection and text selection need it. */
export const textLayerReady = (page: Page, testId: string) =>
  expect(page.locator(`[data-testid="${testId}"] .e-pv-text`).first()).toBeAttached({ timeout: 20_000 });
