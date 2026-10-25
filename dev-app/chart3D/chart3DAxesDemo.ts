import { salesData } from './chart3DLog';

export class Chart3DAxesDemo {
  // Syncfusion "Multiple axes" sample: rows / columns / axes, plus DateTime and Logarithmic value types
  multiSeries: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'Column', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'Column', name: 'Profit', yAxisName: 'yAxis1' }
  ];
  cat = { valueType: 'Category' };
  y = { title: 'Sales', minimum: 0, maximum: 50, interval: 10 };
  rows = [{ height: '50%' }, { height: '50%' }];
  columns = [{ width: '100%' }];
  axes = [{ name: 'yAxis1', rowIndex: 1, title: 'Profit', minimum: 0, maximum: 20, interval: 5, opposedPosition: true }];

  dateSeries: any[] = [{
    dataSource: [
      { d: new Date(2024, 0, 1), v: 20 }, { d: new Date(2024, 1, 1), v: 35 }, { d: new Date(2024, 2, 1), v: 25 },
      { d: new Date(2024, 3, 1), v: 40 }
    ], xName: 'd', yName: 'v', type: 'Column', name: 'Dated'
  }];
  dateX = { valueType: 'DateTime', labelFormat: 'MMM', intervalType: 'Months' };
  logSeries: any[] = [{
    dataSource: [{ x: 'A', y: 10 }, { x: 'B', y: 100 }, { x: 'C', y: 1000 }], xName: 'x', yName: 'y', type: 'Column', name: 'Log'
  }];
  logY = { valueType: 'Logarithmic', minimum: 1, maximum: 10000 };

  // Syncfusion "Axis labels with currency" style sample: currencyCode and useGroupingSeparator format the C0 labels
  formatSeries: any[] = [{
    dataSource: [{ x: 'A', y: 1500 }, { x: 'B', y: 4200 }], xName: 'x', yName: 'y', type: 'Column', name: 'Revenue'
  }];
  formatY = { labelFormat: 'C0', minimum: 0, maximum: 5000, interval: 1000 };
  currencyCode = 'USD';
  useGroupingSeparator = true;
  setEuro() { this.currencyCode = 'EUR'; }
  setNoGrouping() { this.useGroupingSeparator = false; }
}
