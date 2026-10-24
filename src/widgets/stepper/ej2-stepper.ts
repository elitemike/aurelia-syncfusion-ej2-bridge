import { Stepper, StepperModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("stepper")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-stepper')
export class Ej2Stepper extends SyncfusionWrapper<Stepper, StepperModel> {
  protected syncfusionWidgetType = Stepper;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
