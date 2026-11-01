import { dependencyData, clone } from './ganttData';
import { logEvent } from './ganttLog';
import { Ej2Gantt } from 'widgets/gantt/ej2-gantt';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Gantt)
export class GanttExportDemo {
  log = logEvent;
  exportGantt: any;
  taskFields = { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', progress: 'Progress', dependency: 'Predecessor' };
  columns = [
    { field: 'TaskID', headerText: 'ID', width: 70 },
    { field: 'TaskName', headerText: 'Name', width: 220 },
    { field: 'Duration', headerText: 'Duration', width: 100 }
  ];
  data = clone(dependencyData);
  toolbar = ['ExcelExport', 'CsvExport', 'PdfExport'];

  onToolbarClick(event: CustomEvent) {
    logEvent('toolbarClick', event);
    const gantt: any = this.exportGantt.widget;
    const id: string = event.detail.item.id;
    if (id.endsWith('_excelexport')) { gantt.excelExport(); }
    if (id.endsWith('_csvexport')) { gantt.csvExport(); }
    if (id.endsWith('_pdfexport')) { gantt.pdfExport(); }
  }
}
