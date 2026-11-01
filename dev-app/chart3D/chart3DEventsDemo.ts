import { logEvent, salesData } from './chart3DLog';
import { Ej2Chart3D } from 'widgets/chart3D/ej2-chart3D';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Chart3D)
export class Chart3DEventsDemo {
  log = logEvent;
  cat = { valueType: 'Category' };
  series: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'Column', name: 'Sales', dataLabel: { visible: true } }
  ];
  tooltip = { enable: true };
  legend = { visible: true };

  onBeforePrint(e: CustomEvent) {
    logEvent('beforePrint', e);
    // do not open the browser print dialog
    e.detail.cancel = true;
  }

  onBeforeExport(e: CustomEvent) {
    logEvent('beforeExport', e);
  }

  host() {
    return (document.querySelector('[data-testid="c3d-events"] .e-control') as any).ej2_instances[0];
  }

  print() { this.host().print(); }
  exportPng() { this.host().export('PNG', 'chart3d-events'); }
  resize() { this.host().width = '420px'; this.host().dataBind(); }
}
