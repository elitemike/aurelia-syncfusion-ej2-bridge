import { DiagramConstraints, DiagramTools, SnapConstraints } from '@syncfusion/ej2-diagrams';
import { Ej2Diagram } from 'widgets/diagram/ej2-diagram';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Diagram)
export class DiagramDynamicDemo {
  width = '500px';
  height = '320px';
  bg = '#ffffff';
  constraints = DiagramConstraints.Default | DiagramConstraints.Tooltip;
  noUserInteraction = DiagramConstraints.Default & ~DiagramConstraints.UserInteraction;
  tool = DiagramTools.Default;
  zoomPan = DiagramTools.ZoomPan;
  snap: any = { constraints: SnapConstraints.None };
  snapOn = { constraints: SnapConstraints.ShowLines };
  rulers: any = { showRulers: false };
  rulersOn = { showRulers: true };
  page: any = { width: 300, height: 200 };
  pageBig = { width: 450, height: 280 };
  scroll: any = { currentZoom: 1, scrollLimit: 'Infinity' };
  zoomed = { currentZoom: 0.5, scrollLimit: 'Infinity' };
  bridge = 'Top';
  thumbShape = 'Square';
  thumbSize = 10;
  tooltip: any = { content: 'first tooltip' };
  tipChanged = { content: 'second tooltip' };
  menu: any = { show: true };
  menuOff = { show: false };
  addInfo: any = { owner: 'start' };
  rtl = false;

  nodeDefaults = { width: 80, height: 40, style: { fill: '#8fc1e3' } };
  connectorDefaults = { type: 'Straight' };
  nodes: any[] = [
    { id: 'a', offsetX: 100, offsetY: 60, annotations: [{ content: 'A' }] },
    { id: 'b', offsetX: 300, offsetY: 60, annotations: [{ content: 'B' }] }
  ];
  movedNodes: any[] = [
    { id: 'a', offsetX: 100, offsetY: 160, annotations: [{ content: 'A' }] },
    { id: 'b', offsetX: 300, offsetY: 160, annotations: [{ content: 'B' }] }
  ];
  connectors: any[] = [{ id: 'ab', sourceID: 'a', targetID: 'b' }];

  roundThumbs() {
    this.thumbShape = 'Circle';
    this.thumbSize = 20;
  }

  resize() {
    this.width = '420px';
    this.height = '260px';
  }
}
