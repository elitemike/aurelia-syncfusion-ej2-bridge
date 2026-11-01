import {
  DiagramConstraints, DiagramTools, SnapConstraints, TextElement, SelectorConstraints, Keys, KeyModifiers
} from '@syncfusion/ej2-diagrams';
import { logEvent } from './diagramLog';
import { Ej2Diagram } from 'widgets/diagram/ej2-diagram';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Diagram)
export class DiagramBasicDemo {
  log = logEvent;
  addInfo = { owner: 'demo' };

  nodes: any[] = [
    { id: 'start', offsetX: 150, offsetY: 50, shape: { type: 'Flow', shape: 'Terminator' }, annotations: [{ content: 'Start' }] },
    { id: 'process', offsetX: 150, offsetY: 150, shape: { type: 'Flow', shape: 'Process' }, annotations: [{ content: 'Process' }] },
    { id: 'decision', offsetX: 150, offsetY: 250, shape: { type: 'Flow', shape: 'Decision' }, annotations: [{ content: 'Decision' }] },
    { id: 'end', offsetX: 350, offsetY: 250, shape: { type: 'Flow', shape: 'Terminator' }, annotations: [{ content: 'End' }] }
  ];
  connectors: any[] = [
    { id: 'c1', sourceID: 'start', targetID: 'process' },
    { id: 'c2', sourceID: 'process', targetID: 'decision' },
    { id: 'c3', sourceID: 'decision', targetID: 'end', annotations: [{ content: 'Yes' }] }
  ];
  nodeDefaults = { width: 100, height: 50, style: { fill: '#6ba5d7', strokeColor: 'white' } };
  connectorDefaults = { type: 'Orthogonal', style: { strokeColor: '#6ba5d7', strokeWidth: 2 }, targetDecorator: { style: { fill: '#6ba5d7', strokeColor: '#6ba5d7' } } };

  webMcp = { name: 'demo-diagram' };
  contextMenu = { show: true, showCustomMenuOnly: false, items: [{ text: 'Say hello', id: 'hello', target: '.e-diagramcontent', iconCss: 'e-menu-icon' }] };
  constraints = DiagramConstraints.Default | DiagramConstraints.Bridging | DiagramConstraints.Tooltip;
  tool = DiagramTools.Default;
  snap = { constraints: SnapConstraints.ShowLines, horizontalGridlines: { lineColor: '#d0d0d0', lineIntervals: [1, 9] }, verticalGridlines: { lineColor: '#d0d0d0', lineIntervals: [1, 9] } };
  rulers = { showRulers: true, horizontalRuler: { interval: 10, segmentWidth: 100 }, verticalRuler: { interval: 10, segmentWidth: 100 } };
  page = { width: 500, height: 320, background: { color: '#ffffff' }, showPageBreaks: true, multiplePage: false };
  serialization = { preventDefaults: true };
  drawingObject = { id: 'drawn', shape: { type: 'Basic', shape: 'Rectangle' } };
  basicElements: any[] = [this.makeElement()];
  tooltip = { content: 'Diagram tooltip', position: 'BottomRight', relativeMode: 'Object' };
  history = { stackLimit: 4 };
  diagramSettings = { inversedAlignment: true };
  scroll = { scrollLimit: 'Infinity', canAutoScroll: false };
  selected = { constraints: SelectorConstraints.All & ~SelectorConstraints.Rotate };
  layers = [{ id: 'layer1', visible: true, lock: false, objects: ['start', 'process'] }];
  commands = { commands: [{ name: 'customCommand', canExecute: () => true, execute: () => { (window as any).__customCommand = ((window as any).__customCommand || 0) + 1; }, gesture: { key: Keys.Q, keyModifiers: KeyModifiers.Control | KeyModifiers.Shift } }] };
  drawOnce = DiagramTools.DrawOnce;

  private makeElement() {
    const element = new TextElement();
    element.id = 'basicText';
    element.content = 'Basic element';
    element.offsetX = 300;
    element.offsetY = 30;
    element.width = 100;
    element.height = 20;
    return element;
  }
}
