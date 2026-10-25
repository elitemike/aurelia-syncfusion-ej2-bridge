import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from '../pivotView/pivotData';

export class PivotFieldListDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  destroyedCount = 0;
  onDestroyed() { this.destroyedCount++; }
  showMain = true;

  // fixed render mode
  dsr: any = createDataSourceSettings();
  aggregateTypes = ['Sum', 'Count', 'Avg'];
  spinnerTemplate = '<div class="pfl-spinner">Loading...</div>';

  // actions (no deferred layout update)
  actionsDsr: any = createDataSourceSettings();

  // server mode, the engine url is answered by a stub in the tests, so the request only starts on demand
  showServer = false;
  serverDsr: any = {
    mode: 'Server', url: '/stub/pivot-engine', rows: [{ name: 'Country' }], columns: [{ name: 'Year' }],
    values: [{ name: 'Sold' }]
  };

  // popup render mode
  popupDsr: any = createDataSourceSettings();

  // linked with a pivot view through the shared dataSourceSettings
  linkedDsr: any = createDataSourceSettings();

  replaceDsr() {
    this.dsr = createDataSourceSettings({ rows: [{ name: 'Products' }], columns: [], values: [{ name: 'Sold' }] });
  }
}
