import { OtpInput, OtpInputModel } from '@syncfusion/ej2-inputs';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("otpInput")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-otp-input')
export class Ej2OtpInput extends SyncfusionWrapper<OtpInput, OtpInputModel> {
  protected syncfusionWidgetType = OtpInput;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
