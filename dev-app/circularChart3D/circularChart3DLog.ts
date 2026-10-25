/** Records every event a demo chart raises so the specs can assert the handler fired (count and last args). */
export function logEvent(name: string, e: CustomEvent) {
  const w = window as any;
  const store = w.__chartEvents || (w.__chartEvents = {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = e && e.detail;
}

export const browsers = [
  { browser: 'Chrome', users: 37, text: '37%' },
  { browser: 'Safari', users: 27, text: '27%' },
  { browser: 'Edge', users: 14, text: '14%' },
  { browser: 'Firefox', users: 12, text: '12%' },
  { browser: 'Other', users: 10, text: '10%' }
];
