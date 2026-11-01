import { SelectorConstraints } from '@syncfusion/ej2-diagrams';
import { logEvent } from './diagramLog';
import { Ej2Diagram } from 'widgets/diagram/ej2-diagram';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Diagram)
export class DiagramTemplatesDemo {
  log = logEvent;
  // ES template strings, evaluated with the node / annotation / handle as data
  nodeTemplate = '<div class="html-node-tpl" style="width:100%;height:100%;background:#cfe8cf;text-align:center">Node ${id}</div>';
  annotationTemplate = '<div class="annotation-tpl" style="background:#ffe08a">Note ${id}</div>';
  userHandleTemplate = '<div class="user-handle-tpl" style="background:#f4a261;width:24px;height:24px">${name}</div>';
  fixedUserHandleTemplate = '<div class="fixed-handle-tpl" style="background:#a2d2ff;width:100%;height:100%">${id}</div>';

  nodes: any[] = [
    {
      id: 'html1', offsetX: 150, offsetY: 110, width: 160, height: 80, shape: { type: 'HTML' },
      annotations: [{ id: 'note1', width: 90, height: 24, offset: { x: 0.5, y: 1.2 } }],
      fixedUserHandles: [{ id: 'fixed1', width: 26, height: 26, offset: { x: 1, y: 0 }, margin: { left: 4, top: 0, right: 0, bottom: 0 } }]
    }
  ];

  selected = {
    constraints: SelectorConstraints.All | SelectorConstraints.UserHandle,
    userHandles: [{
      name: 'tplHandle', template: '', side: 'Bottom', offset: 0.5, size: 24, backgroundColor: '#f4a261',
      horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }
    }]
  };
}
