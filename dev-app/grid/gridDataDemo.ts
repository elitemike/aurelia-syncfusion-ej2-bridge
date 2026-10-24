import { data } from './gridDemo';
import { logEvent } from './gridLog';

const countries = ['France', 'Germany', 'Brazil', 'Belgium', 'Austria'];

export class GridDataDemo {
  log = logEvent;

  // 500 rows with 30 extra columns
  bigData = Array.from({ length: 500 }, (_, i) => {
    const row: any = { OrderID: 10000 + i, CustomerID: `CUST${i}`, ShipCountry: countries[i % countries.length], Freight: i + 0.5 };
    for (let c = 0; c < 30; c++) { row[`F${c}`] = `r${i}c${c}`; }
    return row;
  });
  narrowColumns = [
    { field: 'OrderID', headerText: 'Order ID', width: 110, isPrimaryKey: true, textAlign: 'Right' },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
    { field: 'Freight', headerText: 'Freight', width: 110 }
  ];
  // the frozen grid writes into its column definitions, so every grid gets its own copy
  wideColumns = () => [
    { field: 'OrderID', headerText: 'Order ID', width: 120, isPrimaryKey: true },
    ...Array.from({ length: 30 }, (_, c) => ({ field: `F${c}`, headerText: `Field ${c}`, width: 120 }))
  ];
  columnVirtualColumns = this.wideColumns();
  frozenGridColumns = this.wideColumns();
  smallWide = this.bigData.slice(0, 10);
  smallRows = (data as any[]).slice(0, 12).map(row => ({ ...row }));

  // infinite scrolling
  infiniteSettings = { initialBlocks: 2, maxBlocks: 4, enableCache: false };
  infinitePage = { pageSize: 10 };

  // DOM virtualization
  domSettings = { rowBuffer: 3, scrollThrottle: 0, autoRowHeight: false };
  rowHeightCalls = 0;
  rowHeightFn = () => { this.rowHeightCalls++; return 40; };
  detailTpl = '<div class="dom-detail">Details</div>';

  // templates
  templateColumns = [
    { field: 'OrderID', headerText: 'Order ID', width: 110 },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 }
  ];
  templatePage = { pageSize: 4 };
  rowTpl = '<tr class="tpl-row"><td>Order ${OrderID}</td><td>${CustomerID}</td></tr>';
  pagerTpl = '<div class="pager-tpl">Page ${currentPage} of ${totalPages}</div>';

  // row drag and drop
  dndRows = (data as any[]).slice(0, 5).map(row => ({ ...row }));
  dropped: any[] = [];
  dndSelection = { type: 'Multiple' };
  dropSettings = { targetID: '' };

  // spans
  spanColumns = [
    { field: 'Team', headerText: 'Team', width: 120 },
    { field: 'Role', headerText: 'Role', width: 120 },
    { field: 'Lead', headerText: 'Lead', width: 120 }
  ];
  spanRows = [
    { Team: 'Alpha', Role: 'Dev', Lead: 'Dev' },
    { Team: 'Alpha', Role: 'QA', Lead: 'Ann' },
    { Team: 'Beta', Role: 'Ops', Lead: 'Bob' }
  ];

  // formulas
  // cell references are spreadsheet like: column letter and row number, where row 1 is the header row
  formulaColumns = [
    { field: 'ID', headerText: 'ID', width: 60, isPrimaryKey: true, type: 'number' },
    { field: 'A', headerText: 'A', width: 80, type: 'number' },
    { field: 'B', headerText: 'B', width: 80, type: 'number' },
    { field: 'Sum', headerText: 'Sum', width: 100, allowFormula: true },
    { field: 'Double', headerText: 'Double', width: 100, allowFormula: true }
  ];
  formulaRows = [
    { ID: 1, A: 2, B: 3, Sum: '=B2+C2', Double: '=DOUBLE(B2)' },
    { ID: 2, A: 5, B: 7, Sum: '=B3+C3', Double: '=DOUBLE(B3)' }
  ];
  formulaSettings = {
    allowBuiltInFunctions: true,
    calculationMode: 'Automatic',
    customFunctions: { DOUBLE: (args: any) => Number(args.values[0]) * 2 }
  };

  // webmcp
  webMcpSettings = { name: 'orders', tools: ['getSelectedRecords', 'getCurrentViewRecords'] };

  // custom data binding
  employees = [{ EmployeeID: 1, FirstName: 'Nancy' }, { EmployeeID: 2, FirstName: 'Andrew' }];
  customRows = Array.from({ length: 30 }, (_, i) => ({ OrderID: 20000 + i, CustomerID: `C${i}`, ShipCountry: countries[i % 5], EmployeeID: (i % 2) + 1 }));
  customColumns = [
    { field: 'OrderID', headerText: 'Order ID', width: 110, isPrimaryKey: true, type: 'number', validationRules: { required: true } },
    { field: 'CustomerID', headerText: 'Customer ID', width: 130 },
    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
    {
      field: 'EmployeeID', headerText: 'Employee', width: 140, foreignKeyField: 'EmployeeID', foreignKeyValue: 'FirstName',
      dataSource: { result: this.employees, count: this.employees.length }
    }
  ];
  customPage = { pageSize: 5 };
  customFilter = { type: 'Excel' };
  customEdit = { allowAdding: true, allowEditing: true, mode: 'Normal' };
  customToolbar = ['Add', 'Update'];
  customData: any = { result: this.customRows.slice(0, 5), count: this.customRows.length };

  onDataStateChange(event: CustomEvent) {
    const state = event.detail;
    this.log('custom.dataStateChange', event);
    const skip = state.skip || 0;
    const take = state.take || 5;
    this.customData = { result: this.customRows.slice(skip, skip + take), count: this.customRows.length };
  }

  onColumnDataStateChange(event: CustomEvent) {
    this.log('custom.columnDataStateChange', event);
    // hand the foreign key data back to the grid
    event.detail.setColumnData({ result: this.employees, count: this.employees.length });
  }

  onDataSourceChanged(event: CustomEvent) {
    this.log('custom.dataSourceChanged', event);
    const state = event.detail;
    if (state.action === 'add') {
      this.customRows.unshift(state.data);
      this.customData = { result: this.customRows.slice(0, 5), count: this.customRows.length };
    }
    state.endEdit();
  }

  // lazy load grouping
  lazyRows = (this.bigData as any[]).slice(0, 40);
  lazyGroup = { columns: ['ShipCountry'], enableLazyLoading: true };

  // adaptive dialogs
  adaptiveToolbar = ['Search'];
}
