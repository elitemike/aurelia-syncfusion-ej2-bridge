import { OtpInput, OtpInputModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { constants } from '../../common/constants';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("otpInput")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-otp-input')
export class Ej2OtpInput extends SyncfusionWrapper<OtpInput, OtpInputModel> {
  protected syncfusionWidgetType = OtpInput;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
    // `input` is raised for every digit, `valueChanged` only when all boxes are filled. Keep the partial value
    // bound as well, reading it back from the widget so a numeric OTP keeps the widget's own representation.
    const sync = () => {
      this[`${constants.bindablePrefix}value`] = (<any>this.widget).value;
    };
    this.widget.addEventListener("input", sync);
    this.widget.addEventListener("valueChanged", sync);
  }
}
