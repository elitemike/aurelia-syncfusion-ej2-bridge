import { Page, expect } from '@playwright/test';

/** Number of times the demo handler for `name` (see dev-app/queryBuilder/qbLog.ts) has run. */
export const evCount = (page: Page, name: string) =>
  page.evaluate((n) => ((window as any).__bridgeEvents?.[n]?.count) || 0, name);

/** Poll until the handler ran at least `min` times. */
export const expectEvent = (page: Page, name: string, min = 1) =>
  expect.poll(() => evCount(page, name), { message: `event ${name}` }).toBeGreaterThanOrEqual(min);

/** Read `path` (dot separated) from the arguments of the last raise of `name`. */
export const evArg = (page: Page, name: string, path: string) =>
  page.evaluate(([n, p]) => {
    const rec = (window as any).__bridgeEvents?.[n];
    return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
  }, [name, path]);

/** Evaluate a JS expression (`w` = widget) against the EJ2 widget behind `<tag data-testid=...>`. */
export const widgetValue = (page: Page, tag: string, testId: string, expr: string) =>
  page.evaluate(([t, id, e]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au[t].viewModel.widget;
    return new Function('w', `return ${e};`)(w);
  }, [tag, testId, expr]);

export const expectWidget = (page: Page, tag: string, testId: string, expr: string, expected: unknown) =>
  expect.poll(() => widgetValue(page, tag, testId, expr), { message: `${testId}: ${expr}` }).toEqual(expected);

/** Run an expression against the widget and wait for the result. */
export const callWidget = (page: Page, tag: string, testId: string, expr: string) =>
  page.evaluate(([t, id, e]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    const w = el.au[t].viewModel.widget;
    return Promise.resolve(new Function('w', `return ${e};`)(w)).then(() => true);
  }, [tag, testId, expr]);

/** Set a property on the view model that owns the control (the bound source), like a user of the wrapper would. */
export const setVm = (page: Page, tag: string, testId: string, prop: string, value: unknown) =>
  page.evaluate(([t, id, p, v]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    el.au[t].viewModel.bindingContext[p as string] = v;
  }, [tag, testId, prop, value] as any);

export const getVm = (page: Page, tag: string, testId: string, prop: string) =>
  page.evaluate(([t, id, p]) => {
    const el: any = document.querySelector(`[data-testid="${id}"]`);
    return el.au[t].viewModel.bindingContext[p];
  }, [tag, testId, prop]);
