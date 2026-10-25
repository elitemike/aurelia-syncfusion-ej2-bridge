import { Page, expect } from '@playwright/test';

/**
 * Test helpers for a bridge control: `tag` is the custom element ('ej2-tree-grid') and `store` the window
 * property that the demo's logEvent fills ('__tgEvents').
 */
export function bridgeCtl(tag: string, store: string) {
  const widgetValue = (page: Page, testId: string, expr: string) =>
    page.evaluate(([t, id, e]) => {
      const el: any = document.querySelector(`[data-testid="${id}"]`);
      const w = el.au[t].viewModel.widget;
      return new Function('w', `return ${e};`)(w);
    }, [tag, testId, expr]);

  const expectWidget = (page: Page, testId: string, expr: string, expected: unknown) =>
    expect.poll(() => widgetValue(page, testId, expr), { message: `${testId}: ${expr}` }).toEqual(expected);

  const setVm = (page: Page, testId: string, prop: string, value: unknown) =>
    page.evaluate(([t, id, p, v]) => {
      const el: any = document.querySelector(`[data-testid="${id}"]`);
      el.au[t].viewModel.bindingContext[p as string] = v;
    }, [tag, testId, prop, value] as any);

  /** Run a JS expression against the view model that owns the control (`vm`). */
  const vmEval = (page: Page, testId: string, expr: string) =>
    page.evaluate(([t, id, e]) => {
      const el: any = document.querySelector(`[data-testid="${id}"]`);
      return Promise.resolve(new Function('vm', `return ${e};`)(el.au[t].viewModel.bindingContext));
    }, [tag, testId, expr]);

  const getVm = (page: Page, testId: string, prop: string) => vmEval(page, testId, `vm[${JSON.stringify(prop)}]`);

  const callWidget = (page: Page, testId: string, expr: string) =>
    page.evaluate(([t, id, e]) => {
      const el: any = document.querySelector(`[data-testid="${id}"]`);
      const w = el.au[t].viewModel.widget;
      return Promise.resolve(new Function('w', `return ${e};`)(w)).then(() => true);
    }, [tag, testId, expr]);

  const evCount = (page: Page, name: string) =>
    page.evaluate(([s, n]) => ((window as any)[s]?.[n]?.count) || 0, [store, name]);

  const expectEvent = (page: Page, name: string, min = 1) =>
    expect.poll(() => evCount(page, name), { message: `event ${name}` }).toBeGreaterThanOrEqual(min);

  const evArg = (page: Page, name: string, path: string) =>
    page.evaluate(([s, n, p]) => {
      const rec = (window as any)[s]?.[n];
      return rec ? p.split('.').reduce((o: any, k: string) => (o == null ? o : o[k]), rec.last) : undefined;
    }, [store, name, path]);

  return { widgetValue, expectWidget, setVm, vmEval, getVm, callWidget, evCount, expectEvent, evArg };
}
