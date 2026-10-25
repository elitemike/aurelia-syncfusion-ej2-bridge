const label = (extra: any = {}) => ({
  position: 'Inside', useRangeColor: false, font: { size: '12px', fontFamily: 'Arial', fontWeight: 'Regular', color: '#333333' }, ...extra
});

export class CircularGaugeDemo {
  titleStyle = { size: '18px', color: '#b71c1c', fontFamily: 'Arial', fontWeight: 'bold' };
  border = { color: '#1565c0', width: 2 };
  margin = { left: 10, right: 10, top: 10, bottom: 10 };

  basicAxes = [{
    minimum: 0, maximum: 2000, radius: '90%', startAngle: 230, endAngle: 130,
    lineStyle: { width: 8, color: '#e0e0e0' },
    labelStyle: label({ format: 'n0' }),
    majorTicks: { height: 10, interval: 500, color: '#757575' }, minorTicks: { height: 5, interval: 100, color: '#bdbdbd' },
    pointers: [{ value: 1500, radius: '70%', color: '#d81b60', pointerWidth: 8, cap: { radius: 8, color: '#d81b60' }, needleTail: { length: '15%', color: '#d81b60' } }]
  }];

  rangeAxes = [{
    minimum: 0, maximum: 120, radius: '90%', startAngle: 220, endAngle: 140,
    lineStyle: { width: 0 }, labelStyle: label({ position: 'Outside', useRangeColor: true }),
    majorTicks: { height: 8, interval: 20, color: '#616161' }, minorTicks: { height: 0 },
    ranges: [
      { start: 0, end: 40, color: '#30b32d', legendText: 'Slow', startWidth: 12, endWidth: 12 },
      { start: 40, end: 80, color: '#ffdd00', legendText: 'Normal', startWidth: 12, endWidth: 12 },
      { start: 80, end: 120, color: '#f03e3e', legendText: 'Fast', startWidth: 12, endWidth: 12 }
    ],
    pointers: [{ value: 60, radius: '65%', pointerWidth: 6, cap: { radius: 6 } }]
  }];
  legend = { visible: true, position: 'Bottom', alignment: 'Center', shape: 'Circle', toggleVisibility: true, background: '#fafafa', border: { color: '#9e9e9e', width: 1 } };

  pointerAxes = [
    {
      minimum: 0, maximum: 100, radius: '90%', lineStyle: { width: 6, color: '#e0e0e0' }, labelStyle: label({ position: 'Outside' }),
      majorTicks: { height: 0 }, minorTicks: { height: 0 },
      pointers: [{ value: 70, type: 'RangeBar', radius: '90%', pointerWidth: 12, color: '#6a1b9a', roundedCornerRadius: 6 }]
    },
    {
      minimum: 0, maximum: 100, radius: '60%', lineStyle: { width: 4, color: '#e0e0e0' }, labelStyle: label({ position: 'Inside', font: { size: '0px' } }),
      majorTicks: { height: 0 }, minorTicks: { height: 0 },
      pointers: [{ value: 40, type: 'Marker', markerShape: 'Triangle', markerHeight: 14, markerWidth: 14, radius: '60%', color: '#ef6c00' }]
    }
  ];

  annotationAxes = [{
    minimum: 0, maximum: 100, radius: '90%', lineStyle: { width: 8, color: '#e0e0e0' }, labelStyle: label(),
    majorTicks: { height: 8, interval: 20 }, minorTicks: { height: 0 },
    pointers: [{ value: 50, radius: '70%', cap: { radius: 6 } }],
    annotations: [{ content: '<div class="cg-annotation" style="font-size:20px;font-weight:bold">50 %</div>', angle: 180, radius: '40%', zIndex: '1' }]
  }];

  semiAxes = [{
    minimum: 0, maximum: 100, radius: '100%', startAngle: 270, endAngle: 90, lineStyle: { width: 10, color: '#e0e0e0' }, labelStyle: label({ position: 'Outside' }),
    majorTicks: { height: 8, interval: 20 }, minorTicks: { height: 0 },
    pointers: [{ value: 35, radius: '75%', cap: { radius: 6 } }]
  }];

  tooltipAxes = [{
    minimum: 0, maximum: 100, radius: '90%', lineStyle: { width: 8, color: '#e0e0e0' }, labelStyle: label(),
    majorTicks: { height: 8, interval: 20 }, minorTicks: { height: 0 },
    pointers: [{ value: 75, radius: '70%', pointerWidth: 8, cap: { radius: 7 }, animation: { enable: false } }]
  }];
  tooltip = { enable: true, format: 'Level {value} units', type: ['Pointer', 'Range'], showAtMousePosition: false };
  tooltipContent = '';

  dragAxes = [{
    minimum: 0, maximum: 100, radius: '90%', startAngle: 0, endAngle: 360, lineStyle: { width: 8, color: '#e0e0e0' }, labelStyle: label(),
    majorTicks: { height: 8, interval: 25 }, minorTicks: { height: 0 },
    ranges: [{ start: 60, end: 80, color: '#43a047', startWidth: 14, endWidth: 14 }],
    pointers: [{ value: 25, type: 'Marker', markerShape: 'Circle', markerHeight: 16, markerWidth: 16, radius: '90%', color: '#e53935', enableDrag: true, animation: { enable: false } }]
  }];
  dragValue: number = null;

  eventAxes = [{
    minimum: 0, maximum: 100, radius: '90%', lineStyle: { width: 8, color: '#e0e0e0' }, labelStyle: label(),
    majorTicks: { height: 8, interval: 25 }, minorTicks: { height: 0 },
    ranges: [{ start: 0, end: 50, color: '#43a047', legendText: 'Low' }, { start: 50, end: 100, color: '#e53935', legendText: 'High' }],
    pointers: [{ value: 80, radius: '70%', cap: { radius: 6 } }]
  }];

  counts: { [name: string]: number } = {
    load: 0, loaded: 0, animationComplete: 0, axisLabelRender: 0, radiusCalculate: 0, annotationRender: 0, legendRender: 0, tooltipRender: 0,
    dragStart: 0, dragMove: 0, dragEnd: 0, gaugeMouseMove: 0, gaugeMouseLeave: 0, gaugeMouseDown: 0, gaugeMouseUp: 0, resized: 0, beforePrint: 0
  };

  dynWidth = '300';
  dynTitle = 'First title';
  dynBackground = '#ffffff';
  dynTheme = 'Material3';
  dynAxes = [this.dynAxis(30)];

  private dynAxis(value: number) {
    return {
      minimum: 0, maximum: 100, radius: '90%', lineStyle: { width: 8, color: '#e0e0e0' }, labelStyle: label(),
      majorTicks: { height: 8, interval: 25 }, minorTicks: { height: 0 }, pointers: [{ value, radius: '70%', cap: { radius: 6 } }]
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

  change() {
    this.dynWidth = '400';
    this.dynTitle = 'Second title';
    this.dynBackground = '#ffe0b2';
    this.dynTheme = 'Bootstrap5Dark';
    this.dynAxes = [this.dynAxis(80)];
  }
}
