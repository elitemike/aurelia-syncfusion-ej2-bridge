import { logEvent } from '../chart/chartLog';
import { Ej2AccumulationChart } from 'widgets/accumulationChart/ej2-accumulationChart';
import { viewResources } from 'aurelia-framework';

const pie = [
  { x: 'Chrome', y: 61.3, text: '61.3%' }, { x: 'Safari', y: 24.2, text: '24.2%' }, { x: 'Edge', y: 8.4, text: '8.4%' },
  { x: 'Firefox', y: 3.7, text: '3.7%' }, { x: 'Other', y: 2.4, text: '2.4%' }
];
const money = [{ x: 'Rent', y: 12000 }, { x: 'Food', y: 4500 }, { x: 'Travel', y: 7800 }];
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

@viewResources(Ej2AccumulationChart)
export class AccumulationChartDemo {
  log = logEvent;
  pie = pie;
  money = money;
  pixel = pixel;
  empty: any[] = [];

  // basic
  title = 'Browser share';
  titleStyle = { fontFamily: 'Arial', size: '18px', color: '#c0392b' };
  subTitleStyle = { size: '12px', color: '#2980b9' };
  margin = { left: 15, right: 25, top: 10, bottom: 10 };
  border = { width: 3, color: '#27ae60' };
  center = { x: '40%', y: '55%' };
  legend = { visible: true, position: 'Right', title: 'Browsers', toggleVisibility: true };
  tooltip = { enable: true, format: '${point.x}: <b>${point.y}%</b>' };
  pieSeries: any[] = [{
    dataSource: pie, xName: 'x', yName: 'y', name: 'Browser', type: 'Pie', radius: '80%', explode: true, explodeIndex: 0,
    dataLabel: { visible: true, name: 'text', position: 'Outside', font: { fontWeight: '600' } }
  }];

  // doughnut + center label
  doughnutSeries: any[] = [{ dataSource: pie, xName: 'x', yName: 'y', name: 'Browser', type: 'Pie', innerRadius: '55%', startAngle: 270, endAngle: 90 }];
  centerLabel = { text: 'Center', textStyle: { size: '16px', color: '#8e44ad' } };

  // funnel / pyramid
  funnelSeries: any[] = [{ dataSource: pie, xName: 'x', yName: 'y', type: 'Funnel', neckWidth: '20%', dataLabel: { visible: true, name: 'x', position: 'Inside' } }];
  pyramidSeries: any[] = [{ dataSource: pie, xName: 'x', yName: 'y', type: 'Pyramid', dataLabel: { visible: true, name: 'x', position: 'Inside' } }];

  // selection
  selectionMode = 'Point';
  highlightMode = 'Point';
  selectionPattern = 'Dots';
  highlightPattern = 'Chessboard';
  highlightColor = '#ff00ff';
  multi = true;
  selected = [{ series: 0, point: 1 }];
  plainSeries: any[] = [{ dataSource: pie, xName: 'x', yName: 'y', type: 'Pie', name: 'Browser' }];

  // look
  smartSeries: any[] = [{
    dataSource: pie, xName: 'x', yName: 'y', type: 'Pie', name: 'Browser',
    dataLabel: { visible: true, name: 'x', position: 'Outside', connectorStyle: { length: '20px' } }
  }];
  annotations = [{ content: '<div id="acc-annotation">Total</div>', region: 'Series', x: '50%', y: '50%' }];
  moneySeries: any[] = [{ dataSource: money, xName: 'x', yName: 'y', type: 'Pie', name: 'Spend', dataLabel: { visible: true, position: 'Inside', name: 'y', format: 'C0' } }];
  htmlTitle = '<b>Bold</b><img src=x onerror=window.__accxss=1>';
  noData = '<div id="acc-no-data">Nothing to show</div>';
  exportEnabled = true;
  exportAllowed = true;
}
