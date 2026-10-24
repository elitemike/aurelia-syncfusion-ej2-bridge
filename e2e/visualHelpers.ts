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

/** Current value of a demo output element as a number (counters). */
export async function counter(page: Page | Locator, testId: string): Promise<number> {
  return Number(await page.getByTestId(testId).innerText());
}
