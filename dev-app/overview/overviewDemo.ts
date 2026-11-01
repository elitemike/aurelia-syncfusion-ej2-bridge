import { logEvent } from '../diagram/diagramLog';
import { Ej2Diagram } from 'widgets/diagram/ej2-diagram';
import { Ej2Overview } from 'widgets/overview/ej2-overview';
import { viewResources } from 'aurelia-framework';

const grid = (prefix: string) => {
  const nodes: any[] = [];
  for (let i = 0; i < 12; i++) {
    nodes.push({ id: prefix + i, offsetX: 60 + (i % 4) * 160, offsetY: 60 + Math.floor(i / 4) * 120, width: 100, height: 50, annotations: [{ content: prefix + i }] });
  }
  return nodes;
};

@viewResources(Ej2Diagram, Ej2Overview)
export class OverviewDemo {
  log = (name: string, e: Event) => logEvent('ov:' + name, e);

  nodes = grid('a');
  otherNodes = grid('b');
  lateNodes = grid('c');
  scroll = { scrollLimit: 'Infinity' };
  sourceId = 'ov-diagram';

  useOther() {
    this.sourceId = 'ov-diagram-2';
  }
}
