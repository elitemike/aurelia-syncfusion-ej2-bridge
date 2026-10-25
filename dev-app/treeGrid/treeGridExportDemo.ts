import { hierarchicalData, clone } from './treeGridData';
import { logEvent } from './treeGridLog';

export class TreeGridExportDemo {
  log = logEvent;
  columns = [
    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right' },
    { field: 'taskName', headerText: 'Task Name', width: 220 },
    { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right' }
  ];
  data = clone(hierarchicalData);
  toolbar = ['ExcelExport', 'CsvExport', 'PdfExport', 'Print'];
  aggregates = [{ columns: [{ type: 'Sum', field: 'duration', columnName: 'duration', footerTemplate: 'Sum: ${Sum}' }] }];
  printMode = 'AllPages';
  exportGrid: any;

  onToolbarClick(event: CustomEvent) {
    logEvent('toolbarClick', event);
    const grid: any = this.exportGrid.widget;
    const id: string = event.detail.item.id;
    if (id.endsWith('_excelexport')) { grid.excelExport(); }
    if (id.endsWith('_csvexport')) { grid.csvExport(); }
    if (id.endsWith('_pdfexport')) { grid.pdfExport(); }
  }
}
