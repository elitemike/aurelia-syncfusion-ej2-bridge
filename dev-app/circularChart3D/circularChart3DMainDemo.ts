import { browsers } from './circularChart3DLog';

const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export class CircularChart3DMainDemo {
  // Syncfusion "3D Pie" sample: browser market share with data labels, legend and tooltip
  browsers = browsers;
  width = '90%';
  height = '380px';
  title = 'Browser share';
  subTitle = 'Percent of users';
  background = '#f8fbff';
  backgroundImage = pixel;
  theme = 'Material';
  enableAnimation = false;
  depth = 80;
  tilt = -30;
  rotation = 0;
  enableRotation = true;
  enableExport = true;
  useGroupingSeparator = true;
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  border = { color: '#34495e', width: 2 };
  titleStyle = { size: '18px', fontWeight: '700', color: '#1b3a57' };
  subTitleStyle = { size: '12px', color: '#667788' };
  legendSettings = { visible: true, position: 'Right' };
  tooltip = { enable: true, format: '${point.x}: ${point.y}%' };
  series: any[] = [{
    dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', radius: '80%',
    dataLabel: { visible: true, name: 'text', position: 'Outside' }
  }];

  setTitle() { this.title = 'Market share'; this.subTitle = 'Updated'; }
  setSize() { this.width = '520px'; this.height = '300px'; }
  setBackground() { this.background = '#fff3e0'; }
  setTheme() { this.theme = 'Bootstrap5Dark'; }
  setAngles() { this.depth = 40; this.tilt = -10; this.rotation = 90; }
  setNoRotation() { this.enableRotation = false; }
  setMargin() { this.margin = { left: 60, right: 60, top: 20, bottom: 20 }; }
  setStyles() {
    this.titleStyle = { size: '26px', fontWeight: '700', color: '#c0392b' };
    this.subTitleStyle = { size: '16px', color: '#8e44ad' };
    this.border = { color: '#e67e22', width: 5 };
  }
  setLegend() { this.legendSettings = { visible: true, position: 'Bottom' }; }
  setTooltip() { this.tooltip = { enable: true, format: 'Share ${point.y}' }; }
  setSeries() {
    this.series = [{
      dataSource: browsers.slice(0, 3), xName: 'browser', yName: 'users', name: 'Top three', radius: '70%',
      dataLabel: { visible: true, name: 'text', position: 'Inside' }
    }];
  }
  setGrouping() { this.useGroupingSeparator = false; }
}
