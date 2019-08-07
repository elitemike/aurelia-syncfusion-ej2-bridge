import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable, BindingEngine, Disposable, autoinject } from 'aurelia-framework';

@autoinject
export class Ej2Button {
  @bindable
  private onClick: Function = null;
  @bindable
  private settings: ButtonModel = null;
  @bindable
  public disabled: boolean = false;

  private context: any = null;
  private buttonElement: HTMLButtonElement = null;
  private button: Button = null;
  private buttonModel: ButtonModel = {};
  private disabledSubscription: Disposable = null;

  constructor(private bindingEngine: BindingEngine) {

  }

  bind(context) {
    this.context = context;
    this.buttonModel.disabled = this.disabled;

    if (this.settings) {
      Object.assign(this.buttonModel, this.settings);
    }

    this.button = new Button(this.buttonModel);

    this.disabledSubscription = this.bindingEngine.propertyObserver(this, "disabled").subscribe((newValue: boolean) => {
      this.button.disabled = newValue;
    });
  }

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }

  attached() {
    this.button.appendTo(this.buttonElement);
  }

  detached() {
    this.disabledSubscription.dispose();
  }
}
