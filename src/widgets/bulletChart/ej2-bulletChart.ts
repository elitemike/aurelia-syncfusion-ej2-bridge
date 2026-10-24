import { BulletChart, BulletChartModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("bulletChart")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-bullet-chart')
export class Ej2BulletChart extends SyncfusionWrapper<BulletChart, BulletChartModel> {
  protected syncfusionWidgetType = BulletChart;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
