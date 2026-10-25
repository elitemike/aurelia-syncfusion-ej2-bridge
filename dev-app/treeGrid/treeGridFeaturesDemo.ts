import { DataManager, Query } from '@syncfusion/ej2-data';
import { hierarchicalData, selfReferenceData, clone } from './treeGridData';
import { logEvent } from './treeGridLog';

export class TreeGridFeaturesDemo {
  log = logEvent;
  columns = [
    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right', isPrimaryKey: true },
    { field: 'taskName', headerText: 'Task Name', width: 220 },
    { field: 'startDate', headerText: 'Start Date', width: 120, format: 'yMd', type: 'date', textAlign: 'Right' },
    { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right' },
    { field: 'progress', headerText: 'Progress', width: 100, textAlign: 'Right' }
  ];

  // paging
  pageData = clone(selfReferenceData);
  pageSettings = { pageSize: 2, pageSizes: false };
  pagerTemplate = '<div class="tg-pager-template">Custom pager</div>';

  // sorting
  sortData = clone(hierarchicalData);
  sortSettings = { columns: [{ field: 'taskName', direction: 'Descending' }] };

  // filtering and searching
  filterData = clone(hierarchicalData);
  filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent' };
  searchData = clone(hierarchicalData);
  searchSettings = { fields: ['taskName'], hierarchyMode: 'Parent', operator: 'contains', ignoreCase: true };
  searchToolbar = ['Search'];

  // menus
  menuData = clone(hierarchicalData);
  columnMenuItems = ['SortAscending', 'SortDescending', 'ColumnChooser', 'Filter'];
  contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'];

  // column chooser
  chooserData = clone(hierarchicalData);
  chooserSettings = { enableSearching: true };
  chooserToolbar = ['ColumnChooser'];

  // aggregates
  aggData = clone(hierarchicalData);
  aggregates = [{ columns: [{ type: 'Sum', field: 'duration', columnName: 'duration', footerTemplate: 'Sum: ${Sum}' }] }];

  // frozen
  frozenData = clone(hierarchicalData);
  wideColumns = [
    { field: 'taskID', headerText: 'Task ID', width: 100 },
    { field: 'taskName', headerText: 'Task Name', width: 300 },
    { field: 'startDate', headerText: 'Start Date', width: 300, format: 'yMd', type: 'date' },
    { field: 'duration', headerText: 'Duration', width: 300 },
    { field: 'progress', headerText: 'Progress', width: 300 }
  ];

  // reorder, resize
  rrData = clone(hierarchicalData);

  // row drag and drop
  ddData = clone(hierarchicalData);
  rowDropSettings = {};
  dragging = false;

  // virtualization
  bigData = (() => {
    const rows: any[] = [];
    for (let i = 1; i <= 300; i++) {
      rows.push({ taskID: i, taskName: 'Task ' + i, startDate: new Date(2025, 0, 1 + (i % 28)), duration: i % 10, progress: i % 100, parentID: i > 1 && i % 10 !== 1 ? i - (i % 10) + 1 : null });
    }
    return rows;
  })();
  domVirtualization = { rowBuffer: 5 };
  infiniteSettings = { initialBlocks: 2, enableCache: false };
  virtualQuery = new Query().take(1000);
  virtualCloneQuery = new Query().select(['taskID', 'taskName', 'duration']);
  columnQueryMode = 'ExcludeHidden';

  // detail and toolbar template
  detailData = clone(hierarchicalData);
  detailTemplate = '<div class="tg-detail-template">Detail of ${taskName}</div>';
  toolbarTemplate = '#tg-toolbar-tpl';
  constructor() {
    if (!document.getElementById('tg-toolbar-tpl')) {
      const tpl = document.createElement('script');
      tpl.id = 'tg-toolbar-tpl';
      tpl.type = 'text/x-template';
      tpl.innerHTML = '<div class="tg-toolbar-template">Custom toolbar</div>';
      document.body.appendChild(tpl);
    }
  }

  // data state
  stateRows = clone(selfReferenceData);
  stateSource: any = { result: this.stateRows, count: this.stateRows.length };
  stateLast = '';

  // query
  queryData = new DataManager(clone(hierarchicalData) as any);
  taskQuery = new Query().where('duration', 'greaterThan', 4, false);

  onDataStateChange(event: CustomEvent) {
    logEvent('dataStateChange', event);
    this.stateLast = event.detail.action ? event.detail.action.requestType : 'init';
    this.stateSource = { result: this.stateRows, count: this.stateRows.length };
  }
}
