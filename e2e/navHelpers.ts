import { Locator } from '@playwright/test';

/** Read a property from the Syncfusion widget that is rendered on the located element (the widget root element). */
export function widgetProp(el: Locator, prop: string) {
  return el.evaluate((node: any, p: string) => node.ej2_instances[0][p], prop);
}

/** Like wrapperProp but resolves a dotted path (e.g. `animationSettings.effect`) in the page, complex properties do not serialize. */
export function wrapperPath(el: Locator, path: string) {
  return el.evaluate((node: any, p: string) => {
    const vm = Object.values(node.au as any).map((c: any) => c.viewModel).find((v: any) => v && v.widget);
    return p.split('.').reduce((o: any, k) => (o == null ? o : o[k]), vm.widget);
  }, path);
}

/** Read a property from the Syncfusion widget behind the wrapper element found by test id. */
export function wrapperProp(el: Locator, prop: string) {
  return el.evaluate((node: any, p: string) => {
    const vm = Object.values(node.au as any).map((c: any) => c.viewModel).find((v: any) => v && v.widget);
    return vm.widget[p];
  }, prop);
}
