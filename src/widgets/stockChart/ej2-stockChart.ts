import {
  StockChart, StockChartModel, LineSeries, ColumnSeries, AreaSeries, BarSeries, SplineSeries, StepLineSeries, StepAreaSeries,
  SplineAreaSeries, ScatterSeries, RangeAreaSeries, HiloSeries, HiloOpenCloseSeries, CandleSeries, StackingColumnSeries,
  StackingAreaSeries, DateTime, Category, DateTimeCategory, Logarithmic, Tooltip, Crosshair, RangeTooltip, Zoom, Selection, Export,
  Trendlines, DataLabel, ChartAnnotation, StockLegend, PeriodSelector, SmaIndicator, EmaIndicator, TmaIndicator, MomentumIndicator, AtrIndicator,
  AccumulationDistributionIndicator, BollingerBands, MacdIndicator, RsiIndicator, StochasticIndicator
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

const seriesModules: { [type: string]: any } = {
  Line: LineSeries, Column: ColumnSeries, Area: AreaSeries, Bar: BarSeries, Spline: SplineSeries, StepLine: StepLineSeries,
  StepArea: StepAreaSeries, SplineArea: SplineAreaSeries, Scatter: ScatterSeries, RangeArea: RangeAreaSeries, Hilo: HiloSeries,
  HiloOpenClose: HiloOpenCloseSeries, Candle: CandleSeries, StackingColumn: StackingColumnSeries, StackingArea: StackingAreaSeries
};
const indicatorModules: { [type: string]: any } = {
  Sma: SmaIndicator, Ema: EmaIndicator, Tma: TmaIndicator, Momentum: MomentumIndicator, Atr: AtrIndicator,
  AccumulationDistribution: AccumulationDistributionIndicator, BollingerBands: BollingerBands, Macd: MacdIndicator,
  Rsi: RsiIndicator, Stochastic: StochasticIndicator
};

// StockChart derives its element id from a fixed counter, so every stock chart on a page ends up with the same id
// and they overwrite each other's svg (all lookups are by id). Hand every instance its own id.
let stockChartIds = 0;

@generateBindables("stockChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-stock-chart')
export class Ej2StockChart extends SyncfusionWrapper<StockChart, StockChartModel> {
  protected syncfusionWidgetType = StockChart;

  // StockChart.Inject forwards its modules to the inner Chart / RangeNavigator. Both are global registrations and the
  // charts only activate what their own options need, so bring the module of every option that switches a feature on.
  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition && module) { modules.push(module); } };
    const names = (value: any): string[] => (Array.isArray(value) ? value : value ? [value] : [])
      .map((v) => (typeof v === 'string' ? v : v && v.type)).filter((v) => v);
    const series: any[] = Array.isArray(model.series) ? model.series.filter((s) => s) : [];
    const axes: any[] = [model.primaryXAxis, model.primaryYAxis].concat(Array.isArray(model.axes) ? model.axes : []).filter((a) => a);
    const has = (value: any, path: string) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), value);

    // the period selector and the selector of the range navigator draw lines and areas, the toolbar can switch the
    // main series to any of the types listed in seriesType
    use(true, LineSeries);
    use(true, AreaSeries);
    use(true, StepLineSeries);
    use(true, DateTime);
    series.forEach((s) => {
      use(true, seriesModules[s.type || 'Line']);
      use(Array.isArray(s.trendlines) && s.trendlines.length, Trendlines);
      use(Array.isArray(s.trendlines) && s.trendlines.length, SplineSeries);
      use(has(s, 'marker.dataLabel.visible'), DataLabel);
    });
    names(model.seriesType).forEach((t) => use(true, seriesModules[t]));
    const indicatorTypes = names(model.indicators).concat(names(model.indicatorType));
    indicatorTypes.forEach((t) => {
      use(true, indicatorModules[t]);
      use(t === 'Macd', ColumnSeries);
      use(t === 'BollingerBands', RangeAreaSeries);
    });
    use(indicatorTypes.length, LineSeries);
    use(names(model.trendlineType).length, Trendlines);
    use(names(model.trendlineType).length, SplineSeries);
    axes.forEach((a) => {
      use(a.valueType === 'Category', Category);
      use(a.valueType === 'Logarithmic', Logarithmic);
      use(a.valueType === 'DateTimeCategory', DateTimeCategory);
    });
    use(has(model, 'tooltip.enable'), Tooltip);
    use(has(model, 'tooltip.enable') && model.enableSelector, RangeTooltip);
    use(has(model, 'crosshair.enable'), Crosshair);
    use(!model.legendSettings || model.legendSettings.visible !== false, StockLegend);
    use(model.enablePeriodSelector !== false, PeriodSelector);
    use(model.exportType || model.enablePeriodSelector !== false, Export);
    const zoom = model.zoomSettings || {};
    use(zoom.enableSelectionZooming || zoom.enableMouseWheelZooming || zoom.enablePinchZooming || zoom.enablePan, Zoom);
    use(model.selectionMode && model.selectionMode !== 'None', Selection);
    use(Array.isArray(model.annotations) && model.annotations.some((a) => a && a.content), ChartAnnotation);

    StockChart.Inject(...modules);
  }

  protected appendWidget() {
    if (!this.widgetElement.id) {
      this.widgetElement.id = `stockChart_bridge_${stockChartIds++}`;
    }
    super.appendWidget();
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
