import { salesData } from './chart3DLog';
import { Ej2Chart3D } from 'widgets/chart3D/ej2-chart3D';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Chart3D)
export class Chart3DSeriesDemo {
  // Syncfusion series samples: Bar, Stacked column / bar, 100% stacked, data labels
  cat = { valueType: 'Category' };
  dataLabel = { visible: true, position: 'Outer' };
  sales = salesData;
  barSeries: any[] = [{ dataSource: salesData, xName: 'month', yName: 'sales', type: 'Bar', name: 'Sales' }];
  stackColumnSeries: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'StackingColumn', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'StackingColumn', name: 'Profit' }
  ];
  stackBarSeries: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'StackingBar', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'StackingBar', name: 'Profit' }
  ];
  fullStackSeries: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'StackingColumn100', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'StackingColumn100', name: 'Profit' }
  ];
  labelSeries: any[] = [{
    dataSource: salesData, xName: 'month', yName: 'sales', type: 'Column', name: 'Sales',
    dataLabel: { visible: true, position: 'Top', font: { size: '12px', fontWeight: '600' } }
  }];
}
