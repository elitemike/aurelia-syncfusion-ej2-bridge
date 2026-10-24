import {
  Chart, ChartModel, LineSeries, ColumnSeries, AreaSeries, BarSeries, SplineSeries, StepLineSeries, StepAreaSeries, SplineAreaSeries,
  ScatterSeries, BubbleSeries, StackingColumnSeries, StackingBarSeries, StackingAreaSeries, StackingLineSeries, StackingStepAreaSeries,
  RangeColumnSeries, RangeAreaSeries, SplineRangeAreaSeries, RangeStepAreaSeries, HiloSeries, HiloOpenCloseSeries, CandleSeries,
  BoxAndWhiskerSeries, HistogramSeries, WaterfallSeries, ParetoSeries, PolarSeries, RadarSeries, MultiColoredLineSeries,
  MultiColoredAreaSeries, ErrorBar, Trendlines, DataLabel, SeriesLabel, LastValueLabel, DataEditing, Category, DateTime, Logarithmic,
  DateTimeCategory, StripLine, MultiLevelLabel, Legend, Tooltip, Crosshair, Zoom, ScrollBar, Selection, Highlight, Export,
  ChartAnnotation, WebMcpChart, SmaIndicator, EmaIndicator, TmaIndicator, MomentumIndicator, AtrIndicator, AccumulationDistributionIndicator,
  BollingerBands, MacdIndicator, RsiIndicator, StochasticIndicator
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

// series type -> module; the 100% stacked types share the module of their stacked counterpart
const seriesModules: { [type: string]: any } = {
  Line: LineSeries, Column: ColumnSeries, Area: AreaSeries, Bar: BarSeries, Spline: SplineSeries, StepLine: StepLineSeries,
  StepArea: StepAreaSeries, SplineArea: SplineAreaSeries, Scatter: ScatterSeries, Bubble: BubbleSeries,
  StackingColumn: StackingColumnSeries, StackingBar: StackingBarSeries, StackingArea: StackingAreaSeries,
  StackingLine: StackingLineSeries, StackingStepArea: StackingStepAreaSeries, RangeColumn: RangeColumnSeries,
  RangeArea: RangeAreaSeries, SplineRangeArea: SplineRangeAreaSeries, RangeStepArea: RangeStepAreaSeries, Hilo: HiloSeries,
  HiloOpenClose: HiloOpenCloseSeries, Candle: CandleSeries, BoxAndWhisker: BoxAndWhiskerSeries, Histogram: HistogramSeries,
  Waterfall: WaterfallSeries, Pareto: ParetoSeries, Polar: PolarSeries, Radar: RadarSeries, MultiColoredLine: MultiColoredLineSeries,
  MultiColoredArea: MultiColoredAreaSeries
};
const indicatorModules: { [type: string]: any } = {
  Sma: SmaIndicator, Ema: EmaIndicator, Tma: TmaIndicator, Momentum: MomentumIndicator, Atr: AtrIndicator,
  AccumulationDistribution: AccumulationDistributionIndicator, BollingerBands: BollingerBands, Macd: MacdIndicator,
  Rsi: RsiIndicator, Stochastic: StochasticIndicator
};

@generateBindables("chart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chart')
export class Ej2Chart extends SyncfusionWrapper<Chart, ChartModel> {
  protected syncfusionWidgetType = Chart;

  // Chart.Inject registers modules globally; the chart then only activates the ones its own options require, so
  // every option that switches a feature on has to bring its module here (mirrors Chart.requiredModules).
  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition && module) { modules.push(module); } };
    const series: any[] = Array.isArray(model.series) ? model.series.filter((s) => s) : [];
    const axes: any[] = [model.primaryXAxis, model.primaryYAxis].concat(Array.isArray(model.axes) ? model.axes : []).filter((a) => a);
    const legendVisible = !model.legendSettings || model.legendSettings.visible !== false;
    const zoom = model.zoomSettings || {};
    const polar = series.length > 0 && (series[0].type === 'Polar' || series[0].type === 'Radar');
    const has = (value: any, path: string) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), value);

    series.forEach((s) => {
      const type = String(s.type || 'Line').replace('100', '');
      use(true, seriesModules[type]);
      if (polar) { use(true, seriesModules[s.drawType || 'Line']); }
      if (type === 'Pareto') { use(true, ColumnSeries); use(true, LineSeries); }
      use(has(s, 'errorBar.visible'), ErrorBar);
      use(has(s, 'marker.dataLabel.visible') || has(s, 'paretoOptions.marker.dataLabel.visible'), DataLabel);
      use(has(s, 'labelSettings.visible'), SeriesLabel);
      use(has(s, 'lastValueLabel.enable'), LastValueLabel);
      use(has(s, 'dragSettings.enable'), DataEditing);
      if (Array.isArray(s.trendlines) && s.trendlines.length) {
        // trendlines render as line / spline series
        use(true, Trendlines); use(true, LineSeries); use(true, SplineSeries);
      }
    });
    if (Array.isArray(model.indicators) && model.indicators.length) {
      use(true, LineSeries);
      model.indicators.forEach((i) => {
        use(true, indicatorModules[i.type]);
        use(i.type === 'Macd', ColumnSeries);
        use(i.type === 'BollingerBands', RangeAreaSeries);
      });
    }
    axes.forEach((a) => {
      use(a.valueType === 'DateTime', DateTime);
      use(a.valueType === 'Category', Category);
      use(a.valueType === 'Logarithmic', Logarithmic);
      use(a.valueType === 'DateTimeCategory', DateTimeCategory);
      use(Array.isArray(a.stripLines) && a.stripLines.some((s) => s && s.visible !== false), StripLine);
      use(Array.isArray(a.multiLevelLabels) && a.multiLevelLabels.length, MultiLevelLabel);
    });
    use(model.enableWebMcp, WebMcpChart);
    use(has(model, 'tooltip.enable'), Tooltip);
    use(legendVisible && series.length, Legend);
    // enableExport defaults to true
    use(model.enableExport !== false || model.allowExport, Export);
    use(!polar && has(model, 'crosshair.enable'), Crosshair);
    const scrollbarOnAxis = axes.some((a) => has(a, 'scrollbarSettings.enable'));
    if (!polar && !scrollbarOnAxis && (zoom.enableSelectionZooming || zoom.enableMouseWheelZooming || zoom.enablePinchZooming ||
      zoom.enablePan || zoom.enableScrollbar || zoom.showToolbar)) {
      use(true, Zoom);
      use(zoom.enableScrollbar, ScrollBar);
    }
    use(scrollbarOnAxis, ScrollBar);
    use(model.selectionMode && model.selectionMode !== 'None', Selection);
    use((model.highlightMode && model.highlightMode !== 'None') || has(model, 'legendSettings.enableHighlight'), Highlight);
    use(has(model, 'stackLabels.visible'), DataLabel);
    use(Array.isArray(model.annotations) && model.annotations.some((a) => a && a.content), ChartAnnotation);

    Chart.Inject(...modules);
  }

  protected onWrapperCreated() {
    // The chart only raises these events when it finds a handler assigned as a property (`if (this.pointClick)`),
    // a listener added with addEventListener, which is how the bridge forwards events, does not count. Assign a
    // placeholder so the chart does its work, the forwarding listener then dispatches the element event.
    ['pointClick', 'pointDoubleClick', 'pointMove', 'axisLabelClick', 'afterExport'].forEach((name) => {
      this.widget[name] = () => undefined;
    });
  }

  protected onWidgetCreated() {
  }
}
