import { constants } from '../common/constants';

let hostCounter = 0;

/**
 * Charts generate a host id themselves (needsID), progress bar, gauges, maps and tree map do not but derive every
 * svg / element id from it and look them up with document.getElementById. Give the host a unique id before the
 * widget is appended.
 */
export function ensureHostId(element: HTMLElement, prefix: string) {
  if (element && !element.id) {
    element.id = `${prefix}_${hostCounter++}`;
  }
}

/**
 * These components only react to a handful of properties after they were rendered, every other property
 * (colors, sizes, thickness, themes, ...) is silently ignored by their onPropertyChanged. Syncfusion's documented
 * way to apply such a change is refresh(), which re-renders the component from its current properties.
 *
 * The bridge looks for a `<property>Changed` method on the wrapper before it writes a bound value to the widget.
 * Provide one for every bindable property outside `handled`: it writes the value and schedules a single refresh
 * for all properties that changed in the same turn. (Hooking the widget's own onPropertyChanged instead would also
 * catch the components' internal normalisation writes, e.g. cornerRadius 'Auto', and re-render forever.)
 */
export function refreshOnPropertyChange(wrapper: any, widget: any, handled: string[]) {
  let pending = false;
  const schedule = () => {
    if (pending) { return; }
    pending = true;
    Promise.resolve().then(() => {
      pending = false;
      if (wrapper.widget === widget && !widget.isDestroyed) {
        widget.refresh();
      }
    });
  };
  const prefixLength = constants.bindablePrefix.length;
  wrapper.getBindables().bindableProperties.forEach((binding: string) => {
    const name = binding.substr(prefixLength);
    if (handled.indexOf(name) !== -1) { return; }
    wrapper[`${name}Changed`] = (newValue: any) => {
      // keep the widget's own value in sync with the latest bound value, then re-render
      widget.setProperties({ [name]: wrapper[binding] === undefined ? newValue : wrapper[binding] }, true);
      schedule();
    };
  });
}
