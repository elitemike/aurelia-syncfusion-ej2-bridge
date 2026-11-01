import { salesData, numericData, financialData, boxData } from './chartData';
import { Ej2Chart } from 'widgets/chart/ej2-chart';
import { viewResources } from 'aurelia-framework';

const rangeData = [
  { x: 'Jan', low: 3, high: 12 }, { x: 'Feb', low: 5, high: 14 }, { x: 'Mar', low: 8, high: 18 }, { x: 'Apr', low: 10, high: 21 }
];
const histogramData = [{ y: 5 }, { y: 6 }, { y: 6 }, { y: 7 }, { y: 7 }, { y: 7 }, { y: 8 }, { y: 8 }, { y: 9 }, { y: 12 }, { y: 13 }];
const waterfallData = [
  { x: 'Income', y: 4711 }, { x: 'Sales', y: -1015 }, { x: 'Cost', y: -688 }, { x: 'Tax', y: -360 }, { x: 'Net', isSum: true }
];
const paretoData = [{ x: 'Bugs', y: 56 }, { x: 'Docs', y: 28 }, { x: 'UX', y: 12 }, { x: 'Perf', y: 4 }];
const cat = { valueType: 'Category' };
const num = { valueType: 'Double' };

function category(type: string, extra: any = {}) {
  return { dataSource: salesData, xName: 'month', yName: 'sales', name: type, type, ...extra };
}

/** One entry per Syncfusion "series type" sample: id, series definition(s) and axis. */
export const gallery: any[] = [
  { id: 'Line', series: [category('Line', { marker: { visible: true } })], x: cat },
  { id: 'Column', series: [category('Column')], x: cat },
  { id: 'Area', series: [category('Area')], x: cat },
  { id: 'Bar', series: [category('Bar')], x: cat },
  { id: 'Spline', series: [category('Spline')], x: cat },
  { id: 'StepLine', series: [category('StepLine')], x: cat },
  { id: 'StepArea', series: [category('StepArea')], x: cat },
  { id: 'SplineArea', series: [category('SplineArea')], x: cat },
  { id: 'Scatter', series: [{ dataSource: numericData, xName: 'x', yName: 'y', type: 'Scatter', name: 'Scatter' }], x: num },
  { id: 'Bubble', series: [{ dataSource: numericData, xName: 'x', yName: 'y', size: 'size', type: 'Bubble', name: 'Bubble' }], x: num },
  { id: 'StackingColumn', series: [category('StackingColumn'), category('StackingColumn', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'StackingBar', series: [category('StackingBar'), category('StackingBar', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'StackingArea', series: [category('StackingArea'), category('StackingArea', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'StackingLine', series: [category('StackingLine'), category('StackingLine', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'StackingColumn100', series: [category('StackingColumn100'), category('StackingColumn100', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'StackingStepArea', series: [category('StackingStepArea'), category('StackingStepArea', { yName: 'profit', name: 'Profit' })], x: cat },
  { id: 'RangeColumn', series: [{ dataSource: rangeData, xName: 'x', low: 'low', high: 'high', type: 'RangeColumn', name: 'Range' }], x: cat },
  { id: 'RangeArea', series: [{ dataSource: rangeData, xName: 'x', low: 'low', high: 'high', type: 'RangeArea', name: 'Range' }], x: cat },
  { id: 'SplineRangeArea', series: [{ dataSource: rangeData, xName: 'x', low: 'low', high: 'high', type: 'SplineRangeArea', name: 'Range' }], x: cat },
  { id: 'RangeStepArea', series: [{ dataSource: rangeData, xName: 'x', low: 'low', high: 'high', type: 'RangeStepArea', name: 'Range' }], x: cat },
  { id: 'Hilo', series: [{ dataSource: financialData, xName: 'x', high: 'high', low: 'low', type: 'Hilo', name: 'Hilo' }], x: { valueType: 'DateTime' } },
  { id: 'HiloOpenClose', series: [{ dataSource: financialData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close', type: 'HiloOpenClose', name: 'HiloOpenClose' }], x: { valueType: 'DateTime' } },
  { id: 'Candle', series: [{ dataSource: financialData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close', type: 'Candle', name: 'Candle' }], x: { valueType: 'DateTime' } },
  { id: 'BoxAndWhisker', series: [{ dataSource: boxData, xName: 'x', yName: 'y', type: 'BoxAndWhisker', name: 'Box' }], x: cat },
  { id: 'Histogram', series: [{ dataSource: histogramData, yName: 'y', binInterval: 2, type: 'Histogram', name: 'Histogram' }], x: num },
  { id: 'Waterfall', series: [{ dataSource: waterfallData, xName: 'x', yName: 'y', sumIndexes: [4], type: 'Waterfall', name: 'Waterfall' }], x: cat },
  { id: 'Pareto', series: [{ dataSource: paretoData, xName: 'x', yName: 'y', type: 'Pareto', name: 'Pareto' }], x: cat },
  { id: 'Polar', series: [{ dataSource: salesData, xName: 'month', yName: 'sales', type: 'Polar', drawType: 'Area', name: 'Polar' }], x: cat },
  { id: 'Radar', series: [{ dataSource: salesData, xName: 'month', yName: 'sales', type: 'Radar', drawType: 'Line', name: 'Radar' }], x: cat },
  { id: 'MultiColoredLine', series: [category('MultiColoredLine', { segmentAxis: 'X', segments: [{ value: 'Mar', color: 'red' }] })], x: cat },
  { id: 'MultiColoredArea', series: [category('MultiColoredArea', { segmentAxis: 'X', segments: [{ value: 'Mar', color: 'red' }] })], x: cat }
];

@viewResources(Ej2Chart)
export class ChartSeriesDemo {
  gallery = gallery;
}
