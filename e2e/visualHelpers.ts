import { Locator, Page } from '@playwright/test';

/** Syncfusion keeps the live component on the host element it was appended to (`ej2_instances`). */
export function hostOf(control: Locator): Locator {
  return control.locator('.e-control').first();
}

/** Read a (JSON-serialisable) property from the Syncfusion widget rendered inside a bridge element. */
export async function widgetProp(control: Locator, name: string): Promise<any> {
  return hostOf(control).evaluate((el: any, n: string) => {
    const value = el.ej2_instances[0][n];
    const seen = new WeakSet();
    const skip = ['parentObj', 'controlParent', 'parent', 'ownerDocument'];
    const replacer = (key: string, v: any) => {
      if (skip.indexOf(key) !== -1 || v instanceof Element) { return undefined; }
      if (v && typeof v === 'object') {
        if (seen.has(v)) { return undefined; }
        seen.add(v);
      }
      return v;
    };
    return value === undefined ? null : JSON.parse(JSON.stringify(value, replacer));
  }, name);
}

/** Run a function against the Syncfusion widget rendered inside a bridge element. */
export async function widgetCall<T = any>(control: Locator, fn: (widget: any, arg?: any) => T, arg?: any): Promise<T> {
  return hostOf(control).evaluate((el: any, [source, a]: [string, any]) => {
    // eslint-disable-next-line no-new-func
    return new Function('widget', 'arg', `return (${source})(widget, arg)`)(el.ej2_instances[0], a);
  }, [fn.toString(), arg] as [string, any]);
}

/** Move the real mouse over an svg shape. Stroke-only paths have no visible area for locator.hover(), so use the box. */
export async function moveOver(target: Locator, fx = 0.5, fy = 0.5) {
  await target.evaluate((el: Element) => el.scrollIntoView({ block: 'center', inline: 'center' }));
  const box = await target.boundingBox();
  if (!box) { throw new Error('element has no bounding box'); }
  const x = box.x + box.width * fx;
  const y = box.y + box.height * fy;
  await target.page().mouse.move(x, y);
  return { x, y };
}

/** Click the middle of an svg shape with the real mouse. */
export async function clickOver(target: Locator, fx = 0.5, fy = 0.5) {
  const { x, y } = await moveOver(target, fx, fy);
  await target.page().mouse.down();
  await target.page().mouse.up();
  return { x, y };
}

/** Current value of a demo output element as a number (counters). */
export async function counter(page: Page | Locator, testId: string): Promise<number> {
  return Number(await page.getByTestId(testId).innerText());
}
