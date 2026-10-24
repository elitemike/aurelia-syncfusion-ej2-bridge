import { stockData, pixel } from '../chart/chartData';
import { logEvent } from '../chart/chartLog';

export class StockChartDemo {
  log = logEvent;
  data = stockData;
  pixel = pixel;
  empty: any[] = [];
  noData = '<div id="stock-no-data">Nothing to show</div>';

  candle: any[] = [{ dataSource: stockData, xName: 'x', open: 'open', high: 'high', low: 'low', close: 'close', volume: 'volume', type: 'Candle', name: 'ACME' }];
  line: any[] = [{ dataSource: stockData, xName: 'x', yName: 'close', type: 'Line', name: 'ACME' }];
  sharedCandle: any[] = [{ xName: 'x', open: 'open', high: 'high', low: 'low', close: 'close', volume: 'volume', type: 'Candle', name: 'Shared' }];
  twoSeries: any[] = [
    { dataSource: stockData, xName: 'x', yName: 'close', type: 'Line', name: 'Close' },
    { dataSource: stockData, xName: 'x', yName: 'open', type: 'Spline', name: 'Open' }
  ];

  // basic
  title = 'ACME stock price';
  titleStyle = { fontFamily: 'Arial', size: '18px', color: '#c0392b' };
  margin = { left: 15, right: 25, top: 10, bottom: 10 };
  border = { width: 3, color: '#27ae60' };
  periods = [
    { text: '1M', interval: 1, intervalType: 'Months' },
    { text: '3M', interval: 3, intervalType: 'Months', selected: true },
    { text: 'All' }
  ];
  tooltip = { enable: true, shared: false };
  crosshair = { enable: true, lineType: 'Both' };
  legend = { visible: true, position: 'Top' };
  xAxis = { valueType: 'DateTime', majorGridLines: { width: 0 }, crosshairTooltip: { enable: true } };
  yAxis = { title: 'Price', crosshairTooltip: { enable: true }, labelFormat: 'n0' };
  chartArea = { border: { width: 2, color: '#8e44ad' }, background: '#eef7ff' };

  changeArea() {
    this.chartArea = { border: { width: 3, color: '#123456' }, background: '#eef7ff' };
  }

  // toolbar choices of the period selector
  seriesType = ['Line', 'Candle', 'Hilo', 'Column'];
  indicatorType = ['Sma', 'Ema', 'Rsi', 'BollingerBands'];
  trendlineType = ['Linear', 'Polynomial'];
  exportType = ['PNG', 'SVG', 'CSV'];

  // indicators and layout
  indicators = [
    { type: 'Sma', period: 5, field: 'Close', seriesName: 'ACME', fill: '#ff6600' },
    { type: 'Rsi', period: 5, seriesName: 'ACME', yAxisName: 'yRsi' }
  ];
  rows = [{ height: '70%' }, { height: '30%' }];
  axes = [{ name: 'yRsi', rowIndex: 1, opposedPosition: true }];

  // stock events
  stockEvents = [
    { date: stockData[20].x, text: 'Split', description: 'Stock split', type: 'Flag', placeAt: 'close', seriesIndexes: [0] },
    { date: stockData[40].x, text: 'Div', description: 'Dividend paid', type: 'Circle', placeAt: 'close', seriesIndexes: [0] }
  ];

  // zoom, selection, annotation
  zoom = { enableSelectionZooming: true, enablePan: true, enableMouseWheelZooming: true };
  selectionMode = 'Point';
  selected = [{ series: 0, point: 3 }];
  annotations = [{ content: '<div id="stock-annotation">Note</div>', x: stockData[30].x, y: 100, coordinateUnits: 'Point', region: 'Series' }];
  customRange = true;
  isSelect = true;
}
