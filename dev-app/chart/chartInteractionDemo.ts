import { salesData, dateData } from './chartData';

export class ChartInteractionDemo {
  sales = salesData;
  dates = dateData;
  cat = { valueType: 'Category', crosshairTooltip: { enable: true } };
  value = { crosshairTooltip: { enable: true } };
  twoSeries: any[] = [
    { type: 'Line', xName: 'month', yName: 'sales', name: 'Sales', marker: { visible: true, width: 10, height: 10 } },
    { type: 'Line', xName: 'month', yName: 'profit', name: 'Profit', marker: { visible: true, width: 10, height: 10 } }
  ];
  columns: any[] = [
    { type: 'Column', xName: 'month', yName: 'sales', name: 'Sales' },
    { type: 'Column', xName: 'month', yName: 'profit', name: 'Profit' }
  ];
  sharedTooltip = { enable: true, shared: true };
  tooltip = { enable: true, header: 'Hover' };
  crosshair = { enable: true, lineType: 'Both' };

  // selection
  selectionMode = 'Point';
  selectionPattern = 'DiagonalForward';
  highlightMode = 'Series';
  highlightPattern = 'Dots';
  highlightColor = '#ff00ff';
  multi = true;
  selected = [{ series: 0, point: 1 }];

  // zoom
  zoom = { enableSelectionZooming: true, enableMouseWheelZooming: true, enablePan: true, showToolbar: true, mode: 'XY' };
  zoomX = { valueType: 'DateTime', labelFormat: 'MMM' };

  // legend
  legend = { visible: true, position: 'Right', shapeHeight: 14, shapeWidth: 14, title: 'Legend title', toggleVisibility: true };
  legendHidden = { visible: false };
  legendHighlight = { visible: true, enableHighlight: true, position: 'Top' };

  changeSelection() {
    this.selected = [{ series: 0, point: 3 }];
  }

  changeMode() {
    this.selectionMode = 'Series';
  }
}
