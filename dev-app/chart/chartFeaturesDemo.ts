import { salesData, financialData, numericData } from './chartData';
import { logEvent } from './chartLog';

export class ChartFeaturesDemo {
  log = logEvent;
  sales = salesData;
  cat = { valueType: 'Category' };
  dateX = { valueType: 'DateTime' };
  columns: any[] = [{ type: 'Column', xName: 'month', yName: 'sales', name: 'Sales', marker: { dataLabel: { visible: true, position: 'Top' } } }];

  annotations = [
    { content: '<div id="chart-annotation-peak" style="color:red">Peak</div>', x: 'May', y: 40, coordinateUnits: 'Point', region: 'Series' }
  ];

  candle: any[] = [{ dataSource: financialData, xName: 'x', open: 'open', high: 'high', low: 'low', close: 'close', type: 'Candle', name: 'Stock' }];
  indicators = [
    { type: 'Sma', period: 3, field: 'Close', seriesName: 'Stock', fill: '#ff6600', name: 'SMA3' },
    { type: 'Ema', period: 3, field: 'Close', seriesName: 'Stock', fill: '#0066ff', name: 'EMA3' },
    { type: 'Tma', period: 3, field: 'Close', seriesName: 'Stock', fill: '#00aa66', name: 'TMA3' },
    { type: 'BollingerBands', period: 3, field: 'Close', seriesName: 'Stock', fill: 'rgba(100,100,100,0.2)', name: 'BB3' }
  ];
  macdIndicators = [{ type: 'Macd', period: 3, slowPeriod: 6, fastPeriod: 3, macdType: 'Both', seriesName: 'Stock', yAxisName: 'yMacd', name: 'MACD' }];
  macdAxes = [{ name: 'yMacd', rowIndex: 1 }];
  macdRows = [{ height: '60%' }, { height: '40%' }];

  trend: any[] = [{
    dataSource: numericData, xName: 'x', yName: 'y', type: 'Scatter', name: 'Observed',
    trendlines: [{ type: 'Linear', name: 'Linear trend', width: 2 }, { type: 'Polynomial', polynomialOrder: 2, name: 'Poly trend' }]
  }];
  errorBars: any[] = [{ dataSource: salesData, xName: 'month', yName: 'sales', type: 'Line', name: 'Err', errorBar: { visible: true, type: 'Fixed', verticalError: 3 } }];

  // export
  exportEnabled = true;
  exportAllowed = true;

  // WebMCP
  mcpSettings = { name: 'salesChart', exposedTo: ['agent'] };
}
