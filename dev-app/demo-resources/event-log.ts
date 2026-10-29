/**
 * Dev-app logger: one capture-phase listener on the document records every event the bridge raises on an
 * <ej2-*> host (e-on-* CustomEvents) and every binding-to-widget property write ('bridge-property-set'),
 * so a demo shows data actually moving in both directions. Entries are also printed with console.debug.
 */
export interface LogEntry { id: number; time: string; control: string; kind: 'event' | 'property'; name: string; data: string; }

const MAX_ENTRIES = 300;

function summarize(value: any, depth = 0): any {
  if (value === null || value === undefined || typeof value !== 'object') {
    return typeof value === 'function' ? '[fn]' : value;
  }
  if (value instanceof Date) { return value.toISOString(); }
  if (typeof Node !== 'undefined' && value instanceof Node) { return `<${(value as Element).nodeName.toLowerCase()}>`; }
  if (Array.isArray(value)) { return depth > 1 ? `[${value.length} items]` : value.slice(0, 5).map(v => summarize(v, depth + 1)); }
  if (depth > 1) { return '{…}'; }
  const out: any = {};
  Object.keys(value).slice(0, 8).forEach(k => {
    if (k === 'event' || k === 'cancel' && value[k] === false) { return; }
    try { out[k] = summarize(value[k], depth + 1); } catch (e) { out[k] = '[unreadable]'; }
  });
  return out;
}

function format(value: any): string {
  let text: string;
  try { text = JSON.stringify(summarize(value)); } catch (e) { text = String(value); }
  text = text === undefined ? '' : text;
  return text.length > 220 ? text.slice(0, 217) + '…' : text;
}

export class EventLog {
  entries: LogEntry[] = [];
  private counter = 0;

  attach(root: Document = document) {
    root.addEventListener('bridge-event', e => this.onEvent(e as CustomEvent), true);
    root.addEventListener('bridge-property-set', e => this.onProperty(e as CustomEvent), true);
  }

  clear() { this.entries = []; }

  private onEvent(e: CustomEvent) {
    this.push(e.target as Element, 'event', e.detail.name, e.detail.args);
  }

  private onProperty(e: CustomEvent) {
    this.push(e.target as Element, 'property', e.detail.property, e.detail.value);
  }

  private push(target: Element, kind: 'event' | 'property', name: string, data: any) {
    const control = ((target && target.tagName) || '').toLowerCase().replace(/^ej2-/, '');
    const id = target && target.id ? `${control}#${target.id}` : control;
    const entry: LogEntry = { id: ++this.counter, time: new Date().toISOString().substr(11, 12), control: id, kind, name, data: format(data) };
    this.entries = [entry, ...this.entries].slice(0, MAX_ENTRIES);
    // eslint-disable-next-line no-console
    console.debug(`[bridge] ${kind} ${id} ${name}`, data);
  }
}
