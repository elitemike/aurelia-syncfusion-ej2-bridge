import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable } from 'aurelia-framework';

export class Ej2Button {
  @bindable
  private onClick: Function = null;
  @bindable
  private settings: ButtonModel = null;

  private context: any = null;
  private buttonElement: HTMLButtonElement = null;
  private button: Button = null;
  private buttonModel: ButtonModel = {};

  bind(context) {
    this.context = context;

    if (this.settings) {
      Object.assign(this.buttonModel, this.settings);
    }

    this.button = new Button(this.buttonModel);
  }

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }

  attached() {
    this.button.appendTo(this.buttonElement);
  }
}
