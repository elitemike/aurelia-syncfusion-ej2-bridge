import { Locator } from '@playwright/test';

/** Read properties of the Syncfusion widget instance behind an `<ej2-*>` wrapper element. */
export function widgetProps(host: Locator, names: string[]) {
  return host.evaluate((el: any, props: string[]) => {
    const widget = el.au[el.tagName.toLowerCase()].viewModel.widget;
    const conv = (v: any) => v instanceof Date ? v.toISOString() : v;
    const out: any = {};
    props.forEach(p => {
      const v = widget[p];
      out[p] = Array.isArray(v) ? v.map(conv) : conv(v);
    });
    return out;
  }, names);
}

export function widgetProp(host: Locator, name: string) {
  return widgetProps(host, [name]).then(r => r[name]);
}

/** Run a function against the widget instance (e.g. to call its API). */
export function onWidget(host: Locator, fn: (widget: any) => any) {
  return host.evaluate((el: any, src: string) => {
    const widget = el.au[el.tagName.toLowerCase()].viewModel.widget;
    return (new Function('widget', `return (${src})(widget)`))(widget);
  }, fn.toString());
}
