/** Records every event a demo chart raises so the specs can assert the handler fired (count and last args). */
export function logEvent(name: string, e: CustomEvent) {
  const w = window as any;
  const store = w.__chartEvents || (w.__chartEvents = {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = e && e.detail;
}

export const salesData = [
  { month: 'Jan', sales: 35, profit: 12, target: 30 },
  { month: 'Feb', sales: 28, profit: 8, target: 32 },
  { month: 'Mar', sales: 34, profit: 14, target: 33 },
  { month: 'Apr', sales: 32, profit: 11, target: 34 },
  { month: 'May', sales: 40, profit: 18, target: 36 },
  { month: 'Jun', sales: 38, profit: 15, target: 38 }
];
