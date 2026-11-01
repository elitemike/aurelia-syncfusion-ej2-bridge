import { salesData, dateData } from './chartData';
import { logEvent } from './chartLog';
import { Ej2Chart } from 'widgets/chart/ej2-chart';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2Chart)
export class ChartEventsDemo {
  log = logEvent;
  sales = salesData;
  dates = dateData;
  valueAxis = { crosshairTooltip: { enable: true } };
  cat = {
    valueType: 'Category',
    crosshairTooltip: { enable: true },
    multiLevelLabels: [{ categories: [{ start: -0.5, end: 2.5, text: 'Q1' }, { start: 2.5, end: 5.5, text: 'Q2' }] }]
  };
  catPlain = { valueType: 'Category' };
  mainSeries: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales', marker: { dataLabel: { visible: true } } },
    { type: 'Line', xName: 'month', yName: 'profit', name: 'Profit' }
  ];
  plainSeries: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'Column', xName: 'month', yName: 'profit', name: 'Profit' }
  ];
  tooltip = { enable: true };
  shared = { enable: true, shared: true };
  crosshair = { enable: true, lineType: 'Both' };
  annotations = [{ content: '<div id="ev-annotation">note</div>', x: 'Mar', y: 30, coordinateUnits: 'Point' }];

  zoom = { enableSelectionZooming: true, mode: 'XY', showToolbar: true };
  zoomX = { valueType: 'DateTime' };
  zoomSeries = [{ dataSource: dateData, xName: 'x', yName: 'y', type: 'Line', name: 'Zoom' }];

  scrollX = { valueType: 'Category', zoomFactor: 0.4, zoomPosition: 0, scrollbarSettings: { enable: true } };

  dragSeries: any[] = [{
    dataSource: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }, { x: 'C', y: 15 }], xName: 'x', yName: 'y', type: 'Line', name: 'Draggable',
    marker: { visible: true, width: 14, height: 14 }, dragSettings: { enable: true }
  }];
  dragY = { minimum: 0, maximum: 40 };
}
