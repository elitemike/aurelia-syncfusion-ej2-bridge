import { bindable, autoinject } from "aurelia-framework";
import { ProgressButton, ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';

@autoinject
export class Ej2ProgressButton extends SyncfusionWrapper<ProgressButton, ProgressButtonModel> {
  @bindable
  private onClick: Function = null;

  protected syncfusionControlType = ProgressButton;

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
}
