import { PLATFORM } from 'aurelia-pal';
import { hierarchicalData, selfReferenceData, clone } from './treeGridData';
import { logEvent } from './treeGridLog';
import { Ej2TreeGrid } from 'widgets/treeGrid/ej2-treeGrid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2TreeGrid)
export class TreeGridDemo {
  log = logEvent;
  parts = [
    PLATFORM.moduleName('treeGrid/treeGridFeaturesDemo'),
    PLATFORM.moduleName('treeGrid/treeGridEditDemo'),
    PLATFORM.moduleName('treeGrid/treeGridExportDemo')
  ];

  columns = [
    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right', isPrimaryKey: true },
    { field: 'taskName', headerText: 'Task Name', width: 220 },
    { field: 'startDate', headerText: 'Start Date', width: 120, format: 'yMd', type: 'date', textAlign: 'Right' },
    { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right' },
    { field: 'progress', headerText: 'Progress', width: 100, textAlign: 'Right' }
  ];

  // basic hierarchical sample
  data = clone(hierarchicalData);
  selectedRowIndex = -1;
  selectionSettings = { type: 'Single', mode: 'Both' };

  // self referential sample
  selfData = clone(selfReferenceData).map((r: any) => ({ ...r, isExpanded: r.taskID !== 5 }));

  // look and feel sample
  lookData = clone(hierarchicalData);
  lookHeight = 300;
  lookWidth = '100%';
  rowHeight = 40;
  lookState = { hover: false, altRow: false, wrap: false, keyboard: true, collapsed: false, loading: 'Spinner' };
  textWrapSettings = { wrapMode: 'Content' };
  loadingIndicator = { indicatorType: 'Spinner' };
  gridLines = 'Both';
  clipMode = 'Clip';
  currencyCode = 'USD';
  emptyTemplate = '<span class="tg-empty">Nothing to show here</span>';
  emptyData: any[] = [];
  rowTemplate = '<tr class="tg-row-template"><td colspan="5">${taskName}</td></tr>';
  copyHierarchyMode = 'Parent';
  selectable = (data: any) => data.taskID !== 3;
  spanColumns = [
    { field: 'taskID', headerText: 'Task ID', width: 90 },
    { field: 'taskName', headerText: 'Task Name', width: 200 },
    { field: 'priority', headerText: 'Priority', width: 120 }
  ];

  toggleLook() {
    this.lookState.hover = !this.lookState.hover;
    this.lookState.altRow = !this.lookState.altRow;
    this.lookState.wrap = true;
  }
  changeLines() {
    this.gridLines = 'None';
    this.rowHeight = 60;
    this.clipMode = 'Ellipsis';
    this.lookHeight = 240;
  }

  selectedFromEvent = '';
  onRowSelected(event: CustomEvent) {
    this.selectedFromEvent = event.detail.data.taskName;
    logEvent('rowSelected', event);
  }
}
