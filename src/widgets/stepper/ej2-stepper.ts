import { Stepper, StepperModel } from '@syncfusion/ej2-navigations';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { constants } from '../../common/constants';

@generateBindables("stepper")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-stepper')
export class Ej2Stepper extends SyncfusionWrapper<Stepper, StepperModel> {
  protected syncfusionWidgetType = Stepper;
  private onStepChanged: (args: any) => void = null;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // activeStep changes through clicks, keyboard, nextStep() and previousStep()
    this.onStepChanged = (args) => {
      this[`${constants.bindablePrefix}activeStep`] = args.activeStep;
    };
    this.widget.addEventListener('stepChanged', this.onStepChanged);
  }

  public detached() {
    if (this.widget) {
      this.widget.removeEventListener('stepChanged', this.onStepChanged);
    }
    super.detached();
  }
}
