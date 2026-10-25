import { salesData } from './chart3DLog';

export class Chart3DInteractionDemo {
  // Syncfusion "Selection" / "Highlight" samples
  cat = { valueType: 'Category' };
  series: any[] = [
    { dataSource: salesData, xName: 'month', yName: 'sales', type: 'Column', name: 'Sales' },
    { dataSource: salesData, xName: 'month', yName: 'profit', type: 'Column', name: 'Profit' }
  ];
  selectionMode = 'Point';
  highlightMode = 'None';
  selectionPattern = 'None';
  highlightPattern = 'None';
  highlightColor = '#ff9800';
  isMultiSelect = false;
  selectedDataIndexes: any[] = [{ series: 0, point: 1 }];

  setSeriesMode() { this.selectionMode = 'Series'; }
  setClusterMode() { this.selectionMode = 'Cluster'; }
  setMulti() { this.isMultiSelect = true; }
  setHighlight() { this.highlightMode = 'Point'; this.highlightColor = '#ff5722'; }
  setPatterns() { this.selectionPattern = 'DiagonalForward'; this.highlightPattern = 'Dots'; }
  setIndexes() { this.selectedDataIndexes = [{ series: 1, point: 3 }]; }
}
