import { Ej2LinearGauge } from 'widgets/linearGauge/ej2-linearGauge';
import { viewResources } from 'aurelia-framework';
const label = (extra: any = {}) => ({ font: { size: '12px', fontFamily: 'Arial', color: '#333333' }, ...extra });

@viewResources(Ej2LinearGauge)
export class LinearGaugeDemo {
  titleStyle = { size: '16px', color: '#b71c1c', fontFamily: 'Arial', fontWeight: 'bold' };
  border = { color: '#1565c0', width: 2 };
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  container = { type: 'Normal', width: 30, height: 300, backgroundColor: '#eceff1', border: { color: '#90a4ae', width: 1 }, roundedCornerRadius: 8, offset: 0 };

  basicAxes = [{
    minimum: 0, maximum: 100, line: { width: 3, color: '#546e7a' }, labelStyle: label({ format: '{value}', offset: 4 }),
    majorTicks: { interval: 20, height: 10, color: '#546e7a' }, minorTicks: { interval: 5, height: 5, color: '#90a4ae' },
    ranges: [{ start: 0, end: 40, color: '#43a047', startWidth: 8, endWidth: 8 }, { start: 60, end: 100, color: '#e53935', startWidth: 8, endWidth: 8 }],
    pointers: [{ value: 55, type: 'Bar', color: '#1e88e5', width: 12, height: 12 }]
  }];

  orientation = 'Horizontal';
  thermometer = { type: 'Thermometer', width: 30, height: 120, backgroundColor: '#eceff1', border: { color: '#90a4ae', width: 1 } };
  horizontalAxes = [{
    minimum: 0, maximum: 100, line: { width: 2, color: '#546e7a' }, labelStyle: label(),
    majorTicks: { interval: 25, height: 8 }, minorTicks: { interval: 5, height: 4 },
    pointers: [{ value: 70, type: 'Bar', color: '#f4511e', width: 10, height: 10 }]
  }];

  markerAxes = [
    {
      minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
      majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
      pointers: [
        { value: 30, type: 'Marker', markerType: 'Triangle', placement: 'Near', color: '#8e24aa', height: 14, width: 14 },
        { value: 60, type: 'Marker', markerType: 'Diamond', placement: 'Far', color: '#00897b', height: 14, width: 14 }
      ]
    },
    {
      minimum: 0, maximum: 100, opposedPosition: true, isInversed: true, line: { width: 2 }, labelStyle: label(),
      majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
      pointers: [{ value: 80, type: 'Marker', markerType: 'Circle', placement: 'Center', color: '#fb8c00', height: 14, width: 14 }]
    }
  ];

  palettes = ['#26a69a', '#ffca28', '#ef5350'];
  rangeAxes = [{
    minimum: 0, maximum: 90, line: { width: 0 }, labelStyle: label(),
    majorTicks: { interval: 30, height: 6 }, minorTicks: { height: 0 },
    ranges: [
      { start: 0, end: 30, startWidth: 10, endWidth: 10 },
      { start: 30, end: 60, startWidth: 10, endWidth: 10 },
      {
        start: 60, end: 90, startWidth: 10, endWidth: 10,
        linearGradient: { startValue: '0%', endValue: '100%', colorStop: [{ color: '#fff176', offset: '0%', opacity: 1 }, { color: '#e53935', offset: '100%', opacity: 1 }] }
      }
    ],
    pointers: [{ value: 45, type: 'Marker', markerType: 'InvertedTriangle', color: '#37474f', height: 12, width: 12 }]
  }];

  annotationAxes = [{
    minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
    majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
    pointers: [{ value: 40, type: 'Bar', color: '#5e35b1', width: 10, height: 10 }]
  }];
  annotations = [{ content: '<div class="lg-annotation" style="font-weight:bold">40 units</div>', axisIndex: 0, axisValue: 40, x: 0, y: -30, zIndex: '1' }];

  tooltipAxes = [{
    minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
    majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
    pointers: [{ value: 65, type: 'Marker', markerType: 'Triangle', color: '#d81b60', height: 16, width: 16, animationDuration: 0 }]
  }];
  tooltip = { enable: true, format: 'Level {value} units', enableAnimation: false };
  tooltipContent = '';

  dragAxes = [{
    minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
    majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
    pointers: [{ value: 20, type: 'Marker', markerType: 'Circle', color: '#e53935', height: 20, width: 20, enableDrag: true, animationDuration: 0 }]
  }];
  dragValue: number = null;

  eventAxes = [{
    minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
    majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 },
    pointers: [{ value: 80, type: 'Bar', color: '#039be5', width: 10, height: 10 }]
  }];

  counts: { [name: string]: number } = {
    load: 0, loaded: 0, animationComplete: 0, axisLabelRender: 0, annotationRender: 0, tooltipRender: 0,
    dragStart: 0, dragMove: 0, dragEnd: 0, valueChange: 0, gaugeMouseMove: 0, gaugeMouseLeave: 0, gaugeMouseDown: 0, gaugeMouseUp: 0, resized: 0, beforePrint: 0
  };

  dynWidth = '300';
  dynTitle = 'First title';
  dynBackground = '#ffffff';
  dynTheme = 'Fabric';
  dynFormat = 'n0';
  dynAxes = [this.dynAxis(30)];

  private dynAxis(value: number) {
    return {
      minimum: 0, maximum: 100, line: { width: 2 }, labelStyle: label(),
      majorTicks: { interval: 25, height: 8 }, minorTicks: { height: 0 }, pointers: [{ value, type: 'Bar', color: '#3949ab', width: 10, height: 10 }]
    };
  }

  log(name: string, event: CustomEvent) {
    this.counts[name]++;
    const args = event.detail || {};
    if (name === 'tooltipRender') {
      this.tooltipContent = args.content;
    }
    if (name === 'dragEnd' || name === 'dragMove') {
      this.dragValue = args.currentValue;
    }
  }

  onAxisLabelRender(event: CustomEvent) {
    this.counts.axisLabelRender++;
    if (event.detail.value === 0) {
      event.detail.text = 'Zero';
    }
  }

  onBeforePrint(event: CustomEvent) {
    this.counts.beforePrint++;
    // do not open a print window in the demo
    event.detail.cancel = true;
  }

  flip() {
    this.orientation = this.orientation === 'Horizontal' ? 'Vertical' : 'Horizontal';
  }

  change() {
    this.dynWidth = '420';
    this.dynTitle = 'Second title';
    this.dynBackground = '#ffe0b2';
    this.dynTheme = 'MaterialDark';
    this.dynFormat = 'n2';
    this.dynAxes = [this.dynAxis(80)];
  }
}
