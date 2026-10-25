import { transmission1, transmission2 } from './smithchartLog';

export class SmithchartMainDemo {
  // Syncfusion "Default functionalities" sample: two transmission lines with markers, labels and tooltips
  renderType = 'Impedance';
  width = '600';
  height = '420';
  theme = 'Material';
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  font = { size: '13px', fontFamily: 'Segoe UI', color: '#223344' };
  border = { width: 2, color: '#34495e' };
  background = '#fbfbfb';
  elementSpacing = 12;
  radius = 0.9;
  title = { visible: true, text: 'Transmission lines', subtitle: { visible: true, text: 'Resistance and reactance' } };
  series: any[] = [
    {
      points: transmission1, name: 'Transmission1', enableAnimation: false, width: 2,
      marker: { visible: true, shape: 'Circle', width: 8, height: 8, dataLabel: { visible: false } },
      tooltip: { visible: true }
    },
    {
      points: transmission2, name: 'Transmission2', enableAnimation: false, width: 2,
      marker: { visible: true, shape: 'Diamond', width: 8, height: 8 },
      tooltip: { visible: true }
    }
  ];
  legendSettings = { visible: true, position: 'Bottom', shape: 'Circle' };
  horizontalAxis = { minorGridLines: { visible: true }, majorGridLines: { color: '#bbbbbb' } };
  radialAxis = { labelPosition: 'Outside', majorGridLines: { color: '#bbbbbb' } };

  setAdmittance() { this.renderType = 'Admittance'; }
  setTheme() { this.theme = 'Bootstrap5Dark'; }
  setSize() { this.width = '480'; this.height = '360'; }
  setBackground() { this.background = '#e8f5e9'; }
  setRadius() { this.radius = 0.6; }
  setSpacing() { this.elementSpacing = 30; }
  setBorder() { this.border = { width: 5, color: '#c0392b' }; }
  setMargin() { this.margin = { left: 40, right: 40, top: 20, bottom: 20 }; }
  setFont() { this.font = { size: '18px', fontFamily: 'Segoe UI', color: '#8e44ad' }; }
  setTitle() { this.title = { visible: true, text: 'Updated title', subtitle: { visible: true, text: 'Updated subtitle' } }; }
  setSeries() { this.series = [Object.assign({}, this.series[0], { name: 'Only line' })]; }
  setLegend() { this.legendSettings = { visible: true, position: 'Top', shape: 'Rectangle' }; }
  setAxes() {
    this.horizontalAxis = { minorGridLines: { visible: false }, majorGridLines: { color: '#e74c3c' } };
    this.radialAxis = { labelPosition: 'Inside', majorGridLines: { color: '#e74c3c' } };
  }
}
