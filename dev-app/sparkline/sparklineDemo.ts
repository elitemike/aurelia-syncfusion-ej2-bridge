import { DataManager, Query } from '@syncfusion/ej2-data';
import { logEvent } from './sparklineLog';
import { Ej2Sparkline } from 'widgets/sparkline/ej2-sparkline';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Sparkline)
export class SparklineDemo {
  log = logEvent;

  numbers = [5, 6, 4, 8, 3, 9, 2];
  winLoss = [12, 15, -9, 0, 14, 1, -2, -1, 13, -6, 15, 12];
  objects = [
    { x: 0, xval: 'Jan', yval: 5 }, { x: 1, xval: 'Feb', yval: 7 }, { x: 2, xval: 'Mar', yval: 3 },
    { x: 3, xval: 'Apr', yval: 9 }, { x: 4, xval: 'May', yval: 1 }, { x: 5, xval: 'Jun', yval: 6 }
  ];
  negatives = [{ x: 0, y: 4 }, { x: 1, y: -3 }, { x: 2, y: 8 }, { x: 3, y: -6 }, { x: 4, y: 8 }, { x: 5, y: 0 }, { x: 6, y: 8 }];
  dates = [
    { x: new Date(2024, 0, 1), y: 4 }, { x: new Date(2024, 0, 2), y: 7 }, { x: new Date(2024, 0, 3), y: 2 },
    { x: new Date(2024, 0, 4), y: 9 }, { x: new Date(2024, 0, 5), y: 5 }
  ];
  manager = new DataManager(this.objects as any);
  query = new Query().take(3);

  border = { color: '#cc3300', width: 2 };
  tooltip = { visible: true, format: '${xval} : ${yval}', trackLineSettings: { visible: true, color: '#cc3300', width: 2 } };
  container = { background: '#eef6ff', border: { color: '#336699', width: 1 }, XAxisLineSettings: { visible: true, color: '#336699', width: 1 } };
  rangeBand = { startRange: 3, endRange: 6, color: '#ffcc66', opacity: 0.6 };
  axis = { minX: 0, maxX: 6, minY: 0, maxY: 10, value: 4, lineSettings: { visible: true, color: '#cc3300', width: 2 } };
  marker = { visible: ['All'], size: 6, fill: '#336699', opacity: 1, border: { color: '#ffffff', width: 1 } };
  dataLabel = { visible: ['High', 'Low'], fill: '#ffffff', textStyle: { size: '11px', color: '#333333' }, offset: { x: 0, y: 10 }, opacity: 1 };
  pad = { left: 10, right: 10, top: 6, bottom: 6 };
  palette = ['#e91e63', '#9c27b0', '#3f51b5', '#009688', '#ff9800', '#795548', '#607d8b'];

  // interaction output
  moves = 0;
  clicks = 0;
  pointClicks = 0;
  pointMoves = 0;
  pointInfo = '';
  loaded = 0;
  loadCount = 0;
  resizeCount = 0;

  count(name: string, e: CustomEvent) {
    const key = { load: 'loadCount', loaded: 'loaded', sparklineMouseMove: 'moves', sparklineMouseClick: 'clicks', resize: 'resizeCount' }[name];
    this[key]++;
    logEvent(name, e);
  }
  onPointClick(e: CustomEvent) {
    this.pointClicks++;
    this.pointInfo = `${e.detail.pointIndex}`;
    logEvent('pointRegionMouseClick', e);
  }
  onPointMove(e: CustomEvent) {
    this.pointMoves++;
    logEvent('pointRegionMouseMove', e);
  }

  // model to widget
  switched = false;
  switchType() { this.switched = !this.switched; }
  get dynamicType() { return this.switched ? 'Column' : 'Line'; }
  dynFill = '#336699';
  setFill() { this.dynFill = '#ff0000'; }
  dynWidth = '300px';
  setWidth() { this.dynWidth = '200px'; }
}
