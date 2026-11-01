import { logEvent, transmission1 } from './smithchartLog';
import { Ej2Smithchart } from 'widgets/smithchart/ej2-smithchart';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Smithchart)
export class SmithchartEventsDemo {
  log = logEvent;
  series: any[] = [{
    points: transmission1.slice(0, 6), name: 'Events', enableAnimation: true, width: 2,
    marker: { visible: true, width: 8, height: 8, dataLabel: { visible: true } }, tooltip: { visible: true }
  }];
  legend = { visible: true };
  title = { visible: true, text: 'Smith events', subtitle: { visible: true, text: 'sub' } };

  onBeforePrint(e: CustomEvent) {
    logEvent('beforePrint', e);
    // do not open the browser print dialog
    e.detail.cancel = true;
  }

  print() {
    const host = document.querySelector('[data-testid="smith-events"] .e-control') as any;
    host.ej2_instances[0].print();
  }
}
