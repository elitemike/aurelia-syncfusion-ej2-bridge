import {
  AccumulationChart, AccumulationChartModel, PieSeries, FunnelSeries, PyramidSeries, AccumulationLegend, AccumulationDataLabel,
  AccumulationTooltip, AccumulationSelection, AccumulationHighlight, AccumulationAnnotation, Export
} from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("accumulationChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-accumulation-chart')
export class Ej2AccumulationChart extends SyncfusionWrapper<AccumulationChart, AccumulationChartModel> {
  protected syncfusionWidgetType = AccumulationChart;

  // AccumulationChart.Inject is global and the chart only activates what its own options need, so bring the module
  // for every option that switches a feature on (mirrors AccumulationChart.requiredModules).
  protected onBeforeWidgetInstantiation() {
    const model: any = this._eModel;
    const modules: any[] = [];
    const use = (condition: any, module: any) => { if (condition) { modules.push(module); } };
    const series: any[] = Array.isArray(model.series) ? model.series.filter((s) => s) : [];

    // Pie is the default type
    modules.push(PieSeries);
    series.forEach((s) => {
      use(s.type === 'Funnel', FunnelSeries);
      use(s.type === 'Pyramid', PyramidSeries);
    });
    use(!model.legendSettings || model.legendSettings.visible !== false, AccumulationLegend);
    use(series.some((s) => s.dataLabel && s.dataLabel.visible), AccumulationDataLabel);
    use(model.tooltip && model.tooltip.enable, AccumulationTooltip);
    use(model.selectionMode && model.selectionMode !== 'None', AccumulationSelection);
    use(model.highlightMode && model.highlightMode !== 'None', AccumulationHighlight);
    use(model.enableExport !== false || model.allowExport, Export);
    use(Array.isArray(model.annotations) && model.annotations.some((a) => a && a.content), AccumulationAnnotation);

    AccumulationChart.Inject(...modules);
  }

  protected onWrapperCreated() {
    // The chart only raises these events when it finds a handler assigned as a property (`if (this.pointClick)`),
    // a listener added with addEventListener, which is how the bridge forwards events, does not count. Assign a
    // placeholder so the chart does its work, the forwarding listener then dispatches the element event.
    ['pointClick', 'pointMove', 'afterExport'].forEach((name) => {
      this.widget[name] = () => undefined;
    });
  }

  protected onWidgetCreated() {
  }
}
