/**
 * Records every handler call in window.__pvEvents so tests can assert that an event was raised (and with which arguments)
 * without rendering anything. `name` is `<viewer>.<event>`.
 */
export function logEvent(name: string, args?: any) {
  const store = ((window as any).__pvEvents = (window as any).__pvEvents || {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = args === undefined ? null : args;
}
