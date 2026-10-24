import { Locator } from '@playwright/test';

/** Read a plain value from the Syncfusion widget instance living on the element (or its first ancestor that has one). */
export function widgetProp<T = any>(el: Locator, prop: string): Promise<T> {
  return el.evaluate((node, p) => {
    let n: any = node;
    while (n && !(n.ej2_instances && n.ej2_instances.length)) { n = n.parentElement; }
    const v = n.ej2_instances[0][p];
    // complex properties (position, animation...) are wrapper objects with a parentObj back reference, unwrap them
    const replacer = (_k: string, x: any) => (x && typeof x === 'object' && x.parentObj && x.properties) ? x.properties : x;
    return JSON.parse(JSON.stringify(v === undefined ? null : v, replacer));
  }, prop);
}

/** Call a method on the Syncfusion widget instance of the element. */
export function widgetCall(el: Locator, method: string, ...args: any[]): Promise<any> {
  return el.evaluate((node, [m, a]: [string, any[]]) => {
    let n: any = node;
    while (n && !(n.ej2_instances && n.ej2_instances.length)) { n = n.parentElement; }
    return n.ej2_instances[0][m](...a);
  }, [method, args] as [string, any[]]);
}
