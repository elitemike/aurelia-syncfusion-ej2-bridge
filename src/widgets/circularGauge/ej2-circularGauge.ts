import { CircularGauge, CircularGaugeModel } from '@syncfusion/ej2-circulargauge';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("circularGauge")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-circular-gauge')
export class Ej2CircularGauge extends SyncfusionWrapper<CircularGauge, CircularGaugeModel> {
  protected syncfusionWidgetType = CircularGauge;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
