import { AccumulationChart, AccumulationChartModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("accumulationChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-accumulation-chart')
export class Ej2AccumulationChart extends SyncfusionWrapper<AccumulationChart, AccumulationChartModel> {
  protected syncfusionWidgetType = AccumulationChart;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
