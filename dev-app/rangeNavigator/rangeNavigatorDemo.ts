import { DataManager, Query } from '@syncfusion/ej2-data';
import { logEvent } from './rangeNavigatorLog';
import { Ej2RangeNavigator } from 'widgets/rangeNavigator/ej2-rangeNavigator';
import { viewResources } from 'aurelia-framework';

const day = 24 * 3600 * 1000;
const start = new Date(2024, 0, 1).getTime();
const dailyData = Array.from({ length: 120 }, (_, i) => ({ x: new Date(start + i * day), y: Math.round(50 + 30 * Math.sin(i / 8) + i * 0.3) }));
const numericData = Array.from({ length: 50 }, (_, i) => ({ x: i, y: Math.round(20 + 15 * Math.cos(i / 5) + i / 2) }));
const logData = [{ x: 1, y: 10 }, { x: 10, y: 40 }, { x: 100, y: 25 }, { x: 1000, y: 60 }, { x: 10000, y: 35 }];

@viewResources(Ej2RangeNavigator)
export class RangeNavigatorDemo {
  log = logEvent;
  rangeVm: any;
  printVm: any;

  daily = dailyData;
  numeric = numericData;
  logs = logData;
  manager = new DataManager(dailyData as any);
  query = new Query().take(30);

  // basic, two-way value
  value: any[] = [new Date(2024, 1, 10), new Date(2024, 2, 10)];
  get valueText() {
    const v = this.value || [];
    const fmt = (d: any) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
    return `${fmt(v[0])}..${fmt(v[1])}`;
  }
  setValue() { this.value = [new Date(2024, 0, 5), new Date(2024, 0, 25)]; }
  areaSeries: any[] = [{ type: 'Area', fill: '#336699', opacity: 0.6, width: 2, border: { color: '#264b73', width: 2 }, animation: { enable: false } }];
  tooltip = { enable: true, displayMode: 'Always', format: 'MMM dd', fill: '#222222', opacity: 0.9, textStyle: { color: '#ffffff' }, border: { color: '#ffffff', width: 1 } };
  xName = 'x';
  yName = 'y';

  // events
  counts: { [name: string]: number } = {};
  changed = '';
  period = '';
  labelText = '';
  tooltipText = '';
  resizedWidth = '';

  constructor() {
    ['load', 'loaded', 'changed', 'labelRender', 'tooltipRender', 'beforeResize', 'resized', 'beforePrint', 'selectorRender']
      .forEach((n) => { this.counts[n] = 0; });
  }

  count(name: string, e: CustomEvent) {
    this.counts[name]++;
    logEvent(name, e);
    const d: any = e && e.detail;
    if (!d) { return; }
    if (name === 'changed') {
      const fmt = (v: any) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(Math.round(v)));
      this.changed = `${fmt(d.start)}..${fmt(d.end)}`;
      this.period = d.selectedPeriod || '';
    }
    if (name === 'labelRender') { this.labelText = d.text; }
    if (name === 'tooltipRender') { this.tooltipText = Array.isArray(d.text) ? d.text.join('|') : String(d.text); }
    if (name === 'resized' && d.currentSize) { this.resizedWidth = String(d.currentSize.width); }
  }
  onLabelRender(e: CustomEvent) {
    // customize the label from the handler
    if (e.detail.text === 'Week1') { e.detail.text = 'First week'; }
    this.count('labelRender', e);
  }
  onBeforePrint(e: CustomEvent) {
    e.detail.cancel = true; // never open the print dialog from the demo
    this.count('beforePrint', e);
  }
  print() { this.printVm.widget.print(); }

  // series types
  numericAxis = 'Double';
  columnSeries: any[] = [{ type: 'Column', fill: '#66bb6a' }];
  stepSeries: any[] = [{ type: 'StepLine', fill: '#ef5350', width: 2, dashArray: '4,2' }];
  splineSeries: any[] = [{ type: 'Spline', fill: '#5c6bc0', width: 2 }];
  splineAreaSeries: any[] = [{ type: 'SplineArea', fill: '#ffa726', opacity: 0.5 }];
  seriesWithOwnData: any[] = [{ dataSource: dailyData, xName: 'x', yName: 'y', type: 'Area', fill: '#00897b' }];
  numericValue = [10, 30];
  disabledValue = [10, 20];
  numericText = '';
  logSeries: any[] = [{ type: 'Area', fill: '#8e24aa' }];

  // period selector
  periodSelector = {
    position: 'Bottom', height: 43,
    periods: [
      { text: '1M', interval: 1, intervalType: 'Months' },
      { text: '2M', interval: 2, intervalType: 'Months', selected: true },
      { text: 'All' }
    ]
  };

  // look
  styleSettings = {
    thumb: { width: 20, height: 28, type: 'Rectangle', fill: '#ffcc00', border: { color: '#aa7700', width: 2 } },
    selectedRegionColor: '#c8e6c9', unselectedRegionColor: '#eeeeee'
  };
  labelStyle = { size: '13px', color: '#aa0000', fontFamily: 'Georgia', fontWeight: '700', fontStyle: 'italic' };
  gridLines = { width: 2, color: '#cc3300', visible: true };
  tickLines = { width: 3, height: 12, color: '#336699' };
  navigatorBorder = { color: '#cc3300', width: 2 };
  margin = { left: 20, right: 20, top: 10, bottom: 10 };
  lookSeries: any[] = [{ type: 'Area', fill: '#4db6ac' }];

  // dynamic
  dynData = this.daily;
  dynTheme = 'Material';
  dynBackground = '#ffffff';
  dynWidth = '100%';
  dynDisabled = false;
  dynValueType = 'DateTime';
  swap() { this.dynData = this.dynData === this.daily ? this.daily.slice(0, 60) : this.daily; }
  dark() { this.dynTheme = 'Bootstrap5Dark'; }
  paint() { this.dynBackground = '#fff8e1'; }
  narrow() { this.dynWidth = '400px'; }
  disable() { this.dynDisabled = true; }
}
