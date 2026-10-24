import { StockChart, StockChartModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("stockChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-stock-chart')
export class Ej2StockChart extends SyncfusionWrapper<StockChart, StockChartModel> {
  protected syncfusionWidgetType = StockChart;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
