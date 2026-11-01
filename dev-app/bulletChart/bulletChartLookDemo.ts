import { Ej2BulletChart } from 'widgets/bulletChart/ej2-bulletChart';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2BulletChart)
export class BulletChartLookDemo {
  data = [{ value: 270, target: 250 }];
  ranges = [{ end: 100, color: '#f7c6c6', name: 'Low' }, { end: 200, color: '#f7e3a1', name: 'Average' }, { end: 300, color: '#b7e3b0', name: 'High' }];
  theme = 'Material';
  border = { color: '#2c3e50', width: 2 };
  margin = { left: 20, right: 30, top: 10, bottom: 10 };
  animation = { enable: false };
  valueBorder = { color: '#e67e22', width: 2 };
  dataLabel = { enable: true, labelStyle: { size: '14px', color: '#d35400' } };

  setTheme() { this.theme = 'Bootstrap5Dark'; }
  setBorder() { this.border = { color: '#c0392b', width: 5 }; }
  setMargin() { this.margin = { left: 60, right: 60, top: 10, bottom: 10 }; }
}
