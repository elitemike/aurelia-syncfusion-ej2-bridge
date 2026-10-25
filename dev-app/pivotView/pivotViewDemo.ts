import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';

export class PivotViewDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  dsr: any = createDataSourceSettings();
  gridSettings = { columnWidth: 140, allowSelection: true, selectionSettings: { mode: 'Cell', type: 'Multiple', cellSelectionMode: 'Box' } };
}
