import { data } from './gridDemo';
import { logEvent } from './gridLog';
import { Ej2Grid } from 'widgets/grid/ej2-grid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Grid)
export class GridSelectionDemo {
  log = logEvent;
  rows = (data as any[]).slice(0, 6).map(row => ({ ...row }));
  columns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 110, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 }
  ];
  checkColumns = [{ type: 'checkbox', width: 50 }, ...this.columns];
  selectionSettings = { type: 'Multiple', mode: 'Both', allowColumnSelection: true, cellSelectionMode: 'Box' };

  fillRows = (data as any[]).slice(0, 6).map(row => ({ ...row }));
  fillColumns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 110, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCity', headerText: 'Ship City', width: 140 }
  ];
  fillSelection = { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' };
  fillEdit = { allowEditing: true, mode: 'Batch' };

  pageSettings = { pageSize: 4 };
  // the first order can not be selected, the order 10252 is pinned to the top
  canSelect = (row: any) => row.OrderID !== 10248;
  isPinned = (row: any) => row.OrderID === 10252;
}
