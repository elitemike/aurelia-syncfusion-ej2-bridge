import { browsers } from './circularChart3DLog';

export class CircularChart3DInteractionDemo {
  // Syncfusion "Selection" / "Highlight" samples
  series: any[] = [{ dataSource: browsers, xName: 'browser', yName: 'users', name: 'Browser', radius: '75%' }];
  selectionMode = 'Point';
  highlightMode = 'None';
  selectionPattern = 'None';
  highlightPattern = 'None';
  highlightColor = '#ff9800';
  isMultiSelect = false;
  selectedDataIndexes: any[] = [{ series: 0, point: 1 }];
  legend = { visible: true, enableHighlight: false };

  setMulti() { this.isMultiSelect = true; }
  setHighlight() { this.highlightMode = 'Point'; this.highlightColor = '#ff5722'; }
  setPatterns() { this.selectionPattern = 'DiagonalForward'; this.highlightPattern = 'Dots'; }
  setIndexes() { this.selectedDataIndexes = [{ series: 0, point: 3 }]; }
}
