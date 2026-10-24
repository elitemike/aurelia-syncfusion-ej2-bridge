import { Sparkline, SparklineModel } from '@syncfusion/ej2-charts';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("sparkline")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-sparkline')
export class Ej2Sparkline extends SyncfusionWrapper<Sparkline, SparklineModel> {
  protected syncfusionWidgetType = Sparkline;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
