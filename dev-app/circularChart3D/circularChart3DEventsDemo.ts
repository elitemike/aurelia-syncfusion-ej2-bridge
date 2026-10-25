import { logEvent, browsers } from './circularChart3DLog';

export class CircularChart3DEventsDemo {
  log = logEvent;
  series: any[] = [{
    dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', radius: '75%',
    dataLabel: { visible: true, name: 'text', position: 'Inside' }
  }];
  tooltip = { enable: true };
  legend = { visible: true };

  onBeforePrint(e: CustomEvent) {
    logEvent('beforePrint', e);
    // do not open the browser print dialog
    e.detail.cancel = true;
  }

  host() {
    return (document.querySelector('[data-testid="cc3d-events"] .e-control') as any).ej2_instances[0];
  }

  print() { this.host().print(); }
  exportPng() { this.host().export('PNG', 'circular3d-events'); }
  resize() { this.host().width = '420px'; this.host().dataBind(); }
}
