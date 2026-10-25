import { logEvent } from './bulletChartLog';

export class BulletChartEventsDemo {
  log = logEvent;
  data = [{ value: 270, target: 250 }];
  ranges = [{ end: 100, color: '#f7c6c6', name: 'Low' }, { end: 200, color: '#f7e3a1', name: 'Average' }, { end: 300, color: '#b7e3b0', name: 'High' }];
  tooltip = { enable: true };
  legend = { visible: true };
  animation = { enable: false };

  onLegendRender(e: CustomEvent) {
    logEvent('legendRender', e);
    // rename the first legend entry through the event args
    if (e.detail && e.detail.text === 'Low') { e.detail.text = 'Poor'; }
  }

  onBeforePrint(e: CustomEvent) {
    logEvent('beforePrint', e);
    // do not open the browser print dialog
    e.detail.cancel = true;
  }

  print() {
    const host = document.querySelector('[data-testid="bullet-events"] .e-control') as any;
    host.ej2_instances[0].print();
  }
}
