import { TextElement, Canvas } from '@syncfusion/ej2-diagrams';
import { logEvent } from '../diagram/diagramLog';
import { Ej2Diagram } from 'widgets/diagram/ej2-diagram';
import { Ej2SymbolPalette } from 'widgets/symbolPalette/ej2-symbolPalette';
import { viewResources } from 'aurelia-framework';

const count = (name: string) => {
  const w = window as any;
  w.__paletteFn = w.__paletteFn || {};
  w.__paletteFn[name] = (w.__paletteFn[name] || 0) + 1;
};

@viewResources(Ej2Diagram, Ej2SymbolPalette)
export class SymbolPaletteDemo {
  log = (name: string, e: Event) => logEvent('pal:' + name, e);

  // every palette gets its own copy, the palette turns the symbol definitions into live nodes
  // ids must be unique on the page: the accordion finds palette content by id
  private makePalettes(prefix: string): any[] {
    return [
      {
        id: prefix + 'flow', expanded: true, title: 'Flow shapes', symbols: [
          { id: prefix + 'Terminator', shape: { type: 'Flow', shape: 'Terminator' } },
          { id: prefix + 'Process', shape: { type: 'Flow', shape: 'Process' } },
          { id: prefix + 'Decision', shape: { type: 'Flow', shape: 'Decision' } }
        ]
      },
      {
        id: prefix + 'basic', expanded: false, title: 'Basic shapes', symbols: [
          { id: prefix + 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' } },
          { id: prefix + 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' } },
          { id: prefix + 'Triangle', shape: { type: 'Basic', shape: 'Triangle' } }
        ]
      },
      {
        id: prefix + 'connectors', expanded: false, title: 'Connectors', symbols: [
          { id: prefix + 'Link', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 }, targetDecorator: { shape: 'Arrow' } }
        ]
      }
    ];
  }

  palettes: any[] = this.makePalettes('b');
  defaultPalettes: any[] = this.makePalettes('d');

  symbolMargin = { left: 12, right: 12, top: 12, bottom: 12 };
  symbolPreview = { width: 90, height: 70 };
  symbolDragSize = { width: 80, height: 45 };

  // the diagram the symbols are dropped on, its drag and drop events are logged
  dropNodes: any[] = [];

  // ---- search and filtering
  searchPalettes: any[] = [{
    id: 'ssearchable', expanded: true, title: 'Shapes',
    symbols: [
      { id: 'sTerminator', shape: { type: 'Flow', shape: 'Terminator' } },
      { id: 'sProcess', shape: { type: 'Flow', shape: 'Process' } },
      { id: 'sDecision', shape: { type: 'Flow', shape: 'Decision' } },
      { id: 'sDocument', shape: { type: 'Flow', shape: 'Document' } },
      { id: 'sRectangle', shape: { type: 'Basic', shape: 'Rectangle' } }
    ]
  }];
  ignored = ['sRectangle'];
  filterSymbols = (symbols: any[]) => {
    count('filterSymbols');
    return symbols.filter((symbol) => symbol.id !== 'sDocument');
  }

  // ---- symbol info, defaults
  symbolInfo = { fit: true, width: 40, height: 40 };
  getSymbolInfo = (symbol: any) => {
    count('getSymbolInfo');
    return { fit: true, description: { text: 'about ' + symbol.id }, tooltip: 'tip ' + symbol.id };
  }
  getNodeDefaults = (node: any) => {
    count('getNodeDefaults');
    node.style = { fill: '#ffe08a', strokeColor: '#b58900' };
    return node;
  }
  nodeDefaults = { width: 60, height: 40 };
  getConnectorDefaults = (connector: any) => {
    count('getConnectorDefaults');
    connector.style = { strokeColor: '#c0392b', strokeWidth: 3 };
    return connector;
  }
  connectorDefaults = { type: 'Orthogonal' };

  // ---- templates
  templatePalettes: any[] = [{
    id: 'tplPalette', expanded: true, title: 'Templates',
    symbols: [
      { id: 'tplA', addInfo: { label: 'Alpha' } },
      { id: 'tplB', addInfo: { label: 'Beta' } }
    ]
  }];
  getSymbolTemplate = (symbol: any) => {
    count('getSymbolTemplate');
    const canvas = new Canvas();
    canvas.id = symbol.id + '_tplcanvas';
    canvas.style.fill = '#b7e4c7';
    const text = new TextElement();
    text.id = symbol.id + '_tpltext';
    text.content = symbol.addInfo && symbol.addInfo.label;
    canvas.children = [text];
    return canvas;
  }
  nodeTemplate = '<div class="palette-node-tpl" style="width:100%;height:100%;background:#cfe8cf">${id}</div>';
  htmlPalettes: any[] = [{
    id: 'html', expanded: true, title: 'HTML symbols',
    symbols: [{ id: 'htmlA', width: 60, height: 40, shape: { type: 'HTML' } }]
  }];
}
