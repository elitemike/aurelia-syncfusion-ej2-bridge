export class BulletChartMainDemo {
  // Syncfusion "Default functionalities" sample: a revenue bullet with three qualitative ranges
  data = [{ value: 270, target: 250 }];
  ranges = [
    { end: 100, color: '#f7c6c6', name: 'Low' },
    { end: 200, color: '#f7e3a1', name: 'Average' },
    { end: 300, color: '#b7e3b0', name: 'High' }
  ];
  title = 'Revenue YTD';
  subtitle = '$ in Thousands';
  maximum = 300;
  minimum = 0;
  interval = 50;
  minorTicksPerInterval = 4;
  orientation = 'Horizontal';
  type = 'Rect';
  labelFormat = '{value}K';
  width = '90%';
  height = '110';
  valueFill = '#1f4e79';
  valueHeight = 10;
  targetWidth = 4;
  targetColor = '#c0392b';
  targetTypes = ['Rect'];
  labelPosition = 'Outside';
  tickPosition = 'Outside';
  titlePosition = 'Top';
  opposedPosition = false;
  enableGroupSeparator = false;
  tabIndex = 3;
  noAnimation = { enable: false };
  majorTickLines = { height: 8, width: 2, color: '#222222' };
  minorTickLines = { height: 4, width: 1, color: '#888888' };
  labelStyle = { size: '13px', color: '#333333', fontWeight: '600' };
  titleStyle = { size: '16px', color: '#112233', fontWeight: '700' };
  subtitleStyle = { size: '11px', color: '#556677' };
  tooltip = { enable: true };
  legendSettings = { visible: true, position: 'Bottom' };

  setTitle() { this.title = 'Sales YTD'; }
  setMaximum() { this.maximum = 400; this.interval = 100; }
  setOrientation() { this.orientation = 'Vertical'; this.height = '300'; this.width = '160'; }
  setType() { this.type = 'Dot'; }
  setFill() { this.valueFill = '#00aa66'; }
  setFormat() { this.labelFormat = '{value}%'; }
  setOpposed() { this.opposedPosition = true; }
  setPositions() { this.labelPosition = 'Inside'; this.tickPosition = 'Inside'; this.titlePosition = 'Left'; }
  setTarget() { this.targetColor = '#8e44ad'; this.targetWidth = 6; this.valueHeight = 16; }
  setData() { this.data = [{ value: 120, target: 180 }]; }
  setGroup() { this.enableGroupSeparator = true; }
}
