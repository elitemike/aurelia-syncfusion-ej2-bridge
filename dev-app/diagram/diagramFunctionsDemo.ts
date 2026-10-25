import { Canvas, TextElement, ToolBase, SelectorConstraints, DiagramConstraints } from '@syncfusion/ej2-diagrams';
import { logEvent } from './diagramLog';

const count = (name: string) => {
  const w = window as any;
  w.__diagramFn = w.__diagramFn || {};
  w.__diagramFn[name] = (w.__diagramFn[name] || 0) + 1;
};

class CloneTool extends ToolBase {
  public mouseDown(args: any) {
    super.mouseDown(args);
    count('customToolMouseDown');
  }
}

export class DiagramFunctionsDemo {
  log = logEvent;
  constraints = DiagramConstraints.Default | DiagramConstraints.Tooltip;

  nodes: any[] = [
    { id: 'plain', offsetX: 100, offsetY: 90, annotations: [{ content: 'Plain' }] },
    { id: 'custom', offsetX: 320, offsetY: 90 },
    { id: 'blank', offsetX: 210, offsetY: 220, annotations: [{ content: 'Blank' }] }
  ];
  connectors: any[] = [{ id: 'fc1', sourceID: 'plain', targetID: 'custom' }];

  selected = {
    constraints: SelectorConstraints.All | SelectorConstraints.UserHandle,
    userHandles: [{
      name: 'clone', pathData: 'M 0 0 L 20 0 L 20 20 L 0 20 Z', side: 'Top', offset: 0.5, pathColor: '#c0392b', backgroundColor: '#ffffff',
      size: 24, horizontalAlignment: 'Center', verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }
    }]
  };

  customCursor = [{ action: 'Rotate', cursor: 'wait' }];

  getNodeDefaults = (node: any) => {
    count('getNodeDefaults');
    node.width = 110;
    node.height = 50;
    node.style = { fill: '#ffe08a', strokeColor: '#b58900' };
    return node;
  }

  getConnectorDefaults = (connector: any) => {
    count('getConnectorDefaults');
    connector.type = 'Straight';
    connector.style = { strokeColor: '#c0392b', strokeWidth: 3 };
    return connector;
  }

  setNodeTemplate = (node: any) => {
    if (node.id === 'custom') {
      count('setNodeTemplate');
      const canvas = new Canvas();
      canvas.id = 'custom_canvas';
      canvas.style.fill = '#b7e4c7';
      canvas.style.strokeColor = '#2d6a4f';
      const text = new TextElement();
      text.id = 'custom_text';
      text.content = 'From setNodeTemplate';
      text.style.color = '#1b4332';
      text.margin = { left: 4, right: 4, top: 4, bottom: 4 };
      canvas.children = [text];
      return canvas;
    }
    return undefined;
  }

  getDescription = (obj: any) => {
    count('getDescription');
    return 'Described ' + (obj && obj.id);
  }

  getCustomProperty = (key: string) => {
    count('getCustomProperty');
    return key === 'nodes' ? ['description'] : null;
  }

  getCustomTool = (action: string) => {
    if (action === 'clone') {
      const host: any = document.getElementById('diagram-functions-host');
      return new CloneTool(host.ej2_instances[0].commandHandler, true);
    }
    return undefined;
  }

  getCustomCursor = (action: string, active: boolean) => {
    count('getCustomCursor');
    return action === 'Drag' && !active ? 'copy' : undefined;
  }

  updateSelection = (obj: any, diagram: any) => {
    count('updateSelection');
    const target = obj && diagram.getObject(obj.id);
    if (target) { diagram.select([target]); }
  }
}
