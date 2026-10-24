/** Records every event a demo grid raises so the specs can assert the handler fired (count and last args). */
export function logEvent(name: string, e: CustomEvent) {
  const w = window as any;
  const store = w.__gridEvents || (w.__gridEvents = {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = e && e.detail;
}
