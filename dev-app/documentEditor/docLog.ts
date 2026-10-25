/**
 * Records every handler call in window.__docEvents so tests can assert that an event was raised (and with which
 * arguments). `name` is `<editor>.<event>`.
 */
export function logEvent(name: string, args?: any) {
  const store = ((window as any).__docEvents = (window as any).__docEvents || {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = args === undefined ? null : args;
}
