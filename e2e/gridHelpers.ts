import { Page, expect } from '@playwright/test';

/** Number of times the demo handler for `name` (see dev-app/grid/gridLog.ts) has run. */
export const evCount = (page: Page, name: string) =>
  page.evaluate((n) => ((window as any).__gridEvents?.[n]?.count) || 0, name);

/** Poll until the handler ran at least `min` times. */
export const expectEvent = (page: Page, name: string, min = 1) =>
  expect.poll(() => evCount(page, name), { message: `event ${name}` }).toBeGreaterThanOrEqual(min);

/** Read `path` (dot separated) from the arguments of the last raise of `name`. */
export const evArg = (page: Page, name: string, path: string) =>
  page.evaluate(([n, p]) => {
    const rec = (window as any).__gridEvents?.[n];
    return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
  }, [name, path]);

/** Evaluate a JS expression against the EJ2 grid widget behind `<ej2-grid data-testid=...>`. */
export const widgetValue = (page: Page, testId: string, expr: string) =>
  page.evaluate(([id, e]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au['ej2-grid'].viewModel.widget;
    return new Function('w', `return ${e};`)(w);
  }, [testId, expr]);

/** Poll a widget expression until it equals `expected`. */
export const expectWidget = (page: Page, testId: string, expr: string, expected: unknown) =>
  expect.poll(() => widgetValue(page, testId, expr), { message: `${testId}: ${expr}` }).toEqual(expected);

/** Change a property on the view model that owns the grid (the bound source), like a user of the wrapper would. */
export const setVm = (page: Page, testId: string, prop: string, value: unknown) =>
  page.evaluate(([id, p, v]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    el.au['ej2-grid'].viewModel.bindingContext[p as string] = v;
  }, [testId, prop, value] as any);

/** Read a property from the view model that owns the grid. */
export const getVm = (page: Page, testId: string, prop: string) =>
  page.evaluate(([id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au['ej2-grid'].viewModel.bindingContext[p];
  }, [testId, prop]);

/** Run an expression against the widget and wait for the result (exports and other async calls). */
export const callWidget = (page: Page, testId: string, expr: string) =>
  page.evaluate(([id, e]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au['ej2-grid'].viewModel.widget;
    return Promise.resolve(new Function('w', `return ${e};`)(w)).then(() => true);
  }, [testId, expr]);
