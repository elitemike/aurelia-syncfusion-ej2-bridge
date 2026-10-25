import { Locator, Page } from '@playwright/test';

/** The Syncfusion host element inside a demo control located by test id. */
export function host(scope: Locator, testId: string) {
  return scope.getByTestId(testId).locator('.e-control').first();
}

/** Evaluate a function against the live Syncfusion widget instance of a host element. */
export async function inst<R = any>(hostEl: Locator, fn: (widget: any) => R): Promise<R> {
  return hostEl.evaluate((el: any, source: string) => {
    // eslint-disable-next-line no-new-func
    return new Function('widget', `return (${source})(widget)`)(el.ej2_instances[0]);
  }, fn.toString());
}

/** Element id of the host (the SVG ids are prefixed with it). */
export async function hostId(hostEl: Locator): Promise<string> {
  return hostEl.evaluate((el: any) => el.id);
}

/** Count of events recorded by the demo handlers in window[store][name]. */
export async function eventCount(page: Page, store: string, name: string): Promise<number> {
  return page.evaluate(([s, n]) => ((window as any)[s] || {})[n]?.count || 0, [store, name]);
}

/** Primitive fields of the last args of an event (the args hold circular widget references). */
export async function eventLast(page: Page, store: string, name: string): Promise<any> {
  return page.evaluate(([s, n]) => {
    const rec = ((window as any)[s] || {})[n];
    if (!rec || !rec.last) { return null; }
    const out: any = {};
    Object.keys(rec.last).forEach((k) => {
      const v = rec.last[k];
      if (v === null || ['string', 'number', 'boolean'].indexOf(typeof v) !== -1) { out[k] = v; }
    });
    return out;
  }, [store, name]);
}

/** Center of an element in viewport coordinates, scrolled into view first. */
export async function center(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}
