import { LinearGauge, LinearGaugeModel } from '@syncfusion/ej2-lineargauge';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("linearGauge")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-linear-gauge')
export class Ej2LinearGauge extends SyncfusionWrapper<LinearGauge, LinearGaugeModel> {
  protected syncfusionWidgetType = LinearGauge;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
