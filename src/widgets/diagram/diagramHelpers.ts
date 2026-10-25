import { ensureHostId } from '../visualizationHelpers';

/**
 * The diagram family (Diagram, SymbolPalette, Overview, Ruler) is wired together by element id (`sourceID`,
 * `targetID`, palette drops). A user supplied `id` on the bridge element has to live on the element the widget is
 * appended to, otherwise `document.getElementById(id)` would find the bridge element and not the widget host.
 * Without an id the host receives a generated one, the widgets derive their svg ids from it.
 */
export function moveIdToHost(element: Element, host: HTMLElement, prefix: string) {
  const id = element.getAttribute('id');
  if (id && host) {
    element.removeAttribute('id');
    host.setAttribute('id', id);
  }
  ensureHostId(host, prefix);
}

/**
 * Some of the diagram components only raise an event when a handler is assigned as a property, the bridge listens
 * with addEventListener. Assign a placeholder so every event reaches the template.
 */
export function assignEventPlaceholders(widget: any, events: string[], prefix: string) {
  const noop = () => { /* placeholder so the event is raised */ };
  events.forEach((name) => {
    const event = name.substr(prefix.length);
    if (!widget[event]) {
      widget[event] = noop;
    }
  });
}
