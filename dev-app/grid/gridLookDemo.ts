import { Query } from '@syncfusion/ej2-data';
import { data } from './gridDemo';
import { Ej2Grid } from 'widgets/grid/ej2-grid';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Grid)
export class GridLookDemo {
  rows = (data as any[]).slice(0, 8).map(row => ({ ...row }));
  none: any[] = [];
  columns = [
    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 110, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
    { field: 'Freight', headerText: 'Freight', width: 110, format: 'C2', textAlign: 'Right' }
  ];
  wrapColumns = [
    { field: 'OrderID', headerText: 'Order identifier of the shipment', width: 90 },
    { field: 'ShipAddress', headerText: 'Ship address', width: 90 },
    { field: 'ShipName', headerText: 'Ship name', width: 90 }
  ];

  // look
  cssClass = 'my-grid';
  gridLines = 'Both';
  enableAltRow = false;
  enableHover = true;
  rowHeight = 60;
  headerRowHeight = 50;
  width = 600;
  height = 250;

  // wrap / clip
  allowTextWrap = true;
  textWrapSettings = { wrapMode: 'Header' };
  clipMode = 'EllipsisWithTooltip';
  rowRenderingMode = 'Vertical';
  loadingIndicator = { indicatorType: 'Shimmer' };

  // query / sort / search
  sortSettings = { columns: [{ field: 'Freight', direction: 'Descending' }] };
  searchSettings = { key: 'hanar', fields: ['CustomerID'], ignoreCase: true };
  query = new Query().take(3);

  // empty
  emptyRecordMode = 'Normal';
  emptyTemplate = '<span class="no-orders">No orders yet</span>';

  // misc
  currentAction: any = { requestType: 'paging' };
  parentDetails: any = { parentKeyFieldValue: 'VINET', parentRowData: { CustomerID: 'VINET' } };
  exportGrids = ['grid-look', 'grid-wrap'];
  showHider: any = undefined;
}
