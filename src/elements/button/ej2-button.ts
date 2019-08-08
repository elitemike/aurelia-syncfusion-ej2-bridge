import { ControlBase } from 'elements/controlBase';
import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable } from 'aurelia-framework';

export class Ej2Button extends ControlBase<Button, ButtonModel> {
  @bindable
  private onClick: Function = null;

  onCreateControl() {
    this.ej2Model.disabled = this.disabled;

    this.control = new Button(this.ej2Model);
  }

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
}
