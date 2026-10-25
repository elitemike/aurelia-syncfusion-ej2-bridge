import { Locator, Page } from '@playwright/test';

/** Evaluate a function against the live Syncfusion widget instance of the first widget host inside a locator. */
export async function inst<R = any>(scope: Locator, fn: (widget: any, arg?: any) => R, arg?: any): Promise<R> {
  return scope.locator('.e-control').first().evaluate((el: any, [source, a]: [string, any]) => {
    // eslint-disable-next-line no-new-func
    return new Function('widget', 'arg', `return (${source})(widget, arg)`)(el.ej2_instances[0], a);
  }, [fn.toString(), arg] as [string, any]);
}

/** Read the {count, last} record the demo handlers write into window.__diagramEvents. */
export async function eventCount(page: Page, name: string): Promise<number> {
  return page.evaluate((n) => ((window as any).__diagramEvents || {})[n]?.count || 0, name);
}

/** Primitive members of the last arguments of an event (the real arguments hold circular diagram references). */
export async function eventLast(page: Page, name: string): Promise<any> {
  return page.evaluate((n) => {
    const rec = ((window as any).__diagramEvents || {})[n];
    if (!rec || !rec.last) { return null; }
    const out: any = {};
    Object.keys(rec.last).forEach((k) => {
      const v = rec.last[k];
      if (v === null || ['string', 'number', 'boolean'].indexOf(typeof v) !== -1) { out[k] = v; }
    });
    return out;
  }, name);
}

/** Runs against the last arguments of an event inside the page. */
export async function eventEval<R = any>(page: Page, name: string, fn: (args: any) => R): Promise<R> {
  return page.evaluate(([n, source]) => {
    const rec = ((window as any).__diagramEvents || {})[n];
    // eslint-disable-next-line no-new-func
    return new Function('args', `return (${source})(args)`)(rec && rec.last);
  }, [name, fn.toString()] as [string, string]);
}

/** Viewport position of the middle of an element, scrolled into view first (the mouse works in viewport coordinates). */
export async function center(target: Locator) {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) { throw new Error('element has no bounding box'); }
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Real mouse drag between two viewport points. */
export async function drag(page: Page, from: { x: number, y: number }, to: { x: number, y: number }, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
  await page.mouse.up();
}

/** Hover with a few intermediate moves, the diagram only reacts to real mouse movement. */
export async function hover(page: Page, at: { x: number, y: number }) {
  await page.mouse.move(at.x - 12, at.y - 12);
  await page.mouse.move(at.x, at.y, { steps: 6 });
  await page.mouse.move(at.x + 1, at.y + 1, { steps: 2 });
}

