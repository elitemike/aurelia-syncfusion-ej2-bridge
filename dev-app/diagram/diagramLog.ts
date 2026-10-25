/**
 * Records every event a demo diagram raises so the specs can assert the handler fired (count and last args).
 * The bridge also forwards native DOM events with the same name (click, keydown, drop, ...) that bubble up to the
 * element, only the CustomEvents dispatched by the bridge carry the Syncfusion arguments.
 */
export function logEvent(name: string, e: Event) {
  if (!(e instanceof CustomEvent)) { return; }
  const w = window as any;
  const store = w.__diagramEvents || (w.__diagramEvents = {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = e.detail;
}
