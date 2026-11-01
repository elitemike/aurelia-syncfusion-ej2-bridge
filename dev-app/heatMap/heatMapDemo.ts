import { logEvent } from './heatMapLog';
import { Ej2HeatMap } from 'widgets/heatMap/ej2-heatMap';
import { viewResources } from 'aurelia-framework';

// the heat map reads dataSource[xIndex][yIndex], the matrices below are written one y label (row) per line
const transpose = (rows: any[][]) => rows[0].map((_, c) => rows.map((r) => r[c]));

@viewResources(Ej2HeatMap)
export class HeatMapDemo {
  log = logEvent;

  // rows are the y axis labels, columns the x axis labels
  data = transpose([
    [10, 20, 30, 40, 50, 60],
    [15, 25, 35, 45, 55, 65],
    [20, 30, 40, 50, 60, 70],
    [25, 35, 45, 55, 65, 75]
  ]);
  otherData = transpose([
    [70, 60, 50, 40, 30, 20],
    [65, 55, 45, 35, 25, 15],
    [60, 50, 40, 30, 20, 10],
    [55, 45, 35, 25, 15, 5]
  ]);
  gappedData = transpose([
    [10, null, 30, 40, 50, 60],
    [15, 25, null, 45, 55, 65],
    [20, 30, 40, null, 60, 70],
    [25, 35, 45, 55, null, 75]
  ]);
  bubbleData = transpose([
    [[10, 90], [20, 40], [30, 70], [40, 10]],
    [[15, 30], [25, 80], [35, 20], [45, 60]],
    [[20, 50], [30, 10], [40, 90], [50, 30]]
  ]);
  xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  yLabels = ['2021', '2022', '2023', '2024'];
  bubbleX = ['Q1', 'Q2', 'Q3', 'Q4'];
  bubbleY = ['North', 'South', 'East'];

  xAxis = { labels: this.xLabels, title: { text: 'Months' } };
  yAxis = { labels: this.yLabels, title: { text: 'Years' } };
  titleSettings = { text: 'Monthly sales', textStyle: { size: '16px', fontWeight: '500', color: '#264b73' } };
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  cellSettings = { showLabel: true, format: '{value}', border: { width: 1, color: '#ffffff', radius: 4 }, textStyle: { size: '12px', color: '#111111' } };
  cellPlain = { showLabel: false };
  legendSettings = { visible: true, position: 'Right', title: { text: 'Sales' }, showLabel: true, labelFormat: '{value}', showGradientPointer: true };
  legendBottom = { visible: true, position: 'Bottom', alignment: 'Center', enableSmartLegend: false, textStyle: { size: '12px' }, height: '30px', width: '60%' };
  legendHidden = { visible: false };

  gradientPalette = { type: 'Gradient', emptyPointColor: '#dddddd', colorGradientMode: 'Table', fillColor: { minColor: '#fff3cd', maxColor: '#cc3300' } };
  rowGradient = { type: 'Gradient', colorGradientMode: 'Row', fillColor: { minColor: '#e3f2fd', maxColor: '#0d47a1' } };
  fixedPalette = {
    type: 'Fixed', emptyPointColor: '#dddddd',
    palette: [
      { value: 0, color: '#2e7d32', label: 'Low' },
      { value: 30, color: '#f9a825', label: 'Medium' },
      { value: 60, color: '#c62828', label: 'High' }
    ]
  };

  rangeAxisX = { labels: this.xLabels, opposedPosition: true, labelRotation: 45, isInversed: true, title: { text: 'Opposed, rotated, inversed' } };
  rangeAxisY = { labels: this.yLabels, labelRotation: 0, textStyle: { size: '13px', color: '#cc3300' }, border: { width: 1, color: '#336699', type: 'Rectangle' } };
  multiX = {
    labels: this.xLabels,
    multiLevelLabels: [
      { categories: [{ start: 0, end: 2, text: 'Q1' }, { start: 3, end: 5, text: 'Q2' }] }
    ]
  };
  trimX = { labels: ['A very long label one', 'A very long label two', 'Three', 'Four', 'Five', 'Six'], enableTrim: true, maxLabelLength: 6 };

  // Table adaptor, one field per column
  tableData = [
    { Year: '2021', Jan: 10, Feb: 20, Mar: 30 },
    { Year: '2022', Jan: 15, Feb: 25, Mar: 35 },
    { Year: '2023', Jan: 20, Feb: 30, Mar: 40 }
  ];
  tableSettings = { isJsonData: true, adaptorType: 'Table', xDataMapping: 'Year' };
  tableX = { labels: ['2021', '2022', '2023'] };
  tableY = { labels: ['Jan', 'Feb', 'Mar'] };
  // Cell adaptor, one record per cell
  cellData = [
    { Year: '2021', Month: 'Jan', Sales: 10 }, { Year: '2021', Month: 'Feb', Sales: 20 },
    { Year: '2022', Month: 'Jan', Sales: 30 }, { Year: '2022', Month: 'Feb', Sales: 40 }
  ];
  cellAdaptor = { isJsonData: true, adaptorType: 'Cell', xDataMapping: 'Month', yDataMapping: 'Year', valueMapping: 'Sales' };
  cellX = { labels: ['Jan', 'Feb'] };
  cellY = { labels: ['2021', '2022'] };

  bubbleCells = { tileType: 'Bubble', bubbleType: 'SizeAndColor', showLabel: false, bubbleSize: { minimum: '20%', maximum: '90%' } };
  bubbleSizeCells = { tileType: 'Bubble', bubbleType: 'Size', isInversedBubbleSize: true };
  bubblePalette = { type: 'Gradient', fillColor: { minColor: '#c8e6c9', maxColor: '#1b5e20' } };
  highlightCells = { showLabel: true, enableCellHighlighting: true, tileType: 'Rect' };

  tooltipSettings = { fill: '#222222', textStyle: { size: '13px', color: '#ffffff' }, border: { width: 1, color: '#ffffff' } };
  htmlTooltip = { template: '<div class="hm-tip">custom ${xLabel}-${yLabel}</div>', fill: '#222222' };

  // events
  counts: { [name: string]: number } = {
    load: 0, loaded: 0, created: 0, cellRender: 0, legendRender: 0, tooltipRender: 0, resized: 0,
    cellClick: 0, cellDoubleClick: 0, cellSelected: 0
  };
  clicked = '';
  doubleClicked = '';
  selected = 0;
  tooltipText = '';
  resized = '';

  count(name: string, e: CustomEvent) {
    this.counts[name]++;
    logEvent(name, e);
    const d: any = e && e.detail;
    if (name === 'cellClick' && d) { this.clicked = `${d.xLabel}/${d.yLabel}=${d.value}`; }
    if (name === 'cellDoubleClick' && d) { this.doubleClicked = `${d.xLabel}/${d.yLabel}=${d.value}`; }
    if (name === 'cellSelected' && d) { this.selected = d.data.length; }
    if (name === 'tooltipRender' && d) { this.tooltipText = `${d.xLabel}/${d.yLabel}=${d.value}`; }
    if (name === 'resized' && d) { this.resized = `${d.currentSize.width}`; }
  }

  // dynamic
  dynData = this.data;
  dynBackground = '#ffffff';
  dynTooltip = true;
  dynMode = 'SVG';
  dynHeight = '260px';
  dynTheme = 'Material';
  swap() { this.dynData = this.dynData === this.data ? this.otherData : this.data; }
  paint() { this.dynBackground = '#fff8e1'; }
  noTooltip() { this.dynTooltip = false; }
  canvas() { this.dynMode = 'Canvas'; }
  shrink() { this.dynHeight = '200px'; }
  dark() { this.dynTheme = 'Bootstrap5Dark'; }
}
