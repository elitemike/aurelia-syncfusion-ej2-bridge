import { salesData, dateData } from './chartData';
import { Ej2Chart } from 'widgets/chart/ej2-chart';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Chart)
export class ChartAxesDemo {
  sales = salesData;
  cat = { valueType: 'Category' };

  // rows with a secondary axis on the second row
  rows = [{ height: '50%' }, { height: '50%' }];
  rowAxes = [{ name: 'yProfit', rowIndex: 1, title: 'Profit', opposedPosition: true }];
  rowSeries: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'Line', xName: 'month', yName: 'profit', name: 'Profit', yAxisName: 'yProfit' }
  ];

  // columns with a secondary x axis in the second column
  columns = [{ width: '50%' }, { width: '50%' }];
  colAxes = [{ name: 'xSecond', columnIndex: 1, valueType: 'Category', title: 'Second' }];
  colSeries: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Left' },
    { type: 'Column', xName: 'month', yName: 'profit', name: 'Right', xAxisName: 'xSecond' }
  ];

  columnSeries: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'Column', xName: 'month', yName: 'profit', name: 'Profit' }
  ];
  stackedSeries: any[] = [
    { type: 'StackingColumn', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'StackingColumn', xName: 'month', yName: 'profit', name: 'Profit' }
  ];
  stackLabels = { visible: true, format: '{value}!' };

  // range colors
  rangeColors = [
    { label: 'Low', start: 0, end: 25, colors: ['#ff0000'] },
    { label: 'High', start: 25, end: 100, colors: ['#00aa00'] }
  ];
  rangeLegend = { visible: true, mode: 'Range' };
  rangeSeries: any[] = [{ type: 'Column', xName: 'month', yName: 'profit', name: 'Profit' }];

  // axis types
  logY = { valueType: 'Logarithmic', minimum: 1, maximum: 1000, interval: 1 };
  logData = [{ x: 1, y: 2 }, { x: 2, y: 20 }, { x: 3, y: 200 }, { x: 4, y: 900 }];
  dateX = { valueType: 'DateTime', labelFormat: 'MMM yy', intervalType: 'Months' };
  dateSeries = [{ dataSource: dateData, xName: 'x', yName: 'y', type: 'Line', name: 'Dates' }];
  stripX = {
    valueType: 'Category',
    stripLines: [{ start: 0.5, end: 1.5, text: 'Slump', color: '#ffcc99', visible: true, zIndex: 'Behind' }],
    multiLevelLabels: [{ categories: [{ start: -0.5, end: 2.5, text: 'Q1' }, { start: 2.5, end: 5.5, text: 'Q2' }] }]
  };
  stripSeries: any[] = [{ type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' }];

  autoInterval = true;
  sideBySide = false;
  transposed = true;
}
