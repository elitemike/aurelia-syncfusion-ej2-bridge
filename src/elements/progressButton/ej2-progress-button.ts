import { Disposable, BindingEngine } from 'aurelia-binding';
import { bindable, autoinject } from "aurelia-framework";
import { ProgressButton, ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { ControlBase } from 'elements/controlBase';

@autoinject
export class Ej2ProgressButton extends ControlBase<ProgressButton, ProgressButtonModel> {
  @bindable
  private onClick: Function = null;

  onCreateControl() {
    this.ej2Model.disabled = this.disabled;

    this.control = new ProgressButton(this.ej2Model);
  }

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
}
