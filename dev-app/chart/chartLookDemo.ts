import { salesData, pixel } from './chartData';

export class ChartLookDemo {
  sales = salesData;
  pixel = pixel;
  title = 'Monthly sales';
  htmlTitle = '<b>Bold</b><img src=x onerror=window.__xss=1>';
  titleStyle = { fontFamily: 'Arial', size: '18px', color: '#c0392b', fontWeight: '600' };
  subTitleStyle = { size: '12px', color: '#2980b9' };
  margin = { left: 20, right: 30, top: 10, bottom: 10 };
  border = { width: 3, color: '#27ae60' };
  chartArea = { border: { width: 2, color: '#8e44ad' }, background: '#eef7ff' };
  palettes = ['#e67e22', '#16a085', '#2c3e50'];
  xAxis = { valueType: 'Category', title: 'Month' };
  yAxis = { title: 'Sales', labelFormat: '{value}K' };
  series: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'Line', xName: 'month', yName: 'profit', name: 'Profit', marker: { visible: true } }
  ];
  legend = { visible: true, position: 'Bottom' };
  tooltip = { enable: true };

  // currency / grouping chart
  currencyData = [{ x: 'A', y: 12000 }, { x: 'B', y: 34000 }, { x: 'C', y: 56000 }];
  currencySeries = [{ type: 'Column', xName: 'x', yName: 'y', name: 'Revenue' }];
  currencyX = { valueType: 'Category' };
  currencyY = { labelFormat: 'C0' };
  currency = 'EUR';

  // empty chart
  empty: any[] = [];
  emptySeries = [{ type: 'Line', xName: 'x', yName: 'y', name: 'None' }];
  noData = '<div id="no-data-template" style="text-align:center">Nothing to show</div>';

  // live updates
  liveData: any[] = [{ x: 'A', y: 3 }, { x: 'B', y: 5 }, { x: 'C', y: 2 }];
  liveSeries = [{ type: 'Column', xName: 'x', yName: 'y', name: 'Live' }];
  liveTitle = 'Before';
  liveWidth = '400px';
  liveHeight = '250px';

  changeLive() {
    this.liveTitle = 'After';
    this.liveWidth = '500px';
    this.liveHeight = '300px';
    this.liveData = [{ x: 'A', y: 9 }, { x: 'B', y: 1 }, { x: 'C', y: 7 }, { x: 'D', y: 4 }];
  }

  changeSeries() {
    this.liveSeries = [{ type: 'Line', xName: 'x', yName: 'y', name: 'Replaced' }];
  }
}
