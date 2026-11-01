import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings, pivotData } from './pivotData';
import { Ej2PivotView } from 'widgets/pivotView/ej2-pivotView';
import { viewResources } from 'aurelia-framework';

/** Drill through and editing of the underlying records (Syncfusion "Drill through" and "Editing" samples). */
@viewResources(Ej2PivotView)
export class PvEditDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  drillDsr: any = createDataSourceSettings();
  editDsr: any = createDataSourceSettings({ dataSource: pivotData.map((row, index) => ({ ...row, Id: index + 1 })) });
  // inline editing needs a value cell that stands for exactly one record
  inlineDsr: any = createDataSourceSettings({
    dataSource: pivotData.map((row) => ({ ...row })), expandAll: true, showSubTotals: false, showGrandTotals: false,
    rows: [{ name: 'Country' }, { name: 'Products' }, { name: 'Quarter' }], columns: [{ name: 'Year' }], values: [{ name: 'Sold' }]
  });
  inlineSettings = { allowEditing: true, allowInlineEditing: true };
  editSettings = {
    allowEditing: true, allowAdding: true, allowDeleting: true, allowCommandColumns: true,
    mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false
  };
}
