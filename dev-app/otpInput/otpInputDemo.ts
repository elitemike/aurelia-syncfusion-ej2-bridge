import { Ej2OtpInput } from 'widgets/otpInput/ej2-otpInput';
import { viewResources } from 'aurelia-framework';
@viewResources(Ej2OtpInput)
export class OtpInputDemo {
  value = '';
  changeCount = 0;
  changeValue: any = null;
  interacted: boolean = null;
  inputCount = 0;
  inputIndex: number = null;
  focusIndex: number = null;
  blurIndex: number = null;
  createdCount = 0;

  length = 4;
  separator = '';

  type = 'text';
  transform = 'none';

  stylingMode = 'outlined';
  placeholder = '*';
  cssClass = 'otp-custom';

  disabled = true;
  htmlAttrs = { 'data-foo': 'bar' };
  ariaLabels = ['First digit', 'Second digit', 'Third digit', 'Fourth digit'];

  onValueChanged(event: CustomEvent) {
    this.changeCount++;
    this.changeValue = event.detail.value;
    this.interacted = event.detail.isInteracted;
  }

  onInput(event: CustomEvent) {
    this.inputCount++;
    this.inputIndex = event.detail.index;
  }

  onFocus(event: CustomEvent) {
    this.focusIndex = event.detail.index;
  }

  onBlur(event: CustomEvent) {
    this.blurIndex = event.detail.index;
  }

  changeType() {
    this.type = 'password';
    this.transform = 'uppercase';
  }

  changeStyle() {
    this.stylingMode = 'filled';
    this.placeholder = '#';
    this.cssClass = 'otp-custom-two';
  }
}
