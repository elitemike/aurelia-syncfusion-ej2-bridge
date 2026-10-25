/** Records every event a demo chart raises so the specs can assert the handler fired (count and last args). */
export function logEvent(name: string, e: CustomEvent) {
  const w = window as any;
  const store = w.__chartEvents || (w.__chartEvents = {});
  const rec = store[name] || (store[name] = { count: 0, last: null });
  rec.count++;
  rec.last = e && e.detail;
}

export const transmission1 = [
  { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 }, { resistance: 6, reactance: 4.5 },
  { resistance: 4.5, reactance: 2 }, { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
  { resistance: 2, reactance: 1.1 }, { resistance: 1.5, reactance: 0.6 }, { resistance: 1, reactance: 0 },
  { resistance: 0.5, reactance: -0.3 }, { resistance: 0.25, reactance: -0.25 }, { resistance: 0.05, reactance: -0.1 }
];
export const transmission2 = [
  { resistance: 20, reactance: -50 }, { resistance: 10, reactance: -10 }, { resistance: 9, reactance: -4.5 },
  { resistance: 8, reactance: -3.5 }, { resistance: 7, reactance: -2.5 }, { resistance: 6, reactance: -1.5 },
  { resistance: 5, reactance: -1 }, { resistance: 4, reactance: -0.5 }, { resistance: 3.5, reactance: -0.3 },
  { resistance: 3, reactance: 0 }, { resistance: 2.5, reactance: 0.5 }, { resistance: 2, reactance: 1 }
];
