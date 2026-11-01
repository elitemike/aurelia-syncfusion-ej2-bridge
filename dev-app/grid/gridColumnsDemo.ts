import { data } from './gridDemo';
import { logEvent } from './gridLog';
import { Ej2Grid } from 'widgets/grid/ej2-grid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Grid)
export class GridColumnsDemo {
  log = logEvent;
  rows = (data as any[]).slice(0, 6).map(row => ({ ...row }));
  columns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
    { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
  ];
  resizeSettings = { mode: 'Normal' };

  columnMenuItems = ['SortAscending', 'SortDescending', { text: 'Custom item', id: 'custom-col-item' }];
  contextMenuItems = ['Copy', 'SortAscending', { text: 'Custom action', target: '.e-content', id: 'custom-ctx-item' }];

  toolbar = [{ text: 'Ping', id: 'ping-item', tooltipText: 'Ping' }];

  excelFilter = { type: 'Excel' };
  advancedFilterSettings = { includeHiddenColumns: false };
  advancedToolbar = ['AdvancedFilter'];
}
