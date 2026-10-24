import { data } from './gridDemo';
import { logEvent } from './gridLog';

export class GridExportDemo {
  log = logEvent;
  rows = (data as any[]).slice(0, 8).map(row => ({ ...row }));
  columns = [
    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
    { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
  ];
  groupSettings = { columns: ['ShipCountry'] };
  aggregates = [{ columns: [{ type: 'Sum', field: 'Freight', format: 'C2', footerTemplate: 'Sum: ${Sum}' }] }];
  toolbar = ['ExcelExport', 'CsvExport', 'PdfExport', 'Print'];
  pageSettings = { pageSize: 20 };

  parents = [
    { EmployeeID: 1, FirstName: 'Nancy', City: 'Seattle' },
    { EmployeeID: 2, FirstName: 'Andrew', City: 'Tacoma' }
  ];
  parentColumns = [
    { field: 'EmployeeID', headerText: 'Employee ID', width: 120, textAlign: 'Right' },
    { field: 'FirstName', headerText: 'Name', width: 140 },
    { field: 'City', headerText: 'City', width: 140 }
  ];
  childGrid = {
    dataSource: [
      { OrderID: 10001, EmployeeID: 1, Freight: 10.5 },
      { OrderID: 10002, EmployeeID: 1, Freight: 20.25 },
      { OrderID: 10003, EmployeeID: 2, Freight: 30 }
    ],
    queryString: 'EmployeeID',
    columns: [
      { field: 'OrderID', headerText: 'Order ID', width: 110 },
      { field: 'Freight', headerText: 'Freight', width: 110, format: 'C2' }
    ]
  };
  detailTemplate = '<div class="detail-tpl">Employee ${FirstName} works in ${City}</div>';

  // only Print is built into the toolbar, the export items are wired by the application
  onToolbarClick(event: CustomEvent) {
    const id: string = event.detail.item.id;
    const grid = (event.target as any).au['ej2-grid'].viewModel.widget;
    if (/excelexport$/.test(id)) {
      grid.excelExport();
    } else if (/csvexport$/.test(id)) {
      grid.csvExport();
    } else if (/pdfexport$/.test(id)) {
      grid.pdfExport();
    }
  }
}
