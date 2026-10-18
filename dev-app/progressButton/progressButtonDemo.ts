import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { ProgressButtonModel, ProgressButton } from '@syncfusion/ej2-splitbuttons';

export class ProgressButtonDemo {
  showButton = true;
  clickCount = 0;
  begun = 0;
  ended = 0;

  spinnerModel: ProgressButtonModel = { spinSettings: { position: 'Right' }, duration: 600 };
  progressModel: ProgressButtonModel = { duration: 1500, enableProgress: true, cssClass: 'e-hide-spinner' };

  progressVm: IEJ2WidgetBridge<ProgressButton> = null;

  onClick() {
    this.clickCount++;
  }

  onBegin() {
    this.begun++;
  }

  onEnd() {
    this.ended++;
  }

  start() {
    this.progressVm.widget.start();
  }

  toggle() {
    this.showButton = !this.showButton;
  }
}
