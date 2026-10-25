import { logEvent } from '../queryBuilder/qbLog';
import { createDataSourceSettings } from './pivotData';

/** Pivot chart: table / chart display options and every chart event (Syncfusion "Pivot Chart" samples). */
export class PvChartDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);
  dsr: any = createDataSourceSettings();
  dragDsr: any = createDataSourceSettings();
  displayOption = { view: 'Both', primary: 'Chart' };
  chartTypes = ['Column', 'Bar', 'Line', 'Area'];
  chartSettings = {
    title: 'Sales analysis',
    chartSeries: { type: 'Column', animation: { enable: true, duration: 300 }, marker: { dataLabel: { visible: true } } },
    enableExport: true,
    showMultiLevelLabels: true,
    legendSettings: { visible: true },
    tooltip: { enable: true },
    crosshair: { enable: true },
    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, toolbarItems: ['Zoom', 'Pan', 'Reset'] },
    primaryYAxis: { title: 'Units' }
  };
  dragChartSettings = { chartSeries: { type: 'Column' }, selectionMode: 'DragXY', isMultiSelect: false };
}
