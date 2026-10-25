import { salesData } from './chart3DLog';

// 1x1 transparent png, a data uri keeps the demo offline
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export class Chart3DMainDemo {
  // Syncfusion "3D Column" sample: a column series with wall, depth, tilt and rotation
  salesData = salesData;
  title = 'Monthly sales';
  subTitle = 'In thousands';
  theme = 'Material';
  description = 'Sales per month as 3D columns';
  width = '90%';
  height = '380px';
  background = '#f8fbff';
  backgroundImage = pixel;
  depth = 100;
  wallSize = 6;
  tilt = 10;
  rotation = 20;
  enableRotation = true;
  perspectiveAngle = 90;
  wallColor = '#d6e4f0';
  enableSideBySidePlacement = true;
  isTransposed = false;
  currencyCode = 'USD';
  useGroupingSeparator = true;
  enableExport = true;
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  titleStyle = { size: '18px', fontWeight: '700', color: '#1b3a57' };
  subTitleStyle = { size: '12px', color: '#667788' };
  border = { color: '#34495e', width: 2 };
  palettes = ['#e74c3c', '#3498db', '#2ecc71'];
  legendSettings = { visible: true, position: 'Bottom' };
  tooltip = { enable: true, format: '${point.x}: ${point.y}' };
  primaryXAxis = { valueType: 'Category', title: 'Month' };
  primaryYAxis = { title: 'Sales', minimum: 0, maximum: 50, interval: 10 };
  series: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'Column', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'Column', name: 'Profit' }
  ];

  setTitle() { this.title = 'Quarterly sales'; this.subTitle = 'In millions'; }
  setTheme() { this.theme = 'Bootstrap5Dark'; }
  setDescription() { this.description = 'Updated description'; }
  setSize() { this.width = '500px'; this.height = '300px'; }
  setBackground() { this.background = '#fff3e0'; }
  setDepth() { this.depth = 40; this.wallSize = 12; }
  setAngles() { this.tilt = 25; this.rotation = 50; this.perspectiveAngle = 60; }
  setWall() { this.wallColor = '#c8e6c9'; }
  setTransposed() { this.isTransposed = true; }
  setSideBySide() { this.enableSideBySidePlacement = false; }
  setNoRotation() { this.enableRotation = false; }
  setCurrency() { this.currencyCode = 'EUR'; this.useGroupingSeparator = false; }
  setMargin() { this.margin = { left: 50, right: 50, top: 20, bottom: 20 }; }
  setStyles() {
    this.titleStyle = { size: '26px', fontWeight: '700', color: '#c0392b' };
    this.subTitleStyle = { size: '16px', color: '#8e44ad' };
    this.border = { color: '#e67e22', width: 5 };
  }
  setPalettes() { this.palettes = ['#8e44ad', '#16a085']; }
  setLegend() { this.legendSettings = { visible: true, position: 'Top' }; }
  setTooltip() { this.tooltip = { enable: true, format: 'Value ${point.y}' }; }
  setAxes() {
    this.primaryXAxis = { valueType: 'Category', title: 'Months of year' };
    this.primaryYAxis = { title: 'Amount', minimum: 0, maximum: 60, interval: 20 };
  }
  setSeries() { this.series = [{ dataSource: salesData, xName: 'month', yName: 'target', type: 'Column', name: 'Target' }]; }
}
