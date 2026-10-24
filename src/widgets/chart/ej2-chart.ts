import { Chart, ChartModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("chart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-chart')
export class Ej2Chart extends SyncfusionWrapper<Chart, ChartModel> {
  protected syncfusionWidgetType = Chart;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
