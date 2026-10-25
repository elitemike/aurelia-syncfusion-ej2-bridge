import { Locator } from '@playwright/test';

// Resolve the Syncfusion widget instance for an element: the element itself, then its ancestors, then its descendants
// (the Aurelia wrapper element `ej2-xxx` hosts the real widget element as a child).
const FIND_INSTANCE = `
  function findInstance(node) {
    var n = node;
    while (n && !(n.ej2_instances && n.ej2_instances.length)) { n = n.parentElement; }
    if (n) { return n.ej2_instances[0]; }
    var all = node.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) { if (all[i].ej2_instances && all[i].ej2_instances.length) { return all[i].ej2_instances[0]; } }
    return null;
  }`;

/** Read a plain value from the Syncfusion widget instance belonging to the element. */
export function widgetProp<T = any>(el: Locator, prop: string): Promise<T> {
  return el.evaluate((node, [p, finder]: [string, string]) => {
    const instance = new Function(`${finder}; return findInstance;`)()(node);
    const v = instance[p];
    // complex properties (position, animation...) are wrapper objects with a parentObj back reference, unwrap them
    const replacer = (_k: string, x: any) => (x && typeof x === 'object' && x.parentObj && x.properties) ? x.properties : x;
    return JSON.parse(JSON.stringify(v === undefined ? null : v, replacer));
  }, [prop, FIND_INSTANCE] as [string, string]);
}

/** Call a method on the Syncfusion widget instance belonging to the element. */
export function widgetCall(el: Locator, method: string, ...args: any[]): Promise<any> {
  return el.evaluate((node, [m, a, finder]: [string, any[], string]) => {
    const instance = new Function(`${finder}; return findInstance;`)()(node);
    return instance[m](...a);
  }, [method, args, FIND_INSTANCE] as [string, any[], string]);
}
