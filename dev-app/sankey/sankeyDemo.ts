import { logEvent } from './sankeyLog';
import { Ej2Sankey } from 'widgets/sankey/ej2-sankey';
import { viewResources } from 'aurelia-framework';

const pixel = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="%23fff8e1"/></svg>';

@viewResources(Ej2Sankey)
export class SankeyDemo {
  log = logEvent;
  sankeyVm: any;
  exportVm: any;

  nodes = [
    { id: 'Solar', label: { text: 'Solar power' }, color: '#f9a825' },
    { id: 'Wind', label: { text: 'Wind power' }, color: '#26a69a' },
    { id: 'Gas', label: { text: 'Natural gas' }, color: '#8d6e63' },
    { id: 'Grid', label: { text: 'Power grid' }, color: '#5c6bc0' },
    { id: 'Homes', label: { text: 'Homes' }, color: '#66bb6a' },
    { id: 'Industry', label: { text: 'Industry' }, color: '#ef5350' }
  ];
  links = [
    { sourceId: 'Solar', targetId: 'Grid', value: 20 },
    { sourceId: 'Wind', targetId: 'Grid', value: 30 },
    { sourceId: 'Gas', targetId: 'Grid', value: 40 },
    { sourceId: 'Grid', targetId: 'Homes', value: 50 },
    { sourceId: 'Grid', targetId: 'Industry', value: 40 }
  ];
  otherLinks = [
    { sourceId: 'Solar', targetId: 'Grid', value: 60 },
    { sourceId: 'Wind', targetId: 'Grid', value: 10 },
    { sourceId: 'Grid', targetId: 'Homes', value: 40 },
    { sourceId: 'Grid', targetId: 'Industry', value: 30 }
  ];

  titleStyle = { size: '18px', fontWeight: '600', color: '#264b73', textAlignment: 'Center' };
  subTitleStyle = { size: '13px', color: '#666666', fontStyle: 'italic' };
  margin = { left: 20, right: 20, top: 10, bottom: 10 };
  border = { color: '#336699', width: 2 };
  animation = { enable: false };
  accessibility = { focusable: true, tabIndex: 3, accessibilityRole: 'figure', accessibilityDescription: 'Energy flow diagram' };

  nodeStyle = { fill: '#9e9e9e', stroke: '#222222', strokeWidth: 2, padding: 20, width: 24, opacity: 0.9 };
  linkStyle = { opacity: 0.5, highlightOpacity: 0.9, inactiveOpacity: 0.1, curvature: 0.8, colorType: 'Target' };
  linkFixed = { opacity: 0.6, colorType: 'Source' };
  labelSettings = { visible: true, fontSize: '14px', color: '#aa0000', fontFamily: 'Georgia', fontWeight: '700', padding: 12, fontStyle: 'italic' };

  legend = {
    visible: true, position: 'Bottom', title: 'Sources', titleStyle: { size: '13px' }, width: '60%', height: '40px',
    padding: 6, itemPadding: 8, shapeWidth: 12, shapeHeight: 12, shapePadding: 6, enableHighlight: true, background: '#f5f5f5', opacity: 1,
    border: { color: '#cccccc', width: 1 }, margin: { left: 4, right: 4, top: 4, bottom: 4 }, textStyle: { size: '12px' }, isInversed: false, reverse: false
  };
  legendRight = { visible: true, position: 'Right', reverse: true, isInversed: true };
  legendHidden = { visible: false };

  tooltip = {
    enable: true, fill: '#222222', opacity: 0.9, textStyle: { color: '#ffffff', size: '13px' },
    nodeFormat: '$name carries $value', linkFormat: '$start.name to $target.name : $value',
    enableAnimation: false, duration: 100, fadeOutDuration: 200, fadeOutMode: 'Move'
  };
  noTooltip = { enable: false };

  // events
  counts: { [name: string]: number } = {};
  info: { [name: string]: string } = {};
  hover = '';

  constructor() {
    // the bindings read these keys, they have to exist up front to be observable
    ['load', 'loaded', 'sizeChanged', 'nodeRendering', 'linkRendering', 'labelRendering', 'legendItemRendering', 'legendItemHover',
      'tooltipRendering', 'nodeClick', 'nodeEnter', 'nodeLeave', 'linkClick', 'linkEnter', 'linkLeave', 'beforeExport', 'afterExport',
      'exportCompleted', 'beforePrint'].forEach((n) => { this.counts[n] = 0; this.info[n] = ''; });
  }

  count(name: string, e: CustomEvent) {
    this.counts[name] = (this.counts[name] || 0) + 1;
    logEvent(name, e);
    const d: any = e && e.detail;
    if (!d) { return; }
    if (d.node) { this.info[name] = d.node.id; }
    if (d.link) { this.info[name] = `${d.link.sourceId}>${d.link.targetId}`; }
    if (d.text !== undefined && typeof d.text === 'string') { this.info[name] = d.text; }
    if (d.currentSize) { this.info[name] = String(d.currentSize.width); }
  }
  onNodeRendering(e: CustomEvent) {
    // customize the node fill from the handler
    if (e.detail.node && e.detail.node.id === 'Homes') { e.detail.fill = '#ff00ff'; }
    this.count('nodeRendering', e);
  }
  onLinkRendering(e: CustomEvent) {
    this.count('linkRendering', e);
  }
  onLabelRendering(e: CustomEvent) {
    if (e.detail.text && e.detail.text.indexOf('Industry') === 0) { e.detail.text = e.detail.text.replace('Industry', 'Factories'); }
    this.count('labelRendering', e);
  }
  onLegendRendering(e: CustomEvent) {
    this.count('legendItemRendering', e);
  }
  onBeforeExport(e: CustomEvent) {
    this.count('beforeExport', e);
    if (this.cancelExport) { e.detail.cancel = true; }
  }
  onBeforePrint(e: CustomEvent) {
    e.detail.cancel = true; // never open the print dialog from the demo
    this.count('beforePrint', e);
  }
  cancelExport = false;
  exportPng() { this.exportVm.widget.export('PNG', 'sankey'); }
  exportSvg() { this.exportVm.widget.export('SVG', 'sankey'); }
  cancelAndExport() { this.cancelExport = true; this.exportVm.widget.export('PNG', 'sankey'); this.cancelExport = false; }
  print() { this.exportVm.widget.print(); }

  // images
  bgImage = pixel;

  // dynamic
  dynLinks = this.links;
  dynOrientation = 'Horizontal';
  dynTheme = 'Material';
  dynTitle = 'Energy';
  dynWidth = '100%';
  swap() { this.dynLinks = this.dynLinks === this.links ? this.otherLinks : this.links; }
  vertical() { this.dynOrientation = 'Vertical'; }
  dark() { this.dynTheme = 'Bootstrap5Dark'; }
  rename() { this.dynTitle = 'Renamed'; }
  narrow() { this.dynWidth = '500px'; }
}
