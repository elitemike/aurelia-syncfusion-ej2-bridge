import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { hierarchicalData, selfReferenceData, clone } from './treeGridData';
import { logEvent } from './treeGridLog';
import { Ej2TreeGrid } from 'widgets/treeGrid/ej2-treeGrid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2TreeGrid)
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
  contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending'];

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
  toolbarTemplate = () => {
    const div = document.createElement('div');
    div.className = 'tg-toolbar-template';
    div.textContent = 'Custom toolbar';
    return [div];
  };

  // data state: the app owns the data, root rows are supplied up front and children on expand
  stateAll = clone(selfReferenceData);
  stateRoots = this.stateAll.filter((r: any) => !r.parentID);
  stateSource: any = { result: this.stateRoots, count: this.stateRoots.length };
  stateLast = '';
  stateSaved = '';
  stateEdit = { allowEditing: true, mode: 'Normal' };

  // a remote source whose answer is not valid JSON, the request fails and actionFailure is raised
  showFailing = false;
  failingSource = new DataManager({ url: '/tg-missing', adaptor: new UrlAdaptor() });

  // query
  queryData = new DataManager(clone(hierarchicalData) as any);
  taskQuery = new Query().where('duration', 'greaterThan', 4, false);

  onDataStateChange(event: CustomEvent) {
    logEvent('dataStateChange', event);
    const state: any = event.detail;
    if (state.requestType === 'expand') {
      this.stateLast = 'expand';
      state.childData = this.stateAll.filter((r: any) => r.parentID === state.data.taskID);
      state.childDataBind();
      return;
    }
    const action = state.action || {};
    this.stateLast = action.requestType || 'init';
    let roots = this.stateRoots.slice();
    if (action.requestType === 'sorting') {
      const sign = action.direction === 'Descending' ? -1 : 1;
      roots = roots.sort((a: any, b: any) => (a[action.columnName] > b[action.columnName] ? sign : -sign));
    }
    this.stateSource = { result: roots, count: roots.length };
  }

  onDataSourceChanged(event: CustomEvent) {
    logEvent('dataSourceChanged', event);
    const state: any = event.detail;
    if (state.action === 'edit' || state.requestType === 'save') {
      const row = this.stateAll.find((r: any) => r.taskID === state.data.taskID);
      if (row) { Object.assign(row, state.data); }
      this.stateSaved = state.data.taskName;
    }
    state.endEdit();
  }
}
