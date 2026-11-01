import { data } from './gridDemo';
import { logEvent } from './gridLog';
import { Ej2Grid } from 'widgets/grid/ej2-grid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Grid)
export class GridEditDemo {
  log = logEvent;
  rows = (data as any[]).slice(0, 5).map(row => ({ ...row }));
  columns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 110, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCity', headerText: 'Ship City', width: 140 }
  ];
  editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false };
  toolbar = ['Add', 'Delete', 'Update', 'Cancel'];
  commandColumns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 110 },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { headerText: 'Actions', width: 120, commands: [{ buttonOption: { content: 'Details', cssClass: 'e-flat details-command' } }] }
  ];
}
