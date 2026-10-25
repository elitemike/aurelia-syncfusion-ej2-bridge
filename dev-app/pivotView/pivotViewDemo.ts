import { PLATFORM } from 'aurelia-pal';
import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';

export class PivotViewDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  parts = [
    PLATFORM.moduleName('pivotView/pvToolbarDemo'),
    PLATFORM.moduleName('pivotView/pvChartDemo'),
    PLATFORM.moduleName('pivotView/pvLargeDataDemo'),
    PLATFORM.moduleName('pivotView/pvEditDemo'),
    PLATFORM.moduleName('pivotView/pvTemplatesDemo'),
    PLATFORM.moduleName('pivotView/pvMcpDemo')
  ];

  destroyedCount = 0;
  onDestroyed() { this.destroyedCount++; }
  showMain = true;

  // default functionalities
  dsr: any = createDataSourceSettings();
  pivotValues: any[] = null;
  aggregateTypes = ['Sum', 'Count', 'Avg', 'Max'];
  gridSettings = {
    columnWidth: 140, allowSelection: true, allowResizing: true, allowReordering: true,
    selectionSettings: { mode: 'Both', type: 'Multiple', cellSelectionMode: 'Box' }
  };
  groupingBarSettings = { showFilterIcon: true, showSortIcon: true, showRemoveIcon: true, showValueTypeIcon: true, allowDragAndDrop: true };

  replaceDsr() {
    this.dsr = createDataSourceSettings({ rows: [{ name: 'Products' }], columns: [], values: [{ name: 'Sold' }] });
  }
}
