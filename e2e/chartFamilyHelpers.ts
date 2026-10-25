import { Locator, Page, expect } from '@playwright/test';

/** The Syncfusion widget host element inside a demo chart located by test id. */
export function chartHost(scope: Locator, testId: string) {
  return scope.getByTestId(testId).locator('.e-control').first();
}

/** Evaluate a function against the live Syncfusion widget instance of a host element. */
export async function inst<R = any>(host: Locator, fn: (chart: any) => R): Promise<R> {
  return host.evaluate((el: any, source: string) => {
    // eslint-disable-next-line no-new-func
    return new Function('chart', `return (${source})(chart)`)(el.ej2_instances[0]);
  }, fn.toString());
}

/** Element id of the host (every SVG id is prefixed with it). */
export async function hostId(host: Locator): Promise<string> {
  return host.evaluate((el: any) => el.id);
}

/** Read the {count, last} record the demo handlers write into window.__chartEvents. */
export async function eventCount(page: Page, name: string): Promise<number> {
  return page.evaluate((n) => ((window as any).__chartEvents || {})[n]?.count || 0, name);
}

/** Primitive members of the last args an event was raised with (the args hold circular chart references). */
export async function eventLast(page: Page, name: string): Promise<any> {
  return page.evaluate((n) => {
    const rec = ((window as any).__chartEvents || {})[n];
    if (!rec || !rec.last) { return null; }
    const out: any = {};
    Object.keys(rec.last).forEach((k) => {
      const v = rec.last[k];
      if (v === null || ['string', 'number', 'boolean'].indexOf(typeof v) !== -1) { out[k] = v; }
    });
    return out;
  }, name);
}

/** Bounding box in viewport coordinates, the demo pages are long so scroll the element in first. */
export async function visibleBox(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  return locator.boundingBox();
}

/**
 * Viewport point that (once the animation settled) really hits one of the faces of a 3D point. The faces overlap, so the center of a face's
 * bounding box often belongs to a neighbour: probe a grid and keep a spot whose topmost element is a wanted face.
 */
export async function hitPoint(host: Locator, selector: string): Promise<{ x: number; y: number }> {
  await host.locator(selector).first().scrollIntoViewIfNeeded();
  const probe = () => host.evaluate((el: any, sel: string) => {
    el.scrollIntoView({ block: 'center' });
    const faces = Array.from(el.querySelectorAll(sel)) as Element[];
    for (const face of faces) {
      const r = face.getBoundingClientRect();
      for (let i = 1; i < 8; i++) {
        for (let j = 1; j < 8; j++) {
          const x = r.left + (r.width * i) / 8;
          const y = r.top + (r.height * j) / 8;
          const hit = document.elementFromPoint(x, y);
          if (hit && faces.indexOf(hit) !== -1) { return { x, y }; }
        }
      }
    }
    return null;
  }, selector);
  // the 3D series animate in, the faces only settle once the animation is over
  await expect.poll(async () => (await probe()) !== null, { message: `a visible spot for ${selector}` }).toBe(true);
  return probe();
}

/** Center of an element in viewport coordinates. */
export async function center(locator: Locator) {
  const box = await visibleBox(locator);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}
