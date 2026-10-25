import { DiagramConstraints, ConnectorConstraints } from '@syncfusion/ej2-diagrams';
import { logEvent } from './diagramLog';

const image = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#e76f51"/></svg>');

export class DiagramEventsDemo {
  log = (name: string, e: Event) => logEvent('ev:' + name, e);

  constraints = DiagramConstraints.Default | DiagramConstraints.Tooltip;
  contextMenu = { show: true };
  scroll = { scrollLimit: 'Infinity' };
  nodeDefaults = { style: { fill: '#8fc1e3', strokeColor: '#3a6ea5' } };
  connectorDefaults = { style: { strokeColor: '#3a6ea5', strokeWidth: 2 } };

  nodes: any[] = [
    { id: 'n1', width: 100, height: 50, offsetX: 100, offsetY: 80, annotations: [{ id: 'l1', content: 'One' }] },
    { id: 'n2', width: 100, height: 50, offsetX: 300, offsetY: 150, annotations: [{ id: 'l2', content: 'Two' }] },
    { id: 'img', offsetX: 520, offsetY: 80, shape: { type: 'Image', source: image } },
    { id: 'n3', width: 100, height: 50, offsetX: 150, offsetY: 300, annotations: [{ id: 'l3', content: 'Three' }] },
    { id: 'n4', width: 100, height: 50, offsetX: 450, offsetY: 300, annotations: [{ id: 'l4', content: 'Four' }] },
    {
      id: 'er1', offsetX: 580, offsetY: 230,
      shape: {
        type: 'Er', header: { annotation: { content: 'Customer' } },
        fields: [{ id: 'f1', name: 'Id', dataType: 'int', isPrimaryKey: true }, { id: 'f2', name: 'Name', dataType: 'string' }]
      }
    }
  ];
  connectors: any[] = [
    { id: 'oc', type: 'Orthogonal', constraints: ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb, sourceID: 'n1', targetID: 'n2', segments: [{ type: 'Orthogonal', direction: 'Right', length: 60 }, { type: 'Orthogonal', direction: 'Bottom', length: 70 }] },
    { id: 'free', type: 'Straight', sourcePoint: { x: 260, y: 200 }, targetPoint: { x: 380, y: 200 } }
  ];
}
